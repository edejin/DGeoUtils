/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DCircle, DGeo, DPoint} from '../src';
import MockInstance = jest.MockInstance;

describe('DCircle', () => {
  test('constructor', () => {
    const t = new DCircle(new DPoint(3, 5), 20);
    expect(t.r).toBe(20);
    expect(t.center.equal(new DPoint(3, 5))).toBe(true);
  });

  test('constructor2', () => {
    const t = new DCircle();
    expect(t.r).toBe(0);
    expect(t.center.equal(DPoint.zero())).toBe(true);
  });

  test('toString', () => {
    const t = new DCircle(new DPoint(3, 5), 20);
    expect(t.toString()).toBe('(3 5, 20)');
  });

  test('getValue', () => {
    const t = new DCircle(new DPoint(3, 5), 20);
    expect(t.getValue()).toEqual({
      center: new DPoint(3, 5),
      r: 20
    });
  });

  test('clone', () => {
    const t1 = new DCircle(new DPoint(3, 5), 20);
    const t2 = t1.clone();
    expect(t1.toString()).toBe('(3 5, 20)');
    expect(t2.toString()).toBe('(3 5, 20)');
    t1.center = new DPoint(4, 5);
    t1.r = 30;
    t2.center = new DPoint(6, 7);
    t2.r = 35;
    expect(t1.toString()).toBe('(4 5, 30)');
    expect(t2.toString()).toBe('(6 7, 35)');
  });

  describe('findPoints', () => {
    test('none', () => {
      expect(new DCircle(new DPoint(0, 0), 10).findPoints(new DCircle(new DPoint(30, 0), 10))).toEqual([]);
    });
    test('one', () => {
      expect(new DCircle(new DPoint(0, 0), 10)
        .findPoints(new DCircle(new DPoint(20, 0), 10))).toEqual([new DPoint(10, 0)]);
    });
    test('two withs same y', () => {
      expect(new DCircle(new DPoint(0, 4), 13)
        .findPoints(new DCircle(new DPoint(20, 4), 13)))
        .toEqual([new DPoint(10, -4.306623862918075), new DPoint(10, 12.306623862918075)]);
    });
    test('two with same x', () => {
      expect(new DCircle(new DPoint(3, 0), 13)
        .findPoints(new DCircle(new DPoint(3, 20), 13)))
        .toEqual([
          new DPoint(11.306623862918075, 10),
          new DPoint(-5.306623862918075, 10)
        ]);
    });
    test('two', () => {
      expect(new DCircle(new DPoint(0, 2), 13)
        .findPoints(new DCircle(new DPoint(20, 1), 13)))
        .toEqual([new DPoint(9.585939154181538, -6.781216916369241), new DPoint(10.414060845818462, 9.78121691636924)]);
    });
    test('all', () => {
      expect(new DCircle(new DPoint(0, 0), 11)
        .findPoints(new DCircle(new DPoint(0, 0), 11))).toBe(Infinity);
    });
  });

  describe('findPolygonInside', () => {
    test('1', () => {
      const t = new DCircle(new DPoint(20, 30), 7).findPolygonInside();
      expect(t.toString()).toBe('(' +
        '27 30, ' +
        '26.966293086705377 30.686119982306924, ' +
        '26.86549696282261 31.3656322541129, ' +
        '26.698582350125463 32.031992740781234, ' +
        '26.467156727579006 32.678784026555626, ' +
        '26.173448850438486 33.29977715778198, ' +
        '25.820287286117818 33.888991631137216, ' +
        '25.411073173539158 34.440752989145516, ' +
        '24.949747468305834 34.94974746830583, ' +
        '24.44075298914552 35.41107317353916, ' +
        '23.888991631137216 35.82028728611782, ' +
        '23.299777157781985 36.17344885043848, ' +
        '22.67878402655563 36.46715672757901, ' +
        '22.031992740781234 36.69858235012546, ' +
        '21.365632254112896 36.86549696282261, ' +
        '20.686119982306924 36.96629308670538, ' +
        '19.999999999999996 37, ' +
        '19.313880017693073 36.96629308670538, ' +
        '18.634367745887097 36.86549696282261, ' +
        '17.96800725921876 36.69858235012546, ' +
        '17.321215973444367 36.467156727579, ' +
        '16.70022284221801 36.17344885043848, ' +
        '16.111008368862777 35.82028728611781, ' +
        '15.559247010854476 35.41107317353915, ' +
        '15.050252531694161 34.94974746830583, ' +
        '14.588926826460835 34.44075298914551, ' +
        '14.179712713882179 33.88899163113721, ' +
        '13.82655114956151 33.299777157781975, ' +
        '13.532843272420989 32.67878402655562, ' +
        '13.301417649874534 32.03199274078123, ' +
        '13.134503037177385 31.365632254112885, ' +
        '13.03370691329462 30.68611998230691, ' +
        '13 29.999999999999986, ' +
        '13.033706913294623 29.31388001769306, ' +
        '13.13450303717739 28.634367745887086, ' +
        '13.301417649874542 27.968007259218748, ' +
        '13.532843272421001 27.321215973444357, ' +
        '13.826551149561524 26.700222842218, ' +
        '14.179712713882195 26.11100836886277, ' +
        '14.588926826460854 25.559247010854467, ' +
        '15.05025253169418 25.050252531694152, ' +
        '15.559247010854499 24.588926826460828, ' +
        '16.1110083688628 24.17971271388217, ' +
        '16.700222842218032 23.826551149561507, ' +
        '17.321215973444385 23.532843272420987, ' +
        '17.968007259218776 23.301417649874534, ' +
        '18.63436774588711 23.134503037177385, ' +
        '19.313880017693084 23.033706913294623, ' +
        '20.000000000000004 23, ' +
        '20.686119982306927 23.033706913294623, ' +
        '21.3656322541129 23.13450303717739, ' +
        '22.031992740781234 23.301417649874537, ' +
        '22.678784026555626 23.53284327242099, ' +
        '23.29977715778198 23.82655114956151, ' +
        '23.88899163113721 24.17971271388218, ' +
        '24.44075298914551 24.588926826460835, ' +
        '24.949747468305823 25.050252531694156, ' +
        '25.411073173539148 25.55924701085447, ' +
        '25.820287286117807 26.11100836886277, ' +
        '26.173448850438476 26.700222842217997, ' +
        '26.467156727579 27.32121597344435, ' +
        '26.698582350125456 27.968007259218737, ' +
        '26.865496962822608 28.634367745887076, ' +
        '26.966293086705377 29.313880017693045, ' +
        '27 30' +
        ')');
    });
    test('2', () => {
      const t = new DCircle(new DPoint(20, 30), 7).findPolygonInside(8, 1 / 6 * Math.PI, 5 / 6 * Math.PI);
      expect(t.toString()).toBe('(' +
        '26.062177826491073 33.5, ' +
        '21.811733315717646 36.761480784023476, ' +
        '13.937822173508929 33.5' +
        ')');
    });
    test('3', () => {
      const t = new DCircle(DPoint.zero(), 10).findPolygonInside(64, 0, Math.PI / 2);
      expect(t.toString()).toBe('(' +
        '10 0, ' +
        '9.95184726672197 0.980171403295606, ' +
        '9.807852804032304 1.9509032201612824, ' +
        '9.569403357322088 2.902846772544623, ' +
        '9.238795325112868 3.826834323650898, ' +
        '8.819212643483551 4.7139673682599765, ' +
        '8.314696123025453 5.555702330196022, ' +
        '7.73010453362737 6.343932841636455, ' +
        '7.0710678118654755 7.071067811865475, ' +
        '6.343932841636455 7.730104533627369, ' +
        '5.555702330196023 8.314696123025453, ' +
        '4.713967368259978 8.81921264348355, ' +
        '3.8268343236508984 9.238795325112868, ' +
        '2.902846772544623 9.56940335732209, ' +
        '1.950903220161281 9.807852804032304, ' +
        '6.123233995736766e-16 10' +
        ')');
    });
  });

  describe('findPolygonInsideOnSphere', () => {
    test('1', () => {
      const t = new DCircle(new DPoint(0, 0), 7000).findPolygonInsideOnSphere();
      expect(t.toGeoJSONFeature()).toMatchSnapshot();
    });
    test('2', () => {
      const t = new DCircle(new DPoint(45, 45), 7000).findPolygonInsideOnSphere();
      expect(t.toGeoJSONFeature()).toMatchSnapshot();
    });
    test('3', () => {
      const t = new DCircle(new DPoint(45, 45), 7000).findPolygonInsideOnSphere(64, 0, Math.PI / 2);
      expect(t.toGeoJSONFeature()).toMatchSnapshot();
    });
  });

  describe('checkFunction', () => {
    beforeAll(() => {
      DGeo.DEBUG = true;
    });

    afterAll(() => {
      DGeo.DEBUG = false;
    });

    describe('findPolygonInsideOnSphere', () => {
      // eslint-disable-next-line init-declarations
      let spy: MockInstance<any, any>;
      beforeEach(() => {
        spy = jest.spyOn(console, 'warn').mockImplementation();
      });

      afterEach(() => {
        if (spy) {
          spy.mockRestore();
        }
      });

      test('1', () => {
        expect(new DCircle(new DPoint(1, 10), 2).findPolygonInsideOnSphere()
          .toWKT()).toMatchSnapshot();
        expect(spy).toHaveBeenCalledTimes(7812);
      });
      test('2', () => {
        expect(new DCircle(new DPoint(1, 10010), 2).findPolygonInsideOnSphere()
          .toWKT()).toMatchInlineSnapshot('"POLYGON ((' +
          '1 -69.99998203369482, ' +
          '1.0000051488324002 -69.99998212020742, ' +
          '1.0000102480788564 -69.99998237891208, ' +
          '1.000015248630961 -69.99998280731727, ' +
          '1.0000201023307755 -69.99998340129729, ' +
          '1.0000247624346164 -69.99998415513177, ' +
          '1.0000291840632172 -69.9999850615609, ' +
          '1.0000333246339375 -69.9999861118553, ' +
          '1.0000371442708553 -69.99998729590006, ' +
          '1.0000406061887912 -69.99998860229222, ' +
          '1.0000436770475707 -69.99999001845053, ' +
          '1.0000463272731077 -69.99999153073661, ' +
          '1.0000485313422212 -69.99999312458638, ' +
          '1.0000502680284404 -69.99999478465017, ' +
          '1.0000515206064282 -69.9999964949407, ' +
          '1.0000522770130618 -69.99999823898695, ' +
          '1.000052529963609 -69.99999999999277, ' +
          '1.0000522770218907 -70.00000176099876, ' +
          '1.0000515206237472 -70.00000350504544, ' +
          '1.0000502680535832 -70.00000521533669, ' +
          '1.0000485313742222 -70.00000687540144, ' +
          '1.0000463273107365 -70.00000846925238, ' +
          '1.0000436770893817 -70.00000998153979, ' +
          '1.0000406062331777 -70.00001139769957, ' +
          '1.0000371443161113 -70.00001270409324, ' +
          '1.0000333246783242 -70.00001388813949, ' +
          '1.0000291841050284 -70.00001493843534, ' +
          '1.0000247624722454 -70.00001584486581, ' +
          '1.0000201023627762 -70.00001659870148, ' +
          '1.0000152486561038 -70.00001719268245, ' +
          '1.0000102480961754 -70.00001762108838, ' +
          '1.0000051488412292 -70.00001787979345, ' +
          '1 -70.0000179663062, ' +
          '0.9999948511587708 -70.00001787979345, ' +
          '0.9999897519038247 -70.00001762108838, ' +
          '0.9999847513438962 -70.00001719268245, ' +
          '0.9999798976372238 -70.00001659870148, ' +
          '0.9999752375277547 -70.00001584486581, ' +
          '0.9999708158949717 -70.00001493843534, ' +
          '0.9999666753216759 -70.00001388813949, ' +
          '0.9999628556838887 -70.00001270409324, ' +
          '0.9999593937668223 -70.00001139769957, ' +
          '0.9999563229106182 -70.00000998153979, ' +
          '0.9999536726892635 -70.00000846925238, ' +
          '0.9999514686257778 -70.00000687540144, ' +
          '0.9999497319464168 -70.00000521533669, ' +
          '0.9999484793762529 -70.00000350504544, ' +
          '0.9999477229781094 -70.00000176099876, ' +
          '0.9999474700363911 -69.99999999999277, ' +
          '0.9999477229869383 -69.99999823898695, ' +
          '0.9999484793935718 -69.9999964949407, ' +
          '0.9999497319715597 -69.99999478465017, ' +
          '0.9999514686577787 -69.99999312458638, ' +
          '0.9999536727268924 -69.99999153073661, ' +
          '0.9999563229524294 -69.99999001845053, ' +
          '0.9999593938112088 -69.99998860229222, ' +
          '0.9999628557291448 -69.99998729590006, ' +
          '0.9999666753660625 -69.9999861118553, ' +
          '0.9999708159367828 -69.9999850615609, ' +
          '0.9999752375653836 -69.99998415513177, ' +
          '0.9999798976692246 -69.99998340129729, ' +
          '0.9999847513690391 -69.99998280731727, ' +
          '0.9999897519211435 -69.99998237891208, ' +
          '0.9999948511675999 -69.99998212020742, ' +
          '1 -69.99998203369482))"');
        expect(spy).toHaveBeenCalledTimes(7878);
        expect(spy.mock.calls[0][0]).toEqual('"findPolygonInsideOnSphere" -> "center" should be degree!');
      });
    });
  });
});
