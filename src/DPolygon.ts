import {DCoord, DPoint, LatLng, PSEUDO_MERCATOR, WORLD_GEODETIC_SYSTEM} from './DPoint';
import {DLine} from './DLine';
import {DCircle} from './DCircle';
import {DNumbers} from './DNumbers';

interface ParseProps {
  dataProjection: string;
  featureProjection: string;
}

export const MIN_POINTS_IN_VALID_POLYGON = 3;
const APPROXIMATION_VALUE = 0.1;
const MAX_CONVEX_ITERATIONS = 100;
const CLOSE_TO_INTERSECTION_DISTANCE = 0.001;

export class DPolygon {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: { [key: string]: any } = {};
  holes: DPolygon[] = [];
  private pPoints: DPoint[] = [];
  private searchStore: Record<number, Record<number, Record<number | string, boolean>>> = {};

  constructor(points: DPoint[] = []) {
    this.pPoints = points;
  }

  static minAreaRectangleSize(poly: DPolygon): DPoint {
    const {first, second, last} = poly.clone().open();
    return new DPoint(first.distance(second), first.distance(last));
  }

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

  static parseFromWKT(wkt: string, optProps?: ParseProps): DPolygon {
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

    if (optProps) {
      return res!.transform(optProps.dataProjection, optProps.featureProjection);
    }
    return res!;
  }

