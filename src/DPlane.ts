import {DPoint} from './DPoint';
import {gaussianElimination} from './utils';
import {DPolygon} from './DPolygon';
import {DNumbers} from './DNumbers';
import {DLine} from './DLine';

export class DPlane {
  // eslint-disable-next-line max-params,no-useless-constructor
  constructor(
    public a: number,
    public b: number,
    public c: number,
    public d: number,
    public p1: DPoint = DPoint.zero(),
    public p2: DPoint = DPoint.zero(),
    public p3: DPoint = DPoint.zero()
    // eslint-disable-next-line no-empty-function
  ) {}

  static find(p1: DPoint, p2: DPoint, p3: DPoint): DPlane {
    if (p1.x === p2.x && p2.x === p3.x) {
      return new DPlane(1, 0, 0, -p1.x, p1, p2, p3);
    }
    if (p1.y === p2.y && p2.y === p3.y) {
      return new DPlane(0, 1, 0, -p1.y, p1, p2, p3);
    }
    if (p1.z === p2.z && p2.z === p3.z) {
      return new DPlane(0, 0, 1, -p1.z!, p1, p2, p3);
    }
    const d = 1;
    const [a, b, c] = gaussianElimination([
      [p1.x, p1.y, p1.z!, -d],
      [p2.x, p2.y, p2.z!, -d],
      [p3.x, p3.y, p3.z!, -d]
    ]);
    return new DPlane(a, b, c, d, p1, p2, p3);
  }

  x(p: DPoint): DPoint;
  x(p: DPolygon): DPolygon;
  x(p: DPoint | DPolygon): DPoint | DPolygon {
    if (p instanceof DPoint) {
      const {
        a,
        b,
        c,
        d
      } = this;
      const {
        y,
        z
      } = p;
      p.x = -(b * y + c * z! + d) / a;
      return p;
    }
    return (p as DPolygon).map((t: DPoint) => this.x(t));
  }

  y(p: DPoint): DPoint;
  y(p: DPolygon): DPolygon;
  y(p: DPoint | DPolygon): DPoint | DPolygon {
    if (p instanceof DPoint) {
      const {
        a,
        b,
        c,
        d
      } = this;
      const {
        x,
        z
      } = p;
      p.y = -(a * x + c * z! + d) / b;
      return p;
    }
    return (p as DPolygon).map((t: DPoint) => this.y(t));
  }

  z(p: DPoint): DPoint;
  z(p: DPolygon): DPolygon;
  z(p: DPoint | DPolygon): DPoint | DPolygon {
    if (p instanceof DPoint) {
      const {
        a,
        b,
        c,
        d
      } = this;
      const {
        x,
        y
      } = p;
      p.z = -(a * x + b * y + d) / c;
      return p;
    }
    return (p as DPolygon).map((t: DPoint) => this.z(t));
  }

  clone(): DPlane {
    const {
      a,
      b,
      c,
      d,
      p1,
      p2,
      p3
    } = this;
    return new DPlane(a, b, c, d, p1, p2, p3);
  }

  distance(p: DPoint): number;
  distance(p: DPlane): number;
  distance(p: DPoint | DPlane): number {
    if (p instanceof DPoint) {
      const {
        x,
        y,
        z
      } = p;
      const {
        a,
        b,
        c,
        d
      } = this;
      return Math.abs(a * x + b * y + c * z! + d) / Math.sqrt(a * a + b * b + c * c);
    }
    const {
      a,
      b,
      c,
      d
    } = p as DPlane;
    const {d: r} = this;
    return Math.abs(d - r) / Math.sqrt(a * a + b * b + c * c);
  }

  equal(p: DPlane): boolean {
    const {
      a,
      b,
      c,
      d
    } = p;
    const {
      a: q,
      b: w,
      c: e,
      d: r
    } = this;
    return DNumbers.like(a, q) &&
      DNumbers.like(b, w) &&
      DNumbers.like(c, e) &&
      DNumbers.like(d, r);
  }

  same(p: DPlane): boolean {
    const {
      a,
      b,
      c,
      d
    } = p;
    const {
      a: q,
      b: w,
      c: e,
      d: r
    } = this;
    const t = a / q;
    const y = b / w;
    const u = c / e;
    const i = d / r;
    return DNumbers.like(t, y) &&
      DNumbers.like(t, u) &&
      DNumbers.like(t, c) &&
      DNumbers.like(t, i);
  }

  parallel(p: DPlane): boolean {
    const {
      a,
      b,
      c,
      d
    } = p;
    const {
      a: q,
      b: w,
      c: e,
      d: r
    } = this;
    const t = a / q;
    const y = b / w;
    const u = c / e;
    const i = d / r;
    return DNumbers.like(t, y) &&
      DNumbers.like(t, u) &&
      DNumbers.like(t, c) &&
      !DNumbers.like(t, i);
  }

  findIntersection(p: DPlane): DLine | null {
    if (this.parallel(p)) {
      return null;
    }
    const {a, b, c, d} = this;
    const {a: q, b: w, c: e, d: r} = p;
    const [f, g, h] = gaussianElimination([
      [a, b, c, -d],
      [q, w, e, -r],
      [0, 0, 1, 1]
    ]);
    return new DLine(f, g, h);
  }
}
