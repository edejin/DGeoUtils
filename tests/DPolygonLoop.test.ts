import {DPoint, DPolygon} from '../src';

// eslint-disable-next-line max-lines-per-function
describe('DPolygonLoop', () => {
  describe('basic', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(1, 2),
        new DPoint(3, 4)
      ]);
      expect(p
        .loop()
        .move(1)
        .scale(2)
        .run()
        .toString())
        .toBe('(4 6, 8 10)');
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(1, 2),
        new DPoint(3, 4)
      ]);
      expect(p
        .loop()
        .scale(2)
        .move(1)
        .run()
        .toString())
        .toBe('(3 5, 7 9)');
    });
    test('3', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2),' +
        ' (25.2 18.3, 30.4 31.5, 21.6 32.7, 18.8 22.9, 25.1 18.2))')
        .loop()
        .move(1)
        .scale(2)
        .run()
        .toWKT()).toBe('POLYGON ((62.2 22.4, 82.6 82.8, 43 83.2, 23.4 43.6, 62.2 22.4),' +
        ' (52.4 38.6, 62.8 65, 45.2 67.4, 39.6 47.8, 52.2 38.4))');
    });
    test('4', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2),' +
        ' (25.2 18.3, 30.4 31.5, 21.6 32.7, 18.8 22.9, 25.1 18.2))')
        .loop()
        .scale(2)
        .move(1)
        .run()
        .toWKT()).toBe('POLYGON ((61.2 21.4, 81.6 81.8, 42 82.2, 22.4 42.6, 61.2 21.4),' +
        ' (51.4 37.6, 61.8 64, 44.2 66.4, 38.6 46.8, 51.2 37.4))');
    });
  });
  describe('move', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(1, 2),
        new DPoint(3, 4)
      ]);
      expect(p
        .loop()
        .move(1)
        .run()
        .toString())
        .toBe('(2 3, 4 5)');
    });
  });
  describe('scale', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(1, 2),
        new DPoint(3, 4)
      ]);
      expect(p
        .loop()
        .scale(2)
        .run()
        .toString())
        .toBe('(2 4, 6 8)');
    });
  });
  describe('getTileFromCoords', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 0),
        new DPoint(33.6, 44.5),
        new DPoint(54, 24)
      ]);
      expect(p.loop()
        .getTileFromCoords(13)
        .run()
        .toString())
        .toBe('(4096 4096, 4860 2962, 5324 3533)');
    });
  });
  describe('getCoordsFromTile', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(4096, 4096, 13),
        new DPoint(4860, 2962, 13),
        new DPoint(5324, 3533, 13)
      ]);
      expect(p.loop()
        .getCoordsFromTile()
        .run()
        .toString())
        .toBe('(0 0, 33.57421875 44.5278427984555, 53.96484375 24.00632619875113)');
    });
  });
  describe('transform', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 0),
        new DPoint(33.6, 44.5),
        new DPoint(54, 24)
      ]);
      expect(p.loop()
        .metersToDegree()
        .run()
        .toString())
        .toBe('(0 0, 0.0003018339355061748 0.00039975030148298174,' +
          ' 0.00048509025349206667 0.00021559566822304532)');
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(0, 0),
        new DPoint(33.6, 44.5),
        new DPoint(54, 24)
      ]);
      expect(p.loop()
        .degreeToMeters()
        .run()
        .toString())
        .toBe('(0 -7.081154550627917e-10, 3740334.8901333325 5543147.203090187,' +
          ' 6011252.501999999 2753408.1089817025)');
    });
  });
  describe('height', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(4096, 4096, 13),
        new DPoint(4860, 2962, 13),
        new DPoint(5324, 3533, 13)
      ]);
      expect(p.loop()
        .height(14)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [4096, 4096, 14],
          [4860, 2962, 14],
          [5324, 3533, 14]
        ]);
    });
  });
  describe('setX', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(4096, 4096, 13),
        new DPoint(4860, 2962, 13),
        new DPoint(5324, 3533, 13)
      ]);
      expect(p.loop()
        .setX(14)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [14, 4096, 13],
          [14, 2962, 13],
          [14, 3533, 13]
        ]);
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(4096, 4096, 13),
        new DPoint(4860, 2962, 13),
        new DPoint(5324, 3533, 13)
      ]);
      expect(p.loop()
        .setX(({
          x,
          y
        }: DPoint) => x + y)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [8192, 4096, 13],
          [7822, 2962, 13],
          [8857, 3533, 13]
        ]);
    });
  });
  describe('setY', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(4096, 4096, 13),
        new DPoint(4860, 2962, 13),
        new DPoint(5324, 3533, 13)
      ]);
      expect(p.loop()
        .setY(14)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [4096, 14, 13],
          [4860, 14, 13],
          [5324, 14, 13]
        ]);
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(4096, 4096, 13),
        new DPoint(4860, 2962, 13),
        new DPoint(5324, 3533, 13)
      ]);
      expect(p.loop()
        .setY(({
          x,
          y
        }: DPoint) => x + y)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [4096, 8192, 13],
          [4860, 7822, 13],
          [5324, 8857, 13]
        ]);
    });
  });
  describe('setZ', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(4096, 4096, 13),
        new DPoint(4860, 2962, 13),
        new DPoint(5324, 3533, 13)
      ]);
      expect(p.loop()
        .setZ(14)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [4096, 4096, 14],
          [4860, 2962, 14],
          [5324, 3533, 14]
        ]);
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(4096, 4096, 13),
        new DPoint(4860, 2962, 13),
        new DPoint(5324, 3533, 13)
      ]);
      expect(p.loop()
        .setZ(({
          x,
          y
        }: DPoint) => x + y)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [4096, 4096, 8192],
          [4860, 2962, 7822],
          [5324, 3533, 8857]
        ]);
    });
  });
  describe('rotate', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(30, 30),
        new DPoint(60, 30),
        new DPoint(60, 60),
        new DPoint(30, 60)
      ]);
      expect(p
        .loop()
        .rotate(Math.PI / 6)
        .toFixed()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [10.98, 40.98],
          [36.96, 55.98],
          [21.96, 81.96],
          [-4.02, 66.96]
        ]);
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(30, 30),
        new DPoint(60, 30),
        new DPoint(60, 60),
        new DPoint(30, 60)
      ]);

      expect(p
        .loop()
        .rotate(Math.PI / 8)
        .toFixed()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [16.24, 39.2],
          [43.95, 50.68],
          [32.47, 78.39],
          [4.76, 66.91]
        ]);
    });
  });
  describe('round', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 0.3),
        new DPoint(0.7, 1)
      ]);
      expect(p.loop()
        .round()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 0],
          [1, 1]
        ]);
    });
  });
  describe('flipVertically', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 0.3),
        new DPoint(0.7, 1)
      ]);
      expect(p.loop()
        .flipVertically(10)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 9.7],
          [0.7, 9]
        ]);
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2))')
        .loop()
        .flipVertically(100)
        .run()
        .toWKT()).toBe('POLYGON ((30.1 89.8, 40.3 59.6, 20.5 59.4, 10.7 79.2, 30.1 89.8))');
    });
    test('3', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2),' +
        ' (25.2 18.3, 30.4 31.5, 21.6 32.7, 18.8 22.9, 25.1 18.2))')
        .loop()
        .flipVertically(new DPoint(100, 100))
        .run()
        .toWKT()).toBe('POLYGON ((30.1 89.8, 40.3 59.6, 20.5 59.4, 10.7 79.2, 30.1 89.8),' +
        ' (25.2 81.7, 30.4 68.5, 21.6 67.3, 18.8 77.1, 25.1 81.8))');
    });
  });
  describe('ceil', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 0.3),
        new DPoint(0.7, 1)
      ]);
      expect(p.loop()
        .ceil()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 1],
          [1, 1]
        ]);
    });
  });
  describe('floor', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 0.3),
        new DPoint(0.7, 1)
      ]);
      expect(p.loop()
        .floor()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 0],
          [0, 1]
        ]);
    });
  });
  describe('abs', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, -0),
        new DPoint(-1, 1)
      ]);
      expect(p.loop()
        .abs()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 0],
          [1, 1]
        ]);
    });
  });
  describe('toFixed', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0.123, 0.345),
        new DPoint(0.567, 0.789)
      ]);
      expect(p.loop()
        .toFixed(1)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0.1, 0.3],
          [0.6, 0.8]
        ]);
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(0.123, 0.345),
        new DPoint(0.567, 0.789)
      ]);
      expect(p.loop()
        .toFixed()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0.12, 0.34],
          [0.57, 0.79]
        ]);
    });
  });
  describe('divide', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(1, 2),
        new DPoint(3, 4)
      ]);
      expect(p.loop()
        .scale(2)
        .move(1)
        .divide(2)
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [1.5, 2.5],
          [3.5, 4.5]
        ]);
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(1, 2),
        new DPoint(3, 4)
      ]);
      expect(p.loop()
        .scale(2)
        .move(1)
        .divide(new DPoint(2, 1))
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [1.5, 5],
          [3.5, 9]
        ]);
    });
  });
  describe('degreeToRadians', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 90),
        new DPoint(180, 360)
      ]);
      expect(p
        .loop()
        .degreeToRadians()
        .toFixed()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 1.57],
          [3.14, 6.28]
        ]);
    });
  });
  describe('radiansToDegrees', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 1.57),
        new DPoint(3.14, 6.28)
      ]);
      expect(p
        .loop()
        .radiansToDegrees()
        .round()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 90],
          [180, 360]
        ]);
    });
  });
  describe('radiansToMeters', () => {
    test('1', () => {
      const p = new DPolygon([new DPoint(Math.PI / 4, Math.PI / 4)]);
      expect(p
        .loop()
        .radiansToMeters()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([[5009377.085, 5621521.485409545]]);
    });
  });
  describe('metersToRadians', () => {
    test('1', () => {
      const p = new DPolygon([new DPoint(5009377.085, 5621521.485409545)]);
      expect(p
        .loop()
        .metersToRadians()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([[Math.PI / 4, Math.PI / 4]]);
    });
  });
  describe('getHipPoint', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 90),
        new DPoint(180, 360)
      ]);
      expect(p
        .loop()
        .getHipPoint()
        .toFixed()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [90, 90],
          [402.49, 402.49]
        ]);
    });
  });
  describe('getXPoint', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 90),
        new DPoint(180, 360)
      ]);
      expect(p
        .loop()
        .getXPoint()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 0],
          [180, 180]
        ]);
    });
  });
  describe('getYPoint', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 90),
        new DPoint(180, 360)
      ]);
      expect(p
        .loop()
        .getYPoint()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [90, 90],
          [360, 360]
        ]);
    });
  });
  describe('getWPoint', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 90),
        new DPoint(180, 360)
      ]);
      expect(p
        .loop()
        .getWPoint()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [0, 0],
          [180, 180]
        ]);
    });
  });
  describe('getHPoint', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 90),
        new DPoint(180, 360)
      ]);
      expect(p
        .loop()
        .getHPoint()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [90, 90],
          [360, 360]
        ]);
    });
  });
  describe('setIfLessThan', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 90),
        new DPoint(0, 0),
        new DPoint(90, 90),
        new DPoint(90, 0)
      ]);
      expect(p
        .loop()
        .setIfLessThan(new DPoint(45, 50))
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [45, 90],
          [45, 50],
          [90, 90],
          [90, 50]
        ]);
    });
  });
  describe('minus', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(-90, 90),
        new DPoint(-90, -90),
        new DPoint(90, 90),
        new DPoint(90, -90)
      ]);
      expect(p
        .loop()
        .minus()
        .run()
        .toArrayOfCoords())
        .toStrictEqual([
          [90, -90],
          [90, 90],
          [-90, -90],
          [-90, 90]
        ]);
    });
  });
});
