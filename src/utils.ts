import {DGeo} from './index';
import {DPoint} from './DPoint';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const warn = (...args: any[]): void => {
  if (DGeo.DEBUG) {
    // eslint-disable-next-line no-console
    console.warn(...args);
  }
};

type CheckFunc = (p: DPoint) => CheckFunction;

interface CheckArgument {
  shouldBeDegree: CheckFunc;
  shouldBeMeters: CheckFunc;
  shouldBeInt: CheckFunc;
  shouldBeUInt: CheckFunc;
  shouldBeRadians: CheckFunc;
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
        shouldBeRadians: hook(this)
      };
    }
    return {
      shouldBeDegree: shouldBeDegree(this, funcName, argName),
      shouldBeMeters: shouldBeMeters(this, funcName, argName),
      shouldBeInt: shouldBeInt(this, funcName, argName),
      shouldBeUInt: shouldBeUInt(this, funcName, argName),
      shouldBeRadians: shouldBeRadians(this, funcName, argName)
    };
  }
});

/**
 * @param v
 * @param [fillSymbol=0]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createArray = (v: number, fillSymbol: any = 0): number[] => new Array(v).fill(fillSymbol);

/**
 * @param h
 * @param w
 * @param [fillSymbol=0]
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMatrix = ({h, w}: DPoint, fillSymbol: any = 0): number[][] => createArray(h)
  .map(() => createArray(w, fillSymbol));

const GAUSSIAN_ELIMINATION_MIN = 1e-10;

/**
 * [Gaussian elimination](https://en.wikipedia.org/wiki/Gaussian_elimination)
 * @param matrix
 */
export const gaussianElimination = (matrix: number[][]): number[] => {
  const n = matrix.length;
  const matrixClone = createMatrix(new DPoint(n + 1, n));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n + 1; j++) {
      matrix[i][j] = matrix[i][j] === 0 ? GAUSSIAN_ELIMINATION_MIN : matrix[i][j];
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

// eslint-disable-next-line eqeqeq,@typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
export const isDefAndNotNull = (a: any): boolean => a != undefined;

/**
 * Create dom canvas element with same width and height
 * @param size
 */
function createCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D];

/**
 * Create offscreen canvas with same width and height
 * @param size
 * @param offscreen
 */
function createCanvas(size: number, offscreen: boolean): [OffscreenCanvas, OffscreenCanvasRenderingContext2D];

/**
 * Create canvas by width and height
 * @param w
 * @param h
 */
function createCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D];

/**
 * Create offscreen canvas by width and height
 * @param w
 * @param h
 * @param offscreen
 */
function createCanvas(w: number, h: number, offscreen: boolean): [OffscreenCanvas, OffscreenCanvasRenderingContext2D];

/**
 * Create dom canvas element by `DPoint` size
 * @param size
 */
function createCanvas(size: DPoint): [HTMLCanvasElement, CanvasRenderingContext2D];

/**
 * Create offscreen canvas by `DPoint` size
 * @param size
 * @param offscreen
 */
function createCanvas(size: DPoint, offscreen: boolean): [OffscreenCanvas, OffscreenCanvasRenderingContext2D];

// eslint-disable-next-line func-style
function createCanvas(
  a: DPoint | number,
  b?: number | boolean,
  c?: boolean
): [HTMLCanvasElement | OffscreenCanvas, CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D] {
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    offscreen ? new OffscreenCanvas(w, h) : (createCanvas.document ?? document).createElement('canvas');
  if (!offscreen) {
    canvas.width = w;
    canvas.height = h;
  }
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

export {
  createCanvas
};
