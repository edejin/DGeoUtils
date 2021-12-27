import {DPoint} from './DPoint';
import {DCircle} from './DCircle';
import {checkFunction} from './utils';

// eslint-disable-next-line padded-blocks
export class DLine {

  /**
   * @param a
   * @param b
   * @param c
   * @param [begin=DPoint.zero()]
   * @param [end=DPoint.zero()]
   */
  constructor(
    public a: number,
    public b: number,
    public c: number,
    public begin: DPoint = DPoint.zero(),
    public end: DPoint = DPoint.zero()
  ) {}

  clone(): DLine {
    return new DLine(this.a, this.b, this.c, this.begin.clone(), this.end.clone());
  }

  findPerpendicular(p: DPoint): DLine {
    checkFunction('findPerpendicular')
      .checkArgument('this.begin')
      .shouldBeMeters(this.begin)
      .checkArgument('this.end')
      .shouldBeMeters(this.end)
      .checkArgument('p')
      .shouldBeMeters(p);
    return new DLine(-this.b, this.a, this.b * p.x - this.a * p.y);
  }

  perpendicularDistance(p: DPoint): number {
    checkFunction('perpendicularDistance')
      .checkArgument('this.begin')
      .shouldBeMeters(this.begin)
      .checkArgument('this.end')
      .shouldBeMeters(this.end)
      .checkArgument('p')
      .shouldBeMeters(p);
    const perpendicularLine = this.findPerpendicular(p);
    const targetPoint = perpendicularLine.findPoint(this);
    return targetPoint!.distance(p);
  }

  /**
   * Find intersection of two lines segments.
   * For intersection of two lines use [[findPoint]]
   * @param l
   * @param [d=0]
   * @param [includeOnly=false]
   */
  intersection(l: DLine, d: number = 0, includeOnly: boolean = false): DPoint | null {
    const p = this.findPoint(l);
    if (p) {
      if (includeOnly) {
        return this.insideRange(p, d) && l.insideRange(p, d) ? p : null;
      }
      return this.inRange(p, d) && l.inRange(p, d) ? p : null;
    }
    return null;
  }

  intersectionWithCircle(circle: DCircle): DPoint | [DPoint, DPoint] | null {
    const {center, r} = circle;
    const per = this.findPerpendicular(center);
    const t = this.intersection(per, Infinity)!;
    let distance = t.distance(center);
    if (this.begin.equal(center)) {
      distance = 0;
    }
    if (this.end.equal(center)) {
      distance = 0;
    }
    if (distance < r) {
      const {a, b, c} = this;
      if (this.isParallel) {
        const ct = center.distance(t);
        const move = Math.sqrt(r * r - ct * ct);
        // Mean "|" x = const
        if (this.isParallelY) {
          t.x = this.begin.x;
          const r1 = t.clone().move(0, -move);
          const r2 = t.clone().move(0, move);
          return [r1, r2];
        }
        // Mean "-" y = const
        if (this.isParallelX) {
          t.y = this.begin.y;
          const r1 = t.clone().move(move, 0);
          const r2 = t.clone().move(-move, 0);
          return [r1, r2];
        }
      }
      if (this.begin.like(center)) {
        const p = this.begin.clone();
        return [this.movePoint(p, r), this.movePoint(p, -r)];
      }
      if (this.end.like(center)) {
        const p = this.end.clone();
        return [this.movePoint(p, r), this.movePoint(p, -r)];
      }
      const s = a * a + b * b;
      const d = r * r - c * c / s;
      const mult = Math.sqrt(d / s);
      const r1 = t.clone().move(b * mult, -a * mult);
      const r2 = t.clone().move(-b * mult, a * mult);
      return [r1, r2];
    }
    if (distance === r) {
      return t;
    }
    return null;
  }

  /**
   * Check if point below to line segment
   * @param p
   * @param d
   */
  inRange(p: DPoint, d: number = 0): boolean {
    const {minX, minY, maxX, maxY} = this;
    const {x, y} = p;
    const isInX = x >= minX - d && x <= maxX + d;
    const isInY = y >= minY - d && y <= maxY + d;
    return isInX && isInY;
  }

  /**
   * Check if point below to line segment, but not equal star or end point.
   * @param p
   * @param [d=0]
   */
  insideRange(p: DPoint, d: number = 0): boolean {
    const {begin, end} = this;
    return this.inRange(p, d) && !begin.like(p, 0.00001) && !end.like(p, 0.00001);
  }

  get center(): DPoint {
    return this.begin
      .clone()
      .setIfLessThan(this.end)
      .move(this.end
        .clone()
        .move(this.begin
          .clone()
          .minus())
        .abs()
        .minus()
        .divide(2));
  }

  get minX(): number {
    return Math.min(this.begin.x, this.end.x);
  }

  get minY(): number {
    return Math.min(this.begin.y, this.end.y);
  }

  get maxX(): number {
    return Math.max(this.begin.x, this.end.x);
  }

  get maxY(): number {
    return Math.max(this.begin.y, this.end.y);
  }

