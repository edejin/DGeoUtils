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
];

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
];

describe('TraceMatrix', () => {
  const t = new TraceMatrix(
    new DPoint(10, 10),
    ({x, y}: DPoint) => data[y][x] ? TraceMatrixValues.t : TraceMatrixValues.f
  );
  const t2 = new TraceMatrix(
    new DPoint(10, 10),
    ({x, y}: DPoint) => data2[y][x] ? TraceMatrixValues.t : TraceMatrixValues.f
  );

  test('1', () => {
    expect(t.fullMatrixTrace()).toEqual([
      {
        holes: [],
        pPoints: [
          {
            properties: {},
            x: 1,
            y: 2,
            z: undefined
          }, {
            properties: {},
            x: 2,
            y: 2,
            z: undefined
          }, {
            properties: {},
            x: 2,
            y: 4,
            z: undefined
          }, {
            properties: {},
            x: 3,
            y: 5,
            z: undefined
          }, {
            properties: {},
            x: 6,
            y: 1,
            z: undefined
          }, {
            properties: {},
            x: 6,
            y: 5,
            z: undefined
          }, {
            properties: {},
            x: 5,
            y: 6,
            z: undefined
          }, {
            properties: {},
            x: 3,
            y: 6,
            z: undefined
          }, {
            properties: {},
            x: 2,
            y: 8,
            z: undefined
          }, {
            properties: {},
            x: 1,
            y: 8,
            z: undefined
          }, {
            properties: {},
            x: 1,
            y: 2,
            z: undefined
          }
        ],
        properties: {},
        searchStore: {}
      }
    ]);
  });

  test('2', () => {
    expect(t2.fullMatrixTrace().map((l) => l.toWKT())).toEqual([
      'POLYGON ((1 2, 2 2, 2 8, 1 8, 1 2))',
      'POLYGON ((4 3, 6 1, 6 5, 5 6, 4 6, 4 3))'
    ]);
  });
});
