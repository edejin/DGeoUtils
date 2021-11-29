import {DPoint, EARTH_RADIUS_IN_METERS} from './DPoint';
import {DPolygon} from './DPolygon';
import {DNumbers} from './DNumbers';
import {checkFunction} from './utils';

// eslint-disable-next-line padded-blocks
export class DCircle {

  /**
   * @param [center=(0,0)]
   * @param [r=0]
   */
  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(public center: DPoint = DPoint.zero(), public r: number = 0) {}

  toString(): string {
    return `(${this.center.toString()}, ${this.r})`;
  }

  getValue(): {center: DPoint, r: number} {
    return {center: this.center, r: this.r};
  }

  clone(): DCircle {
    return new DCircle(this.center, this.r);
  }

  /**
   * Find intersection points with other circle.
   *
   * ![Example](https://edejin.github.io/DGeoUtils/media/examples/findPoints.png)
   * @param c
   */
  findPoints(c: DCircle): DPoint[] | number {
    if (this.equal(c)) {
      return Infinity;
    }
    const {
      center: {x: x0, y: y0},
      r: r0
    } = this;
    const {
      center: {x: x1, y: y1},
      r: r1
    } = c;

    const r02 = r0 * r0;

    const d = this.center.distance(c.center);
    const a = (r02 - r1 * r1 + d * d) / (2 * d);
    const h = Math.sqrt(r02 - a * a);

    const ad = a / d;
    const dy = y1 - y0;
    const dx = x1 - x0;
    const hd = h / d;

    const x2 = x0 + ad * (x1 - x0);
    const y2 = y0 + ad * (y1 - y0);

    const x31 = x2 + hd * dy;
    const y31 = y2 - hd * dx;
    const x32 = x2 - hd * dy;
    const y32 = y2 + hd * dx;

    const res = [];
    if (!isNaN(x31) && !isNaN(y31)) {
      res.push(new DPoint(x31, y31));
    }
    if (!isNaN(x32) && !isNaN(y32) && !(x31 === x32 && y31 === y32)) {
      res.push(new DPoint(x32, y32));
    }
    return res;
  }

  equal({center, r}: DCircle): boolean {
    return this.center.equal(center) && this.r === r;
  }

  /**
   * Transform circle to polygon
   *
   * ![Example](https://edejin.github.io/DGeoUtils/media/examples/findPolygonInside.png)
   * @param [pointCount=64]
   */
  findPolygonInside(pointCount: number = 64): DPolygon {
    const preAngle = 2 * Math.PI / pointCount;
    const points: DPoint[] = [];
    for (let i = 0; i < pointCount; i++) {
      const angle = preAngle * i;
      const x = this.r * Math.cos(angle) + this.center.x;
      const y = this.r * Math.sin(angle) + this.center.y;
      points.push(new DPoint(x, y));
    }
    return new DPolygon([...points, points[0]]);
  }

  /**
   * Transform circle to polygon on sphere. It would be different for different latitude.
   *
   * @remarks
   * Center should be Lng/Lat.
   *
   * @remarks
   * Radius should be in meters.
   *
   * ![Example](https://edejin.github.io/DGeoUtils/media/examples/findPolygonInsideOnSphere.png)
   * @param [pointCount=64]
   */
  findPolygonInsideOnSphere(pointCount: number = 64): DPolygon {
    checkFunction('findPolygonInsideOnSphere')
      .checkArgument('center')
      .shouldBeDegree(this.center);
    const res = new DPolygon();
    for (let i = 0; i < pointCount; i++) {
      res.push(this.sphereOffset(2 * Math.PI * i / pointCount));
    }
    return res.close();
  }

  private sphereOffset(bearing: number, earthRadius = EARTH_RADIUS_IN_METERS): DPoint {
    const lat1 = DNumbers.deg2Rad(this.center.y);
    const lon1 = DNumbers.deg2Rad(this.center.x);
    const dByR = this.r / earthRadius;
    const lat = Math.asin(Math.sin(lat1) * Math.cos(dByR) +
      Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
    const lon =
      lon1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
        Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat)
      );
    return new DPoint(DNumbers.rad2Deg(lon), DNumbers.rad2Deg(lat));
  }
}
