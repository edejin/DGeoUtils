import {DPoint} from './DPoint';

export const DGeo = {
  DEBUG: false
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const warn = (...args: any[]): void => {
  if (DGeo.DEBUG) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
};

// eslint-disable-next-line eqeqeq,@typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const isDefAndNotNull = (a: any): boolean => a != undefined;

type CheckFunc = (p: DPoint) => CheckFunction;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CheckFunc2 = (p: any) => CheckFunction;

interface CheckArgument {
  shouldBeDegree: CheckFunc;
  shouldBeMeters: CheckFunc;
  shouldBeInt: CheckFunc;
  shouldBeUInt: CheckFunc;
  shouldBeRadians: CheckFunc;
  shouldExist: CheckFunc2;
}

interface CheckFunction {
  checkArgument: (argName: string) => CheckArgument;
}

const hook = (scope: CheckFunction): CheckFunc => (): CheckFunction => scope;

const shouldBeInt = (
  scope: CheckFunction,
  funcName: string,
  argName: string
): CheckFunc => (p: DPoint): CheckFunction => {
  if (!p.clone().round()
    .equal(p)) {
    warn(`"${funcName}" -> "${argName}" should be Int!`);
  }
  return scope;
};

const shouldBeUInt = (
  scope: CheckFunction,
  funcName: string,
  argName: string
): CheckFunc => (p: DPoint): CheckFunction => {
  if (!p.clone().round()
    .equal(p) || !p.gtOrEqual(DPoint.zero())) {
    warn(`"${funcName}" -> "${argName}" should be UInt!`);
  }
  return scope;
};

const shouldBeDegree = (
  scope: CheckFunction,
  funcName: string,
  argName: string
): CheckFunc => (p: DPoint): CheckFunction => {
  if (!p.likeWorldGeodeticSystem) {
    warn(`"${funcName}" -> "${argName}" should be degree!`);
  }
  return scope;
};

const shouldBeRadians = (
  scope: CheckFunction,
  funcName: string,
  argName: string
): CheckFunc => (p: DPoint): CheckFunction => {
  if (!p.likeRadians) {
    warn(`"${funcName}" -> "${argName}" should be radians!`);
  }
  return scope;
};

const shouldExist = (
  scope: CheckFunction,
  funcName: string,
  argName: string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): CheckFunc => (p: any): CheckFunction => {
  if (!isDefAndNotNull(p)) {
    warn(`"${funcName}" -> "${argName}" should exist!`);
  }
  return scope;
};

const shouldBeMeters = (
  scope: CheckFunction,
  funcName: string,
  argName: string
): CheckFunc => (p: DPoint): CheckFunction => {
  if (!p.likePseudoMercator) {
    warn(`"${funcName}" -> "${argName}" should be meters!`);
  }
  return scope;
};

export const checkFunction = (funcName: string): CheckFunction => ({
  // eslint-disable-next-line func-names, object-shorthand
  checkArgument: function(argName: string) {
    if (!DGeo.DEBUG) {
      return {
        shouldBeDegree: hook(this),
        shouldBeMeters: hook(this),
        shouldBeInt: hook(this),
        shouldBeUInt: hook(this),
        shouldBeRadians: hook(this),
        shouldExist: hook(this)
      };
    }
    return {
      shouldBeDegree: shouldBeDegree(this, funcName, argName),
      shouldBeMeters: shouldBeMeters(this, funcName, argName),
      shouldBeInt: shouldBeInt(this, funcName, argName),
      shouldBeUInt: shouldBeUInt(this, funcName, argName),
      shouldBeRadians: shouldBeRadians(this, funcName, argName),
      shouldExist: shouldExist(this, funcName, argName)
    };
  }
});

type ArrayFillFunction<T> = (index: number) => T;

/**
 * @param v
 * @param [fillSymbol=0]
 */
export const createArray = <T = number>(v: number, fillSymbol?: T | ArrayFillFunction<T>): T[] => {
  if (typeof fillSymbol === 'function') {
    return new Array(v).fill(false)
      .map((_, i) => (fillSymbol as ArrayFillFunction<T>)(i));
  }
  return new Array(v).fill(fillSymbol ?? 0);
};

type MatrixFillFunction<T> = (x: number, y: number) => T;

/**
 * @param h
 * @param w
 * @param [fillSymbol=0]
 */
export const createMatrix = <T>({h, w}: DPoint, fillSymbol?: T | MatrixFillFunction<T>): T[][] => {
  if (typeof fillSymbol === 'function') {
    return createArray(h)
      .map((_, y) => createArray<T>(w, (x) => (fillSymbol as MatrixFillFunction<T>)(x, y)));
  }
  return createArray(h)
    .map(() => createArray<T>(w, fillSymbol));
};

/**
 * [Gaussian elimination](https://en.wikipedia.org/wiki/Gaussian_elimination)
 * @param matrix
 */
export const gaussianElimination: {
  (matrix: number[][]): number[],

  /**
   * Min value if matrix contain 0.
   * @default 1e-10
   */
  MIN: number;
} = (matrix: number[][]): number[] => {
  const n = matrix.length;
  const matrixClone = createMatrix<number>(new DPoint(n + 1, n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n + 1; j++) {
      matrix[i][j] = matrix[i][j] === 0 ? gaussianElimination.MIN : matrix[i][j];
      matrixClone[i][j] = matrix[i][j];
    }
  }

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n + 1; i++) {
      matrixClone[k][i] /= matrix[k][k];
    }
    for (let i = k + 1; i < n; i++) {
      const K = matrixClone[i][k] / matrixClone[k][k];
      for (let j = 0; j < n + 1; j++) {
        matrixClone[i][j] -= matrixClone[k][j] * K;
      }
    }
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n + 1; j++) {
        matrix[i][j] = matrixClone[i][j];
      }
    }
  }

  for (let k = n - 1; k > -1; k--) {
    for (let i = n; i > -1; i--) {
      matrixClone[k][i] /= matrix[k][k];
    }
    for (let i = k - 1; i > -1; i--) {
      const K = matrixClone[i][k] / matrixClone[k][k];
      for (let j = n; j > -1; j--) {
        matrixClone[i][j] -= matrixClone[k][j] * K;
      }
    }
  }

  const answer = createArray(n);
  for (let i = 0; i < n; i++) {
    answer[i] = matrixClone[i][n];
  }

  return answer;
};
gaussianElimination.MIN = 1e-10;

