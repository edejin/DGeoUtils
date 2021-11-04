import {DLine} from './DLine';
import {DPolygon} from './DPolygon';
import {checkFunction} from './utils';

const diff = 0;

const radiansPolygon = new DPolygon();

/**
 * Meters
 * Projected bounds:
 * -20026376.39 -20048966.10
 * 20026376.39 20048966.10
 */
export const PSEUDO_MERCATOR = 'EPSG:3857';
const pseudoMercatorPolygon = new DPolygon();

/**
 * Degrees
 * Projected bounds:
 * -180.0 -90.0
 * 180.0 90.0
 */
export const WORLD_GEODETIC_SYSTEM = 'EPSG:4326';
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
  x: number = 0;
  y: number = 0;
  z?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: { [key: string]: any } = {};

  /**
   *
   * @param x - lng, meters to East, radians to East or width
   * @param y - lat, meters to North, radians to North or height
   * @param z - height
   */
  constructor(x: number = 0, y: number = 0, z?: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static Zero(): DPoint {
    return new DPoint(0, 0);
  }

  static parse(c: LatLng | number[] | DCoord): DPoint {
    const {lat, lng} = c as LatLng;
    if (lat && lng) {
      return new DPoint(lat, lng, 0);
    }
    const [x, y, z] = c as DCoord;
    return new DPoint(x, y, z);
  }

  static isPoint(p: unknown): boolean {
    return p instanceof DPoint;
  }

  static parseFromWKT(wkt: string): DPoint {
    const regexp = /POINT \((?<data>(?:(?!\)).)*?)\)$/miu;
    const data = wkt.trim().toUpperCase();
    const res = regexp.exec(data)!;
    const [x, y, z] = res.groups!.data.split(' ').map(Number);
    return new DPoint(x, y, z);
  }

  static Random(): DPoint {
    return new DPoint(Math.random(), Math.random());
  }

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

  setX(x: number | SetterFunction): DPoint {
    this.x = typeof x === 'number' ? x : x(this);
    return this;
  }

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

  move(x: number | DPoint = 0, y: number = (x as number)): DPoint {
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

  scale(x: number | DPoint = 0, y: number = (x as number)): DPoint {
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

  divide(x: number | DPoint = 0, y: number = (x as number)): DPoint {
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

  like(p: DPoint, d = 0.001): boolean {
    const likeX = Math.abs(this.x - p.x) < d;
    const likeY = Math.abs(this.y - p.y) < d;
    const likeZ = this.z === p.z || Math.abs(this.z! - p.z!) < d;
    return likeX && likeY && likeZ;
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
    return new DPolygon(Array.from(new Array(pointsCount))
      .map((v: undefined, i: number) => {
        const x = t.x + step * i;
        const y = Math.atan((Math.tan(t.y) * Math.sin(p.x - x)) / d +
          (Math.tan(p.y) * Math.sin(x - t.x)) / d);
        return new DPoint(x, y).radiansToDegrees();
      }));
  }
}
