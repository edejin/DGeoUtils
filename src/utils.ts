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

export const createArray = (v: number): number[] => new Array(v).fill(0);
