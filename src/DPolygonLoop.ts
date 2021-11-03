import {DPolygon} from './DPolygon';
import {DPoint, PSEUDO_MERCATOR, SetterFunction, WORLD_GEODETIC_SYSTEM} from './DPoint';

type LoopFunction = (k: DPoint) => DPoint;

export class DPolygonLoop {
  private f: LoopFunction = (k: DPoint): DPoint => k;

  private readonly parent: DPolygon;

  constructor(parent: DPolygon) {
    this.parent = parent;
  }

  getTileFromCoords(zoom?: number): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).getTileFromCoords(zoom);
    return this;
  }

  getCoordsFromTile(zoom?: number): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).getCoordsFromTile(zoom);
    return this;
  }

  transform(from: string = PSEUDO_MERCATOR, to: string = WORLD_GEODETIC_SYSTEM): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).transform(from, to);
    return this;
  }

  height(z: number): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).height(z);
    return this;
  }

  setX(x: number | SetterFunction): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).setX(x);
    return this;
  }

  setY(y: number | SetterFunction): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).setY(y);
    return this;
  }

  rotate(a: number): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).rotateCurrent(a);
    return this;
  }

  move(x: number | DPoint = 0, y?: number): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).moveCurrent(x, y);
    return this;
  }

  round(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).roundCurrent();
    return this;
  }

  ceil(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).ceilCurrent();
    return this;
  }

  floor(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).floorCurrent();
    return this;
  }

  toFixed(n: number = 2): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).toFixedCurrent(n);
    return this;
  }

  abs(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).absCurrent();
    return this;
  }

  scale(x: number | DPoint = 0, y?: number): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).scaleCurrent(x, y);
    return this;
  }

  divide(x: number | DPoint = 0, y?: number): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).divideCurrent(x, y);
    return this;
  }

  asRadians(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).asRadians();
    return this;
  }

  asDegrees(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).asDegrees();
    return this;
  }

  getHipPoint(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).hipPoint;
    return this;
  }

  getXPoint(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).xPoint;
    return this;
  }

  getYPoint(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).yPoint;
    return this;
  }

  getWPoint(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).wPoint;
    return this;
  }

  getHPoint(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).hPoint;
    return this;
  }

  setIfLessThan(p: DPoint): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).setIfLessThan(p);
    return this;
  }

  minus(): DPolygonLoop {
    const t = this.f.bind(null);
    this.f = (k: DPoint) => t(k).minus();
    return this;
  }

  run(): DPolygon {
    this.parent.points = this.parent.points.map(this.f);
    return this.parent;
  }
}
