/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DGeo, DPoint, DPolygon} from '../src';
import MockInstance = jest.MockInstance;

describe('DPoint', () => {
  describe('Constructor', () => {
    test('Constructor with z', () => {
      const t = new DPoint(3, 7, 1);
      expect(t.x).toEqual(3);
      expect(t.y).toEqual(7);
      expect(t.z).toEqual(1);
    });
    test('Constructor without z', () => {
      const t = new DPoint(30, 70);
      expect(t.x).toBe(30);
      expect(t.y).toBe(70);
      expect(t.z).toBeUndefined();
    });
    test('Constructor without params', () => {
      const t = new DPoint();
      expect(t.x).toBe(0);
      expect(t.y).toBe(0);
      expect(t.z).toBeUndefined();
    });
  });

  test('Zero', () => {
    expect(DPoint.zero().x).toBe(0);
    expect(DPoint.zero().y).toBe(0);
    DPoint.zero().y = 18;
    expect(DPoint.zero().x).toBe(0);
    expect(DPoint.zero().y).toBe(0);
  });

  describe('Parse', () => {
    test('LatLng', () => {
      const t = DPoint.parse({lat: 10, lng: 20});
      expect(t.x).toBe(20);
      expect(t.y).toBe(10);
      expect(t.z).toBe(0);
    });
    test('Number[]', () => {
      const t = DPoint.parse([11, 12, 13, 14]);
      expect(t.x).toBe(11);
      expect(t.y).toBe(12);
      expect(t.z).toBe(13);
    });
    test('DCoord (2 elements)', () => {
      const t = DPoint.parse([110, 120]);
      expect(t.x).toBe(110);
      expect(t.y).toBe(120);
      expect(t.z).toBeUndefined();
    });
    test('DCoord (3 elements)', () => {
      const t = DPoint.parse([111, 121, 7]);
      expect(t.x).toBe(111);
      expect(t.y).toBe(121);
      expect(t.z).toBe(7);
    });
    test('Empty Array', () => {
      const t = DPoint.parse([]);
      expect(t.x).toBe(0);
      expect(t.y).toBe(0);
      expect(t.z).toBeUndefined();
    });
    test('With Format', () => {
      const t = DPoint.parse([3, 2, 1], 'zyx');
      expect(t.x).toBe(1);
      expect(t.y).toBe(2);
      expect(t.z).toBe(3);
    });
    test('GeoJSON', () => {
      const t = DPoint.parse({
        type: 'Point',
        coordinates: [3, 2, 1]
      }, 'zyx');
      expect(t.x).toBe(1);
      expect(t.y).toBe(2);
      expect(t.z).toBe(3);
    });
  });

  describe('Parse from WKT', () => {
    test('"POINT (30 10)"', () => {
      const t = DPoint.parseFromWKT('POINT (30 10)');
      expect(t.x).toBe(30);
      expect(t.y).toBe(10);
      expect(t.z).toBeUndefined();
    });
    test('"POINT (30 10 70)"', () => {
      const t = DPoint.parseFromWKT('POINT (30 10 70)');
      expect(t.x).toBe(30);
      expect(t.y).toBe(10);
      expect(t.z).toBe(70);
    });
  });

  describe('getTileFromCoords', () => {
    test('with z', () => {
      const t = new DPoint(1, 7, 8).getTileFromCoords();
      expect(t.x).toBe(128);
      expect(t.y).toBe(123);
      expect(t.z).toBe(8);
    });
    test('with other z', () => {
      const t = new DPoint(1, 7, 8).getTileFromCoords(6);
      expect(t.x).toBe(32);
      expect(t.y).toBe(30);
      expect(t.z).toBe(6);
    });
    test('with other z and without basic z', () => {
      const t = new DPoint(2, 5).getTileFromCoords(6);
      expect(t.x).toBe(32);
      expect(t.y).toBe(31);
      expect(t.z).toBe(6);
    });
  });

  describe('toCoords', () => {
    test('x, y', () => {
      const [x, y, z] = new DPoint(2, 3).toCoords();
      expect(x).toBe(2);
      expect(y).toBe(3);
      expect(z).toBeUndefined();
    });
    test('x, y, z', () => {
      const [x, y, z] = new DPoint(2, 3, 4).toCoords();
      expect(x).toBe(2);
      expect(y).toBe(3);
      expect(z).toBe(4);
    });
    test('3', () => {
      expect(new DPoint(1, 2, 3).toCoords('xyz')).toEqual([1, 2, 3]);
    });
    test('4', () => {
      expect(new DPoint(1, 2, 3).toCoords('yxz')).toEqual([2, 1, 3]);
    });
    test('5', () => {
      expect(new DPoint(1, 2, 3).toCoords('some texyt')).toEqual([1, 2]);
    });
    test('6', () => {
      expect(new DPoint(1, 2, 3).toCoords('some tezt')).toEqual([3]);
    });
  });

  describe('findLine', () => {
    test('(0, 2), (0, 4)', () => {
      const l = new DPoint(0, 2).findLine(new DPoint(0, 4));
      expect(l).not.toBe(null);
      expect(l!.a).toBe(1);
      expect(l!.b).toBeCloseTo(0, 1e-20);
      expect(l!.c).toBeCloseTo(0, 1e-20);
    });
    test('(7, 2), (7, 4)', () => {
      const l = new DPoint(7, 2).findLine(new DPoint(7, 4));
      expect(l).not.toBe(null);
      expect(l!.a).toBe(1);
      expect(l!.b).toBeCloseTo(0, 1e-20);
      expect(l!.c).toBe(-7);
    });
    test('(2, 0), (4, 0)', () => {
      const l = new DPoint(2, 0).findLine(new DPoint(4, 0));
      expect(l).not.toBe(null);
      expect(l!.a).toBeCloseTo(0, 1e-20);
      expect(l!.b).toBe(1);
      expect(l!.c).toBeCloseTo(0, 1e-20);
    });
    test('(2, 7), (4, 7)', () => {
      const l = new DPoint(2, 7).findLine(new DPoint(4, 7));
      expect(l).not.toBe(null);
      expect(l!.a).toBeCloseTo(0, 1e-20);
      expect(l!.b).toBe(1);
      expect(l!.c).toBe(-7);
    });
    test('(1, 2) (3, 4)', () => {
      const l = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(l).not.toBe(null);
      expect(l!.a).toBe(-2);
      expect(l!.b).toBe(2);
      expect(l!.c).toBe(-2);
    });
    test('(1, 1) (1, 1)', () => {
      const l = new DPoint(1, 1).findLine(new DPoint(1, 1));
      expect(l).not.toBe(null);
      expect(l!.a).toBe(1);
      expect(l!.b).toBe(0);
      expect(l!.c).toBe(-1);
    });
  });

  describe('findInnerAngle', () => {
    test('(0, 0) -> (0, 1), (1, 0)', () => {
      expect(DPoint.zero().findInnerAngle(new DPoint(0, 1), new DPoint(1, 0))).toBe(Math.PI / 2);
    });
    test('(0, 0.5) -> (0, 1), (0, 0)', () => {
      expect(new DPoint(0, 0.5).findInnerAngle(new DPoint(0, 1), new DPoint(0, 0))).toBe(Math.PI);
    });
    test('(2, 4) -> (0, 1), (1, 0)', () => {
      expect(new DPoint(2, 4).findInnerAngle(new DPoint(0, 1), new DPoint(1, 0))).toBe(5.940161366758883);
    });
    test('(2, 4) -> (1, 0), (0, 1)', () => {
      expect(new DPoint(2, 4).findInnerAngle(new DPoint(1, 0), new DPoint(0, 1))).toBe(0.3430239404207036);
    });
  });

  describe('transform', () => {
    test('without params(EPSG:3857 -> EPSG:4326)', () => {
      const t = new DPoint(1, 1).metersToDegree();
      expect(t.x).toBe(0.000008983152842445679);
      expect(t.y).toBe(0.000008983152838482056);
    });
    test('EPSG:3857 -> EPSG:4326', () => {
      const t = new DPoint(1, 1).metersToDegree();
      expect(t.x).toBe(0.000008983152842445679);
      expect(t.y).toBe(0.000008983152838482056);
    });
    test('EPSG:4326 -> EPSG:3857', () => {
      const t = new DPoint(1, 1).degreeToMeters();
      expect(t.x).toBe(111319.49077777777);
      expect(t.y).toBe(111325.14285088828);
    });
    test('(45, 45) EPSG:4326 -> EPSG:3857', () => {
      const t = new DPoint(45, 45).degreeToMeters();
      expect(t.x).toBe(5009377.085);
      expect(t.y).toBe(5621521.485409545);
    });
    test('(360 + 45, 360 + 45) EPSG:4326 -> EPSG:3857', () => {
      const t = new DPoint(360 + 45, 360 + 45).degreeToMeters();
      expect(t.x).toBe(5009377.085);
      expect(t.y).toBe(5621521.485409545);
    });
  });

  describe('toString', () => {
    test('(1, 0.7)', () => {
      expect(new DPoint(1, 0.7).toString()).toBe('1 0.7');
    });
  });

  describe('getValue', () => {
    test('(1, 0.7)', () => {
      expect(new DPoint(1, 0.7).getValue()).toEqual([1, 0.7]);
    });
  });

  test('height', () => {
    const t = DPoint.zero().height(7);
    expect(t.x).toBe(0);
    expect(t.y).toBe(0);
    expect(t.z).toBe(7);
  });

  test('toWKT', () => {
    const t = new DPoint(1, 2);
    expect(t.toWKT()).toBe('POINT (1 2)');
  });

  test('distance', () => {
    expect(new DPoint(1, 2).distance(new DPoint(3, 4))).toBe(2.8284271247461903);
  });

  test('distance3d', () => {
    expect(new DPoint(1, 2, 1).distance3d(new DPoint(3, 4, 2))).toBe(3);
  });

  describe('setX', () => {
    test('value', () => {
      expect(new DPoint(3, 4).setX(7)
        .equal(new DPoint(7, 4))).toBe(true);
    });
    test('function', () => {
      expect(new DPoint(3, 4).setX((p) => p.x * 2)
        .equal(new DPoint(6, 4))).toBe(true);
    });
  });

  describe('setZ', () => {
    test('value', () => {
      expect(new DPoint(3, 4).setZ(7)
        .equal(new DPoint(3, 4, 7))).toBe(true);
    });
    test('function', () => {
      expect(new DPoint(3, 4, 5).setZ((p) => p.z! * 2)
        .equal(new DPoint(3, 4, 10))).toBe(true);
    });
  });

  describe('setY', () => {
    test('value', () => {
      expect(new DPoint(3, 4).setY(7)
        .equal(new DPoint(3, 7))).toBe(true);
    });
    test('function', () => {
      expect(new DPoint(3, 4).setY((p) => p.x * 2)
        .equal(new DPoint(3, 6))).toBe(true);
    });
  });

  describe('clone', () => {
    test('change after', () => {
      const t1 = new DPoint(1, 2);
      const t2 = t1.clone();
      expect(t1.equal(t2)).toBe(true);
      t1.x = 6;
      expect(!t1.equal(t2)).toBe(true);
    });
  });

  describe('gt', () => {
    test('(1, 1) (2, 2)', () => {
      expect(new DPoint(1, 1).gt(new DPoint(2, 2))).toBe(false);
    });
    test('(1, 1) (1, 1)', () => {
      expect(new DPoint(1, 1).gt(new DPoint(1, 1))).toBe(false);
    });
    test('(1, 1) (0, 0)', () => {
      expect(new DPoint(1, 1).gt(new DPoint(0, 0))).toBe(true);
    });
  });

  describe('lt', () => {
    test('(1, 1) (2, 2)', () => {
      expect(new DPoint(1, 1).lt(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 1) (1, 1)', () => {
      expect(new DPoint(1, 1).lt(new DPoint(1, 1))).toBe(false);
    });
    test('(1, 1) (0, 0)', () => {
      expect(new DPoint(1, 1).lt(new DPoint(0, 0))).toBe(false);
    });
  });

  describe('gtOrEqual', () => {
    test('(1, 1) (2, 2)', () => {
      expect(new DPoint(1, 1).gtOrEqual(new DPoint(2, 2))).toBe(false);
    });
    test('(1, 1) (1, 1)', () => {
      expect(new DPoint(1, 1).gtOrEqual(new DPoint(1, 1))).toBe(true);
    });
    test('(1, 1) (0, 0)', () => {
      expect(new DPoint(1, 1).gtOrEqual(new DPoint(0, 0))).toBe(true);
    });
  });

  describe('ltOrEqual', () => {
    test('(1, 1) (2, 2)', () => {
      expect(new DPoint(1, 1).ltOrEqual(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 1) (1, 1)', () => {
      expect(new DPoint(1, 1).ltOrEqual(new DPoint(1, 1))).toBe(true);
    });
    test('(1, 1) (0, 0)', () => {
      expect(new DPoint(1, 1).ltOrEqual(new DPoint(0, 0))).toBe(false);
    });
  });

  describe('rotate', () => {
    const res = new DPoint(0.5411961001461969, 1.3065629648763766);
    const p = new DPoint(1, 1);
    test('(1, 1) Pi/8', () => {
      expect(p.clone().rotate(Math.PI / 8)
        .equal(res)).toBe(true);
    });
    test('(1, 1) -Pi/8', () => {
      expect(p.clone().rotate(-Math.PI / 8)
        .equal(new DPoint(1.3065629648763766, 0.5411961001461969))).toBe(true);
    });
    test('(1, 1) 2Pi', () => {
      expect(p.clone().rotate(2 * Math.PI)
        .like(p.clone(), 1e-10)).toBe(true);
    });
    test('(1, 1) 17Pi/8', () => {
      expect(p.clone().rotate(17 * Math.PI / 8)
        .like(res, 1e-10)).toBe(true);
    });
  });

  describe('w', () => {
    test('w', () => {
      const t = new DPoint(6, 7);
      expect(t.w).toBe(6);
      expect(t.x).toBe(6);
      t.w = 9;
      expect(t.w).toBe(9);
      expect(t.x).toBe(9);
      t.x = 4;
      expect(t.w).toBe(4);
      expect(t.x).toBe(4);
    });
  });

  describe('h', () => {
    test('h', () => {
      const t = new DPoint(7, 6);
      expect(t.h).toBe(6);
      expect(t.y).toBe(6);
      t.h = 9;
      expect(t.h).toBe(9);
      expect(t.y).toBe(9);
      t.y = 4;
      expect(t.h).toBe(4);
      expect(t.y).toBe(4);
    });
  });

  test('area', () => {
    expect(new DPoint(2, 2).area).toBe(4);
  });

  describe('hip', () => {
    test('(30, 40)', () => {
      expect(new DPoint(30, 40).hip).toBe(50);
    });
    test('(0, 30)', () => {
      expect(new DPoint(0, 30).hip).toBe(30);
    });
    test('(20, 0)', () => {
      expect(new DPoint(20, 0).hip).toBe(20);
    });
  });

  describe('min', () => {
    test('(1, 2)', () => {
      expect(new DPoint(1, 2).min).toBe(1);
    });
    test('(1, 1)', () => {
      expect(new DPoint(1, 1).min).toBe(1);
    });
    test('(1, 0)', () => {
      expect(new DPoint(1, 0).min).toBe(0);
    });
  });

  describe('max', () => {
    test('(1, 2)', () => {
      expect(new DPoint(1, 2).max).toBe(2);
    });
    test('(1, 1)', () => {
      expect(new DPoint(1, 1).max).toBe(1);
    });
    test('(1, 0)', () => {
      expect(new DPoint(1, 0).max).toBe(1);
    });
  });

  describe('hipPoint', () => {
    test('(30, 40)', () => {
      expect(new DPoint(30, 40).hipPoint.equal(new DPoint(50, 50))).toBe(true);
    });
    test('(0, 30)', () => {
      expect(new DPoint(0, 30).hipPoint.equal(new DPoint(30, 30))).toBe(true);
    });
    test('(20, 0)', () => {
      expect(new DPoint(20, 0).hipPoint.equal(new DPoint(20, 20))).toBe(true);
    });
  });

  describe('xPoint', () => {
    test('(30, 40)', () => {
      expect(new DPoint(30, 40).xPoint.equal(new DPoint(30, 30))).toBe(true);
    });
    test('(0, 30)', () => {
      expect(new DPoint(0, 30).xPoint.equal(new DPoint(0, 0))).toBe(true);
    });
    test('(20, 0)', () => {
      expect(new DPoint(20, 0).xPoint.equal(new DPoint(20, 20))).toBe(true);
    });
  });

  describe('yPoint', () => {
    test('(30, 40)', () => {
      expect(new DPoint(30, 40).yPoint.equal(new DPoint(40, 40))).toBe(true);
    });
    test('(0, 30)', () => {
      expect(new DPoint(0, 30).yPoint.equal(new DPoint(30, 30))).toBe(true);
    });
    test('(20, 0)', () => {
      expect(new DPoint(20, 0).yPoint.equal(new DPoint(0, 0))).toBe(true);
    });
  });

  describe('wPoint', () => {
    test('(30, 40)', () => {
      expect(new DPoint(30, 40).wPoint.equal(new DPoint(30, 30))).toBe(true);
    });
    test('(0, 30)', () => {
      expect(new DPoint(0, 30).wPoint.equal(new DPoint(0, 0))).toBe(true);
    });
    test('(20, 0)', () => {
      expect(new DPoint(20, 0).wPoint.equal(new DPoint(20, 20))).toBe(true);
    });
  });

  describe('hPoint', () => {
    test('(30, 40)', () => {
      expect(new DPoint(30, 40).hPoint.equal(new DPoint(40, 40))).toBe(true);
    });
    test('(0, 30)', () => {
      expect(new DPoint(0, 30).hPoint.equal(new DPoint(30, 30))).toBe(true);
    });
    test('(20, 0)', () => {
      expect(new DPoint(20, 0).hPoint.equal(new DPoint(0, 0))).toBe(true);
    });
  });

  describe('simple', () => {
    test('without params', () => {
      expect(new DPoint(4, 5).simple()).toEqual({x: 4, y: 5});
    });
    test('x key only', () => {
      expect(new DPoint(4, 5).simple('aaa')).toEqual({aaa: 4, y: 5});
    });
    test('both keys', () => {
      expect(new DPoint(4, 5).simple('key1', 'key2')).toEqual({key1: 4, key2: 5});
    });
  });

  describe('setIfLessThan', () => {
    test('(2, 2) (2, 2)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (2, 2)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(0, 2) (2, 2)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(2, 1) (2, 2)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 1) (2, 2)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(0, 1) (2, 2)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(2, 0) (2, 2)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 0) (2, 2)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(0, 0) (2, 2)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(2, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(2, 2) (1, 2)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (1, 2)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 2) (1, 2)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(2, 1) (1, 2)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 1) (1, 2)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 1) (1, 2)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(2, 0) (1, 2)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 0) (1, 2)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 0) (1, 2)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(1, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(2, 2) (0, 2)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (0, 2)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 2) (0, 2)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(0, 2))).toBe(true);
    });
    test('(2, 1) (0, 2)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 1) (0, 2)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 1) (0, 2)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(0, 2))).toBe(true);
    });
    test('(2, 0) (0, 2)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 0) (0, 2)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 0) (0, 2)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(0, 2))
        .equal(new DPoint(0, 2))).toBe(true);
    });
    test('(2, 2) (2, 1)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (2, 1)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(0, 2) (2, 1)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(2, 1) (2, 1)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 1) (2, 1)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(0, 1) (2, 1)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(2, 0) (2, 1)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 0) (2, 1)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(0, 0) (2, 1)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(2, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(2, 2) (1, 1)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (1, 1)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 2) (1, 1)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(2, 1) (1, 1)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 1) (1, 1)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(0, 1) (1, 1)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(2, 0) (1, 1)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 0) (1, 1)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(0, 0) (1, 1)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(1, 1))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(2, 2) (0, 1)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (0, 1)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 2) (0, 1)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(0, 2))).toBe(true);
    });
    test('(2, 1) (0, 1)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 1) (0, 1)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(0, 1) (0, 1)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(0, 1))).toBe(true);
    });
    test('(2, 0) (0, 1)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 0) (0, 1)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(0, 0) (0, 1)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(0, 1))
        .equal(new DPoint(0, 1))).toBe(true);
    });
    test('(2, 2) (2, 0)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (2, 0)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(0, 2) (2, 0)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(2, 1) (2, 0)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 1) (2, 0)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(0, 1) (2, 0)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(2, 0) (2, 0)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 0))).toBe(true);
    });
    test('(1, 0) (2, 0)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 0))).toBe(true);
    });
    test('(0, 0) (2, 0)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(2, 0))
        .equal(new DPoint(2, 0))).toBe(true);
    });
    test('(2, 2) (1, 0)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (1, 0)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 2) (1, 0)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(2, 1) (1, 0)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 1) (1, 0)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(0, 1) (1, 0)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(2, 0) (1, 0)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(2, 0))).toBe(true);
    });
    test('(1, 0) (1, 0)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(1, 0))).toBe(true);
    });
    test('(0, 0) (1, 0)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(1, 0))
        .equal(new DPoint(1, 0))).toBe(true);
    });
    test('(2, 2) (0, 0)', () => {
      expect(new DPoint(2, 2).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(2, 2))).toBe(true);
    });
    test('(1, 2) (0, 0)', () => {
      expect(new DPoint(1, 2).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(1, 2))).toBe(true);
    });
    test('(0, 2) (0, 0)', () => {
      expect(new DPoint(0, 2).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(0, 2))).toBe(true);
    });
    test('(2, 1) (0, 0)', () => {
      expect(new DPoint(2, 1).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(2, 1))).toBe(true);
    });
    test('(1, 1) (0, 0)', () => {
      expect(new DPoint(1, 1).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(1, 1))).toBe(true);
    });
    test('(0, 1) (0, 0)', () => {
      expect(new DPoint(0, 1).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(0, 1))).toBe(true);
    });
    test('(2, 0) (0, 0)', () => {
      expect(new DPoint(2, 0).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(2, 0))).toBe(true);
    });
    test('(1, 0) (0, 0)', () => {
      expect(new DPoint(1, 0).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(1, 0))).toBe(true);
    });
    test('(0, 0) (0, 0)', () => {
      expect(new DPoint(0, 0).setIfLessThan(new DPoint(0, 0))
        .equal(new DPoint(0, 0))).toBe(true);
    });
  });

  describe('minus', () => {
    test('(1, 1)', () => {
      expect(new DPoint(1, 1).minus()
        .equal(new DPoint(-1, -1))).toBe(true);
    });
    test('(0, 1)', () => {
      expect(new DPoint(0, 1).minus()
        .equal(new DPoint(0, -1))).toBe(true);
    });
    test('(-1, 1)', () => {
      expect(new DPoint(-1, 1).minus()
        .equal(new DPoint(1, -1))).toBe(true);
    });
    test('(1, 0)', () => {
      expect(new DPoint(1, 0).minus()
        .equal(new DPoint(-1, 0))).toBe(true);
    });
    test('(0, 0)', () => {
      expect(new DPoint(0, 0).minus()
        .equal(new DPoint(0, 0))).toBe(true);
    });
    test('(-1, 0)', () => {
      expect(new DPoint(-1, 0).minus()
        .equal(new DPoint(1, 0))).toBe(true);
    });
    test('(1, -1)', () => {
      expect(new DPoint(1, -1).minus()
        .equal(new DPoint(-1, 1))).toBe(true);
    });
    test('(0, -1)', () => {
      expect(new DPoint(0, -1).minus()
        .equal(new DPoint(0, 1))).toBe(true);
    });
    test('(-1, -1)', () => {
      expect(new DPoint(-1, -1).minus()
        .equal(new DPoint(1, 1))).toBe(true);
    });
  });

  test('random', () => {
    // eslint-disable-next-line new-cap
    const t = DPoint.random();
    expect(t.x >= 0).toBe(true);
    expect(t.x < 1).toBe(true);
    expect(typeof t.x === 'number').toBe(true);
    expect(t.y >= 0).toBe(true);
    expect(t.y < 1).toBe(true);
    expect(typeof t.y === 'number').toBe(true);
  });

  describe('move', () => {
    test('by number', () => {
      expect(new DPoint(1, 1).move(7)
        .equal(new DPoint(8, 8))).toBe(true);
    });
    test('by two numbers', () => {
      expect(new DPoint(1, 2).move(7, 3)
        .equal(new DPoint(8, 5))).toBe(true);
    });
    test('by three numbers', () => {
      expect(new DPoint(1, 2).move(7, 3, 4)
        .equal(new DPoint(8, 5))).toBe(true);
    });
    test('by three numbers 2', () => {
      expect(new DPoint(1, 2, 3).move(7, 3, 4)
        .equal(new DPoint(8, 5, 7))).toBe(true);
    });
    test('by point', () => {
      const t1 = new DPoint(1, 2);
      const t2 = new DPoint(3, 5);
      const t3 = new DPoint(4, 7);
      expect(t1.move(t2).equal(t3)).toBe(true);
    });
  });

  describe('like', () => {
    test('1', () => {
      expect(new DPoint(1, 1).like(new DPoint(2, 2))).toBe(false);
    });
    test('2', () => {
      expect(new DPoint(1, 1).like(new DPoint(2, 2), 1.00001)).toBe(true);
    });
    test('3', () => {
      expect(new DPoint(1, 1).like(new DPoint(1.01, 1.01), 0.02)).toBe(true);
    });
    test('4', () => {
      expect(new DPoint(1, 1).like(new DPoint(1.00001, 1.00001))).toBe(true);
    });
    test('5', () => {
      expect(new DPoint(1, 1, 1).like(new DPoint(1, 1))).toBe(true);
    });
    test('6', () => {
      expect(new DPoint(1, 1).like(new DPoint(1, 1, 1))).toBe(true);
    });
  });

  describe('equal', () => {
    test('1', () => {
      // eslint-disable-next-line new-cap
      expect(new DPoint().equal(DPoint.random())).toBe(false);
    });
    test('2', () => {
      expect(new DPoint(1, 1).equal(new DPoint(1, 1))).toBe(true);
    });
    test('3', () => {
      expect(new DPoint(1, 2, 3).equal(new DPoint(1, 2))).toBe(false);
    });
    test('4', () => {
      expect(new DPoint(1, 2, 3).equal(new DPoint(1, 2, 3))).toBe(true);
    });
  });

  describe('divide', () => {
    test('by number', () => {
      expect(new DPoint(1, 1).divide(7)
        .equal(new DPoint(1 / 7, 1 / 7))).toBe(true);
    });
    test('by three numbers', () => {
      expect(new DPoint(1, 1, 1).divide(7, 7, 7)
        .equal(new DPoint(1 / 7, 1 / 7, 1 / 7))).toBe(true);
    });
    test('by 3d point', () => {
      expect(new DPoint(1, 1, 1).divide(new DPoint(7, 7, 7))
        .equal(new DPoint(1 / 7, 1 / 7, 1 / 7))).toBe(true);
    });
    test('by two numbers', () => {
      expect(new DPoint(1, 2).divide(7, 3)
        .equal(new DPoint(1 / 7, 2 / 3))).toBe(true);
    });
    test('by point', () => {
      const t1 = new DPoint(1, 2);
      const t2 = new DPoint(3, 5);
      const t3 = new DPoint(1 / 3, 2 / 5);
      expect(t1.divide(t2).equal(t3)).toBe(true);
    });
  });

  describe('scale', () => {
    test('by number', () => {
      expect(new DPoint(1, 1).scale(7)
        .equal(new DPoint(7, 7))).toBe(true);
    });
    test('by three numbers', () => {
      expect(new DPoint(1, 1, 1).scale(7, 7, 7)
        .equal(new DPoint(7, 7, 7))).toBe(true);
    });
    test('by 3d point', () => {
      expect(new DPoint(1, 1, 1).scale(new DPoint(7, 7, 7))
        .equal(new DPoint(7, 7, 7))).toBe(true);
    });
    test('by two numbers', () => {
      expect(new DPoint(1, 2).scale(7, 3)
        .equal(new DPoint(7, 6))).toBe(true);
    });
    test('by point', () => {
      const t1 = new DPoint(1, 2);
      const t2 = new DPoint(3, 5);
      const t3 = new DPoint(3, 10);
      expect(t1.scale(t2).equal(t3)).toBe(true);
    });
  });

  describe('abs', () => {
    test('negative', () => {
      expect(new DPoint(-3, -7).abs()
        .equal(new DPoint(3, 7)));
    });
    test('positive', () => {
      expect(new DPoint(3, 7).abs()
        .equal(new DPoint(3, 7)));
    });
    test('different 1', () => {
      expect(new DPoint(-3, 7).abs()
        .equal(new DPoint(3, 7)));
    });
    test('different 2', () => {
      expect(new DPoint(3, -7).abs()
        .equal(new DPoint(3, 7)));
    });
  });

  describe('toFixed', () => {
    test('negative', () => {
      expect(new DPoint(3, 7).toFixed()
        .equal(new DPoint(3, 7)));
    });
    test('positive', () => {
      expect(new DPoint(3.0001, 7.00000001).toFixed()
        .equal(new DPoint(3, 7)));
    });
    test('different 1', () => {
      expect(new DPoint(-3, 7.12345).toFixed(3)
        .equal(new DPoint(-3, 7)));
    });
    test('different 2', () => {
      expect(new DPoint(3.1234, -7.1234).toFixed()
        .equal(new DPoint(3.12, 7.12)));
    });
  });

  describe('floor', () => {
    test('1', () => {
      expect(new DPoint(1, 3).floor()
        .equal(new DPoint(1, 3))).toBe(true);
    });
    test('2', () => {
      expect(new DPoint(1.4, 3.4).floor()
        .equal(new DPoint(1, 3))).toBe(true);
    });
    test('3', () => {
      expect(new DPoint(1.9, 3.9).floor()
        .equal(new DPoint(1, 3))).toBe(true);
    });
  });

  describe('ceil', () => {
    test('1', () => {
      expect(new DPoint(1, 3).ceil()
        .equal(new DPoint(1, 3))).toBe(true);
    });
    test('2', () => {
      expect(new DPoint(1.4, 3.4).ceil()
        .equal(new DPoint(2, 4))).toBe(true);
    });
    test('3', () => {
      expect(new DPoint(1.9, 3.9).ceil()
        .equal(new DPoint(2, 4))).toBe(true);
    });
  });

  describe('round', () => {
    test('1', () => {
      expect(new DPoint(1, 3).round()
        .equal(new DPoint(1, 3))).toBe(true);
    });
    test('2', () => {
      expect(new DPoint(1.4, 3.4).round()
        .equal(new DPoint(1, 3))).toBe(true);
    });
    test('3', () => {
      expect(new DPoint(1.9, 3.9).round()
        .equal(new DPoint(2, 4))).toBe(true);
    });
  });

  test('degreeToRadians', () => {
    expect(new DPoint(90, 180).degreeToRadians()
      .equal(new DPoint(Math.PI / 2, Math.PI))).toBe(true);
  });

  test('orthodromicPath', () => {
    expect(new DPoint(151.06515252840597, -33.907214742507016)
      .orthodromicPath(new DPoint(-21.88006077513806, 64.13365454019574))
      .toString()).toBe('(151.065152528406 -33.907214742507016, 150.58341098717048 -29.967866361326713, 150.' +
      '101669445935 -25.688009703082873, 149.6199279046995 -21.07580646133773, 149.138186363464 -16.157816572579986,' +
      ' 148.6564448222285 -10.981981848513616, 148.174703280993 -5.617859958151424, 147.6929617397575 -0.15299270919' +
      '772584, 147.211220198522 5.3146618943979425, 146.72947865728648 10.686849634052077, 146.247737116051 15.87521' +
      '541834549, 145.7659955748155 20.809063523161566, 145.28425403358003 25.43921990023483, 144.8025124923445 29.7' +
      '37991000550817, 144.32077095110898 33.69629560849068, 143.83902940987352 37.31940361788753, 143.357287868638 ' +
      '40.62249038508074, 142.8755463274025 43.62674876854825, 142.393804786167 46.35636425811363, 141.9120632449315' +
      '2 48.836366808759415, 141.43032170369602 51.091227286102445, 140.9485801624605 53.144022014597326, 140.466838' +
      '621225 55.01599890594001, 139.98509707998952 56.726410187135606, 139.50335553875402 58.292511666820644, 139.0' +
      '2161399751853 59.72965879209583, 138.53987245628304 61.051453169417464, 138.0581309150475 62.26991009389787, ' +
      '137.57638937381202 63.39562921222996, 137.09464783257653 64.4379581045922, 136.61290629134103 65.405143476238' +
      '98, 136.13116475010554 66.30446768966202, 135.64942320887002 67.14237018092527, 135.16768166763453 67.9245543' +
      '2816149, 134.68594012639903 68.65608087020831, 134.2041985851635 69.34144920149757, 133.72245704392805 69.984' +
      '66791939809, 133.24071550269252 70.58931595045709, 132.75897396145703 71.15859548085953, 132.27723242022154 7' +
      '1.69537779325287, 131.79549087898602 72.20224298404594, 131.31374933775055 72.68151441195889, 130.83200779651' +
      '503 73.13528861487555, 130.35026625527954 73.56546133000026, 129.86852471404404 73.97375016239717, 129.386783' +
      '17280855 74.3617143687101, 128.90504163157306 74.7307721552968, 128.42330009033753 75.08221583203506, 127.941' +
      '55854910204 75.41722511350576, 127.45981700786655 75.73687881701738, 126.97807546663104 76.04216517098295, 12' +
      '6.49633392539556 76.33399091658522, 126.01459238416005 76.61318935966902, 125.53285084292455 76.8805275076888' +
      '4, 125.05110930168907 77.13671240772473, 124.56936776045356 77.38239678555311, 124.08762621921807 77.61818407' +
      '209363, 123.60588467798256 77.84463289188572, 123.12414313674705 78.06226107827379, 122.64240159551157 78.271' +
      '54927143734, 122.16066005427606 78.47294414807767, 121.67891851304056 78.66686132527941, 121.19717697180506 7' +
      '8.85368797565032, 120.71543543056956 79.03378518617549, 120.23369388933405 79.20749008919174, 119.75195234809' +
      '857 79.37511779040274, 119.27021080686306 79.53696311583501, 118.78846926562758 79.69330219701314, 118.306727' +
      '72439208 79.84439391135484, 117.82498618315657 79.9904811927998, 117.34324464192107 80.13179222595647, 116.86' +
      '150310068557 80.2685415355365, 116.37976155945009 80.40093098152276, 115.89802001821458 80.52915066935566, 11' +
      '5.41627847697907 80.65337978340247, 114.93453693574358 80.77378735107823, 114.45279539450807 80.8905329441961' +
      ', 113.97105385327258 81.00376732342866, 113.48931231203709 81.11363303114564, 113.00757077080158 81.220264937' +
      '34882, 112.52582922956609 81.32379074294161, 112.04408768833059 81.42433144414318, 111.56234614709508 81.5220' +
      '01761475, 111.08060460585959 81.61691053641034, 110.59886306462408 81.70916109847381, 110.11712152338859 81.7' +
      '988516053099, 109.6353799821531 81.88607535799804, 109.15363844091759 81.97092109367662, 108.6718968996821 82' +
      '.05347325734584, 108.19015535844659 82.13381225454594, 107.7084138172111 82.2120146864522, 107.2266722759756 ' +
      '82.28815356878903, 106.7449307347401 82.3622985358389, 106.2631891935046 82.43451603070999, 105.7814476522691' +
      '1 82.50486948292297, 105.2997061110336 82.57341947428654, 104.81796456979811 82.64022389394701, 104.336223028' +
      '5626 82.70533808342242, 103.8544814873271 82.76881497236317, 103.37273994609161 82.83070520571945, 102.890998' +
      '4048561 82.8910572629393, 102.40925686362061 82.94991756977028, 101.9275153223851 83.00733060319138, 101.4457' +
      '7378114961 83.06333898995929, 100.96403223991412 83.11798359921498, 100.48229069867861 83.17130362956107, 100' +
      '.00054915744312 83.22333669098893, 99.51880761620762 83.27411888200463, 99.03706607497212 83.32368486227664, ' +
      '98.55532453373662 83.37206792110314, 98.07358299250112 83.41930004197502, 97.59184145126562 83.46541196348953' +
      ', 97.11009991003013 83.51043323685087, 96.62835836879462 83.5543922801771, 96.14661682755913 83.5973164298159' +
      '8, 95.66487528632362 83.63923198885884, 95.18313374508813 83.68016427302707, 94.70139220385263 83.72013765409' +
      '415, 94.21965066261713 83.75917560099433, 93.73790912138163 83.79730071875909, 93.25616758014614 83.834534785' +
      '41182, 92.77442603891063 83.87089878694331, 92.29268449767513 83.90641295048151, 91.81094295643963 83.9410967' +
      '7576185, 91.32920141520414 83.97496906499708, 90.84745987396865 84.00804795123906, 90.36571833273314 84.04035' +
      '092531898, 89.88397679149764 84.07189486144664, 89.40223525026214 84.10269604154443, 88.92049370902664 84.132' +
      '77017838661, 88.43875216779115 84.16213243760981, 87.95701062655564 84.19079745865737, 87.47526908532015 84.2' +
      '1877937471469, 86.99352754408466 84.24609183169072, 86.51178600284915 84.27274800629652, 86.03004446161364 84' +
      '.2987606232684, 85.54830292037815 84.32414197178119, 85.06656137914266 84.34890392109361, 84.58481983790716 8' +
      '4.37305793546535, 84.10307829667165 84.39661508838348, 83.62133675543616 84.41958607613307, 83.13959521420065' +
      ' 84.44198123074506, 82.65785367296516 84.46381053235254, 82.17611213172965 84.48508362098478, 81.694370590494' +
      '16 84.50580980782632, 81.21262904925867 84.52599808596727, 80.73088750802317 84.54565714066936, 80.2491459667' +
      '8767 84.56479535917059, 79.76740442555216 84.58342084005047, 79.28566288431666 84.6015414021762, 78.803921343' +
      '08117 84.61916459324931, 78.32217980184568 84.6362976979709, 77.84043826061017 84.65294774584288, 77.35869671' +
      '937468 84.66912151862138, 76.87695517813917 84.68482555743778, 76.39521363690368 84.700066169602, 75.91347209' +
      '566817 84.71484943510151, 75.43173055443268 84.72918121280945, 74.94998901319718 84.74306714641371, 74.468247' +
      '47196169 84.75651267007875, 73.98650593072618 84.76952301385128, 73.50476438949067 84.78210320881983, 73.0230' +
      '2284825518 84.79425809203823, 72.54128130701969 84.80599231122211, 72.0595397657842 84.81731032922728, 71.577' +
      '79822454869 84.82821642831819, 71.0960566833132 84.83871471423417, 70.61431514207769 84.8488091200611, 70.132' +
      '57360084219 84.85850340991504, 69.65083205960669 84.86780118244472, 69.16909051837119 84.876705874159, 68.687' +
      '3489771357 84.8852207625851, 68.2056074359002 84.89334896926293, 67.7238658946647 84.90109346258103, 67.24212' +
      '435342919 84.90845706045874, 66.7603828121937 84.91544243287926, 66.2786412709582 84.92205210427772, 65.79689' +
      '972972271 84.92828845578862, 65.3151581884872 84.934153727356, 64.83341664725171 84.93965001971016, 64.351675' +
      '1060162 84.944779296214, 63.86993356478071 84.94954338458209, 63.3881920235452 84.95394397847528, 62.90645048' +
      '230971 84.95798263897356, 62.424708941074215 84.96166079592918, 61.942967399838714 84.96497974920275, 61.4612' +
      '2585860321 84.96794066978399, 60.979484317367714 84.97054460079869, 60.49774277613221 84.9727924584043, 60.01' +
      '600123489672 84.97468503257454, 59.53425969366121 84.9762229877751, 59.05251815242571 84.97740686353116, 58.5' +
      '7077661119022 84.97823707488756, 58.089035069954726 84.97871391276253, 57.607293528719225 84.97883754419546, ' +
      '57.12555198748372 84.97860801248908, 56.643810446248224 84.97802523724637, 56.162068905012724 84.977089014302' +
      '07, 55.68032736377723 84.97579901554886, 55.19858582254172 84.97415478865788, 54.71684428130623 84.9721557566' +
      '9327, 54.23510274007073 84.96980121761963, 53.753361198835236 84.96709034370237, 53.27161965759973 84.9640221' +
      '8079947, 52.78987811636423 84.9605956475436, 52.308136575128735 84.95680953441347, 51.82639503389324 84.95266' +
      '250269272, 51.344653492657734 84.94815308331495, 50.862911951422234 84.94327967559273, 50.38117041018674 84.9' +
      '3804054582868, 49.89942886895124 84.93243382580651, 49.41768732771575 84.92645751115933, 48.93594578648024 84' +
      '.92010945961266, 48.454204245244746 84.91338738909946, 47.972462704009246 84.90628887574353, 47.4907211627737' +
      '5 84.89881135170883, 47.008979621538245 84.89095210291009, 46.527238080302745 84.88270826658172, 46.045496539' +
      '06725 84.8740768287005, 45.56375499783176 84.8650546212579, 45.08201345659625 84.85563831937706, 44.600271915' +
      '36075 84.84582443826993, 44.11853037412526 84.83560933002876, 43.636788832889756 84.824989180247, 43.15504729' +
      '165426 84.81396000446301, 42.673305750418756 84.80251764442076, 42.19156420918326 84.79065776414059, 41.70982' +
      '266794776 84.77837584579315, 41.22808112671227 84.76566718536881, 40.74633958547676 84.75252688813481, 40.264' +
      '59804424126 84.73894986387147, 39.78285650300577 84.72493082187918, 39.301114961770274 84.71046426574581, 38.' +
      '81937342053477 84.69554448786559, 38.337631879299266 84.68016556369813, 37.85589033806377 84.66432134575699, ' +
      '37.37414879682827 84.64800545731573, 36.892407255592765 84.63121128581892, 36.41066571435727 84.6139319759851' +
      '7, 35.928924173121764 84.59616042258787, 35.44718263188628 84.5778892628993, 34.96544109065077 84.55911086878' +
      '189, 34.48369954941529 84.53981733841043, 34.00195800817978 84.52000048760775, 33.52021646694427 84.499651840' +
      '77479, 33.03847492570879 84.47876262139596, 32.55673338447328 84.45732374209837, 32.0749918432378 84.43532579' +
      '424314, 31.59325030200229 84.41275903702514, 31.111508760766778 84.38961338605623, 30.629767219531296 84.3658' +
      '7840140572, 30.148025678295788 84.34154327506981, 29.66628413706028 84.31659681784026, 29.184542595824798 84.' +
      '2910274455408, 28.702801054589287 84.26482316459733, 28.221059513353804 84.2379715569065, 27.739317972118297 ' +
      '84.21045976396438, 27.257576430882786 84.18227447021489, 26.775834889647303 84.15340188557498, 26.29409334841' +
      '1796 84.12382772709056, 25.812351807176313 84.09353719967443, 25.330610265940805 84.06251497587431, 24.848868' +
      '724705294 84.03074517461505, 24.36712718346981 83.99821133885632, 23.885385642234304 83.96489641210232, 23.40' +
      '3644100998797 83.9307827136959, 22.92190255976331 83.89585191282549, 22.440161018527803 83.86008500116725, 21' +
      '.95841947729232 83.82346226408042, 21.476677936056813 83.78596325026759, 20.994936394821302 83.74756673980555' +
      ', 20.51319485358582 83.70825071044544, 20.031453312350312 83.6679923020742, 19.54971177111483 83.626767779220' +
      '74, 19.06797022987932 83.58455249148247, 18.58622868864381 83.54132083173805, 18.104487147408328 83.497046192' +
      '00284, 17.62274560617282 83.45170091677215, 17.141004064937313 83.4052562536862, 16.659262523701827 83.357682' +
      '30133779, 16.17752098246632 83.30894795402979, 15.695779441230837 83.25902084327487, 15.21403789999533 83.207' +
      '86727581323, 14.73229635875982 83.15545216790655, 14.250554817524337 83.10173897564708, 13.768813276288828 83' +
      '.04668962099954, 13.287071735053319 82.99026441327052, 12.805330193817836 82.93242196567503, 12.3235886525823' +
      '29 82.87311910664229, 11.841847111346844 82.81231078547277, 11.360105570111337 82.74994997192567, 10.87836402' +
      '8875827 82.68598754927974, 10.396622487640345 82.62037220037102, 9.914880946404836 82.55305028606756, 9.43313' +
      '9405169353 82.48396571559326, 8.951397863933844 82.41305980806052, 8.469656322698336 82.34027114451396, 7.987' +
      '914781462853 82.26553540972286, 7.506173240227344 82.1887852228906, 7.024431698991836 82.10994995637122, 6.54' +
      '2690157756352 82.02895554139718, 6.060948616520844 81.94572425972802, 5.579207075285361 81.860174520024, 5.09' +
      '7465534049853 81.77222061763165, 4.615723992814344 81.68177247633965, 4.133982451578861 81.58873537051826, 3.' +
      '652240910343352 81.49300962589595, 3.170499369107869 81.3944902970476, 2.6887578278723607 81.29306681947027, ' +
      '2.2070162866368523 81.18862263389893, 1.725274745401369 81.08103478026636, 1.2435332041658604 80.970173458432' +
      '34, 0.7617916629303519 80.85590155249501, 0.2800501216948688 80.7380741151463, -0.2016914195406397 80.6165378' +
      '0813863, -0.6834329607761228 80.49113029448682, -1.1651745020116313 80.36167957752743, -1.64691604324714 80.2' +
      '2800328139394, -2.1286575844826228 80.08990786682602, -2.6103991257181316 79.94718777550817, -3.0921406669536' +
      '4 79.79962449531276, -3.573882208189123 79.6469855378904, -4.055623749424631 79.48902331899036, -4.5373652906' +
      '60115 79.3254739306867, -5.019106831895623 79.15605579330685, -5.500848373131132 78.98046817328512, -5.982589' +
      '914366615 78.7983895513586, -6.464331455602124 78.60947582345574, -6.946072996837606 78.41335831425118, -7.42' +
      '78145380731155 78.20964158062517, -7.909556079308624 77.99790097911503, -8.391297620544107 77.77767996780473,' +
      ' -8.873039161779616 77.54848710888889, -9.354780703015123 77.30979273326788, -9.836522244250608 77.0610252228' +
      '6749, -10.318263785486115 76.8015668597912, -10.800005326721598 76.53074918374426, -11.281746867957107 76.247' +
      '84779022075, -11.763488409192616 75.95207649149228, -12.245229950428099 75.64258075020464, -12.72697149166360' +
      '7 75.31843028105554, -13.208713032899091 74.97861069921375, -13.690454574134598 74.62201407439161, -14.172196' +
      '115370108 74.247428226275, -14.65393765660559 73.85352456972095, -15.1356791978411 73.43884428603506, -15.617' +
      '420739076607 73.00178255890309, -16.09916228031209 72.54057056922912, -16.5809038215476 72.05325489117548, -1' +
      '7.062645362783083 71.53767387097086, -17.54438690401859 70.99143049938796, -18.0261284452541 70.4118612071058' +
      '3, -18.50786998648958 69.79599991862867, -18.989611527725092 69.14053659478134, -19.471353068960575 68.441769' +
      '37687602, -19.953094610196082 67.69554932021755, -20.43483615143159 66.89721657675517, -20.916577692667076 66' +
      '.0415267678747, -21.398319233902583 65.12256619881694, -21.88006077513809 64.13365454019569)');
  });

  describe('likeRadians', () => {
    test('1', () => {
      expect(new DPoint(1, 1).likeRadians).toBe(true);
    });
    test('2', () => {
      expect(new DPoint(-180, 90).likeRadians).toBe(false);
    });
    test('3', () => {
      expect(new DPoint(-181, 1).likeRadians).toBe(false);
    });
    test('4', () => {
      expect(new DPoint(1, -91).likeRadians).toBe(false);
    });
  });

  describe('likeWorldGeodeticSystem', () => {
    test('1', () => {
      expect(new DPoint(1, 1).likeWorldGeodeticSystem).toBe(false);
    });
    test('2', () => {
      expect(new DPoint(-180, 90).likeWorldGeodeticSystem).toBe(true);
    });
    test('3', () => {
      expect(new DPoint(-181, 1).likeWorldGeodeticSystem).toBe(false);
    });
    test('4', () => {
      expect(new DPoint(1, -91).likeWorldGeodeticSystem).toBe(false);
    });
  });

  describe('likePseudoMercator', () => {
    test('1', () => {
      expect(new DPoint(1, 1).likePseudoMercator).toBe(false);
    });
    test('2', () => {
      expect(new DPoint(-180, 90).likePseudoMercator).toBe(false);
    });
    test('3', () => {
      expect(new DPoint(-181, 1).likePseudoMercator).toBe(true);
    });
    test('4', () => {
      expect(new DPoint(1, -91).likePseudoMercator).toBe(true);
    });
    test('5', () => {
      expect(new DPoint(-20026376.39, 20048967.10).likePseudoMercator).toBe(false);
    });
  });

  describe('checkFunction', () => {
    beforeAll(() => {
      DGeo.DEBUG = true;
    });

    afterAll(() => {
      DGeo.DEBUG = false;
    });

    describe('radiansToDegrees', () => {
      // eslint-disable-next-line init-declarations
      let spy: MockInstance<any, any>;
      beforeEach(() => {
        spy = jest.spyOn(console, 'warn').mockImplementation();
      });

      afterEach(() => {
        if (spy) {
          spy.mockRestore();
        }
      });

      test('1', () => {
        expect(new DPoint(Math.PI, Math.PI / 2).radiansToDegrees()
          .toWKT()).toBe('POINT (180 90)');
        expect(spy).toHaveBeenCalledTimes(0);
      });
      test('2', () => {
        expect(new DPoint(Math.PI + 100, Math.PI / 2 + 100).radiansToDegrees()
          .toWKT()).toBe('POINT (5909.5779513082325 5819.577951308232)');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls).toEqual([['"radiansToDegrees" -> "this" should be radians!']]);
      });
    });

    describe('radiansToMeters', () => {
      test('1', () => {
        expect(new DPoint(Math.PI / 4, Math.PI / 4).radiansToMeters()
          .toWKT()).toBe('POINT (5009377.085 5621521.485409545)');
      });
    });
    describe('metersToRadians', () => {
      test('1', () => {
        expect(new DPoint(5009377.085, 5621521.485409545).metersToRadians()
          .equal(new DPoint(Math.PI / 4, Math.PI / 4))).toBe(true);
      });
    });

    describe('flipVertically', () => {
      test('1', () => {
        expect(new DPoint(10, 10).flipVertically(100)
          .equal(new DPoint(10, 90))).toBe(true);
      });
      test('2', () => {
        expect(new DPoint(10, 10).flipVertically(new DPoint(100, 100))
          .equal(new DPoint(10, 90))).toBe(true);
      });
    });

    describe('getCoordsFromTile', () => {
      // eslint-disable-next-line init-declarations
      let spy: MockInstance<any, any>;
      beforeEach(() => {
        spy = jest.spyOn(console, 'warn').mockImplementation();
      });

      afterEach(() => {
        if (spy) {
          spy.mockRestore();
        }
      });

      test('with z', () => {
        const t = new DPoint(2, 4, 8).getCoordsFromTile();
        expect(t.x).toBe(-177.1875);
        expect(t.y).toBe(84.54136107313408);
        expect(t.z).toBe(8);
        expect(spy).toHaveBeenCalledTimes(0);
      });
      test('with other z', () => {
        const t = new DPoint(2, 4, 8).getCoordsFromTile(6);
        expect(t.x).toBe(-168.75);
        expect(t.y).toBe(82.67628497834903);
        expect(t.z).toBe(6);
        expect(spy).toHaveBeenCalledTimes(0);
      });
      test('with other z and without basic z', () => {
        const t = new DPoint(2, 4).getCoordsFromTile(6);
        expect(t.x).toBe(-168.75);
        expect(t.y).toBe(82.67628497834903);
        expect(t.z).toBe(6);
        expect(spy).toHaveBeenCalledTimes(0);
      });
      test('invalid input', () => {
        const t = new DPoint(2.0001, 4.0001).getCoordsFromTile(6);
        expect(t.x).toBe(-168.7494375);
        expect(t.y).toBe(82.67621327322917);
        expect(t.z).toBe(6);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls).toEqual([['"getCoordsFromTile" -> "this" should be UInt!']]);
      });
    });
  });

  describe('rotate3dX', () => {
    test('1', () => {
      expect(new DPoint(0, 2, 3).rotate3dX(Math.PI / 2)).toEqual({
        properties: {},
        x: 0,
        y: 3,
        z: -1.9999999999999998
      });
    });
  });

  describe('rotate3dY', () => {
    test('1', () => {
      expect(new DPoint(2, 0, 3).rotate3dY(Math.PI / 2)).toEqual({
        properties: {},
        x: 3,
        y: 0,
        z: -1.9999999999999998
      });
    });
  });

  describe('rotate3dZ', () => {
    test('1', () => {
      expect(new DPoint(2, 3, 3).rotate3dZ(Math.PI / 2)).toEqual({
        properties: {},
        x: -3,
        y: -1.9999999999999998,
        z: 3
      });
    });
  });

  describe('sortByDistance', () => {
    test('1', () => {
      expect(new DPoint(5, 5).sortByDistance(new DPolygon([
        new DPoint(0, 0),
        new DPoint(0, 4),
        new DPoint(4, 4),
        new DPoint(4, 0)
      ]))
        .toArrayOfCoords()).toEqual([[4, 4], [0, 4], [4, 0], [0, 0]]);
    });
    test('2', () => {
      expect(new DPoint(1, 3).sortByDistance(new DPolygon([
        new DPoint(0, 0),
        new DPoint(0, 4),
        new DPoint(4, 4),
        new DPoint(4, 0)
      ]))
        .toArrayOfCoords()).toEqual([[0, 4], [0, 0], [4, 4], [4, 0]]);
    });
    test('3', () => {
      expect(new DPoint(0, 0).sortByDistance(new DPolygon([
        new DPoint(0, 0),
        new DPoint(0, 4),
        new DPoint(4, 4),
        new DPoint(4, 0)
      ]))
        .toArrayOfCoords()).toEqual([[0, 0], [0, 4], [4, 0], [4, 4]]);
    });
  });

  describe('getQuadKeyFromTile', () => {
    test('1', () => {
      expect(new DPoint(1, 1, 1).getQuadKeyFromTile()).toEqual('3');
    });
    test('2', () => {
      expect(new DPoint(10, 10, 10).getQuadKeyFromTile()).toEqual('0000003030');
    });
    test('3', () => {
      expect(new DPoint(1, 2, 3).getQuadKeyFromTile()).toEqual('021');
    });
  });

  describe('getTileFromQuadKey', () => {
    test('1', () => {
      expect(DPoint.getTileFromQuadKey('3').toCoords()).toEqual([1, 1, 1]);
    });
    test('2', () => {
      expect(DPoint.getTileFromQuadKey('0000003030').toCoords()).toEqual([10, 10, 10]);
    });
    test('3', () => {
      expect(DPoint.getTileFromQuadKey('021').toCoords()).toEqual([1, 2, 3]);
    });
  });

  describe('toGeoJSON', () => {
    test('1', () => {
      expect(new DPoint(1, 2).toGeoJSON()).toStrictEqual({
        type: 'Point',
        coordinates: [1, 2]
      });
    });
    test('2', () => {
      expect(new DPoint(1, 2, 3).toGeoJSON('yxz')).toStrictEqual({
        type: 'Point',
        coordinates: [2, 1, 3]
      });
    });
  });

  describe('getters', () => {
    test('1', () => {
      const t = new DPoint(11, 21, 31);
      expect(t.lat).toBe(21);
      expect(t.lon).toBe(11);
      expect(t.alt).toBe(31);
    });
    test('2', () => {
      const t = new DPoint(11, 21);
      expect(t.lat).toBe(21);
      expect(t.lng).toBe(11);
      expect(t.alt).toBe(undefined);
    });
  });
});
