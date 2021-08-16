import {DGeo} from './index';
import {DPoint} from '../src';

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
}

interface CheckFunction {
  checkArgument: (argName: string) => CheckArgument;
}

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
  // eslint-disable-next-line func-names
  checkArgument: function(argName: string) {
    return {
      shouldBeDegree: shouldBeDegree(this, funcName, argName),
      shouldBeMeters: shouldBeMeters(this, funcName, argName)
    };
  }
});
