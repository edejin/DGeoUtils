import {DPolygon} from './DPolygon';
import {DPoint, SetterFunction} from './DPoint';

export type LoopFunction = (k: DPoint) => DPoint;

enum LoopFunctions {
  getTileFromCoords,
  getCoordsFromTile,
  height,
  setX,
  setY,
  setZ,
  rotate,
  rotate3dX,
  rotate3dY,
  rotate3dZ,
  move,
  round,
  ceil,
  floor,
  toFixed,
  abs,
  scale,
  divide,
  degreeToRadians,
  radiansToDegrees,
  radiansToMeters,
  metersToRadians,
  hipPoint,
  xPoint,
  yPoint,
  wPoint,
  hPoint,
  setIfLessThan,
  minus,
  degreeToMeters,
  metersToDegree,
  flipVertically
}

interface PoolRecord {
  functionName: LoopFunctions,
  numberArg?: number;
  setterArg?: number | SetterFunction;
  pointArg?: DPoint;
  numberPointArg?: number | DPoint;
}

// eslint-disable-next-line complexity
const decodePoolRecord = (a: LoopFunction, {
  functionName,
  pointArg,
  numberPointArg,
  numberArg,
  setterArg
}: PoolRecord): LoopFunction => {
  let res = a;
  // eslint-disable-next-line default-case
  switch (functionName) {
    case LoopFunctions.getTileFromCoords:
      res = (k: DPoint): DPoint => a(k)
        .getTileFromCoords(numberArg);
      break;
    case LoopFunctions.getCoordsFromTile:
      res = (k: DPoint): DPoint => a(k)
        .getCoordsFromTile(numberArg);
      break;
    case LoopFunctions.height:
      res = (k: DPoint): DPoint => a(k)
        .height(numberArg!);
      break;
    case LoopFunctions.setX:
      res = (k: DPoint): DPoint => a(k)
        .setX(setterArg as SetterFunction);
      break;
    case LoopFunctions.setY:
      res = (k: DPoint): DPoint => a(k)
        .setY(setterArg as SetterFunction);
      break;
    case LoopFunctions.setZ:
      res = (k: DPoint): DPoint => a(k)
        .setZ(setterArg as SetterFunction);
      break;
    case LoopFunctions.rotate:
      res = (k: DPoint): DPoint => a(k)
        .rotate(numberArg!);
      break;
    case LoopFunctions.rotate3dX:
      res = (k: DPoint): DPoint => a(k)
        .rotate3dX(numberArg!);
      break;
    case LoopFunctions.rotate3dY:
      res = (k: DPoint): DPoint => a(k)
        .rotate3dY(numberArg!);
      break;
    case LoopFunctions.rotate3dZ:
      res = (k: DPoint): DPoint => a(k)
        .rotate3dZ(numberArg!);
      break;
    case LoopFunctions.move:
      res = (k: DPoint): DPoint => a(k)
        .move(numberPointArg! as number, numberArg!);
      break;
    case LoopFunctions.round:
      res = (k: DPoint): DPoint => a(k)
        .round();
      break;
    case LoopFunctions.ceil:
      res = (k: DPoint): DPoint => a(k)
        .ceil();
      break;
    case LoopFunctions.floor:
      res = (k: DPoint): DPoint => a(k)
        .floor();
      break;
    case LoopFunctions.toFixed:
      res = (k: DPoint): DPoint => a(k)
        .toFixed(numberArg);
      break;
    case LoopFunctions.abs:
      res = (k: DPoint): DPoint => a(k)
        .abs();
      break;
    case LoopFunctions.scale:
      res = (k: DPoint): DPoint => a(k)
        .scale(numberPointArg as number, numberArg as number);
      break;
    case LoopFunctions.divide:
      res = (k: DPoint): DPoint => a(k)
        .divide(numberPointArg as number, numberArg as number);
      break;
    case LoopFunctions.degreeToRadians:
      res = (k: DPoint): DPoint => a(k)
        .degreeToRadians();
      break;
    case LoopFunctions.radiansToDegrees:
      res = (k: DPoint): DPoint => a(k)
        .radiansToDegrees();
      break;
    case LoopFunctions.radiansToMeters:
      res = (k: DPoint): DPoint => a(k)
        .radiansToMeters();
      break;
    case LoopFunctions.metersToRadians:
      res = (k: DPoint): DPoint => a(k)
        .metersToRadians();
      break;
    case LoopFunctions.hipPoint:
      res = (k: DPoint): DPoint => a(k)
        .hipPoint;
      break;
    case LoopFunctions.xPoint:
      res = (k: DPoint): DPoint => a(k)
        .xPoint;
      break;
    case LoopFunctions.yPoint:
      res = (k: DPoint): DPoint => a(k)
        .yPoint;
      break;
    case LoopFunctions.wPoint:
      res = (k: DPoint): DPoint => a(k)
        .wPoint;
      break;
    case LoopFunctions.hPoint:
      res = (k: DPoint): DPoint => a(k)
        .hPoint;
      break;
    case LoopFunctions.setIfLessThan:
      res = (k: DPoint): DPoint => a(k)
        .setIfLessThan(pointArg!);
      break;
    case LoopFunctions.minus:
      res = (k: DPoint): DPoint => a(k)
        .minus();
      break;
    case LoopFunctions.degreeToMeters:
      res = (k: DPoint): DPoint => a(k)
        .degreeToMeters();
      break;
    case LoopFunctions.metersToDegree:
      res = (k: DPoint): DPoint => a(k)
        .metersToDegree();
      break;
    case LoopFunctions.flipVertically:
      res = (k: DPoint): DPoint => a(k)
        .flipVertically(numberPointArg as number);
      break;
  }
  return res;
};

