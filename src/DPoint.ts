import {DLine} from './DLine';
import {DPolygon} from './DPolygon';
import {checkFunction, createArray} from './utils';

const diff = 0;

const radiansPolygon = new DPolygon();

const pseudoMercatorPolygon = new DPolygon();

const worldGeodeticPolygon = new DPolygon();
export const EARTH_RADIUS_IN_METERS = 6371008.8;

export type DCoord = [number, number] | [number, number, number];

export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_IN_MITERS = 20037508.34;
const DEGREES_IN_EARTH = 180;
const MITERS_IN_ONE_DEGREE = EARTH_IN_MITERS / DEGREES_IN_EARTH;
const DEGREES_IN_ONE_MITER = DEGREES_IN_EARTH / EARTH_IN_MITERS;
export const HALF_PI_IN_DEGREE = 90;
export const PI_IN_DEGREE = 180;
export const DOUBLE_PI_IN_DEGREE = 360;
export const PI_TO_DEGREE = Math.PI / PI_IN_DEGREE;
export const DEGREE_TO_PI = PI_IN_DEGREE / Math.PI;

export type SetterFunction = (t: DPoint) => number;

export class DPoint {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: { [key: string]: any } = {};

  /**
   * Create point with zero coords `(0, 0)`
   */
  constructor();

  /**
   * Create point
   * @param xy - `x` and `y` value
   */
  constructor(xy: number);

  /**
   * Create point
   * @param x - lng, meters to East, radians to East or width
   * @param y - lat, meters to North, radians to North or height
   */
  constructor(x: number, y: number);

  /**
   * Create point
   * @param x - lng, meters to East, radians to East or width
   * @param y - lat, meters to North, radians to North or height
   * @param z - height
   */
  constructor(x: number, y: number, z?: number);
  // eslint-disable-next-line no-empty-function,no-useless-constructor
  constructor(public x: number = 0, public y: number = x, public z?: number) {}

  static zero(): DPoint {
    return new DPoint();
  }

  static parse(c: LatLng | number[] | DCoord): DPoint {
    const {lat, lng} = c as LatLng;
    if (lat && lng) {
      return new DPoint(lat, lng, 0);
    }
    const [x, y, z] = c as DCoord;
    return new DPoint(x, y, z);
  }

