import {DPoint} from './DPoint';
import {DPolygon, MIN_POINTS_IN_VALID_POLYGON} from './DPolygon';
import {FastSearch} from './FastSearch';

const createArray = (v = 0) => new Array(v + 1)
  .join(' ')
  .split('')
  .map((r: string, i: number) => i);

export enum TraceMatrixValues {
  f = 0,
  t = 1
}

type SimpleMatrix = TraceMatrixValues[][];

const getByPosition = (
  m: SimpleMatrix,
  p: DPoint,
  defaultValue: TraceMatrixValues = TraceMatrixValues.f
): TraceMatrixValues => {
  if (m[p.y] === undefined || m[p.y][p.x] === undefined) {
    return defaultValue;
  }
  return m[p.y][p.x];
};

const setByPosition = (m: SimpleMatrix, p: DPoint, value: TraceMatrixValues): TraceMatrixValues => {
  if (m[p.y] === undefined || m[p.y][p.x] === undefined) {
    return value;
  }
  m[p.y][p.x] = value;
  return m[p.y][p.x];
};

export class TraceMatrix {
  private readonly m: SimpleMatrix;
  private readonly size: DPoint;

  constructor(size: DPoint, f: (p: DPoint) => TraceMatrixValues) {
    this.size = size;
    this.m = TraceMatrix.createMatrix(this.size, f);
  }

  fullMatrixTrace(): DPolygon[] {
    const groups = this.findAllGroupsInMatrix(this.m);
    const paths = groups.map((g: DPolygon) => this.traceGroup(this.m, g));
    const holeMatrixs = groups.map(this.createHoleMatrix);
    const holesGroups = holeMatrixs.map((m: SimpleMatrix | null) => m && this.findAllGroupsInMatrix(m));
    const holesPaths = holesGroups.map((hg: DPolygon[] | null, index: number) => hg && hg.map((g: DPolygon) => this
      .traceGroup(holeMatrixs[index]!, g)).filter((r: DPolygon) => r.length > MIN_POINTS_IN_VALID_POLYGON));

    return groups.map((g: DPolygon, index: number) => {
      const res = paths[index];
      if (holesGroups[index] && holesGroups[index]!.length) {
        res.holes = holesPaths[index]!;
      }
      return res;
    });
  }

  private reverseMatrix(m: SimpleMatrix): SimpleMatrix {
    return TraceMatrix.createMatrix(
      this.size,
      (p: DPoint) => getByPosition(m, p) === TraceMatrixValues.f ? TraceMatrixValues.t : TraceMatrixValues.f
    );
  }