export class DPolygonLoop {
  private pool: PoolRecord[] = [];

  constructor(private readonly parent: DPolygon) {}

  private getLoopFunction() {
    return this.pool.reduce(decodePoolRecord, (k: DPoint): DPoint => k);
  }

  /**
   * Run loop
   */
  run(): DPolygon {
    return this.parent.map(this.getLoopFunction());
  }

  /**
   * @param zoom default value would be `z` of point
   */
  getTileFromCoords(zoom?: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.getTileFromCoords,
      numberArg: zoom
    });
    return this;
  }

  /**
   * @param zoom default value would be `z` of point
   */
  getCoordsFromTile(zoom?: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.getCoordsFromTile,
      numberArg: zoom
    });
    return this;
  }

  height(z: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.height,
      numberArg: z
    });
    return this;
  }

  /**
   * Set `x` value
   * @param x
   */
  setX(x: number): DPolygonLoop;

  /**
   * Transform `x` value by function
   * @param f
   */
  setX(f: SetterFunction): DPolygonLoop;
  setX(x: number | SetterFunction): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.setX,
      setterArg: x
    });
    return this;
  }

  /**
   * Set `y` value
   * @param y
   */
  setY(y: number): DPolygonLoop;

  /**
   * Transform `y` value by function
   * @param f
   */
  setY(f: SetterFunction): DPolygonLoop;
  setY(y: number | SetterFunction): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.setY,
      setterArg: y
    });
    return this;
  }

  /**
   * Set `z` value
   * @param z
   */
  setZ(z: number): DPolygonLoop;

  /**
   * Transform `z` value by function
   * @param f
   */
  setZ(f: SetterFunction): DPolygonLoop;
  setZ(z: number | SetterFunction): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.setZ,
      setterArg: z
    });
    return this;
  }

  rotate(a: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.rotate,
      numberArg: a
    });
    return this;
  }

  rotate3dX(a: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.rotate3dX,
      numberArg: a
    });
    return this;
  }

  rotate3dY(a: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.rotate3dY,
      numberArg: a
    });
    return this;
  }

  rotate3dZ(a: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.rotate3dZ,
      numberArg: a
    });
    return this;
  }

  /**
   * Add `v` to `x` and `y`
   * @param v
   */
  move(v: number): DPolygonLoop;

  /**
   * Add `p.x` to `x` field and `p.y` to `y` field.
   * @param p
   */
  move(p: DPoint): DPolygonLoop;

  /**
   * Add `x` to `x` field and `y` to `y` field.
   * @param x
   * @param y
   */
  move(x: number, y: number): DPolygonLoop;
  move(x: number | DPoint, y: number = (x as number)): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.move,
      numberPointArg: x,
      numberArg: y
    });
    return this;
  }

  round(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.round
    });
    return this;
  }

  ceil(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.ceil
    });
    return this;
  }

  floor(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.floor
    });
    return this;
  }

  toFixed(n: number = 2): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.toFixed,
      numberArg: n
    });
    return this;
  }

  abs(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.abs
    });
    return this;
  }

  /**
   * Multiply `v` to `x` and `y`
   * @param v
   */
  scale(v: number): DPolygonLoop;

  /**
   * Multiply `p.x` to `x` field and `p.y` to `y` field.
   * @param p
   */
  scale(p: DPoint): DPolygonLoop;

  /**
   * Multiply `x` to `x` field and `y` to `y` field.
   * @param x
   * @param y
   */
  scale(x: number, y: number): DPolygonLoop;
  scale(x: number | DPoint, y: number = (x as number)): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.scale,
      numberPointArg: x,
      numberArg: y
    });
    return this;
  }

  /**
   * Divide `x` and `y` to `v`
   * @param v
   */
  divide(v: number): DPolygonLoop;

  /**
   * Divide `x` field to `p.x` and `y` field to `p.y`.
   * @param p
   */
  divide(p: DPoint): DPolygonLoop;

  /**
   * Divide `x` field to `x` and `y` field to `y`.
   * @param x
   * @param y
   */
  divide(x: number, y: number): DPolygonLoop;
  divide(x: number | DPoint, y?: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.divide,
      numberPointArg: x,
      numberArg: y
    });
    return this;
  }

  degreeToRadians(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.degreeToRadians
    });
    return this;
  }

  radiansToDegrees(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.radiansToDegrees
    });
    return this;
  }

  radiansToMeters(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.radiansToMeters
    });
    return this;
  }

  metersToRadians(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.metersToRadians
    });
    return this;
  }

  getHipPoint(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.hipPoint
    });
    return this;
  }

  getXPoint(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.xPoint
    });
    return this;
  }

  getYPoint(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.yPoint
    });
    return this;
  }

  getWPoint(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.wPoint
    });
    return this;
  }

  getHPoint(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.hPoint
    });
    return this;
  }

  setIfLessThan(p: DPoint): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.setIfLessThan,
      pointArg: p
    });
    return this;
  }

  minus(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.minus
    });
    return this;
  }

  degreeToMeters(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.degreeToMeters
    });
    return this;
  }

  metersToDegree(): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.metersToDegree
    });
    return this;
  }

  /**
   * Flip vertically
   * @param size canvas size
   */
  flipVertically(size: DPoint): DPolygonLoop;

  /**
   * Flip vertically
   * @param height canvas height
   */
  flipVertically(height: number): DPolygonLoop;
  flipVertically(size: DPoint | number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.flipVertically,
      numberPointArg: size
    });
    return this;
  }
}
