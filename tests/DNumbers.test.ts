/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DNumbers} from '../src';

describe('DNumbers', () => {
  describe('like', () => {
    test('1', () => {
      expect(DNumbers.like(0.99, 1.001, 0.02)).toBe(true);
    });
    test('2', () => {
      expect(DNumbers.like(0.99, 1.001, 0.01)).toBe(false);
    });
  });

  describe('likeZero', () => {
    test('1', () => {
      expect(DNumbers.likeZero(0.0001)).toBe(true);
    });
    test('2', () => {
      expect(DNumbers.likeZero(1)).toBe(false);
    });
  });

  test('rad2Deg', () => {
    expect(DNumbers.rad2Deg(Math.PI)).toBe(180);
  });

  test('deg2Rad', () => {
    expect(DNumbers.deg2Rad(180)).toBe(Math.PI);
  });

  describe('likePI', () => {
    test('1', () => {
      expect(DNumbers.likePI(Math.PI - 0.0000001)).toBe(true);
    });
    test('2', () => {
      expect(DNumbers.likePI(Math.PI - 1)).toBe(false);
    });
  });

  describe('like2PI', () => {
    test('1', () => {
      expect(DNumbers.like2PI(2 * Math.PI - 0.0000001)).toBe(true);
    });
    test('2', () => {
      expect(DNumbers.like2PI(2 * Math.PI - 1)).toBe(false);
    });
  });
});
