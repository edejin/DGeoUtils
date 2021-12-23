import {DPlane, DPoint, DPolygon} from '../src';

// eslint-disable-next-line max-lines-per-function
describe('DPlane', () => {
  describe('find', () => {
    test('1', () => {
      const p = DPlane.find(
        new DPoint(1, 3, 2),
        new DPoint(2, 1, 1),
        new DPoint(7, 2, 1)
      );
      expect(p.a).toEqual(-0.12499999999999956);
      expect(p.b).toEqual(0.625);
      expect(p.c).toEqual(-1.3750000000000002);
      expect(p.d).toEqual(1);
    });
    test('2', () => {
      const p = DPlane.find(
        new DPoint(0, 0, 13),
        new DPoint(12, 0, 8),
        new DPoint(0, 12, 0)
      );
      expect(p).toEqual({
        a: -0.03205108642578125,
        b: -0.08333396911621094,
        c: -0.07692307692218935,
        d: 1,
        p1: {
          properties: {},
          x: 0,
          y: 0,
          z: 13
        },
        p2: {
          properties: {},
          x: 12,
          y: 0,
          z: 8
        },
        p3: {
          properties: {},
          x: 0,
          y: 12,
          z: 0
        }
      });
    });
    test('3', () => {
      const p = DPlane.find(
        new DPoint(0, 0, 1),
        new DPoint(0, 0, 0),
        new DPoint(0, 1, 0)
      );
      expect(p.a).toEqual(1);
      expect(p.b).toEqual(0);
      expect(p.c).toEqual(0);
      expect(p.d).toEqual(-0);
    });
    test('4', () => {
      const p = DPlane.find(
        new DPoint(7, 0, 1),
        new DPoint(7, 0, 0),
        new DPoint(7, 1, 0)
      );
      expect(p.a).toEqual(1);
      expect(p.b).toEqual(0);
      expect(p.c).toEqual(0);
      expect(p.d).toEqual(-7);
    });
    test('5', () => {
      const p = DPlane.find(
        new DPoint(10, 0, 1),
        new DPoint(3, 0, 0),
        new DPoint(8, 0, 5)
      );
      expect(p.a).toEqual(0);
      expect(p.b).toEqual(1);
      expect(p.c).toEqual(0);
      expect(p.d).toEqual(-0);
    });
    test('6', () => {
      const p = DPlane.find(
        new DPoint(10, 5, 1),
        new DPoint(3, 5, 0),
        new DPoint(8, 5, 5)
      );
      expect(p.a).toEqual(0);
      expect(p.b).toEqual(1);
      expect(p.c).toEqual(0);
      expect(p.d).toEqual(-5);
    });
    test('7', () => {
      const p = DPlane.find(
        new DPoint(10, 3, 0),
        new DPoint(3, 4, 0),
        new DPoint(8, 5, 0)
      );
      expect(p.a).toEqual(0);
      expect(p.b).toEqual(0);
      expect(p.c).toEqual(1);
      expect(p.d).toEqual(-0);
    });
    test('7', () => {
      const p = DPlane.find(
        new DPoint(10, 3, 8),
        new DPoint(3, 4, 8),
        new DPoint(8, 5, 8)
      );
      expect(p.a).toEqual(0);
      expect(p.b).toEqual(0);
      expect(p.c).toEqual(1);
      expect(p.d).toEqual(-8);
    });
  });
  describe('x', () => {
    test('point', () => {
      expect(new DPlane(1, 0, 0, -7).x(new DPoint(1, 2, 3))).toEqual({
        properties: {},
        x: 7,
        y: 2,
        z: 3
      });
    });
    test('polygon', () => {
      expect(DPlane.find(
        new DPoint(1, 2, 5),
        new DPoint(3, 4, 7),
        new DPoint(7, 3, 4)
      ).x(new DPolygon([
        new DPoint(1.5, 2, 5),
        new DPoint(3.5, 4, 7),
        new DPoint(7.5, 3, 4),
        new DPoint(2.5, 3, 6)
      ]))
        .toWKT(undefined, true)).toBe('POLYGON ((' +
        '1 2 5, ' +
        '2.9999999999999987 4 7, ' +
        '6.999999999999996 3 4, ' +
        '1.9999999999999987 3 6, ' +
        '1 2 5' +
        '))');
    });
  });
  describe('y', () => {
    test('point', () => {
      expect(new DPlane(0, 1, 0, -7).y(new DPoint(1, 2, 3))).toEqual({
        properties: {},
        x: 1,
        y: 7,
        z: 3
      });
    });
    test('polygon', () => {
      expect(DPlane.find(
        new DPoint(1, 2, 5),
        new DPoint(3, 4, 7),
        new DPoint(7, 3, 4)
      ).y(new DPolygon([
        new DPoint(1, 2.5, 5),
        new DPoint(3, 4.5, 7),
        new DPoint(7, 3.5, 4),
        new DPoint(2, 3.5, 6)
      ]))
        .toWKT(undefined, true)).toBe('POLYGON ((' +
        '1 2 5, ' +
        '3 4 7, ' +
        '7 3.0000000000000013 4, ' +
        '2 3.0000000000000004 6, ' +
        '1 2 5' +
        '))');
    });
  });
  describe('z', () => {
    test('point', () => {
      expect(new DPlane(0, 0, 1, -7).z(new DPoint(1, 2, 3))).toEqual({
        properties: {},
        x: 1,
        y: 2,
        z: 7
      });
    });
    test('polygon', () => {
      expect(DPlane.find(
        new DPoint(1, 2, 5),
        new DPoint(3, 4, 7),
        new DPoint(7, 3, 4)
      ).z(new DPolygon([
        new DPoint(1, 2, 5.5),
        new DPoint(3, 4, 7.5),
        new DPoint(7, 3, 4.5),
        new DPoint(2, 3, 6.5)
      ]))
        .toWKT(undefined, true)).toBe('POLYGON ((' +
        '1 2 5, ' +
        '3 4 7, ' +
        '7 3 3.9999999999999982, ' +
        '2 3 5.999999999999999, ' +
        '1 2 5' +
        '))');
    });
  });
  describe('clone', () => {
    test('1', () => {
      expect(new DPlane(1, 2, 3, 4).clone()).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        p1: {
          properties: {},
          x: 0,
          y: 0,
          z: undefined
        },
        p2: {
          properties: {},
          x: 0,
          y: 0,
          z: undefined
        },
        p3: {
          properties: {},
          x: 0,
          y: 0,
          z: undefined
        }
      });
    });
  });
  describe('distance', () => {
    test('Point', () => {
      expect(DPlane.find(
        new DPoint(1, 0, 0),
        new DPoint(0, 1, 0),
        new DPoint(0, 0, 1)
      ).distance(DPoint.zero().setZ(0))).toEqual(0.5773502693050958);
    });
    test('Plane', () => {
      expect(new DPlane(3, 1, -4, -11).distance(new DPlane(3, 1, -4, -34))).toEqual(4.510671108178233);
    });
  });
  describe('equal', () => {
    test('1', () => {
      expect(DPlane.find(
        new DPoint(1, 0, 0),
        new DPoint(0, 1, 0),
        new DPoint(0, 0, 1)
      ).equal(DPlane.find(
        new DPoint(1, 0, 0),
        new DPoint(0, 1, 0),
        new DPoint(0, 0, 1)
      ))).toBe(true);
    });
    test('2', () => {
      expect(DPlane.find(
        new DPoint(1, 0, 0),
        new DPoint(0, 1, 0),
        new DPoint(0, 0, 1)
      ).equal(DPlane.find(
        new DPoint(1, 0, 0),
        new DPoint(0, 1, 0),
        new DPoint(0, 1, 1)
      ))).toBe(false);
    });
  });
  describe('same', () => {
    test('1', () => {
      expect(new DPlane(1, 1, 1, 1).same(new DPlane(10, 10, 10, 10))).toBe(true);
    });
    test('2', () => {
      expect(DPlane.find(
        new DPoint(1, 0, 0),
        new DPoint(0, 1, 0),
        new DPoint(0, 0, 1)
      ).same(DPlane.find(
        new DPoint(2, 0, 0),
        new DPoint(0, 2, 0),
        new DPoint(0, 2, 2)
      ))).toBe(false);
    });
  });
  describe('Parallel', () => {
    test('1', () => {
      expect(new DPlane(1, 1, 1, 1).parallel(new DPlane(1, 1, 1, 10))).toBe(true);
    });
    test('2', () => {
      expect(DPlane.find(
        new DPoint(1, 0, 0),
        new DPoint(0, 1, 0),
        new DPoint(0, 0, 1)
      ).parallel(DPlane.find(
        new DPoint(2, 0, 0),
        new DPoint(0, 2, 0),
        new DPoint(0, 2, 2)
      ))).toBe(false);
    });
  });
  describe('findIntersection', () => {
    test('parallel', () => {
      expect(new DPlane(1, 2, 1, 54).findIntersection(new DPlane(1, 2, 1, 55))).toEqual(null);
    });
    test('line', () => {
      expect(new DPlane(1, 2, 1, 54).findIntersection(new DPlane(2, 9, -5, 32))).toEqual({
        a: -88.20000002720799,
        b: 16.600000010023997,
        c: 1.00000000716,
        begin: {
          properties: {},
          x: 0,
          y: 0,
          z: undefined
        },
        end: {
          properties: {},
          x: 0,
          y: 0,
          z: undefined
        }
      });
    });
  });
});
