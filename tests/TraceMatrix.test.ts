/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DPoint, TraceMatrix, TraceMatrixValues} from '../src';

const data = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 0, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
].reverse();

const data2 = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 0, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
].reverse();

const data3 = [
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 1, 1, 0, 0, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
].reverse();

const data4 = [
  [1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1]
].reverse();

describe('TraceMatrix', () => {
  const t = new TraceMatrix(
    new DPoint(10, 10),
    ({x, y}: DPoint) => data[y][x] ? TraceMatrixValues.t : TraceMatrixValues.f
  );
  const t2 = new TraceMatrix(
    new DPoint(10, 10),
    ({x, y}: DPoint) => data2[y][x] ? TraceMatrixValues.t : TraceMatrixValues.f
  );
  const t2Negative = new TraceMatrix(
    new DPoint(10, 10),
    ({x, y}: DPoint) => data2[y][x] ? TraceMatrixValues.f : TraceMatrixValues.t
  );

  const t3 = new TraceMatrix(
    new DPoint(10, 10),
    ({x, y}: DPoint) => data3[y][x] ? TraceMatrixValues.t : TraceMatrixValues.f
  );
  const t3Negative = new TraceMatrix(
    new DPoint(10, 10),
    ({x, y}: DPoint) => data3[y][x] ? TraceMatrixValues.f : TraceMatrixValues.t
  );

  const t4 = new TraceMatrix(
    new DPoint(5, 3),
    ({x, y}: DPoint) => data4[y][x] ? TraceMatrixValues.t : TraceMatrixValues.f
  );

  test('1', () => {
    expect(t.fullMatrixTrace().map((p) => p.toGeoJSONFeature())).toMatchSnapshot();
  });

  test('2', () => {
    expect(t2.fullMatrixTrace().map((p) => p.toGeoJSONFeature())).toMatchSnapshot();
  });

  test('2 negative', () => {
    expect(t2Negative.fullMatrixTrace().map((p) => p.toGeoJSONFeature())).toMatchSnapshot();
  });

  test('3', () => {
    expect(t3.fullMatrixTrace().map((p) => p.toGeoJSONFeature())).toMatchSnapshot();
  });

  test('3 negative', () => {
    expect(t3Negative.fullMatrixTrace().map((p) => p.toGeoJSONFeature())).toMatchSnapshot();
  });

  test('4', () => {
    expect(t4.fullMatrixTrace().map((p) => p.toGeoJSONFeature())).toMatchSnapshot();
  });
});