  static createSquareBySize(size: DPoint): DPolygon {
    return new DPolygon([DPoint.Zero(), size.clone().setX(0), size.clone(), size.clone().setY(0)]).close();
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

  get center(): DPoint {
    return this.leftTop.moveCurrent(this.size.divideCurrent(2));
  }

  get h(): number {
    return this.maxY - this.minY;
  }

  get w(): number {
    return this.maxX - this.minX;
  }

  get dY(): number {
    return this.h;
  }

  get dX(): number {
    return this.w;
  }

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

  get size(): DPoint {
    const {w, h} = this;
    return new DPoint(w, h);
  }

  get leftTop(): DPoint {
    const {minX, minY} = this;
    return new DPoint(minX, minY);
  }

  get rightBottom(): DPoint {
    const {maxX, maxY} = this;
    return new DPoint(maxX, maxY);
  }

  get length(): number {
    return this.pPoints.length;
  }

  get fullLength(): number {
    return this.clone().open().perimeter;
  }

  get perimeter(): number {
    let p = 0;
    for (let i = 1; i < this.pPoints.length; i++) {
      p += this.pPoints[i - 1].distance(this.pPoints[i]);
    }
    return p;
  }

  get area(): number {
    const closed = this.deintersection;
    let sum = 0;
    for (let i = 1; i < closed.length; i++) {
      const cur = closed.p(i);
      const prev = closed.p(i - 1);
      sum += prev.x * cur.y - prev.y * cur.x;
    }
    return Math.abs(sum / 2) - this.holes.reduce((a: number, hole: DPolygon) => a + hole.area, 0);
  }

  get deintersection(): DPolygon {
    const p = this.clone().close();
    for (let i = 0; i < p.length - 1; i++) {
      for (let j = i + 2; j < p.length - 1; j++) {
        const firstLine = p.p(i).findLine(p.p(i + 1));
        const secondLine = p.p(j).findLine(p.p(j + 1));
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

  get valid(): boolean {
    return this.length > MIN_POINTS_IN_VALID_POLYGON;
  }

  get first(): DPoint {
    return this.p(0);
  }

  get second(): DPoint {
    return this.p(1);
  }

  get last(): DPoint {
    return this.p(this.length - 1);
  }

  get minAreaRectangle(): DPolygon {
    const p = this.convex;
    let resultPolygon = new DPolygon();
    let resultArea = Infinity;
    for (let k = 0; k < p.length - 1; k++) {
      const l = p.p(k).findLine(p.p(k + 1));
      let maxWidth = 0;
      let maxWidthPoint1: DPoint | null = null;
      let maxWidthPoint2: DPoint | null = null;
      let maxHeight = 0;
      let maxHeightPoint: DPoint | null = null;
      for (let i = 0; i < p.length - 1; i++) {
        const p1: DPoint = l.findPoint(l.findPerpendicular(p.p(i)))!;
        const h = p1.distance(p.p(i));
        if (h >= maxHeight) {
          maxHeight = h;
          maxHeightPoint = p.p(i);
        }
        for (let j = i; j < p.length - 1; j++) {
          const p2: DPoint = l.findPoint(l.findPerpendicular(p.p(j)))!;
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
        const p1 = p.p(i - 1);
        const p2 = p.p(i);
        const p3 = p.p(i + 1);
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

  get isClockwise(): boolean {
    let sum = 0;
    const p = this.clone().close();
    for (let i = 1; i < p.length; i++) {
      const p1 = p.p(i - 1);
      const p2 = p.p(i);
      sum += (p2.x - p1.x) * (p2.y + p1.y);
    }
    return sum < 0;
  }

  get clockWise(): DPolygon {
    if (this.isClockwise) {
      return this.clone();
    }
    return this.clone().reverse();
  }

  get noHoles(): DPolygon {
    const res = this.clone();
    res.holes = [];
    return res;
  }

  intersection(l: DLine): DPoint[] {
    const res = [];
    for (let i = 0; i < this.pPoints.length - 1; i++) {
      const p1 = this.pPoints[i];
      const p2 = this.pPoints[i + 1];
      const line = p1.findLine(p2);
      const intersect = line.intersection(l);
      if (intersect) {
        res.push(intersect);
      }
    }
    return res;
  }

  setCenter(newCenter: DPoint): DPolygon {
    return this.clone().move(newCenter.clone().moveCurrent(this.center.minus()));
  }

  toWKT(): string {
    let h = '';
    if (this.holes && this.holes.length) {
      h = `, ${this.holes.map((hole: DPolygon) => hole.toString()).join(', ')}`;
    }
    return `POLYGON ((${this.deintersection.pPoints.map((r: DPoint) => `${r.x} ${r.y}`).join(', ')})${h})`;
  }

  rotate(a: number): DPolygon {
    this.pPoints = this.pPoints.map((p: DPoint) => p.rotateCurrent(a));
    this.holes = this.holes.map((h: DPolygon) => h.rotate(a));
    return this;
  }

  filter(f: (p: DPoint) => boolean): DPolygon {
    this.pPoints = this.pPoints.filter(f);
    return this;
  }

  move(x: number | DPoint = 0, y?: number): DPolygon {
    this.pPoints = this.pPoints.map((p: DPoint) => p.moveCurrent(x, y));
    this.holes = this.holes.map((h: DPolygon) => h.move(x, y));
    return this;
  }

  scale(x: number | DPoint = 0, y?: number): DPolygon {
    this.pPoints = this.pPoints.map((p: DPoint) => p.scaleCurrent(x, y));
    this.holes = this.holes.map((h: DPolygon) => h.scale(x, y));
    return this;
  }

  divide(x: number | DPoint = 0, y?: number): DPolygon {
    this.pPoints = this.pPoints.map((p: DPoint) => p.divideCurrent(x, y));
    this.holes = this.holes.map((h: DPolygon) => h.divide(x, y));
    return this;
  }

  round(): DPolygon {
    this.pPoints = this.pPoints.map((p: DPoint) => p.roundCurrent());
    this.holes = this.holes.map((h: DPolygon) => h.round());
    return this;
  }

  floor(): DPolygon {
    this.pPoints = this.pPoints.map((p: DPoint) => p.floorCurrent());
    this.holes = this.holes.map((h: DPolygon) => h.floor());
    return this;
  }

  ceil(): DPolygon {
    this.pPoints = this.pPoints.map((p: DPoint) => p.ceilCurrent());
    this.holes = this.holes.map((h: DPolygon) => h.ceil());
    return this;
  }

  toFixed(n: number = 2): DPolygon {
    this.pPoints = this.pPoints.map((p: DPoint) => p.toFixedCurrent(n));
    this.holes = this.holes.map((h: DPolygon) => h.toFixed(n));
    return this;
  }

  map(f: (r: DPoint, index?: number) => DPoint): DPolygon {
    this.pPoints = this.pPoints.map(f);
    this.holes = this.holes.map((h: DPolygon) => h.map(f));
    return this;
  }

  p(index: number, divide: boolean = false): DPoint {
    if (divide) {
      let t = index;
      while (t < 0) {
        t += this.length;
      }
      return this.pPoints[t % this.length];
    }
    return this.pPoints[index];
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

  transform(from: string = PSEUDO_MERCATOR, to: string = WORLD_GEODETIC_SYSTEM): DPolygon {
    this.pPoints = this.pPoints.map((r: DPoint) => r.transform(from, to));
    this.holes = this.holes.map((h: DPolygon) => h.transform(from, to));
    return this;
  }

  toString(): string {
    return `(${this.pPoints.map((r: DPoint) => r.toString()).join(', ')})`;
  }

  close(): DPolygon {
    const p0 = this.first;
    if (p0 && !p0.equal(this.last)) {
      this.push(p0.clone());
    }
    return this;
  }

  open(): DPolygon {
    const p = this.first;
    if (this.length > 2 && p && p.equal(this.last)) {
      this.pop();
    }
    return this;
  }

  height(z: number): DPolygon {
    this.map((p: DPoint) => p.height(z));
    this.holes = this.holes.map((h: DPolygon) => h.height(z));
    return this;
  }

  add(poly: DPolygon): DPolygon {
    const res = new DPolygon([...this.points, ...poly.points]).close();
    res.holes = [...this.holes, ...poly.holes].map((h: DPolygon) => h.clone());
    return res;
  }

  has(p: DPoint): boolean {
    return this.pPoints.some((q: DPoint) => q.equal(p));
  }

  clone(): DPolygon {
    const res = new DPolygon([...this.points.map((r: DPoint) => r.clone())]);
    res.holes = this.holes.map((h: DPolygon) => h.clone());
    res.properties = this.properties;
    return res;
  }

  equal(p: DPolygon | null): boolean {
    if (!(p instanceof DPolygon)) {
      return false;
    }
    if (this.clone().open().length !== p.clone().open().length || this.holes.length !== p.holes.length) {
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

  same(p: DPolygon): boolean {
    const pClone = p.clone().open();
    const thisClone = this.clone().open();
    const thisAsString = thisClone.toString();
    return thisClone.points.reduce((a: boolean) => {
      const f = pClone.shift();
      pClone.push(f);
      return (
        a ||
        thisAsString === pClone.toString() ||
        thisAsString ===
        pClone
          .clone()
          .reverse()
          .toString()
      );
    }, false);
  }

  findIndex(p: DPoint): number {
    return this.points.findIndex((t: DPoint) => t.equal(p));
  }

  approximation(e: number = Math.sqrt(this.perimeter) * APPROXIMATION_VALUE): DPolygon {
    return new DPolygon(this.clone().douglasPeucker(this.pPoints, e));
  }

  insertAfter(index: number, ...points: DPoint[]): void {
    this.pPoints.splice(index + 1, 0, ...points);
  }

  removePart(index: number, count: number): DPoint[] {
    return this.pPoints.splice(index + 1, count);
  }

  hasSimpleIntersection(p: DPolygon): boolean {
    const extend1 = this.extend;
    const extend2 = p.extend;
    const extend1points = extend1.points;
    const extend2points = extend2.points;
    const in1 = extend1points.some((t: DPoint) => extend2.simpleInclude(t));
    const in2 = extend2points.some((t: DPoint) => extend1.simpleInclude(t));
    return in1 || in2;
  }

  simpleInclude(p: DPoint): boolean {
    return this.simpleIncludeX(p) && this.simpleIncludeY(p);
  }

  drawPolygonOnCanvas(
    canvas: HTMLCanvasElement,
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
    if (fillColor) {
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

  clearPolygonOnCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!;
    const old = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = 'destination-out';
    this.goByPath(ctx);
    ctx.fill();
    ctx.globalCompositeOperation = old;
  }

  contain(p: DPoint, isBorderInside: boolean = false, move: DPoint = DPoint.Zero()): boolean {
    const simpleInclude = this.simpleInclude(p);
    if (!simpleInclude) {
      return false;
    }
    const onBorder = this.onBorder(p);
    if (onBorder) {
      return isBorderInside;
    }
    const line = p.findLine(this.leftTop.moveCurrent(move));
    const poly = this.deintersection;
    const intersectionPoints: DPoint[] = [];
    for (let i = 0; i < poly.length - 1; i++) {
      const polygonLine = poly.p(i).findLine(poly.p(i + 1));
      const intersection = line.intersection(polygonLine, CLOSE_TO_INTERSECTION_DISTANCE);
      if (intersection) {
        intersectionPoints.push(intersection as DPoint);
      }
    }
    const hasCorners = intersectionPoints.some((z: DPoint) => poly.has(z));
    if (hasCorners) {
      return this.contain2(p, isBorderInside);
    }
    return intersectionPoints.length % 2 === 1;
  }

  onBorder(p: DPoint): boolean {
    const simpleInclude = this.simpleInclude(p);
    if (simpleInclude) {
      const poly = this.deintersection;
      const hasSamePoint = this.points.some((point: DPoint) => point.equal(p));
      if (hasSamePoint) {
        return true;
      }
      for (let i = 0; i < poly.length - 1; i++) {
        const p0 = poly.p(i);
        const p1 = poly.p(i + 1);
        const polygonLine = p0.findLine(p1);
        const onBorder = polygonLine.x(p).equal(p) && polygonLine.inRange(p);
        if (onBorder) {
          return true;
        }
      }
    }
    return false;
  }

  nextStart(): DPolygon {
    this.open();
    this.push(this.shift());
    this.close();
    return this;
  }

  removeDuplicates(): DPolygon {
    for (let i = 0; i < this.length - 1; i++) {
      const p1 = this.p(i);
      const p2 = this.p(i + 1);
      if (p1.equal(p2)) {
        this.removePart(i, 1);
        i--;
      }
    }
    return this;
  }

  static parse(a: LatLng[] | number[][] | DCoord[]): DPolygon {
    return new DPolygon(a.map((r: LatLng | number[] | DCoord) => DPoint.parse(r)));
  }

  toArrayOfCoords(): DCoord[] {
    return this.pPoints.map((r) => r.toCoords());
  }

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

  private goByPath(ctx: CanvasRenderingContext2D, steps: number = this.length - 1) {
    const start = this.first;
    ctx.moveTo(start.x, start.y);
    for (let i = 1; i < (steps % this.length); i++) {
      const {x, y} = this.p(i);
      ctx.lineTo(x, y);
    }
  }

  private contain2(p: DPoint, isBorderInside: boolean = false): boolean {
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
      const p1 = poly.p(i);
      const p2 = poly.p(i + 1);
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
}
