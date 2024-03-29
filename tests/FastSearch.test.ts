/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DPoint, FastSearch} from '../src';
import 'jest-canvas-mock';

describe('FastSearch', () => {
  test('1', () => {
    const t = new FastSearch();
    expect(t.find(new DPoint(10, 10))).toBe(false);
    t.add([new DPoint(10, 10), new DPoint(10, 10, 37)]);
    expect(t.find(new DPoint(10, 20))).toBe(false);
    expect(t.find(new DPoint(10, 20, 30))).toBe(false);
    expect(t.find(new DPoint(10, 10))).toBe(true);
    expect(t.find(new DPoint(10, 10, 37))).toBe(true);
  });
});
