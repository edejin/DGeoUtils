/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DCircle, DGeo, DLine, DPoint} from '../src';
import MockInstance = jest.MockInstance;

describe('DLine', () => {
  describe('constructor', () => {
    test('1', () => {
      expect(new DLine(1, 2, 3)).toEqual({
        a: 1,
        b: 2,
        c: 3,
        p1: {
          x: 0,
          y: 0,
          properties: {}
        },
        p2: {
          x: 0,
          y: 0,
          properties: {}
        }
      });
    });
    test('2', () => {
      expect(new DLine(1, 2, 3, new DPoint(4, 5))).toEqual({
        a: 1,
        b: 2,
        c: 3,
        p1: {
          x: 4,
          y: 5,
          properties: {}
        },
        p2: {
          x: 0,
          y: 0,
          properties: {}
        }
      });
    });
    test('3', () => {
      expect(new DLine(1, 2, 3, new DPoint(4, 5), new DPoint(6, 7))).toEqual({
        a: 1,
        b: 2,
        c: 3,
        p1: {
          x: 4,
          y: 5,
          properties: {}
        },
        p2: {
          x: 6,
          y: 7,
          properties: {}
        }
      });
    });
  });

  describe('clone', () => {
    test('1', () => {
      const t1 = new DPoint(1, 2).findLine(new DPoint(3, 4));
      const t2 = t1.clone();
      expect(t1).toEqual({
        a: -2,
        b: 2,
        c: -2,
        p1: {
          x: 1,
          y: 2,
          z: undefined,
          properties: {}
        },
        p2: {
          x: 3,
          y: 4,
          z: undefined,
          properties: {}
        }
      });
      expect(t2).toEqual({
        a: -2,
        b: 2,
        c: -2,
        p1: {
          x: 1,
          y: 2,
          z: undefined,
          properties: {}
        },
        p2: {
          x: 3,
          y: 4,
          z: undefined,
          properties: {}
        }
      });
      t2.a = 5;
      t2.b = 6;
      t2.c = 7;
      t2.p1 = new DPoint(10, 20);
      t2.p2 = new DPoint(11, 21);
      expect(t1).toEqual({
        a: -2,
        b: 2,
        c: -2,
        p1: {
          x: 1,
          y: 2,
          z: undefined,
          properties: {}
        },
        p2: {
          x: 3,
          y: 4,
          z: undefined,
          properties: {}
        }
      });
      expect(t2).toEqual({
        a: 5,
        b: 6,
        c: 7,
        p1: {
          x: 10,
          y: 20,
          z: undefined,
          properties: {}
        },
        p2: {
          x: 11,
          y: 21,
          z: undefined,
          properties: {}
        }
      });
    });
  });

  describe('findPerpendicular', () => {
    test('1', () => {
      const t1 = new DPoint(0, 0).findLine(new DPoint(10, 10));
      const t2 = t1.findPerpendicular(new DPoint(0, 10));
      expect(t2).toEqual({
        a: -10,
        b: -10,
        c: 100,
        p1: {
          x: 0,
          y: 0,
          z: undefined,
          properties: {}
        },
        p2: {
          x: 0,
          y: 0,
          z: undefined,
          properties: {}
        }
      });
    });
    test('2', () => {
      const t1 = new DPoint(0, 0).findLine(new DPoint(10, 0));
      const t2 = t1.findPerpendicular(new DPoint(5, 5));
      expect(t2).toEqual({
        a: -1,
        b: 0,
        c: 5,
        p1: {
          x: 0,
          y: 0,
          z: undefined,
          properties: {}
        },
        p2: {
          x: 0,
          y: 0,
          z: undefined,
          properties: {}
        }
      });
    });
    test('3', () => {
      const t1 = new DPoint(0, 0).findLine(new DPoint(0, 10));
      const t2 = t1.findPerpendicular(new DPoint(5, 5));
      expect(t2).toEqual({
        a: -0,
        b: 1,
        c: -5,
        p1: {
          x: 0,
          y: 0,
          z: undefined,
          properties: {}
        },
        p2: {
          x: 0,
          y: 0,
          z: undefined,
          properties: {}
        }
      });
    });
  });

  describe('perpendicularDistance', () => {
    test('1', () => {
      const t1 = new DPoint(0, 0).findLine(new DPoint(10, 10));
      const t2 = t1.perpendicularDistance(new DPoint(0, 10));
      expect(t2).toBe(7.0710678118654755);
    });
    test('2', () => {
      const t1 = new DPoint(0, 0).findLine(new DPoint(10, 0));
      const t2 = t1.perpendicularDistance(new DPoint(5, 5));
      expect(t2).toBe(5);
    });
    test('3', () => {
      const t1 = new DPoint(0, 0).findLine(new DPoint(0, 10));
      const t2 = t1.perpendicularDistance(new DPoint(5, 5));
      expect(t2).toBe(5);
    });
  });

  describe('minX', () => {
    test('1', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.minX).toBe(1);
    });
  });

  describe('minY', () => {
    test('1', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.minY).toBe(2);
    });
  });

  describe('maxX', () => {
    test('1', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.maxX).toBe(3);
    });
  });

  describe('maxY', () => {
    test('1', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.maxY).toBe(4);
    });
  });

  describe('inRange', () => {
    test('in', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.inRange(new DPoint(1.5, 2.5))).toBe(true);
    });
    test('out', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.inRange(new DPoint(-1.5, -2.5))).toBe(false);
    });
    test('border', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.inRange(new DPoint(1, 2))).toBe(true);
    });
    test('in with delta', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.inRange(new DPoint(3.001, 4.001), 0.01)).toBe(true);
    });
    test('out without delta', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.inRange(new DPoint(3.001, 4.001))).toBe(false);
    });
  });

  describe('insideRange', () => {
    test('in', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.insideRange(new DPoint(1.5, 2.5))).toBe(true);
    });
    test('out', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.insideRange(new DPoint(-1.5, -2.5))).toBe(false);
    });
    test('border', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.insideRange(new DPoint(1, 2))).toBe(false);
    });
    test('in with delta', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.insideRange(new DPoint(3.001, 4.001), 0.01)).toBe(true);
    });
    test('out without delta', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4));
      expect(t.inRange(new DPoint(3.001, 4.001))).toBe(false);
    });
  });

  describe('findPoint', () => {
    test('=', () => {
      expect(new DPoint(1, 5).findLine(new DPoint(4, 5))
        .findPoint(new DPoint(2, 6).findLine(new DPoint(8, 6))))
        .toBe(null);
    });
    test('||', () => {
      expect(new DPoint(5, 1).findLine(new DPoint(5, 4))
        .findPoint(new DPoint(6, 2).findLine(new DPoint(6, 8))))
        .toBe(null);
    });
    test('1', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4))
        .findPoint(new DPoint(3, 2).findLine(new DPoint(1, 4)));
      expect(t).toEqual({
        x: 2,
        y: 3,
        z: undefined,
        properties: {}
      });
    });
    test('2', () => {
      const t = new DPoint(0, 5).findLine(new DPoint(0, 7))
        .findPoint(new DPoint(1, 1).findLine(new DPoint(3, -4)));
      expect(t).toEqual({
        x: 0,
        y: 3.5,
        z: undefined,
        properties: {}
      });
    });
    test('3', () => {
      const t = new DPoint(5, 0).findLine(new DPoint(7, 0))
        .findPoint(new DPoint(1, 1).findLine(new DPoint(-4, 3)));
      expect(t).toEqual({
        x: 3.5,
        y: -0,
        z: undefined,
        properties: {}
      });
    });
    test('4', () => {
      const t = new DPoint(1, 1).findLine(new DPoint(17, 10))
        .findPoint(new DPoint(11, 1).findLine(new DPoint(27, 10)));
      expect(t).toBe(null);
    });
    test('5', () => {
      const t = new DPoint(1, 1).findLine(new DPoint(17, 10))
        .findPoint(new DLine(1, 0, 7));
      expect(t).toEqual({
        x: -7,
        y: -3.5,
        z: undefined,
        properties: {}
      });
    });
    test('6', () => {
      const t = new DPoint(1, 1).findLine(new DPoint(17, 10))
        .findPoint(new DLine(0, 1, 7));
      expect(t).toEqual({
        x: -13.222222222222221,
        y: -7,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('intersection', () => {
    test('1', () => {
      const t = new DPoint(1, 2).findLine(new DPoint(3, 4))
        .intersection(new DPoint(3, 2).findLine(new DPoint(1, 4)));
      expect(t).toEqual({
        x: 2,
        y: 3,
        z: undefined,
        properties: {}
      });
    });
    test('2', () => {
      const t = new DPoint(0, 5).findLine(new DPoint(0, 7))
        .intersection(new DPoint(1, 1).findLine(new DPoint(3, -4)));
      expect(t).toBe(null);
    });
    test('3', () => {
      const t = new DPoint(5, 0).findLine(new DPoint(7, 0))
        .intersection(new DPoint(1, 1).findLine(new DPoint(-4, 3)));
      expect(t).toBe(null);
    });
    test('4', () => {
      const t = new DPoint(1, 1).findLine(new DPoint(17, 10))
        .intersection(new DPoint(11, 1).findLine(new DPoint(27, 10)));
      expect(t).toBe(null);
    });
  });

  describe('intersectionWithCircle', () => {
    test('p1', () => {
      expect(new DPoint(0, 0).findLine(new DPoint(11, 10))
        .intersectionWithCircle(new DCircle(DPoint.Zero(), 10))).toEqual([
        {
          x: -7.399400733959437,
          y: -6.726727939963125,
          z: undefined,
          properties: {}
        },
        {
          x: 7.399400733959437,
          y: 6.726727939963125,
          z: undefined,
          properties: {}
        }
      ]);
    });
    test('p2', () => {
      expect(new DPoint(11, -10).findLine(new DPoint(0, 0))
        .intersectionWithCircle(new DCircle(DPoint.Zero(), 10))).toEqual([
        {
          x: 7.399400733959437,
          y: -6.726727939963125,
          z: undefined,
          properties: {}
        },
        {
          x: -7.399400733959437,
          y: 6.726727939963125,
          z: undefined,
          properties: {}
        }
      ]);
    });
    test('null', () => {
      expect(new DPoint(11, -10).findLine(new DPoint(11, 10))
        .intersectionWithCircle(new DCircle(DPoint.Zero(), 10))).toBe(null);
    });
    test('one', () => {
      expect(new DPoint(10, -10).findLine(new DPoint(10, 10))
        .intersectionWithCircle(new DCircle(DPoint.Zero(), 10))).toEqual({
        x: 10,
        y: -0,
        z: undefined,
        properties: {}
      });
    });
    test('one (2)', () => {
      expect(new DPoint(-10, 10).findLine(new DPoint(10, 10))
        .intersectionWithCircle(new DCircle(DPoint.Zero(), 10))).toEqual({
        x: 0,
        y: 10,
        z: undefined,
        properties: {}
      });
    });
    test('two', () => {
      expect(new DPoint(9, -10).findLine(new DPoint(9, 10))
        .intersectionWithCircle(new DCircle(DPoint.Zero(), 10))).toEqual([
        {
          x: 9,
          y: -4.358898943540674,
          z: undefined,
          properties: {}
        },
        {
          x: 9,
          y: 4.358898943540674,
          z: undefined,
          properties: {}
        }
      ]);
    });
    test('two (2)', () => {
      expect(new DPoint(-10, 9).findLine(new DPoint(10, 9))
        .intersectionWithCircle(new DCircle(DPoint.Zero(), 10))).toEqual([
        {
          x: 4.358898943540674,
          y: 9,
          z: undefined,
          properties: {}
        },
        {
          x: -4.358898943540674,
          y: 9,
          z: undefined,
          properties: {}
        }
      ]);
    });
    test('two (3)', () => {
      expect(new DPoint(10, 0).findLine(new DPoint(0, 10))
        .intersectionWithCircle(new DCircle(DPoint.Zero(), 10))).toEqual([
        {
          x: 0,
          y: 10,
          z: undefined,
          properties: {}
        },
        {
          x: 10,
          y: 0,
          z: undefined,
          properties: {}
        }
      ]);
    });
  });

  test('toString', () => {
    expect(new DLine(1, 2, 3).toString()).toBe('(1, 2, 3)');
  });

  test('getValue', () => {
    expect(new DLine(1, 2, 3).getValue()).toEqual([1, 2, 3]);
  });

  describe('x', () => {
    test('parallel x', () => {
      expect(new DPoint(3, -3).findLine(new DPoint(3, 3))
        .x(new DPoint(0, 0))).toEqual({
        x: 3,
        y: 0,
        z: undefined,
        properties: {}
      });
    });
    test('parallel y', () => {
      expect(new DPoint(-3, 3).findLine(new DPoint(3, 3))
        .x(new DPoint(0, 0))).toEqual({
        x: 0,
        y: 3,
        z: undefined,
        properties: {}
      });
    });
    test('other', () => {
      expect(new DPoint(1, 2).findLine(new DPoint(3, 4))
        .x(new DPoint(0, 3))).toEqual({
        x: 2,
        y: 3,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('y', () => {
    test('parallel x', () => {
      expect(new DPoint(3, -3).findLine(new DPoint(3, 3))
        .y(new DPoint(0, 0))).toEqual({
        x: 3,
        y: 0,
        z: undefined,
        properties: {}
      });
    });
    test('parallel y', () => {
      expect(new DPoint(-3, 3).findLine(new DPoint(3, 3))
        .y(new DPoint(0, 0))).toEqual({
        x: 0,
        y: 3,
        z: undefined,
        properties: {}
      });
    });
    test('other', () => {
      expect(new DPoint(1, 2).findLine(new DPoint(3, 4))
        .y(new DPoint(2, 0))).toEqual({
        x: 2,
        y: 3,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('isParallel', () => {
    test('parallel y', () => {
      expect(new DPoint(3, -3).findLine(new DPoint(3, 3))
        .isParallel).toBe(true);
    });
    test('parallel x', () => {
      expect(new DPoint(-3, 3).findLine(new DPoint(3, 3))
        .isParallel).toBe(true);
    });
    test('other', () => {
      expect(new DPoint(1, 2).findLine(new DPoint(3, 4))
        .isParallel).toBe(false);
    });
  });

  describe('isParallelY', () => {
    test('parallel y', () => {
      expect(new DPoint(3, -3).findLine(new DPoint(3, 3))
        .isParallelY).toBe(true);
    });
    test('parallel x', () => {
      expect(new DPoint(-3, 3).findLine(new DPoint(3, 3))
        .isParallelY).toBe(false);
    });
    test('other', () => {
      expect(new DPoint(1, 2).findLine(new DPoint(3, 4))
        .isParallelY).toBe(false);
    });
  });

  describe('isParallelX', () => {
    test('parallel y', () => {
      expect(new DPoint(3, -3).findLine(new DPoint(3, 3))
        .isParallelX).toBe(false);
    });
    test('parallel x', () => {
      expect(new DPoint(-3, 3).findLine(new DPoint(3, 3))
        .isParallelX).toBe(true);
    });
    test('other', () => {
      expect(new DPoint(1, 2).findLine(new DPoint(3, 4))
        .isParallelX).toBe(false);
    });
  });

  test('points', () => {
    expect(new DPoint(1, 2).findLine(new DPoint(3, 4)).points).toEqual([
      {
        x: 1,
        y: 2,
        z: undefined,
        properties: {}
      },
      {
        x: 3,
        y: 4,
        z: undefined,
        properties: {}
      }
    ]);
  });

  test('toWKT', () => {
    expect(new DPoint(2, 3).findLine(new DPoint(4, 5))
      .toWKT()).toBe('LINESTRING (2 3, 4 5)');
  });

  test('vectorProduct', () => {
    expect(new DLine(2, 3, 4).vectorProduct(new DLine(5, 6, 7))).toEqual({
      a: -3,
      b: 6,
      c: -3,
      p1: {
        x: 0,
        y: 0,
        z: undefined,
        properties: {}
      },
      p2: {
        x: 0,
        y: 0,
        z: undefined,
        properties: {}
      }
    });
  });

  describe('findFi', () => {
    test('parallel y', () => {
      expect(new DPoint(3, -3).findLine(new DPoint(3, 3))
        .findFi(new DLine(0, 1, 0))).toBe(1.5707963267948966);
    });
    test('parallel x', () => {
      expect(new DPoint(-3, 3).findLine(new DPoint(3, 3))
        .findFi(new DLine(0, 1, 0))).toBe(0);
    });
    test('other', () => {
      expect(new DPoint(1, 2).findLine(new DPoint(3, 4))
        .findFi(new DLine(0, 1, 0))).toBe(0.7853981633974484);
    });
  });

  describe('movePoint', () => {
    test('parallel y', () => {
      expect(new DPoint(3, -3).findLine(new DPoint(3, 3))
        .movePoint(new DPoint(3, 3), 1)).toEqual({
        x: 3,
        y: 4,
        z: undefined,
        properties: {}
      });
    });
    test('parallel x', () => {
      expect(new DPoint(-3, 3).findLine(new DPoint(3, 3))
        .movePoint(new DPoint(3, 3), 1)).toEqual({
        x: 4,
        y: 3,
        z: undefined,
        properties: {}
      });
    });
    test('other', () => {
      expect(new DPoint(1, 2).findLine(new DPoint(3, 4))
        .movePoint(new DPoint(3, 4), 2)).toEqual({
        x: 1.5857864376269049,
        y: 2.585786437626905,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('checkFunction', () => {
    beforeAll(() => {
      DGeo.DEBUG = true;
    });

    afterAll(() => {
      DGeo.DEBUG = false;
    });

    describe('findPerpendicular', () => {
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
        expect(new DPoint(1, 2).findLine(new DPoint(1, 4))
          .findPerpendicular(new DPoint(2, 3))
          .getValue()).toEqual([-0, 1, -3]);
        expect(spy).toHaveBeenCalledTimes(5);
        expect(spy.mock.calls).toEqual([
          ['"findLine" -> "this" should be meters!'],
          ['"findLine" -> "p" should be meters!'],
          ['"findPerpendicular" -> "this.p1" should be meters!'],
          ['"findPerpendicular" -> "this.p2" should be meters!'],
          ['"findPerpendicular" -> "p" should be meters!']
        ]);
      });
      test('2', () => {
        expect(new DPoint(10001, 2).findLine(new DPoint(10001, 4))
          .findPerpendicular(new DPoint(10002, 3))
          .getValue()).toEqual([-0, 1, -3]);
        expect(spy)
          .toHaveBeenCalledTimes(0);
      });
    });

    describe('perpendicularDistance', () => {
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
        expect(new DPoint(1, 2).findLine(new DPoint(1, 4))
          .perpendicularDistance(new DPoint(2, 3))).toEqual(1);
        expect(spy).toHaveBeenCalledTimes(10);
        expect(spy.mock.calls).toEqual([
          ['"findLine" -> "this" should be meters!'],
          ['"findLine" -> "p" should be meters!'],
          ['"perpendicularDistance" -> "this.p1" should be meters!'],
          ['"perpendicularDistance" -> "this.p2" should be meters!'],
          ['"perpendicularDistance" -> "p" should be meters!'],
          ['"findPerpendicular" -> "this.p1" should be meters!'],
          ['"findPerpendicular" -> "this.p2" should be meters!'],
          ['"findPerpendicular" -> "p" should be meters!'],
          ['"distance" -> "this" should be meters!'],
          ['"distance" -> "p" should be meters!']
        ]);
      });
      test('2', () => {
        expect(new DPoint(10001, 2).findLine(new DPoint(10001, 4))
          .perpendicularDistance(new DPoint(10002, 3))).toEqual(1);
        expect(spy)
          .toHaveBeenCalledTimes(0);
      });
    });

    describe('getFi', () => {
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

      test('parallel y', () => {
        expect(new DPoint(3, -3).findLine(new DPoint(3, 3))
          .getFi()).toBe(4.71238898038469);
        expect(spy).toHaveBeenCalledTimes(4);
        expect(spy.mock.calls).toEqual([
          ['"findLine" -> "this" should be meters!'],
          ['"findLine" -> "p" should be meters!'],
          ['"getFi" -> "this.p1" should be meters!'],
          ['"getFi" -> "this.p2" should be meters!']
        ]);
      });
      test('parallel x', () => {
        expect(new DPoint(-120, 30).findLine(new DPoint(3000, 30))
          .getFi()).toBe(0);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy.mock.calls).toEqual([
          ['"findLine" -> "this" should be meters!'],
          ['"getFi" -> "this.p1" should be meters!']
        ]);
      });
      test('other', () => {
        expect(new DPoint(100, 200).findLine(new DPoint(300, 400))
          .getFi()).toBe(5.497787143782138);
        expect(spy).toHaveBeenCalledTimes(0);
      });
      test('1', () => {
        expect(new DLine(2, 3, 4)
          .getFi()).toBe(0);
        expect(spy).toHaveBeenCalledTimes(2);
      });
      test('2', () => {
        expect(new DPoint(1, 2).findLine(new DPoint(2, 1))
          .getFi()).toBe(0.7853981633974484);
        expect(spy).toHaveBeenCalledTimes(4);
      });
      test('3', () => {
        expect(new DPoint(300, 200).findLine(new DPoint(200, 200))
          .getFi()).toBe(Math.PI);
        expect(spy).toHaveBeenCalledTimes(0);
      });
      test('4', () => {
        expect(new DPoint(300, 100).findLine(new DPoint(2, 2))
          .getFi()).toBe(2.823874335404245);
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy.mock.calls).toEqual([
          ['"findLine" -> "p" should be meters!'],
          ['"getFi" -> "this.p2" should be meters!']
        ]);
      });
    });
  });

  describe('center', () => {
    test('1', () => {
      expect(new DPoint(0, 0).findLine(new DPoint(10, 10)).center.equal(new DPoint(5, 5)));
    });
    test('2', () => {
      expect(new DPoint(10, 0).findLine(new DPoint(0, 10)).center.equal(new DPoint(5, 5)));
    });
  });
});