  private findGroupByIndex = (m: SimpleMatrix, s: DPoint): DPolygon => {
    const res: DPolygon = new DPolygon();
    if (s && getByPosition(m, s) === TraceMatrixValues.t) {
      res.push(s);
      let startIndex = 0;
      const marked = TraceMatrix.createMatrix(this.size, () => TraceMatrixValues.f);
      setByPosition(marked, s, TraceMatrixValues.t);
      while (startIndex < res.length) {
        const r = res.p(startIndex);
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            const t = new DPoint(r.x + i, r.y + j);
            if (
              getByPosition(marked, t, TraceMatrixValues.t) === TraceMatrixValues.f &&
              getByPosition(m, t, TraceMatrixValues.f) === TraceMatrixValues.t
            ) {
              res.push(t);
              setByPosition(marked, t, TraceMatrixValues.t);
            }
          }
        }
        startIndex++;
      }
    }
    return res;
  };

  private findMarked(m: SimpleMatrix, init?: DPoint): DPoint | null {
    const s = this.size;
    let ini = false;
    for (let i = 0; i < s.w; i++) {
      for (let j = 0; j < s.h; j++) {
        if (!ini && init) {
          i = init.x;
          j = init.y;
          ini = true;
          continue;
        }
        if (getByPosition(m, new DPoint(i, j)) === TraceMatrixValues.t) {
          return new DPoint(i, j);
        }
      }
    }
    return null;
  }

  private totalCountInMatrix(m: SimpleMatrix) {
    let res = 0;
    const s = this.size;
    for (let i = 0; i < s.w; i++) {
      for (let j = 0; j < s.h; j++) {
        if (getByPosition(m, new DPoint(i, j))) {
          res++;
        }
      }
    }
    return res;
  }

  private findAllGroupsInMatrix = (m: SimpleMatrix): DPolygon[] => {
    const firstMark = this.findMarked(m);
    if (!firstMark) {
      return [];
    }
    const group = this.findGroupByIndex(m, firstMark);
    const groups = [group];
    let groupSum = group.length;
    let allGroups = [...group.points];
    const fs = new FastSearch();
    fs.add(allGroups);
    while (groupSum < this.totalCountInMatrix(m)) {
      let mark = this.findMarked(m);
      while (mark && fs.find(mark)) {
        mark = this.findMarked(m, mark);
      }
      const nextGroup = this.findGroupByIndex(m, mark!);
      groupSum += nextGroup.length;
      allGroups = [...allGroups, ...nextGroup.points];
      fs.add(nextGroup.points);
      groups.push(nextGroup);
    }
    return groups.filter((g: DPolygon) => g.length > 2);
  };

  private traceGroup = (m: SimpleMatrix, group: DPolygon): DPolygon => {
    const traceDirections = [
      new DPoint(-1, -1),
      new DPoint(-1, 0),
      new DPoint(-1, 1),
      new DPoint(0, 1),
      new DPoint(1, 1),
      new DPoint(1, 0),
      new DPoint(1, -1),
      new DPoint(0, -1)
    ];

    const left = (d: number) => (d + traceDirections.length + 1) % traceDirections.length;
    const right = (d: number) => (d + traceDirections.length - 1) % traceDirections.length;

    if (group.length < 2) {
      const t = group.p(0).clone();
      return new DPolygon([t, t, t]);
    }
    const points: DPolygon = new DPolygon();
    let direction = 0;
    let prevDirection = Infinity;

    let p = group.p(0);

    while (!p.equal(group.p(0)) || points.length < 2) {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const nextValue = getByPosition(m, p.clone().moveCurrent(traceDirections[direction]));
        const nextNeighbourValue = getByPosition(m, p.clone().moveCurrent(traceDirections[left(direction)]));
        if (nextValue === TraceMatrixValues.t && nextNeighbourValue === TraceMatrixValues.f) {
          break;
        }
        direction = right(direction);
      }
      if (prevDirection !== direction) {
        points.push(p);
        prevDirection = direction;
      }
      p = p.clone().moveCurrent(traceDirections[direction]);
      direction = left(left(direction));
    }

    return points.approximation().close();
  };

  private createHoleMatrix = (group: DPolygon): SimpleMatrix | null => {
    const fullTraceDirections = [
      new DPoint(-1, 0),
      new DPoint(0, 1),
      new DPoint(1, 0),
      new DPoint(0, -1)
    ];

    group.prepareToFastSearch();
    const tmpMatrix = TraceMatrix
      .createMatrix(this.size, (p: DPoint) => group.fastHas(p) ? TraceMatrixValues.t : TraceMatrixValues.f);
    const startCoords: DPolygon = new DPolygon();
    for (let i = 0; i < this.size.w; i++) {
      startCoords.push(new DPoint(i, -1));
      startCoords.push(new DPoint(i, this.size.h));
    }
    for (let i = 0; i < this.size.h; i++) {
      startCoords.push(new DPoint(-1, i));
      startCoords.push(new DPoint(this.size.w, i));
    }
    while (startCoords.length) {
      const point = startCoords.pop();
      for (const direction of fullTraceDirections) {
        const tmpPoint = point.clone().moveCurrent(direction);
        const value = getByPosition(tmpMatrix, tmpPoint, TraceMatrixValues.t);
        if (value === TraceMatrixValues.f) {
          setByPosition(tmpMatrix, tmpPoint, TraceMatrixValues.t);
          startCoords.push(tmpPoint);
        }
      }
    }

    const t = this.reverseMatrix(tmpMatrix);
    return this.totalCountInMatrix(t) ? t : null;
  };

  static createMatrix(size: DPoint, f: (pos: DPoint) => TraceMatrixValues = () => TraceMatrixValues.f): SimpleMatrix {
    return createArray(size.h).map((i: number) => createArray(size.w).map((j: number) => f(new DPoint(j, i))));
  }
}
