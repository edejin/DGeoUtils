import {DPolygon} from './DPolygon';
import {DPoint} from './DPoint';
import {isDefAndNotNull} from './utils';

export class InterpolationMatrix {
  private readonly minPoint: DPoint;
  private readonly maxPoint: DPoint;
  private points: DPoint[] = [];
  private cells: Record<number, Record<number, DPolygon>> = {};
  private allCells: DPolygon[] = [];
  private readonly sizePoly: DPolygon;
  private readonly keys: string[];
  readonly size: DPoint;

  /**
   * (Inverse distance weighting)[https://en.wikipedia.org/wiki/Inverse_distance_weighting]
   * `bboxLike`, `stepSize` and `points` should be in same unit.
   */
  constructor(
    bboxLike: DPolygon,
    private readonly stepSize: number,
    keys: string[] | string,
    private readonly p: number = 2
  ) {
    this.minPoint = bboxLike.leftTop;
    this.maxPoint = bboxLike.rightBottom;
    this.sizePoly = DPolygon.createSquareBySize(new DPoint(this.stepSize));
    this.size = this.maxPoint.clone().move(this.minPoint.clone().minus())
      .divide(this.stepSize)
      .ceil();
    this.keys = Array.isArray(keys) ? keys : [keys];
    this.generateCells();
  }

  setKnownPoints(points: DPoint[] | DPolygon): InterpolationMatrix {
    this.points = points instanceof DPolygon ? points.points : points;
    return this;
  }

  positionToCellCoords(d: DPoint): DPoint {
    return d.clone()
      .move(this.minPoint.clone().minus())
      .divide(this.stepSize)
      .floor();
  }

  calculate(): InterpolationMatrix {
    this.setKnownValues();
    this.interpolateValues();
    return this;
  }

  getCellValue({x, y}: DPoint, key?: string | string[]): (number | Record<string, number>) {
    const cell = this.cells[x][y];
    if (key) {
      if (Array.isArray(key)) {
        return key.reduce((a: Record<string, number>, k: string) => {
          a[k] = cell.properties[k];
          return a;
        }, {});
      }
      return cell.properties[key];
    }
    return {
      ...cell.properties
    };
  }

  get getCellData(): Record<number, Record<number, Record<string, number>>> {
    return this.allCells.reduce((a: Record<number, Record<number, Record<string, number>>>, c) => {
      const {
        x,
        y,
        ...props
      } = c.properties;
      a[x] = a[x] || {};
      a[x][y] = {
        ...props
      };
      return a;
    }, {});
  }

  get allCellsClone(): DPolygon[] {
    return this.allCells.map((p: DPolygon) => p.clone());
  }

  private interpolateValues() {
    const points = this.points.map((p: DPoint) => this.positionToCellCoords(p));
    this.allCells.forEach((cell: DPolygon) => {
      const t = new DPoint(cell.properties.x, cell.properties.y);
      const distances = points.map((p) => t.distance(p) ** this.p);
      this.keys.forEach((k) => {
        if (isDefAndNotNull(cell.properties[k])) {
          return;
        }
        const [valueSum, oneSum] = distances.reduce((a, d, i) => {
          if (isDefAndNotNull(this.points[i].properties[k])) {
            a[0] += this.points[i].properties[k] / d;
            a[1] += 1 / d;
          }
          return a;
        }, [0, 0]);
        cell.properties[k] = valueSum / oneSum;
      });
    });
  }

  private setKnownValues() {
    this.points.forEach((p: DPoint) => {
      const {x, y} = this.positionToCellCoords(p);
      this.keys.forEach((k) => {
        this.cells[x][y].properties[k] = p.properties[k];
      });
    });
  }

  private generateCells() {
    for (let i = this.minPoint.x, x = 0; i < this.maxPoint.x; i += this.stepSize, x++) {
      this.cells[x] = this.cells[x] || {};
      for (let j = this.minPoint.y, y = 0; j < this.maxPoint.y; j += this.stepSize, y++) {
        const t = this.sizePoly
          .clone()
          .loop()
          .move(i, j)
          .run()
          .setProperties({
            x,
            y
          });
        this.cells[x][y] = t;
        this.allCells.push(t);
      }
    }
  }
}
