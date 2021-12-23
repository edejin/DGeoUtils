import {checkFunction, gaussianElimination} from '../src/utils';
import {DGeo, DPoint} from '../src';

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
});
