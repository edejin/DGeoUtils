import {checkFunction} from '../src/utils';
import {DGeo, DPoint, gaussianElimination, createArray, createMatrix, isDefAndNotNull} from '../src';

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
});