  toString(): string {
    return `(${this.a}, ${this.b}, ${this.c})`;
  }

  getValue(): number[] {
    return [this.a, this.b, this.c];
  }

  /**
   * Find `x` from `y` value of point
   * @param p
   */
  x(p: DPoint): DPoint {
    if (this.isParallelY) {
      return new DPoint(-this.c / this.a, p.y);
    }
    if (this.isParallelX) {
      return new DPoint(p.x, -this.c / this.b);
    }
    return new DPoint(-this.b / this.a * p.y - this.c / this.a, p.y);
  }

  /**
   * Find `y` from `x` value of point
   * @param p
   */
  y(p: DPoint): DPoint {
    if (this.isParallelY) {
      return new DPoint(-this.c / this.a, p.y);
    }
    if (this.isParallelX) {
      return new DPoint(p.x, -this.c / this.b);
    }
    return new DPoint(p.x, -this.a / this.b * p.x - this.c / this.b);
  }

  /**
   * Find intersection of two lines.
   * For intersection of two lines segments use [[intersection]]
   * @param l
   */
  findPoint(l: DLine): DPoint | null {
    if (this.isParallelY && l.isParallelY) {
      return null;
    }
    if (this.isParallelX && l.isParallelX) {
      return null;
    }
    if (this.isParallelX && l.isParallelY) {
      return new DPoint(-l.c / l.a, -this.c / this.b);
    }
    if (this.isParallelY && l.isParallelX) {
      return new DPoint(-this.c / this.a, -l.c / l.b);
    }
    if (this.isParallelY) {
      const x = -this.c / this.a;
      return l.y(new DPoint(x));
    }
    if (this.isParallelX) {
      const y = -this.c / this.b;
      return l.x(new DPoint(0, y));
    }
    if (l.isParallelY) {
      const x = -l.c / l.a;
      return this.y(new DPoint(x));
    }
    if (l.isParallelX) {
      const y = -l.c / l.b;
      return this.x(new DPoint(0, y));
    }
    const res = this.y(new DPoint((l.c / l.b - this.c / this.b) / (this.a / this.b - l.a / l.b)));
    if (!isFinite(res.x) && !isFinite(res.y)) {
      return null;
    }
    return res;
  }

  /**
   * Check if line parallel to `x` or `y` axis
   */
  get isParallel(): boolean {
    return this.isParallelX || this.isParallelY;
  }

  get isParallelY(): boolean {
    return Math.abs(this.b) < 0.001;
  }

  get isParallelX(): boolean {
    return Math.abs(this.a) < 0.001;
  }

  /**
   * Get lines segment start and end points as array
   */
  get points(): [DPoint, DPoint] {
    return [this.begin, this.end];
  }

  /**
   * Get line segment direction (from start point to end point)
   */
  getFi(): number {
    checkFunction('getFi')
      .checkArgument('this.begin')
      .shouldBeMeters(this.begin)
      .checkArgument('this.end')
      .shouldBeMeters(this.end);
    const {x, y} = this.end.clone().move(this.begin.clone().minus());
    let v = Math.atan2(y, x) - Math.PI;
    if (v > 0) {
      v = Math.PI - v;
    }
    return (Math.PI - v) % (Math.PI * 2);
  }

  toWKT(): string {
    const {
      begin: {x: x1, y: y1},
      end: {x: x2, y: y2}
    } = this;
    return `LINESTRING (${x1} ${y1}, ${x2} ${y2})`;
  }

  /**
   * Move lines point to left or right
   * @param p
   * @param d
   */
  movePoint(p: DPoint, d: number): DPoint {
    const fi = this.findFi(new DLine(1, 0, 0));
    const td = this.begin.distance(this.end) / 2;
    const dcosT = td * Math.cos(fi);
    const dsinT = td * Math.sin(fi);
    const p1T = new DPoint(p.x - dsinT, p.y - dcosT);
    const p2T = new DPoint(p.x + dsinT, p.y + dcosT);
    const dcos = d * Math.cos(fi);
    const dsin = d * Math.sin(fi);
    const p2 = new DPoint(p.x + dsin, p.y + dcos);
    const p3 = new DPoint(p.x - dsin, p.y + dcos);
    if (this.inRange(p1T) || this.inRange(p2T)) {
      return p2;
    }
    return p3;
  }

  /**
   * Find angle between current line and line in argument
   * @param l
   * @param delta
   */
  findFi({a, b}: DLine, delta = 1.0001): number {
    const {a: q, b: w} = this;
    let val = (q * a + w * b) / (Math.sqrt(q * q + w * w) * Math.sqrt(a * a + b * b));
    if (val > 1 && val < delta) {
      val = 1;
    } else if (val < -1 && val > -delta) {
      val = -1;
    }
    return Math.acos(val);
  }

  /**
   * [Cross product](https://en.wikipedia.org/wiki/Cross_product)
   * @param l {DLine}
   */
  vectorProduct({a, b, c}: DLine): DLine {
    const {a: q, b: w, c: e} = this;
    return new DLine(w * c - e * b, e * a - q * c, q * b - w * a);
  }
}
