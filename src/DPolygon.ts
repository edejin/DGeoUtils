/* eslint-disable max-lines */
import {DCoord, DPoint, LatLng} from './DPoint';
import {DLine} from './DLine';
import {DCircle} from './DCircle';
import {DNumbers} from './DNumbers';
import {io as jstsIo, geom, operation} from 'jsts';
import Geometry = geom.Geometry;
import {DPolygonLoop} from './DPolygonLoop';

const {
  buffer: {
    BufferParameters: {
      CAP_ROUND,
      CAP_FLAT,
      CAP_SQUARE
    }
  }
} = operation;

export const MIN_POINTS_IN_VALID_POLYGON = 3;
const APPROXIMATION_VALUE = 0.1;
const MAX_CONVEX_ITERATIONS = 100;
const CLOSE_TO_INTERSECTION_DISTANCE = 0.001;

export class DPolygon {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: { [key: string]: any } = {};
  holes: DPolygon[] = [];
  private searchStore: Record<number, Record<number, Record<number | string, boolean>>> = {};

  // eslint-disable-next-line no-useless-constructor,no-empty-function
  constructor(private pPoints: DPoint[] = []) {}

  /**
   * Specifies a round line buffer end cap style.
   */
  static CAP_ROUND: number = CAP_ROUND;

  /**
   * Specifies a flat line buffer end cap style.
   */
  static CAP_FLAT: number = CAP_FLAT;

  /**
   * Specifies a square line buffer end cap style.
   */
  static CAP_SQUARE: number = CAP_SQUARE;

  /**
   * Transform array of triangles to Three.JS vertices
   *
   * ```
   * const geometry = new THREE.BufferGeometry();
   * // create a simple square shape. We duplicate the top left and bottom right
   * // vertices because each vertex needs to appear once per triangle.
   * const vertices = new Float32Array( DPolygon.arrayOfTrianglesToVertices(triangles, 10) );
   *
   * // itemSize = 3 because there are 3 values (components) per vertex
   * geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
   * const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
   * mesh = new THREE.Mesh( geometry, material );
   *
   * scene.add( mesh );
   * ```
   *
   * @param triangles
   * @param [height=0]
   */
  static arrayOfTrianglesToVertices(triangles: DPolygon[], height: number = 0): number[] {
    return triangles.map((v: DPolygon) => v
      .loop()
      .height(height)
      .run()
      .toArrayOfCoords())
      .flat(2);
  }

  /**
   * Get size of min area rectangle.
   * @param poly should be `minAreaRectangle`
   */
  static minAreaRectangleSize(poly: DPolygon): DPoint {
    const {first, second, last} = poly.clone().open();
    return new DPoint(first.distance(second), first.distance(last));
  }

  /**
   * Slice line string to dashes.
   * @param poly should be `divideToPieces` at first
   */
  static toDash(poly: DPolygon): DPolygon[] {
    let p = new DPolygon();
    const result = [p];
    let trigger = true;
    for (const point of poly.points) {
      if (trigger) {
        p.push(point.clone());
      }
      if (point.properties.pieceBorder) {
        trigger = !trigger;
        if (trigger) {
          p = new DPolygon();
          result.push(p);
          p.push(point.clone());
        }
      }
    }
    return result;
  }

  /**
   * Get min area rectangle direction
   * @param poly should be `minAreaRectangle`
   */
  static minAreaRectangleDirection(poly: DPolygon): number {
    const {first, second, last} = poly.clone().open();
    if (!first || !second || !last) {
      return 0;
    }
    if (first.distance(second) > first.distance(last)) {
      return first.findLine(second).getFi();
    }
    return first.findLine(last).getFi();
  }

