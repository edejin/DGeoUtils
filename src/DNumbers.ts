import {DEGREE_TO_PI, DOUBLE_PI_IN_DEGREE, PI_IN_DEGREE, PI_TO_DEGREE} from './DPoint';

const delta = 0.001;

export class DNumbers {
  static like(v: number, s: number, d: number = delta): boolean {
    return Math.abs(v - s) < d;
  }

  static likeZero(v: number): boolean {
    return DNumbers.like(v, 0);
  }

  static like2PI(v: number): boolean {
    return DNumbers.like(DNumbers.rad2Deg(v), DOUBLE_PI_IN_DEGREE);
  }

  static likePI(v: number): boolean {
    return DNumbers.like(DNumbers.rad2Deg(v), PI_IN_DEGREE);
  }

  static rad2Deg(v: number): number {
    return v * DEGREE_TO_PI;
  }

  static deg2Rad(v: number): number {
    return v * PI_TO_DEGREE;
  }
}
