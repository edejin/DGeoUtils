import data from './assets/interpolationInputData.json';
import {DPoint, DPolygon, TraceMatrix, TraceMatrixValues} from '../src';
import {InterpolationMatrix} from '../src/InterpolationMatrix';
import 'jest-canvas-mock';

const inputPoints: DPoint[] = data.map((r) => DPoint.parse(r).setProperties({
  ...r
})
  .scale(10));

const bbox: DPolygon = DPolygon.parse([
  [
    0,
    0
  ],
  [
    11,
    11
  ]
]);

describe('InterpolationMatrix.test', () => {
  test('one key [z]', () => {
    const c = new InterpolationMatrix(
      bbox,
      1,
      'z'
    );
    c.setKnownPoints(inputPoints)
      .calculate();
    const features = c.allCellsClone.map((p) => p.setProperties((t: DPolygon) => {
      const v = Math.floor(t.properties.z * 255);
      return {
        ...t.properties,
        fill: `#${v.toString(16).padStart(2, '0')}${(255 - v).toString(16).padStart(2, '0')}00`
      };
    }).toGeoJSONFeature());
    expect({
      type: 'FeatureCollection',
      features
    }).toMatchSnapshot();
  });
  test('several keys [z, g]', () => {
    const c = new InterpolationMatrix(
      bbox,
      1,
      ['z', 'g']
    );
    c.setKnownPoints(inputPoints)
      .calculate();
    const features = c.allCellsClone.map((p) => p.setProperties((t: DPolygon) => {
      const v = Math.floor(t.properties.g * 255);
      return {
        ...t.properties,
        fill: `#${v.toString(16).padStart(2, '0')}${(255 - v).toString(16).padStart(2, '0')}00`
      };
    }).toGeoJSONFeature());
    expect({
      type: 'FeatureCollection',
      features
    }).toMatchSnapshot();
    expect(c.minPoint).toEqual({
      properties: {
        g: 0,
        z: 0
      },
      x: 0,
      y: 0
    });
    expect(c.maxPoint).toEqual({
      properties: {
        g: 1,
        z: 1
      },
      x: 11,
      y: 11
    });
  });
  test('one key [z] with trace', () => {
    const c = new InterpolationMatrix(
      bbox,
      1,
      'z'
    );
    c.setKnownPoints(new DPolygon([...inputPoints]))
      .calculate();
    const w = new TraceMatrix(new DPoint(10, 10), (p: DPoint) => {
      const v = c.getCellValue(p, 'z');
      return (v > 0.3 && v < 0.7) ? TraceMatrixValues.t : TraceMatrixValues.f;
    });
    w.approximation = false;
    const features = w.fullMatrixTrace().map((p) => p.toGeoJSONFeature());
    expect({
      type: 'FeatureCollection',
      features
    }).toMatchSnapshot();
    expect(c.getCellValue(new DPoint(1, 1))).toEqual({
      x: 1,
      y: 1,
      z: 0.05178774120317821
    });
    expect(c.getCellValue(new DPoint(10, 10))).toEqual({
      x: 10,
      y: 10,
      z: 0.5
    });
    expect(c.getCellValue(new DPoint(1, 1), ['z'])).toEqual({
      z: 0.05178774120317821
    });
    expect(c.size.toString()).toEqual('11 11');
    expect(c.getCellData).toMatchSnapshot();
  });
});
