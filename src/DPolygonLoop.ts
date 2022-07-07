import {DPolygon} from './DPolygon';
import {DPoint} from './DPoint';

export type SetterFunction<T> = (t: DPoint, index: number) => T;

export type LoopFunction = (k: DPoint, index: number) => DPoint;

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
  flipVertically,
  setProperties,
  div,
  mod
}

interface PoolRecord {
  functionName: LoopFunctions,
  numberArg?: number;
  setterArg?: number | SetterFunction<number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setterArgByObject?: Record<string, any> | SetterFunction<Record<string, any>>;
  pointArg?: DPoint;
  numberPointArg?: number | DPoint;
}

// eslint-disable-next-line complexity
const decodePoolRecord = (a: LoopFunction, {
  functionName,
  pointArg,
  numberPointArg,
  numberArg,
  setterArg,
  setterArgByObject
}: PoolRecord): LoopFunction => {
  let res = a;
  // eslint-disable-next-line default-case
  switch (functionName) {
    case LoopFunctions.getTileFromCoords:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .getTileFromCoords(numberArg);
      break;
    case LoopFunctions.getCoordsFromTile:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .getCoordsFromTile(numberArg);
      break;
    case LoopFunctions.height:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .height(numberArg!);
      break;
    case LoopFunctions.setX:
      res = (k: DPoint, index: number): DPoint => typeof setterArg === 'number' ? a(k, index)
        .setX(setterArg) : a(k, index).setX((p: DPoint) => setterArg!(p, index));
      break;
    case LoopFunctions.setY:
      res = (k: DPoint, index: number): DPoint => typeof setterArg === 'number' ? a(k, index)
        .setY(setterArg) : a(k, index).setY((p: DPoint) => setterArg!(p, index));
      break;
    case LoopFunctions.setZ:
      res = (k: DPoint, index: number): DPoint => typeof setterArg === 'number' ? a(k, index)
        .setZ(setterArg) : a(k, index).setZ((p: DPoint) => setterArg!(p, index));
      break;
    case LoopFunctions.rotate:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .rotate(numberArg!);
      break;
    case LoopFunctions.rotate3dX:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .rotate3dX(numberArg!);
      break;
    case LoopFunctions.rotate3dY:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .rotate3dY(numberArg!);
      break;
    case LoopFunctions.rotate3dZ:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .rotate3dZ(numberArg!);
      break;
    case LoopFunctions.move:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .move(numberPointArg! as number, numberArg!);
      break;
    case LoopFunctions.round:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .round();
      break;
    case LoopFunctions.ceil:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .ceil();
      break;
    case LoopFunctions.floor:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .floor();
      break;
    case LoopFunctions.toFixed:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .toFixed(numberArg);
      break;
    case LoopFunctions.abs:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .abs();
      break;
    case LoopFunctions.scale:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .scale(numberPointArg as number, numberArg as number);
      break;
    case LoopFunctions.divide:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .divide(numberPointArg as number, numberArg as number);
      break;
    case LoopFunctions.div:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .div(numberPointArg as number, numberArg as number);
      break;
    case LoopFunctions.mod:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .mod(numberPointArg as number, numberArg as number);
      break;
    case LoopFunctions.degreeToRadians:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .degreeToRadians();
      break;
    case LoopFunctions.radiansToDegrees:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .radiansToDegrees();
      break;
    case LoopFunctions.radiansToMeters:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .radiansToMeters();
      break;
    case LoopFunctions.metersToRadians:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .metersToRadians();
      break;
    case LoopFunctions.hipPoint:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .hipPoint;
      break;
    case LoopFunctions.xPoint:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .xPoint;
      break;
    case LoopFunctions.yPoint:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .yPoint;
      break;
    case LoopFunctions.wPoint:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .wPoint;
      break;
    case LoopFunctions.hPoint:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .hPoint;
      break;
    case LoopFunctions.setIfLessThan:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .setIfLessThan(pointArg!);
      break;
    case LoopFunctions.minus:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .minus();
      break;
    case LoopFunctions.degreeToMeters:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .degreeToMeters();
      break;
    case LoopFunctions.metersToDegree:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .metersToDegree();
      break;
    case LoopFunctions.flipVertically:
      res = (k: DPoint, index: number): DPoint => a(k, index)
        .flipVertically(numberPointArg as number);
      break;
    case LoopFunctions.setProperties:
      res = (k: DPoint, index: number): DPoint => typeof setterArgByObject === 'object' ? a(k, index)
        .setProperties(setterArgByObject) : a(k, index).setProperties((p: DPoint) => setterArgByObject!(p, index));
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
  setX(f: SetterFunction<number>): DPolygonLoop;
  setX(x: number | SetterFunction<number>): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.setX,
      setterArg: x
    });
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setProperties(setterArgByObject: SetterFunction<Record<string, any>> | Record<string, any>): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.setProperties,
      setterArgByObject
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
  setY(f: SetterFunction<number>): DPolygonLoop;
  setY(y: number | SetterFunction<number>): DPolygonLoop {
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
  setZ(f: SetterFunction<number>): DPolygonLoop;
  setZ(z: number | SetterFunction<number>): DPolygonLoop {
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

  /**
   * [Euclidean division](https://en.wikipedia.org/wiki/Euclidean_division)
   * Divide `x` and `y` to `v`
   * @param v
   */
  div(v: number): DPolygonLoop;

  /**
   * [Euclidean division](https://en.wikipedia.org/wiki/Euclidean_division)
   * Divide `x` field to `p.x` and `y` field to `p.y`.
   * @param p
   */
  div(p: DPoint): DPolygonLoop;

  /**
   * [Euclidean division](https://en.wikipedia.org/wiki/Euclidean_division)
   * Divide `x` field to `x` and `y` field to `y`.
   * @param x
   * @param y
   */
  div(x: number, y: number): DPolygonLoop;
  div(x: number | DPoint, y?: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.div,
      numberPointArg: x,
      numberArg: y
    });
    return this;
  }

  /**
   * [Modulo operation](https://en.wikipedia.org/wiki/Modulo_operation)
   * Divide `x` and `y` to `v`
   * @param v
   */
  mod(v: number): DPolygonLoop;

  /**
   * [Modulo operation](https://en.wikipedia.org/wiki/Modulo_operation)
   * Divide `x` field to `p.x` and `y` field to `p.y`.
   * @param p
   */
  mod(p: DPoint): DPolygonLoop;

  /**
   * [Modulo operation](https://en.wikipedia.org/wiki/Modulo_operation)
   * Divide `x` field to `x` and `y` field to `y`.
   * @param x
   * @param y
   */
  mod(x: number, y: number): DPolygonLoop;
  mod(x: number | DPoint, y?: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.mod,
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
