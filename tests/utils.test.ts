import {checkFunction} from '../src/utils';
import {
  DGeo,
  DPoint,
  gaussianElimination,
  createArray,
  createMatrix,
  isDefAndNotNull,
  cartesianProduct,
  getCombinations
} from '../src';

describe('utils', () => {
  describe('shouldBeInt', () => {
    beforeAll(() => {
      jest.spyOn(global.console, 'warn').mockImplementation();
      DGeo.DEBUG = true;
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    afterAll(() => {
      DGeo.DEBUG = false;
    });
    test('1', () => {
      const p = new DPoint(1.1, 2);
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldBeInt(p);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenLastCalledWith('"function name" -> "variable name" should be Int!');
    });
    test('2', () => {
      const p = new DPoint(1.1, 2.9);
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldBeInt(p);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenLastCalledWith('"function name" -> "variable name" should be Int!');
    });
    test('3', () => {
      const p = new DPoint(1, 2);
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldBeInt(p);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(0);
    });
    test('4', () => {
      const p = 3;
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldExist(p);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(0);
    });
    test('5', () => {
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldExist(undefined);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
    });
  });
  describe('shouldBeUInt', () => {
    beforeAll(() => {
      jest.spyOn(global.console, 'warn').mockImplementation();
      DGeo.DEBUG = true;
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    afterAll(() => {
      DGeo.DEBUG = false;
    });
    test('1', () => {
      const p = new DPoint(1.1, -2);
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldBeUInt(p);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenLastCalledWith('"function name" -> "variable name" should be UInt!');
    });
    test('2', () => {
      const p = new DPoint(1.1, 2.9);
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldBeUInt(p);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenLastCalledWith('"function name" -> "variable name" should be UInt!');
    });
    test('3', () => {
      const p = new DPoint(1, 2);
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldBeUInt(p);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(0);
    });
    test('4', () => {
      const p = new DPoint(1, -2);
      checkFunction('function name')
        .checkArgument('variable name')
        .shouldBeUInt(p);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenLastCalledWith('"function name" -> "variable name" should be UInt!');
    });
  });

  describe('gaussianElimination', () => {
    test('1', () => {
      expect(gaussianElimination([
        [2, 1, -1, 8],
        [-3, -1, 2, -11],
        [-2, 1, 2, -3]
      ])).toEqual([2, 3, -1]);
    });
    test('2', () => {
      expect(gaussianElimination([
        [1, 2, 1, -54],
        [2, 9, -5, -32],
        [0, 0, 1, 1]
      ])).toEqual([
        -88.20000002720799,
        16.600000010023997,
        1.00000000716
      ]);
    });
  });
  describe('createArray', () => {
    test('1', () => {
      expect(createArray(2, 7)).toEqual([7, 7]);
    });
  });
  describe('createMatrix', () => {
    test('1', () => {
      expect(createMatrix(new DPoint(2, 3))).toEqual([
        [0, 0],
        [0, 0],
        [0, 0]
      ]);
    });
  });
  describe('isDefAndNotNull', () => {
    expect(isDefAndNotNull(null)).toBe(false);
    expect(isDefAndNotNull(undefined)).toBe(false);
    expect(isDefAndNotNull(1)).toBe(true);
  });

  describe('cartesianProduct', () => {
    test('1', () => {
      expect(cartesianProduct([1, 2, 3], [10, 20, 30], [100, 200])).toEqual([
        [1, 10, 100],
        [1, 10, 200],
        [1, 20, 100],
        [1, 20, 200],
        [1, 30, 100],
        [1, 30, 200],
        [2, 10, 100],
        [2, 10, 200],
        [2, 20, 100],
        [2, 20, 200],
        [2, 30, 100],
        [2, 30, 200],
        [3, 10, 100],
        [3, 10, 200],
        [3, 20, 100],
        [3, 20, 200],
        [3, 30, 100],
        [3, 30, 200]
      ]);
    });
    test('2', () => {
      expect(cartesianProduct([1, 2, 3], [10, 20, 30], [100, 200], [0.1, 0.2])).toEqual([
        [1, 10, 100, 0.1],
        [1, 10, 100, 0.2],
        [1, 10, 200, 0.1],
        [1, 10, 200, 0.2],
        [1, 20, 100, 0.1],
        [1, 20, 100, 0.2],
        [1, 20, 200, 0.1],
        [1, 20, 200, 0.2],
        [1, 30, 100, 0.1],
        [1, 30, 100, 0.2],
        [1, 30, 200, 0.1],
        [1, 30, 200, 0.2],
        [2, 10, 100, 0.1],
        [2, 10, 100, 0.2],
        [2, 10, 200, 0.1],
        [2, 10, 200, 0.2],
        [2, 20, 100, 0.1],
        [2, 20, 100, 0.2],
        [2, 20, 200, 0.1],
        [2, 20, 200, 0.2],
        [2, 30, 100, 0.1],
        [2, 30, 100, 0.2],
        [2, 30, 200, 0.1],
        [2, 30, 200, 0.2],
        [3, 10, 100, 0.1],
        [3, 10, 100, 0.2],
        [3, 10, 200, 0.1],
        [3, 10, 200, 0.2],
        [3, 20, 100, 0.1],
        [3, 20, 100, 0.2],
        [3, 20, 200, 0.1],
        [3, 20, 200, 0.2],
        [3, 30, 100, 0.1],
        [3, 30, 100, 0.2],
        [3, 30, 200, 0.1],
        [3, 30, 200, 0.2]
      ]);
    });
    test('3', () => {
      expect(cartesianProduct([1, 2, 3], [10, 20, 30])).toEqual([
        [1, 10],
        [1, 20],
        [1, 30],
        [2, 10],
        [2, 20],
        [2, 30],
        [3, 10],
        [3, 20],
        [3, 30]
      ]);
    });
  });

  describe('getCombinations', () => {
    test('1', () => {
      expect(getCombinations([
        ['w', 'e'],
        ['d'],
        ['c', 'v', 'b']
      ])).toEqual([
        [
          'w',
          'd',
          'c'
        ],
        [
          'e',
          'd',
          'c'
        ],
        [
          'w',
          'd',
          'v'
        ],
        [
          'e',
          'd',
          'v'
        ],
        [
          'w',
          'd',
          'b'
        ],
        [
          'e',
          'd',
          'b'
        ]
      ]);
    });
  });
});
