import {DPolygon} from './DPolygon';
import {DPoint, SetterFunction} from './DPoint';

export type LoopFunction = (k: DPoint) => DPoint;

enum LoopFunctions {
  getTileFromCoords,
  getCoordsFromTile,
  height,
  setX,
  setY,
  rotate,
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
        .setX(setterArg!);
      break;
    case LoopFunctions.setY:
      res = (k: DPoint): DPoint => a(k)
        .setY(setterArg!);
      break;
    case LoopFunctions.rotate:
      res = (k: DPoint): DPoint => a(k)
        .rotate(numberArg!);
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
        .scale(numberPointArg, numberArg);
      break;
    case LoopFunctions.divide:
      res = (k: DPoint): DPoint => a(k)
        .divide(numberPointArg, numberArg);
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
        .flipVertically(numberPointArg!);
      break;
    default:
  }
  return res;
};

export class DPolygonLoop {
  private pool: PoolRecord[];

  constructor(private readonly parent: DPolygon) {
    this.pool = [];
  }

  private getLoopFunction() {
    return this.pool.reduce(decodePoolRecord, (k: DPoint): DPoint => k);
  }

  /**
   * Run loop
   */
  run(): DPolygon {
    return this.parent.map(this.getLoopFunction());
  }

  getTileFromCoords(zoom?: number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.getTileFromCoords,
      numberArg: zoom
    });
    return this;
  }

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

  setX(x: number | SetterFunction): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.setX,
      setterArg: x
    });
    return this;
  }

  setY(y: number | SetterFunction): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.setY,
      setterArg: y
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

  move(x: number | DPoint = 0, y: number = (x as number)): DPolygonLoop {
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

  scale(x: number | DPoint = 0, y: number = (x as number)): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.scale,
      numberPointArg: x,
      numberArg: y
    });
    return this;
  }

  divide(x: number | DPoint = 0, y?: number): DPolygonLoop {
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

  flipVertically(size: DPoint | number): DPolygonLoop {
    this.pool.push({
      functionName: LoopFunctions.flipVertically,
      numberPointArg: size
    });
    return this;
  }
}