  static parseFromWKT(wkt: string): DPolygon {
    const data = wkt.trim().toUpperCase();
    let res: DPolygon = new DPolygon();
    if (data.indexOf('POLYGON') === 0) {
      const regexp = /POLYGON \(\((?<data>(?:(?!\)\)$).)*?)\)\)$/miu;
      const reg = regexp.exec(data)!;
      const [path, ...holes] = (reg.groups!.data as string)
        .split('), (')
        .map((p: string) => new DPolygon(p.split(', ')
          .map((pares: string) => DPoint.parse(pares.split(' ').map(Number))!)));
      if (holes && holes.length) {
        path.holes = holes;
      }
      res = path;
    }
    if (data.indexOf('LINESTRING') === 0) {
      const regexp = /LINESTRING \((?<data>(?:(?!\)$).)*?)\)$/miu;
      const reg = regexp.exec(data)!;
      res = new DPolygon((reg.groups!.data as string)
        .split(', ').map((t: string) => DPoint.parse(t.split(' ').map(Number))!));
    }
    if (data.indexOf('POINT') === 0) {
      res = new DPolygon([DPoint.parseFromWKT(data)]);
    }

    return res!;
  }

  static createSquareBySize(size: DPoint): DPolygon {
    return new DPolygon([DPoint.zero(), size.clone().setX(0), size.clone(), size.clone().setY(0)]).close();
  }

  loop(): DPolygonLoop {
    return new DPolygonLoop(this);
  }

  set points(p: DPoint[]) {
    this.pPoints = p;
  }

  get points(): DPoint[] {
    return this.pPoints;
  }

  get maxX(): number {
    return this.pPoints.reduce((a: number, r: DPoint) => Math.max(a, r.x), -Infinity);
  }

  get minX(): number {
    return this.pPoints.reduce((a: number, r: DPoint) => Math.min(a, r.x), Infinity);
  }

  get maxY(): number {
    return this.pPoints.reduce((a: number, r: DPoint) => Math.max(a, r.y), -Infinity);
  }

  get minY(): number {
    return this.pPoints.reduce((a: number, r: DPoint) => Math.min(a, r.y), Infinity);
  }

  /**
   * Get center coordinates
   */
  get center(): DPoint {
    return this.leftTop.move(this.size.divide(2));
  }

  /**
   * Difference between `maxY` and `minY`. Equal `ΔY` (`dY`)
   */
  get h(): number {
    return this.maxY - this.minY;
  }

  /**
   * Difference between `maxX` and `minX`. Equal `ΔX` (`dX`)
   */
  get w(): number {
    return this.maxX - this.minX;
  }

  /**
   * Difference between `maxY` and `minY`. Equal `height` (`h`)
   */
  get dY(): number {
    return this.h;
  }

  /**
   * Difference between `maxX` and `minX`. Equal `width` (`w`)
   */
  get dX(): number {
    return this.w;
  }

  /**
   * Get closed extend polygon
   */
  get extend(): DPolygon {
    const {minX, minY, maxX, maxY} = this;
    return new DPolygon([
      new DPoint(minX, minY),
      new DPoint(maxX, minY),
      new DPoint(maxX, maxY),
      new DPoint(minX, maxY),
      new DPoint(minX, minY)
    ]);
  }

  /**
   * Point with `width` value as `x` and `height` value as `y`
   */
  get size(): DPoint {
    const {w, h} = this;
    return new DPoint(w, h);
  }

  /**
   * Point with minimal `x` and `y`
   */
  get leftTop(): DPoint {
    const {minX, minY} = this;
    return new DPoint(minX, minY);
  }

  /**
   * Point with maximal `x` and `y`
   */
  get rightBottom(): DPoint {
    const {maxX, maxY} = this;
    return new DPoint(maxX, maxY);
  }

  /**
   * Next point index
   */
  get length(): number {
    return this.pPoints.length;
  }

  /**
   * Get length of line string.
   */
  get fullLength(): number {
    return this.clone().open().perimeter;
  }

  /**
   * Get perimeter.
   */
  get perimeter(): number {
    let p = 0;
    for (let i = 1; i < this.pPoints.length; i++) {
      p += this.pPoints[i - 1].distance(this.pPoints[i]);
    }
    return p;
  }

  /**
   * Get polygon area
   */
  get area(): number {
    const closed = this.deintersection;
    let sum = 0;
    for (let i = 1; i < closed.length; i++) {
      const cur = closed.at(i);
      const prev = closed.at(i - 1);
      sum += prev.x * cur.y - prev.y * cur.x;
    }
    return Math.abs(sum / 2) - this.holes.reduce((a: number, hole: DPolygon) => a + hole.area, 0);
  }

  /**
   * Get deintesected polygon.
   */
  get deintersection(): DPolygon {
    const p = this.clone().close();
    for (let i = 0; i < p.length - 1; i++) {
      for (let j = i + 2; j < p.length - 1; j++) {
        const firstLine = p.at(i).findLine(p.at(i + 1));
        const secondLine = p.at(j).findLine(p.at(j + 1));
        const intersectionPoint = firstLine.intersection(secondLine);
        if (
          intersectionPoint &&
          ![...firstLine.points, ...secondLine.points].some((t: DPoint) => t.like(intersectionPoint))
        ) {
          const part = p.removePart(i, j - i).reverse();
          p.insertAfter(i, ...part);
          p.insertAfter(j, intersectionPoint);
          p.insertAfter(i, intersectionPoint);
        }
      }
    }
    return p;
  }

  /**
   * Check if polygon contain more than three points
   */
  get valid(): boolean {
    return this.length > MIN_POINTS_IN_VALID_POLYGON;
  }

  /**
   * Get first point
   */
  get first(): DPoint {
    return this.at(0);
  }

  /**
   * Get second point
   */
  get second(): DPoint {
    return this.at(1);
  }

  /**
   * Get last point
   */
  get last(): DPoint {
    return this.at(this.length - 1);
  }

  /**
   * Get min area rectangle
   */
  get minAreaRectangle(): DPolygon {
    const p = this.convex;
    let resultPolygon = new DPolygon();
    let resultArea = Infinity;
    for (let k = 0; k < p.length - 1; k++) {
      const l = p.at(k).findLine(p.at(k + 1));
      let maxWidth = 0;
      let maxWidthPoint1: DPoint | null = null;
      let maxWidthPoint2: DPoint | null = null;
      let maxHeight = 0;
      let maxHeightPoint: DPoint | null = null;
      for (let i = 0; i < p.length - 1; i++) {
        const p1: DPoint = l.findPoint(l.findPerpendicular(p.at(i)))!;
        const h = p1.distance(p.at(i));
        if (h >= maxHeight) {
          maxHeight = h;
          maxHeightPoint = p.at(i);
        }
        for (let j = i; j < p.length - 1; j++) {
          const p2: DPoint = l.findPoint(l.findPerpendicular(p.at(j)))!;
          const w = p1.distance(p2);
          if (w >= maxWidth) {
            maxWidth = w;
            maxWidthPoint1 = p1;
            maxWidthPoint2 = p2;
          }
        }
      }
      if (!maxWidthPoint1 || !maxWidthPoint2 || !maxHeightPoint) {
        continue;
      }
      const widthLine = maxWidthPoint1.findLine(maxWidthPoint2);
      const perpendicular1 = widthLine.findPerpendicular(maxWidthPoint1);
      const perpendicular2 = widthLine.findPerpendicular(maxWidthPoint2);
      const tempPolygon = new DPolygon([
        maxWidthPoint1,
        maxWidthPoint2,
        perpendicular2.findPoint(perpendicular2.findPerpendicular(maxHeightPoint))!,
        perpendicular1.findPoint(perpendicular1.findPerpendicular(maxHeightPoint))!
      ]).close();
      if (tempPolygon.area < resultArea) {
        resultPolygon = tempPolygon;
        resultArea = tempPolygon.area;
      }
    }
    return resultPolygon;
  }

  /**
   * Get convex polygon
   */
  get convex(): DPolygon {
    let p = this.clone().open();
    const {isClockwise} = p;
    if (!isClockwise) {
      p.reverse();
    }
    let l = 0;
    do {
      const p1 = p.last;
      const p2 = p.first;
      const p3 = p.second;
      const d = p2.findInnerAngle(p1, p3);
      if (d > Math.PI || DNumbers.likeZero(DNumbers.rad2Deg(d)) || DNumbers.likePI(d) || DNumbers.like2PI(d)) {
        p.removePart(-1, 1);
      } else {
        break;
      }
    } while (p.length);
    p.close();
    let iteration = 0;
    do {
      p = p.deintersection;
      l = p.length;
      for (let i = 1; i < p.length - 1; i++) {
        const p1 = p.at(i - 1);
        const p2 = p.at(i);
        const p3 = p.at(i + 1);
        const d = p2.findInnerAngle(p1, p3);
        if (d > Math.PI || DNumbers.likeZero(DNumbers.rad2Deg(d)) || DNumbers.likePI(d) || DNumbers.like2PI(d)) {
          p.removePart(--i, 1);
        }
      }
      iteration++;
    } while (p.length !== l && iteration < MAX_CONVEX_ITERATIONS);
    if (!isClockwise) {
      p.reverse();
    }
    return p;
  }

  /**
   * Check polygon direction
   */
  get isClockwise(): boolean {
    let sum = 0;
    const p = this.clone().close();
    for (let i = 1; i < p.length; i++) {
      const p1 = p.at(i - 1);
      const p2 = p.at(i);
      sum += (p2.x - p1.x) * (p2.y + p1.y);
    }
    return sum < 0;
  }

  /**
   * Get clockwise polygon
   */
  get clockWise(): DPolygon {
    if (this.isClockwise) {
      return this.clone();
    }
    return this.clone().reverse();
  }

  /**
   * Get polygon clone without holes
   */
  get noHoles(): DPolygon {
    const res = this.clone();
    res.holes = [];
    return res;
  }

  /**
   * Check polygon intersection with line
   * @param l
   * @param [includeOnly=false]
   */
  intersection(l: DLine, includeOnly: boolean = false): DPoint[] {
    const res = [];
    for (let i = 0; i < this.pPoints.length - 1; i++) {
      const p1 = this.pPoints[i];
      const p2 = this.pPoints[i + 1];
      const line = p1.findLine(p2);
      const intersect = line.intersection(l, 0, includeOnly);
      if (intersect) {
        res.push(intersect);
      }
    }
    return res;
  }

  /**
   * Set polygon center
   * @param newCenter
   */
  setCenter(newCenter: DPoint): DPolygon {
    return this.loop()
      .move(newCenter.clone().move(this.center.minus()))
      .run();
  }

  static WKT_LINESTRING = 'LINESTRING';
  static WKT_POLYGON = 'POLYGON';

  /**
   * @param [type = DPolygon.WKT_POLYGON] Available values `DPolygon.WKT_POLYGON`, `DPolygon.WKT_LINESTRING`
   * @param [withZ = false]
   */
  toWKT(type: string = DPolygon.WKT_POLYGON, withZ: boolean = false): string {
    if (type === DPolygon.WKT_POLYGON) {
      let h = '';
      if (this.holes && this.holes.length) {
        h = `, ${this.holes.map((hole: DPolygon) => hole.toString())
          .join(', ')}`;
      }
      return `POLYGON ((${this.deintersection.pPoints.map((r: DPoint) => `${r.x} ${r.y}${withZ ? ` ${r.z}` : ''}`)
        .join(', ')})${h})`;
    }
    return `LINESTRING (${this.pPoints.map((r: DPoint) => `${r.x} ${r.y}${withZ ? ` ${r.z}` : ''}`)
      .join(', ')})`;
  }

  /**
   * Filter points
   * @param f
   */
  filter(f: (p: DPoint) => boolean): DPolygon {
    this.pPoints = this.pPoints.filter(f);
    return this;
  }

  map(f: (r: DPoint) => DPoint): DPolygon;
  map(f: (r: DPoint, index: number) => DPoint): DPolygon;
  map(f: (r: DPoint, index: number) => DPoint): DPolygon {
    this.pPoints = this.pPoints.map(f);
    this.holes = this.holes.map((h: DPolygon) => h.map(f));
    return this;
  }

  at(index: number): DPoint {
    const {length} = this;
    return this.points[(index % length + length) % length];
  }

  pop(): DPoint {
    return this.pPoints.pop()!;
  }

  push(...args: DPoint[]): number {
    return this.pPoints.push(...args);
  }

  shift(): DPoint {
    return this.pPoints.shift()!;
  }

  unshift(...args: DPoint[]): number {
    return this.pPoints.unshift(...args);
  }

  reverse(): DPolygon {
    this.pPoints = this.pPoints.reverse();
    this.holes = this.holes.map((h: DPolygon) => h.reverse());
    return this;
  }

  getValue(): string {
    return (
      this.pPoints.map((r: DPoint) => r.getValue()) + this.holes
        .reduce((a: string, h: DPolygon) => a + h.getValue(), '')
    );
  }

  toString(): string {
    return `(${this.pPoints.map((r: DPoint) => r.toString()).join(', ')})`;
  }

  /**
   * Add to the end of polygon point equal to first point if it not exist
   */
  close(): DPolygon {
    const p0 = this.first;
    if (p0 && !this.closed) {
      this.push(p0.clone());
    }
    return this;
  }

  /**
   * Remove from the end of polygon point equal to first point if it exist
   */
  open(): DPolygon {
    const p = this.first;
    if (this.length > 2 && p && this.closed) {
      this.pop();
    }
    return this;
  }

  add(poly: DPolygon): DPolygon {
    const res = new DPolygon([...this.points, ...poly.points]).close();
    res.holes = [...this.holes, ...poly.holes].map((h: DPolygon) => h.clone());
    return res;
  }

  /**
   * Check if has point in list of points
   * @param p
   */
  has(p: DPoint): boolean {
    return this.pPoints.some((q: DPoint) => q.equal(p));
  }

  clone(): DPolygon {
    const res = new DPolygon(this.points.map((r: DPoint) => r.clone()));
    res.holes = this.holes.map((h: DPolygon) => h.clone());
    res.properties = this.properties;
    return res;
  }

  /**
   * Check is it fully equal.
   * @param p
   */
  equal(p: DPolygon | null): boolean {
    if (!(p instanceof DPolygon)) {
      return false;
    }
    if (this.length !== p.length || this.holes.length !== p.holes.length) {
      return false;
    }
    return (
      this.same(p) &&
      this.holes.reduce(
        (a: boolean, hole: DPolygon) => a && p.holes.some((pHoles: DPolygon) => pHoles.same(hole)),
        true
      )
    );
  }

  /**
   * Check is polygons are same. They can be with different directions and different start points.
   * @param p
   */
  same(p: DPolygon): boolean {
    const pClone = p.clone().close();
    const thisAsString = this.clone()
      .close()
      .toString();
    for (let i = 0; i < pClone.length; i++) {
      if (thisAsString === pClone.toString() || thisAsString === pClone.clone().reverse()
        .toString()) {
        return true;
      }
      pClone.nextStart();
    }
    return false;
  }

  findIndex(p: DPoint): number {
    return this.points.findIndex((t: DPoint) => t.equal(p));
  }

  /**
   * Get polygon approximation by
   * [Ramer–Douglas–Peucker algorithm](https://en.wikipedia.org/wiki/Ramer%E2%80%93Douglas%E2%80%93Peucker_algorithm)
   * @param [e=Math.sqrt(this.perimeter)*APPROXIMATION_VALUE]
   */
  approximation(e: number = Math.sqrt(this.perimeter) * APPROXIMATION_VALUE): DPolygon {
    return new DPolygon(this.clone().douglasPeucker(this.pPoints, e));
  }

  insertAfter(index: number, ...points: DPoint[]): void {
    this.pPoints.splice(index + 1, 0, ...points);
  }

  removePart(index: number, count: number): DPoint[] {
    return this.pPoints.splice(index + 1, count);
  }

  /**
   * Check intersection with other polygon
   * @param p
   */
  hasSimpleIntersection(p: DPolygon): boolean {
    const extend1 = this.extend;
    const extend2 = p.extend;
    const extend1points = extend1.points;
    const extend2points = extend2.points;
    const in1 = extend1points.some((t: DPoint) => extend2.simpleInclude(t));
    const in2 = extend2points.some((t: DPoint) => extend1.simpleInclude(t));
    return in1 || in2;
  }

  /**
   * Check if it possible to include point
   * @param p
   */
  simpleInclude(p: DPoint): boolean {
    return this.simpleIncludeX(p) && this.simpleIncludeY(p);
  }

  drawPolygonOnCanvas(
    canvas: HTMLCanvasElement | OffscreenCanvas,
    fillColor?: string,
    strokeColor?: string,
    shadowColor?: string,
    lineWidth: number = 1,
    steps: number = this.length - 1
  ): void {
    if (this.length < 2) {
      return;
    }
    const ctx = canvas.getContext('2d')!;
    if (fillColor) {
      ctx.fillStyle = fillColor;
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
    }
    if (lineWidth) {
      ctx.lineWidth = lineWidth;
    }
    if (fillColor || strokeColor) {
      ctx.beginPath();
    }
    this.goByPath(ctx, steps % this.length);
    if (shadowColor) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
    }
    if (fillColor) {
      ctx.closePath();
      ctx.fill();
    }
    if (strokeColor) {
      ctx.stroke();
    }
  }

  clearPolygonOnCanvas(canvas: HTMLCanvasElement | OffscreenCanvas): void {
    const ctx = canvas.getContext('2d')!;
    const old = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'destination-out';
    this.goByPath(ctx);
    ctx.fill();
    ctx.globalCompositeOperation = old;
  }

  /**
   * Check if contain point
   * @param p
   * @param [isBorderInside=false]
   */
  contain(p: DPoint, isBorderInside: boolean = false): boolean {
    const simpleInclude = this.simpleInclude(p);
    if (!simpleInclude) {
      return false;
    }
    const onBorder = this.onBorder(p);
    if (onBorder) {
      return isBorderInside;
    }
    const poly = this.deintersection;
    let totalFi = 0;
    for (let i = 0; i < poly.length - 1; i++) {
      const p1 = poly.at(i);
      const p2 = poly.at(i + 1);
      const line1 = new DLine(p1.x - p.x, p1.y - p.y, 0);
      const line2 = new DLine(p2.x - p.x, p2.y - p.y, 0);
      const fiDif = line1.findFi(line2);

      if (line1.vectorProduct(line2).c > 0) {
        totalFi += fiDif;
      } else {
        totalFi -= fiDif;
      }
    }

    // eslint-disable-next-line no-magic-numbers
    const eps = Math.PI / 10000;
    let result = false;

    const absTotalFi = Math.abs(totalFi);

    if (absTotalFi < eps) {
      result = false;
    } else if (Math.abs(2 * Math.PI - absTotalFi) < eps) {
      result = true;
    } else {
      throw new Error('contains2 faild');
    }

    return result;
  }

  /**
   * Check if point on border
   * @param p
   */
  onBorder(p: DPoint): boolean {
    const simpleInclude = this.simpleInclude(p);
    if (simpleInclude) {
      const poly = this.deintersection;
      const hasSamePoint = this.points.some((point: DPoint) => point.equal(p));
      if (hasSamePoint) {
        return true;
      }
      for (let i = 0; i < poly.length - 1; i++) {
        const p0 = poly.at(i);
        const p1 = poly.at(i + 1);
        const polygonLine = p0.findLine(p1);
        const onBorder = polygonLine.x(p).equal(p) && polygonLine.inRange(p);
        if (onBorder) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Change start point to second point
   */
  nextStart(): DPolygon {
    this.open();
    this.push(this.shift());
    this.close();
    return this;
  }

  /**
   * Remove duplicates points
   */
  removeDuplicates(): DPolygon {
    for (let i = 0; i < this.length - 1; i++) {
      const p1 = this.at(i);
      const p2 = this.at(i + 1);
      if (p1.equal(p2)) {
        this.removePart(i, 1);
        i--;
      }
    }
    return this;
  }

  /**
   * Parse from [OpenLayers](https://openlayers.org/) coordinates
   * @param a
   */
  static parse(a: LatLng[]): DPolygon;

  /**
   * Parse from [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON) coordinates
   * @param a
   */
  static parse(a: number[][]): DPolygon;

  /**
   * Parse from [OpenLayers](https://openlayers.org/) coordinates
   * @param a
   */
  static parse(a: DCoord[]): DPolygon;
  static parse(a: LatLng[] | number[][] | DCoord[]): DPolygon {
    return new DPolygon(a.map((r: LatLng | number[] | DCoord) => DPoint.parse(r)));
  }

  /**
   * Transform to array of coordinates for [OpenLayers](https://openlayers.org/) or
   * [GeoJSON](https://en.wikipedia.org/wiki/GeoJSON)
   */
  toArrayOfCoords(): DCoord[] {
    return this.pPoints.map((r) => r.toCoords());
  }

  /**
   * Divide line string to pieces by length
   * @param piecesCount
   */
  divideToPieces(piecesCount: number): DPolygon {
    const {fullLength} = this;
    const pieceLength = fullLength / piecesCount;
    let currentPieceLength = pieceLength;
    for (let i = 0; i < this.pPoints.length - 1; i++) {
      const p1 = this.pPoints[i];
      const p2 = this.pPoints[i + 1];
      if (p1.distance(p2) === currentPieceLength) {
        p2.properties.pieceBorder = true;
        currentPieceLength = pieceLength;
        continue;
      }
      if (p1.distance(p2) - currentPieceLength > 0) {
        const circle = new DCircle(p1, currentPieceLength);
        const line = p1.findLine(p2);
        const intersectionPoint: DPoint = (line.intersectionWithCircle(circle) as [DPoint, DPoint])
          .filter((p) => line.inRange(p, CLOSE_TO_INTERSECTION_DISTANCE))[0]!;
        intersectionPoint.properties.pieceBorder = true;
        this.insertAfter(i, intersectionPoint);
        currentPieceLength = pieceLength;
        continue;
      }
      if (p1.distance(p2) - currentPieceLength < 0) {
        currentPieceLength -= p1.distance(p2);
      }
    }
    return this;
  }

  prepareToFastSearch(): void {
    this.searchStore = {};
    for (const {x, y, z} of this.points) {
      if (!this.searchStore[x]) {
        this.searchStore[x] = {};
      }
      if (!this.searchStore[x][y]) {
        this.searchStore[x][y] = {};
      }
      this.searchStore[x][y][z || 'undefined'] = true;
    }
  }

  fastHas({x, y, z}: DPoint): boolean {
    if (!this.searchStore[x]) {
      return false;
    }
    if (!this.searchStore[x][y]) {
      return false;
    }
    if (!this.searchStore[x][y][z || 'undefined']) {
      return false;
    }
    return this.searchStore[x][y][z || 'undefined'];
  }

  /**
   * Get line string as line string with growing length. For animation.
   */
  get growingPiecesGenerator(): () => Generator<DPolygon, DPolygon> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias,consistent-this
    const polygon = this;
    // eslint-disable-next-line func-names
    return function *() {
      const r = new DPolygon();
      for (const p of polygon.pPoints) {
        r.push(p);
        if (p.properties.pieceBorder) {
          yield r.clone();
        }
      }
      return r.clone();
    };
  }

  simpleUnion(p: DPolygon): DPolygon | null {
    try {
      const res = this.simpleLogicFunction(p, true, true);
      if (res === null) {
        return null;
      }
      if (res instanceof DPolygon) {
        return res;
      }
      return null;
    } catch (ex) {
      return null;
    }
  }

  simpleIntersection(p: DPolygon): DPolygon | null | DPolygon[] {
    return this.simpleLogicFunction(p, false, false);
  }

  simpleDifference(p: DPolygon): DPolygon | null | DPolygon[] {
    return this.simpleLogicFunction(p, true, false);
  }

  smartUnion(p: DPolygon): DPolygon | null {
    const res = this.clone().simpleUnion(p);
    if (res) {
      let allHoles = [...this.holes, ...p.holes, ...res.holes].map((h: DPolygon) => h.clone());
      for (const a of allHoles) {
        for (const b of allHoles) {
          if (a.equal(b)) {
            continue;
          }
          const r = a.simpleUnion(b);
          if (r) {
            allHoles = allHoles.filter((v: DPolygon) => !v.equal(a) && !v.equal(b));
            allHoles.push(r);
          }
        }
      }
      res.holes = allHoles;
    }
    return res;
  }

  /**
   * Divide polygon to triangles
   *
   * ![Example](https://edejin.github.io/DGeoUtils/media/examples/toTriangles.png)
   */
  toTriangles(): DPolygon[] {
    const innerAndNotIntersect = (poly: DPolygon, p1: DPoint, p2: DPoint): boolean => {
      const l = p1.findLine(p2);
      const {center} = l;
      const intersections = poly.holes.reduce((a: boolean, hole: DPolygon) => a && Boolean(hole.clone().close()
        .intersection(l, true).length), Boolean(poly.clone().close()
        .intersection(l, true).length));
      const contain = poly.holes.reduce((a: boolean, hole: DPolygon) => a && !hole
        .contain(center), poly.contain(center));
      return !intersections && contain;
    };

    const getTriangle = (poly: DPolygon): DPolygon | void => {
      for (let i = 0; i < poly.length; i++) {
        const p0 = poly.at(0);
        const p1 = poly.at(1);
        const p2 = poly.at(2);
        if (innerAndNotIntersect(poly, p0, p2)) {
          poly.removePart(0, 1);
          return new DPolygon([
            p0.clone(),
            p1.clone(),
            p2.clone()
          ]);
        }
        poly.push(poly.shift());
      }
      return undefined;
    };

    const p = this.clone().clockWise.open();
    while (p.holes.length) {
      const h = p.holes.shift()!
        .clone()
        .clockWise
        .reverse()
        .close();
      for (let i = 0; i < p.length; i++) {
        if (innerAndNotIntersect(p, p.first, h.first)) {
          p.insertAfter(0, ...h.points, p.first);
          break;
        }
        p.push(p.shift());
      }
    }
    const res: DPolygon[] = [];
    while (p.length > 3) {
      const triangle = getTriangle(p);
      if (triangle) {
        res.push(triangle);
      }
    }
    res.push(p);
    return res;
  }

  /**
   * Divide polygon to triangles and return points indexes
   */
  getTrianglesPointIndexes(): number[] {
    const innerAndNotIntersect = (poly: DPolygon, p1: DPoint, p2: DPoint): boolean => {
      const l = p1.findLine(p2);
      const {center} = l;
      const intersections = poly.holes.reduce((a: boolean, hole: DPolygon) => a && Boolean(hole.clone().close()
        .intersection(l, true).length), Boolean(poly.clone().close()
        .intersection(l, true).length));
      const contain = poly.holes.reduce((a: boolean, hole: DPolygon) => a && !hole
        .contain(center), poly.contain(center));
      return !intersections && contain;
    };

    const getTriangle = (poly: DPolygon): [number, number, number] | void => {
      for (let i = 0; i < poly.length; i++) {
        const p0 = poly.at(0);
        const p1 = poly.at(1);
        const p2 = poly.at(2);
        if (innerAndNotIntersect(poly, p0, p2)) {
          poly.removePart(0, 1);
          return [
            p0.properties.index,
            p1.properties.index,
            p2.properties.index
          ];
        }
        poly.push(poly.shift());
      }
      return undefined;
    };

    let p = this.clone();
    let index = 0;
    p.points.forEach((f: DPoint) => {
      f.properties.index = index++;
    });
    p.holes.forEach((h: DPolygon) => {
      h.pPoints.forEach((f: DPoint) => {
        f.properties.index = index++;
      });
    });
    p = p.clockWise.open();

    while (p.holes.length) {
      const h = p.holes.shift()!
        .clone()
        .clockWise
        .reverse()
        .close();
      for (let i = 0; i < p.length; i++) {
        if (innerAndNotIntersect(p, p.first, h.first)) {
          p.insertAfter(0, ...h.points, p.first);
          break;
        }
        p.push(p.shift());
      }
    }
    const res: number[] = [];
    while (p.length > 3) {
      const triangle = getTriangle(p);
      if (triangle) {
        res.push(...triangle);
      }
    }
    res.push(...p.points.map((f: DPoint) => f.properties.index));
    return res;
  }

  get closed(): boolean {
    return this.first.equal(this.last);
  }

  /**
   * @param v
   * @param [quadrantSegments=64]
   * @param [type=DPolygon.CAP_ROUND] DPolygon.CAP_ROUND || DPolygon.CAP_FLAT || DPolygon.CAP_SQUARE
   */
  buffer(v: number, quadrantSegments: number = 64, type: number = DPolygon.CAP_ROUND): DPolygon {
    const reader = new jstsIo.WKTReader();
    const {noHoles, closed} = this;
    const points = reader
      .read(noHoles.toWKT(closed ? DPolygon.WKT_POLYGON : DPolygon.WKT_LINESTRING))
      .buffer(v, quadrantSegments, type)
      .getCoordinates() as { x: number; y: number }[];
    return new DPolygon(points.map(({x, y}: {x: number; y: number}) => new DPoint(x, y)));
  }

  private simpleIncludeX(p: DPoint) {
    const {x} = p;
    return this.minX <= x && this.maxX >= x;
  }

  private simpleIncludeY(p: DPoint) {
    const {y} = p;
    return this.minY <= y && this.maxY >= y;
  }

  private douglasPeucker(points: DPoint[], e: number): DPoint[] {
    let dMax = 0;
    let index = 0;
    const end = points.length - 1;
    const line = points[0].findLine(points[end]);
    for (let i = 1; i < end; i++) {
      const d = line.perpendicularDistance(points[i]);
      if (d > dMax) {
        index = i;
        dMax = d;
      }
    }
    if (dMax >= e) {
      const recResult1 = this.douglasPeucker(points.slice(0, index + 1), e);
      const recResult2 = this.douglasPeucker(points.slice(index), e);
      recResult1.pop();
      return [...recResult1, ...recResult2];
    }
    return [points[0], points[end]];
  }

  private goByPath(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, steps: number = this.length - 1) {
    const start = this.first;
    ctx.moveTo(start.x, start.y);
    for (let i = 1; i <= (steps % this.length); i++) {
      const {x, y} = this.at(i);
      ctx.lineTo(x, y);
    }
  }

  private getJSTSGeometry(p: DPolygon, unionThis: boolean, unionThat: boolean): Geometry | void {
    const unionOrIntersection = unionThat === unionThis;
    const reader = new jstsIo.WKTReader();
    const a = reader.read(this.noHoles.toWKT());
    const b = reader.read(p.noHoles.toWKT());
    if (!unionOrIntersection) {
      return a.difference(b);
    } else if (unionThis) {
      return a.union(b);
    } else if (!unionThis) {
      return a.intersection(b);
    }
    return undefined;
  }

  private simpleLogicFunction(p: DPolygon, unionThis: boolean, unionThat: boolean): DPolygon | null | DPolygon[] {
    const c = this.getJSTSGeometry(p, unionThis, unionThat);
    if (c) {
      const coordinates = c.getCoordinates() as { x: number; y: number }[];
      if (coordinates.length) {
        let result: DPolygon[] = coordinates.reduce(
          (ak: DPolygon[], {x, y}: { x: number; y: number }, index: number) => {
            const lastIndex = ak.length - 1;
            const t = new DPoint(x, y);
            const {first} = ak[lastIndex];
            if (t.equal(first)) {
              if (coordinates[index + 1]) {
                const nextPoint = new DPoint(coordinates[index + 1].x, coordinates[index + 1].y);
                if (ak[lastIndex].length > 1) {
                  ak.push(new DPolygon([nextPoint]));
                }
              }
            } else {
              ak[lastIndex].push(t);
            }
            return ak;
          },
          [new DPolygon([new DPoint(coordinates[0].x, coordinates[0].y)])]
        );
        if (unionThat && unionThis && result.length > 1) {
          for (const q of result) {
            for (const r of result) {
              if (q.has(r.first) && !q.equal(r)) {
                const index = q.findIndex(r.first);
                q.points.splice(index, 0, ...r.points);
                result = result.filter((h: DPolygon) => !h.equal(r));
                continue;
              }
              if (result.length < 2) {
                break;
              }
            }
            if (result.length < 2) {
              break;
            }
          }
        }
        result = result.filter((h: DPolygon) => h.length > 2).map((h: DPolygon) => h.close());
        for (const q of result) {
          for (const r of result) {
            if (result.length < 2) {
              break;
            }
            if (!q.equal(r)) {
              if (q.contain(r.first, true)) {
                q.holes.push(r);
                result = result.filter((h: DPolygon) => !h.equal(r));
              }
            }
          }
          if (result.length < 2) {
            break;
          }
        }
        if (result.length === 0) {
          return null;
        }
        if (result.length === 1) {
          return result[0].close();
        }
        return result.map((g: DPolygon) => g.close());
      }
    }
    return null;
  }
}
