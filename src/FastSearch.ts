import {DPoint} from './DPoint';

export class FastSearch {
  private searchStore: Record<number, Record<number, Record<number | string, boolean>>> = {};

  add(points: DPoint[]): void {
    for (const {x, y, z} of points) {
      if (!this.searchStore[x]) {
        this.searchStore[x] = {};
      }
      if (!this.searchStore[x][y]) {
        this.searchStore[x][y] = {};
      }
      this.searchStore[x][y][z || 'undefined'] = true;
    }
  }

  find({x, y, z}: DPoint): boolean {
    if (!this.searchStore[x]) {
      return false;
    }
    if (!this.searchStore[x][y]) {
      return false;
    }
    return this.searchStore[x][y][z || 'undefined'];
  }
}
