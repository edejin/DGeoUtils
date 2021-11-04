import {checkFunction} from '../src/utils';
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
});