  static parseFromWKT(wkt: string): DPoint {
    const regexp = /POINT \((?<data>(?:(?!\)).)*?)\)$/miu;
    const data = wkt.trim().toUpperCase();
    const res = regexp.exec(data)!;
    const [x, y, z] = res.groups!.data.split(' ').map(Number);
    return new DPoint(x, y, z);
  }

  static random(): DPoint {
    return new DPoint(Math.random(), Math.random());
  }

  /**
   * @remark Point should be Lng/Lat.
   *
   * @remark `z` value default for `zoom` argument.
   *
   * @param [zoom=this.z]
   */
  getTileFromCoords(zoom: number = this.z!): DPoint {
    checkFunction('getTileFromCoords')
      .checkArgument('this')
      .shouldBeDegree(this);
    const x = Math.floor((this.x + PI_IN_DEGREE) / DOUBLE_PI_IN_DEGREE * (2 ** zoom));
    const y = Math.floor((
      1 - Math.log(Math.tan(this.y * PI_TO_DEGREE) + 1 / Math.cos(this.y * PI_TO_DEGREE)) / Math.PI
    ) / 2 * (2 ** zoom));
    return new DPoint(x, y, zoom);
  }

  /**
   * Result would be Lng/Lat.
   *
   * @remark `z` value default for `zoom` argument.
   *
   * @param [zoom=this.z]
   */
  getCoordsFromTile(zoom: number = this.z!): DPoint {
    checkFunction('getCoordsFromTile')
      .checkArgument('this')
      .shouldBeUInt(this);
    const n = Math.PI - 2 * Math.PI * this.y / (2 ** zoom);
    const x = this.x / (2 ** zoom) * DOUBLE_PI_IN_DEGREE - PI_IN_DEGREE;
    const y = PI_IN_DEGREE / Math.PI * Math.atan((Math.exp(n) - Math.exp(-n)) / 2);
    return new DPoint(x, y, zoom);
  }

  toCoords(): DCoord {
    if (this.z === undefined) {
      return [this.x, this.y];
    }
    return [this.x, this.y, this.z];
  }

  /**
   * Find line between two points.
   * @param p
   */
  findLine(p: DPoint): DLine {
    checkFunction('findLine')
      .checkArgument('this')
      .shouldBeMeters(this)
      .checkArgument('p')
      .shouldBeMeters(p);
    if (this.equal(p)) {
      return this.findLine(p.clone().move(0, 1));
    }
    const a = this.y - p.y - diff;
    const b = p.x - this.x - diff;
    const c = this.x * p.y - p.x * this.y - diff;
    if (a === 0) {
      return new DLine(0, 1, c / b, this, p);
    }
    if (b === 0) {
      return new DLine(1, 0, c / a, this, p);
    }
    return new DLine(a, b, c, this, p);
  }

  findInnerAngle(p1: DPoint, p3: DPoint): number {
    checkFunction('findInnerAngle')
      .checkArgument('this')
      .shouldBeMeters(this)
      .checkArgument('p1')
      .shouldBeMeters(p1)
      .checkArgument('p3')
      .shouldBeMeters(p3);
    const a1 = this.findLine(p1).getFi();
    const a2 = this.findLine(p3).getFi();
    if (a2 >= a1) {
      return a2 - a1;
    }
    return a2 + Math.PI * 2 - a1;
  }

  toString(): string {
    return `${this.x} ${this.y}`;
  }

  getValue(): [number, number] {
    return [this.x, this.y];
  }

  height(z: number): DPoint {
    this.z = z;
    return this;
  }

  toWKT(): string {
    const {x, y} = this;
    return `POINT (${x} ${y})`;
  }

  distance(p: DPoint): number {
    checkFunction('distance')
      .checkArgument('this')
      .shouldBeMeters(this)
      .checkArgument('p')
      .shouldBeMeters(p);
    const dx = p.x - this.x;
    const dy = p.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Set `x` value
   * @param x
   */
  setX(x: number): DPoint;

  /**
   * Transform `x` value by function
   * @param f
   */
  setX(f: SetterFunction): DPoint;
  setX(x: number | SetterFunction): DPoint {
    this.x = typeof x === 'number' ? x : x(this);
    return this;
  }

  /**
   * Set `z` value
   * @param z
   */
  setZ(z: number): DPoint;

  /**
   * Transform `z` value by function
   * @param f
   */
  setZ(f: SetterFunction): DPoint;
  setZ(z: number | SetterFunction): DPoint {
    this.z = typeof z === 'number' ? z : z(this);
    return this;
  }


  /**
   * Set `y` value
   * @param y
   */
  setY(y: number): DPoint;

  /**
   * Transform `y` value by function
   * @param f
   */
  setY(f: SetterFunction): DPoint;
  setY(y: number | SetterFunction): DPoint {
    this.y = typeof y === 'number' ? y : y(this);
    return this;
  }

  clone(): DPoint {
    const p = new DPoint(this.x, this.y, this.z);
    p.properties = {...this.properties};
    return p;
  }

  gt(p: DPoint): boolean {
    return this.x > p.x && this.y > p.y;
  }

  lt(p: DPoint): boolean {
    return this.x < p.x && this.y < p.y;
  }

  gtOrEqual(p: DPoint): boolean {
    return this.gt(p) || this.equal(p);
  }

  ltOrEqual(p: DPoint): boolean {
    return this.lt(p) || this.equal(p);
  }

  /**
   * Clockwise rotation
   * @param a radians
   */
  rotate(a: number): DPoint {
    const x = this.x * Math.cos(a) - this.y * Math.sin(a);
    const y = this.x * Math.sin(a) + this.y * Math.cos(a);
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Add `v` to `x` and `y`
   * @param v
   */
  move(v: number): DPoint;

  /**
   * Add `p.x` to `x` field and `p.y` to `y` field.
   * @param p
   */
  move(p: DPoint): DPoint;

  /**
   * Add `x` to `x` field and `y` to `y` field.
   * @param x
   * @param y
   */
  move(x: number, y: number): DPoint;
  move(x: number | DPoint, y: number = (x as number)): DPoint {
    let xV = 0;
    let yV = 0;
    if (x instanceof DPoint) {
      xV = this.x + x.x;
      yV = this.y + x.y;
    } else {
      xV = this.x + (x as number);
      yV = this.y + y;
    }
    this.x = xV;
    this.y = yV;
    return this;
  }

  degreeToMeters(): DPoint {
    checkFunction('degreeToMeters')
      .checkArgument('this')
      .shouldBeDegree(this);
    const x = ((this.x + PI_IN_DEGREE) % DOUBLE_PI_IN_DEGREE - PI_IN_DEGREE) * MITERS_IN_ONE_DEGREE;
    const y = (Math.log(Math.tan(((this.y + HALF_PI_IN_DEGREE) % PI_IN_DEGREE) *
      (Math.PI / DOUBLE_PI_IN_DEGREE))) / PI_TO_DEGREE) * MITERS_IN_ONE_DEGREE;
    this.x = x;
    this.y = y;
    return this;
  }

  metersToDegree(): DPoint {
    checkFunction('metersToDegree')
      .checkArgument('this')
      .shouldBeMeters(this);
    const lon = this.x * DEGREES_IN_ONE_MITER;
    const lat = Math.atan(Math.E ** ((this.y / MITERS_IN_ONE_DEGREE) * PI_TO_DEGREE)) *
      (DOUBLE_PI_IN_DEGREE / Math.PI) - HALF_PI_IN_DEGREE;
    this.x = lon;
    this.y = lat;
    return this;
  }

  degreeToRadians(): DPoint {
    checkFunction('degreeToRadians')
      .checkArgument('this')
      .shouldBeDegree(this);
    return this.scale(PI_TO_DEGREE);
  }

  radiansToDegrees(): DPoint {
    checkFunction('radiansToDegrees')
      .checkArgument('this')
      .shouldBeRadians(this);
    return this.scale(DEGREE_TO_PI);
  }

  radiansToMeters(): DPoint {
    checkFunction('radiansToMeters')
      .checkArgument('this')
      .shouldBeRadians(this);
    return this.radiansToDegrees().degreeToMeters();
  }

  metersToRadians(): DPoint {
    checkFunction('metersToRadians')
      .checkArgument('this')
      .shouldBeMeters(this);
    return this.metersToDegree().degreeToRadians();
  }

  round(): DPoint {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  ceil(): DPoint {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }

  floor(): DPoint {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }

  /**
   * @param [n=2]
   */
  toFixed(n: number = 2): DPoint {
    this.x = parseFloat(this.x.toFixed(n));
    this.y = parseFloat(this.y.toFixed(n));
    return this;
  }

  abs(): DPoint {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  /**
   * Multiply `v` to `x` and `y`
   * @param v
   */
  scale(v: number): DPoint;

  /**
   * Multiply `p.x` to `x` field and `p.y` to `y` field.
   * @param p
   */
  scale(p: DPoint): DPoint;

  /**
   * Multiply `x` to `x` field and `y` to `y` field.
   * @param x
   * @param y
   */
  scale(x: number, y: number): DPoint;
  scale(x: number | DPoint, y: number = (x as number)): DPoint {
    let xV = 0;
    let yV = 0;
    if (x instanceof DPoint) {
      xV = this.x * x.x;
      yV = this.y * x.y;
    } else {
      xV = this.x * (x as number);
      yV = this.y * y;
    }
    this.x = xV;
    this.y = yV;
    return this;
  }

  /**
   * Divide `x` and `y` to `v`
   * @param v
   */
  divide(v: number): DPoint;

  /**
   * Divide `x` field to `p.x` and `y` field to `p.y`.
   * @param p
   */
  divide(p: DPoint): DPoint;

  /**
   * Divide `x` field to `x` and `y` field to `y`.
   * @param x
   * @param y
   */
  divide(x: number, y: number): DPoint;
  divide(x: number | DPoint, y: number = (x as number)): DPoint {
    let xV = 0;
    let yV = 0;
    if (x instanceof DPoint) {
      xV = this.x / x.x;
      yV = this.y / x.y;
    } else {
      xV = this.x / (x as number);
      yV = this.y / y;
    }
    this.x = xV;
    this.y = yV;
    return this;
  }

  equal(p: DPoint): boolean {
    return this.x === p.x && this.y === p.y && this.z === p.z;
  }

  /**
   * @param p
   * @param [d=0.001]
   */
  like(p: DPoint, d = 0.001): boolean {
    if (this.equal(p)) {
      return true;
    }
    const likeX = Math.abs(this.x - p.x) < d;
    const likeY = Math.abs(this.y - p.y) < d;
    const likeZ = Math.abs((this.z ?? p.z ?? 0) - (p.z ?? this.z ?? 0)) < d;
    return likeX && likeY && likeZ;
  }

  /**
   * Flip vertically
   * @param size canvas size
   */
  flipVertically(size: DPoint): DPoint;

  /**
   * Flip vertically
   * @param height canvas height
   */
  flipVertically(height: number): DPoint;
  flipVertically(size: DPoint | number): DPoint {
    let v = size as number;
    if (size instanceof DPoint) {
      v = size.y;
    }
    this.y = v - this.y;
    return this;
  }

  /**
   * Check if point looks like radians
   */
  get likeRadians(): boolean {
    if (radiansPolygon.length === 0) {
      radiansPolygon.push(new DPoint(-Math.PI, -Math.PI / 2), new DPoint(Math.PI, Math.PI / 2));
    }
    return radiansPolygon.simpleInclude(this);
  }

  /**
   * Check if point looks like `EPSG:4326` (degrees)
   */
  get likeWorldGeodeticSystem(): boolean {
    if (worldGeodeticPolygon.length === 0) {
      worldGeodeticPolygon.push(new DPoint(-180, -90), new DPoint(180, 90));
    }
    return !this.likeRadians && worldGeodeticPolygon.simpleInclude(this);
  }


  /**
   * Check if point looks like `EPSG:3857` (meters)
   */
  get likePseudoMercator(): boolean {
    if (pseudoMercatorPolygon.length === 0) {
      pseudoMercatorPolygon.push(new DPoint(-20026376.39, -20048966.10), new DPoint(20026376.39, 20048966.10));
    }
    return !this.likeRadians && !this.likeWorldGeodeticSystem && pseudoMercatorPolygon.simpleInclude(this);
  }

  get w(): number {
    return this.x;
  }

  set w(x: number) {
    this.x = x;
  }

  get h(): number {
    return this.y;
  }

  set h(y: number) {
    this.y = y;
  }

  get area(): number {
    checkFunction('area')
      .checkArgument('this')
      .shouldBeMeters(this);
    return this.w * this.h;
  }

  get hip(): number {
    checkFunction('hip')
      .checkArgument('this')
      .shouldBeMeters(this);
    return Math.sqrt(this.w * this.w + this.h * this.h);
  }

  get min(): number {
    return Math.min(this.x, this.y);
  }

  get max(): number {
    return Math.max(this.x, this.y);
  }

  get hipPoint(): DPoint {
    const {hip} = this;
    return new DPoint(hip, hip);
  }

  get xPoint(): DPoint {
    const {x} = this;
    return new DPoint(x, x);
  }

  get yPoint(): DPoint {
    const {y} = this;
    return new DPoint(y, y);
  }

  get wPoint(): DPoint {
    return this.xPoint;
  }

  get hPoint(): DPoint {
    return this.yPoint;
  }

  simple(xKey: string = 'x', yKey: string = 'y'): { [key: string]: number } {
    return {
      [xKey]: this.x,
      [yKey]: this.y
    };
  }

  setIfLessThan(p: DPoint): DPoint {
    this.x = Math.max(this.x, p.x);
    this.y = Math.max(this.y, p.y);
    return this;
  }

  minus(): DPoint {
    return this.clone().scale(-1);
  }

  /**
   * Find [orthodromic path](https://en.wikipedia.org/wiki/Great-circle_navigation) between to points.
   *
   * @remark Points should be Lng/Lat.
   *
   * ![example](/media/examples/orthodromicPath.png)
   *
   * @param point
   * @param [pointsCount=360]
   */
  orthodromicPath(point: DPoint, pointsCount = 360): DPolygon {
    checkFunction('orthodromicPath')
      .checkArgument('this')
      .shouldBeDegree(this)
      .checkArgument('point')
      .shouldBeDegree(point);
    const t = this.clone().degreeToRadians();
    const p = point.clone().degreeToRadians();
    const d = Math.sin(p.x - t.x);
    const step = (p.x - t.x) / (pointsCount - 1);
    return new DPolygon(createArray(pointsCount)
      .map((v: number, i: number) => {
        const x = t.x + step * i;
        const y = Math.atan((Math.tan(t.y) * Math.sin(p.x - x)) / d +
          (Math.tan(p.y) * Math.sin(x - t.x)) / d);
        return new DPoint(x, y).radiansToDegrees();
      }));
  }
}