export type True = true;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const createCanvas: {

  /**
   * Create dom canvas element with same width and height
   * @param size
   */
  (size: number): [HTMLCanvasElement, CanvasRenderingContext2D];

  /**
   * Create offscreen canvas with same width and height
   * @param size
   * @param offscreen
   */
  (size: number, offscreen: True): [OffscreenCanvas, OffscreenCanvasRenderingContext2D];

  /**
   * Create canvas by width and height
   * @param w
   * @param h
   */
  (w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D];

  /**
   * Create offscreen canvas by width and height
   * @param w
   * @param h
   * @param offscreen
   */
  (w: number, h: number, offscreen: True): [OffscreenCanvas, OffscreenCanvasRenderingContext2D];

  /**
   * Create dom canvas element by `DPoint` size
   * @param size
   */
  (size: DPoint): [HTMLCanvasElement, CanvasRenderingContext2D];

  /**
   * Create offscreen canvas by `DPoint` size
   * @param size
   * @param offscreen
   */
  (size: DPoint, offscreen: True): [OffscreenCanvas, OffscreenCanvasRenderingContext2D];

  /**
   * Mock document object for tests
   */
  document?: Document;
} = (
  a: DPoint | number,
  b?: number | boolean,
  c?: boolean
): [HTMLCanvasElement | OffscreenCanvas, CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D] => {
  let w = 0;
  let h = 0;
  let offscreen = false;
  if (a instanceof DPoint) {
    const {x, y} = a;
    w = x;
    h = y;
  } else {
    w = a;
    h = a;
  }
  if (typeof b === 'boolean') {
    offscreen = b;
  } else if (typeof b === 'number') {
    h = b;
  }
  if (typeof c === 'boolean') {
    offscreen = c;
  }
  const canvas: HTMLCanvasElement | OffscreenCanvas =
    offscreen ? new OffscreenCanvas(w, h) : (createCanvas.document ?? document).createElement('canvas');
  if (!offscreen) {
    canvas.width = w;
    canvas.height = h;
  }
  return [canvas, canvas.getContext('2d')!];
};

/** @ignore */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const f = (a: any, b: any) => [].concat(...a.map((c: any) => b.map((d: any) => [].concat(c, d))));

/**
 * [Cartesian product](https://en.wikipedia.org/wiki/Cartesian_product)
 */
export const cartesianProduct: {

  /**
   * @param a
   * @param b
   */
  <T>(a: T[], ...b: T[][]): T[][];

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
} = <T>(a: T[], b: T[], ...c: T[][]): T[][] => b ? cartesianProduct(f(a, b), ...c) : a;

/**
 * Get all available combinations
 * @param arr
 */
export const getCombinations = <T>(arr: T[][]): T[][] => {
  if (arr.length === 1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return arr[0];
  }
  const ans: T[][] = [];
  const otherCases = getCombinations(arr.slice(1));
  for (let i = 0; i < otherCases.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      ans.push([arr[0][j], ...otherCases[i]]);
    }
  }
  return ans;
};

export const div = (a: number, b: number): number => Math.floor(a / b);

