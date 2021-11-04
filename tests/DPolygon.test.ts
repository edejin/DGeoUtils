/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DPoint, DPolygon} from '../src';
import {JSDOM} from 'jsdom';
const {document} = (new JSDOM('...')).window;

describe('DPolygon', () => {
  describe('constructor', () => {
    test('1', () => {
      expect(new DPolygon([])).toEqual({
        holes: [],
        pPoints: [],
        properties: {},
        searchStore: {}
      });
    });
    test('1', () => {
      expect(new DPolygon([
        new DPoint(1, 2),
        new DPoint(3, 4)
      ])).toEqual({
        holes: [],
        pPoints: [
          {
            x: 1,
            y: 2,
            z: undefined,
            properties: {}
          },
          {
            x: 3,
            y: 4,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('parseFromWKT', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((1 2, 3 4), (5 6, 7 8))')).toEqual({
        holes: [
          {
            holes: [],
            pPoints: [
              {
                x: 5,
                y: 6,
                z: undefined,
                properties: {}
              },
              {
                x: 7,
                y: 8,
                z: undefined,
                properties: {}
              }
            ],
            properties: {},
            searchStore: {}
          }
        ],
        pPoints: [
          {
            x: 1,
            y: 2,
            z: undefined,
            properties: {}
          },
          {
            x: 3,
            y: 4,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('LINESTRING (30 10, 10 30, 40 40)')).toEqual({
        holes: [],
        pPoints: [
          {
            x: 30,
            y: 10,
            z: undefined,
            properties: {}
          },
          {
            x: 10,
            y: 30,
            z: undefined,
            properties: {}
          },
          {
            x: 40,
            y: 40,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
    test('3', () => {
      expect(DPolygon.parseFromWKT('POINT (30 10)')).toEqual({
        holes: [],
        pPoints: [
          {
            x: 30,
            y: 10,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
    test('4', () => {
      expect(DPolygon.parseFromWKT('POINT (30 10)').degreeToMeters()).toEqual({
        holes: [],
        pPoints: [
          {
            x: 3339584.723333333,
            y: 1118889.9747022088,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('createSquareBySize', () => {
    test('1', () => {
      expect(DPolygon.createSquareBySize(new DPoint(10, 20))).toEqual({
        holes: [],
        pPoints: [
          {
            x: 0,
            y: 0,
            z: undefined,
            properties: {}
          },
          {
            x: 0,
            y: 20,
            z: undefined,
            properties: {}
          },
          {
            x: 10,
            y: 20,
            z: undefined,
            properties: {}
          },
          {
            x: 10,
            y: 0,
            z: undefined,
            properties: {}
          },
          {
            x: 0,
            y: 0,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('points', () => {
    test('1', () => {
      const t = new DPolygon([new DPoint(10, 20)]);
      expect(t.points).toEqual([
        {
          x: 10,
          y: 20,
          z: undefined,
          properties: {}
        }
      ]);
      t.points = [
        new DPoint(30, 40),
        new DPoint(50, 60)
      ];
      expect(t.points).toEqual([
        {
          x: 30,
          y: 40,
          z: undefined,
          properties: {}
        },
        {
          x: 50,
          y: 60,
          z: undefined,
          properties: {}
        }
      ]);
    });
  });

  describe('min/max', () => {
    test('1', () => {
      const {minX, maxX, minY, maxY} = new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]);
      expect(minX).toBe(10);
      expect(maxX).toBe(30);
      expect(minY).toBe(20);
      expect(maxY).toBe(40);
    });
  });

  describe('center', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).center).toEqual({
        x: 20,
        y: 30,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('h/w or dX/dY', () => {
    test('1', () => {
      const {h, w, dX, dY} = new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]);
      expect(h).toBe(20);
      expect(w).toBe(20);
      expect(dX).toBe(20);
      expect(dY).toBe(20);
    });
  });

  describe('extend', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).extend).toEqual({
        holes: [],
        pPoints: [
          {
            x: 10,
            y: 20,
            z: undefined,
            properties: {}
          },
          {
            x: 30,
            y: 20,
            z: undefined,
            properties: {}
          },
          {
            x: 30,
            y: 40,
            z: undefined,
            properties: {}
          },
          {
            x: 10,
            y: 40,
            z: undefined,
            properties: {}
          },
          {
            x: 10,
            y: 20,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('size', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).size).toEqual({
        x: 20,
        y: 20,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('leftTop', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).leftTop).toEqual({
        x: 10,
        y: 20,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('rightBottom', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).rightBottom).toEqual({
        x: 30,
        y: 40,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('length', () => {
    test('1', () => {
      const t = new DPolygon([new DPoint(10, 20)]);
      expect(t.length).toBe(1);
      t.points = [
        new DPoint(30, 40),
        new DPoint(50, 60)
      ];
      expect(t.length).toBe(2);
    });
  });

  describe('fullLength', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).extend.fullLength).toEqual(60);
    });
  });

  describe('perimeter', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).extend.perimeter).toEqual(80);
    });
  });

  describe('area', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).extend.area).toBe(400);
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), ' +
        '(20 30, 35 35, 30 20, 20 30))').area).toBe(675);
    });
  });

  describe('deintersection', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 10),
        new DPoint(30, 30),
        new DPoint(10, 30),
        new DPoint(30, 10),
        new DPoint(10, 10)
      ]).deintersection).toEqual({
        pPoints: [
          {
            x: 10,
            y: 10,
            z: undefined,
            properties: {}
          },
          {
            x: 20,
            y: 20,
            z: undefined,
            properties: {}
          },
          {
            x: 10,
            y: 30,
            z: undefined,
            properties: {}
          },
          {
            x: 30,
            y: 30,
            z: undefined,
            properties: {}
          },
          {
            x: 20,
            y: 20,
            z: undefined,
            properties: {}
          },
          {
            x: 30,
            y: 10,
            z: undefined,
            properties: {}
          },
          {
            x: 10,
            y: 10,
            z: undefined,
            properties: {}
          }
        ],
        holes: [],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('valid', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40)
      ]).valid).toBe(false);
    });
    test('2', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50)
      ]).valid).toBe(false);
    });
    test('3', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).valid).toBe(true);
    });
  });

  describe('first', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).first).toEqual({
        x: 10,
        y: 20,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('second', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).second).toEqual({
        x: 30,
        y: 40,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('last', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).last).toEqual({
        x: 70,
        y: 70,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('minAreaRectangle', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).minAreaRectangle).toEqual({
        pPoints: [
          {
            properties: {},
            x: 50.00000000000001,
            y: 50.00000000000001,
            z: undefined
          },
          {
            properties: {},
            x: 10.000000000000002,
            y: 20,
            z: undefined
          },
          {
            properties: {},
            x: 7.600000000000004,
            y: 23.199999999999996,
            z: undefined
          },
          {
            properties: {},
            x: 47.600000000000016,
            y: 53.2,
            z: undefined
          },
          {
            properties: {},
            x: 50.00000000000001,
            y: 50.00000000000001,
            z: undefined
          }
        ],
        holes: [],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('convex', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(1, 1),
        new DPoint(5, 5),
        new DPoint(9, 1),
        new DPoint(4, 4),
        new DPoint(1, 1)
      ]).convex).toEqual({
        holes: [],
        properties: {},
        searchStore: {},
        pPoints: [
          {
            x: 9,
            y: 1,
            z: undefined,
            properties: {}
          },
          {
            x: 1,
            y: 1,
            z: undefined,
            properties: {}
          },
          {
            x: 5,
            y: 5,
            z: undefined,
            properties: {}
          },
          {
            x: 9,
            y: 1,
            z: undefined,
            properties: {}
          }
        ]
      });
    });
  });

  describe('isClockwise', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(1, 1),
        new DPoint(5, 5),
        new DPoint(9, 1),
        new DPoint(4, 4),
        new DPoint(1, 1)
      ]).isClockwise).toEqual(false);
    });
    test('2', () => {
      expect(new DPolygon([
        new DPoint(1, 1),
        new DPoint(5, 5),
        new DPoint(9, 1),
        new DPoint(4, 4),
        new DPoint(1, 1)
      ]).reverse().isClockwise).toEqual(true);
    });
  });

  describe('clockWise', () => {
    const t = new DPolygon([
      new DPoint(1, 1),
      new DPoint(5, 5),
      new DPoint(9, 1),
      new DPoint(4, 4),
      new DPoint(1, 1)
    ]);
    test('1', () => {
      expect(t.clone().clockWise.equal(t.clone().reverse())).toEqual(true);
    });
    test('2', () => {
      expect(t.clone().reverse().clockWise.equal(t.clone().reverse())).toEqual(true);
    });
  });

  describe('noHoles', () => {
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), ' +
        '(20 30, 35 35, 30 20, 20 30))').noHoles.points).toEqual([
        {
          x: 35,
          y: 10,
          z: undefined,
          properties: {}
        },
        {
          x: 45,
          y: 45,
          z: undefined,
          properties: {}
        },
        {
          x: 15,
          y: 40,
          z: undefined,
          properties: {}
        },
        {
          x: 10,
          y: 20,
          z: undefined,
          properties: {}
        },
        {
          x: 35,
          y: 10,
          z: undefined,
          properties: {}
        }
      ]);
    });
  });

  describe('minAreaRectangleSize', () => {
    test('1', () => {
      expect(DPolygon.minAreaRectangleSize(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).minAreaRectangle)).toEqual({
        x: 50.00000000000001,
        y: 3.9999999999999916,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('intersection', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 10),
        new DPoint(20, 20)
      ]).extend.intersection(new DPoint(10, 10).findLine(new DPoint(20, 20)))).toEqual([
        {
          x: 10,
          y: 10,
          z: undefined,
          properties: {}
        },
        {
          x: 20,
          y: 20,
          z: undefined,
          properties: {}
        },
        {
          x: 20,
          y: 20,
          z: undefined,
          properties: {}
        },
        {
          x: 10,
          y: 10,
          z: undefined,
          properties: {}
        }
      ]);
    });
  });

  describe('setCenter', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 10),
        new DPoint(20, 20)
      ]).setCenter(new DPoint(10, 20)).points).toEqual([
        {
          x: 5,
          y: 15,
          z: undefined,
          properties: {}
        },
        {
          x: 15,
          y: 25,
          z: undefined,
          properties: {}
        }
      ]);
    });
  });

  describe('toWKT', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), ' +
        '(20 30, 35 35, 30 20, 20 30))').toWKT()).toBe('POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), ' +
        '(20 30, 35 35, 30 20, 20 30))');
    });
  });

  describe('minAreaRectangleDirection', () => {
    test('1', () => {
      expect(DPolygon.minAreaRectangleDirection(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).minAreaRectangle)).toBe(2.498091544796509);
    });
  });

  describe('toDash', () => {
    test('1', () => {
      expect(DPolygon.toDash(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).divideToPieces(8))).toEqual([
        {
          holes: [],
          pPoints: [
            {
              properties: {},
              x: 10,
              y: 20,
              z: undefined
            },
            {
              properties: {
                pieceBorder: true
              },
              x: 16.976423537605235,
              y: 26.976423537605235,
              z: undefined
            }
          ],
          properties: {},
          searchStore: {}
        },
        {
          holes: [],
          pPoints: [
            {
              properties: {
                pieceBorder: true
              },
              x: 23.95284707521047,
              y: 33.95284707521047,
              z: undefined
            },
            {
              properties: {},
              x: 30,
              y: 40,
              z: undefined
            },
            {
              properties: {
                pieceBorder: true
              },
              x: 31.175444679663237,
              y: 40.58772233983162,
              z: undefined
            }
          ],
          properties: {},
          searchStore: {}
        },
        {
          holes: [],
          pPoints: [
            {
              properties: {
                pieceBorder: true
              },
              x: 39.99999999999999,
              y: 45,
              z: undefined
            },
            {
              properties: {
                pieceBorder: true
              },
              x: 48.82455532033675,
              y: 49.41227766016838,
              z: undefined
            }
          ],
          properties: {},
          searchStore: {}
        },
        {
          holes: [],
          pPoints: [
            {
              properties: {
                pieceBorder: true
              },
              x: 56.04715292478952,
              y: 56.04715292478952,
              z: undefined
            },
            {
              properties: {
                pieceBorder: true
              },
              x: 63.02357646239476,
              y: 63.02357646239476,
              z: undefined
            }
          ],
          properties: {},
          searchStore: {}
        },
        {
          holes: [],
          pPoints: [
            {
              properties: {
                pieceBorder: true
              },
              x: 70,
              y: 70,
              z: undefined
            },
            {
              properties: {},
              x: 70,
              y: 70,
              z: undefined
            }
          ],
          properties: {},
          searchStore: {}
        }
      ]);
    });
  });

  describe('divideToPieces', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).divideToPieces(8)).toEqual({
        holes: [],
        pPoints: [
          {
            properties: {},
            x: 10,
            y: 20,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 16.976423537605235,
            y: 26.976423537605235,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 23.95284707521047,
            y: 33.95284707521047,
            z: undefined
          },
          {
            properties: {},
            x: 30,
            y: 40,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 31.175444679663237,
            y: 40.58772233983162,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 39.99999999999999,
            y: 45,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 48.82455532033675,
            y: 49.41227766016838,
            z: undefined
          },
          {
            properties: {},
            x: 50,
            y: 50,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 56.04715292478952,
            y: 56.04715292478952,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 63.02357646239476,
            y: 63.02357646239476,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 70,
            y: 70,
            z: undefined
          },
          {
            properties: {},
            x: 70,
            y: 70,
            z: undefined
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('rotate', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), ' +
        '(20 30, 35 35, 30 20, 20 30))').rotate(Math.PI / 2)
        .toWKT()).toBe('POLYGON ((-9.999999999999998 35, -45 45,' +
        ' -40 15.000000000000002, -20 10.000000000000002, -9.999999999999998 35),' +
        ' (-30 20.000000000000004, -35 35, -19.999999999999996 30, -30' +
        ' 20.000000000000004))');
    });
  });

  describe('filter', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').filter((p: DPoint) => p.x > 20)
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 30 10))');
    });
  });

  describe('move', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').move(1, 0)
        .toWKT()).toBe('POLYGON ((31 10, 41 40, 21 40, 11 20, 31 10))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10),' +
        ' (25 18, 30 31, 21 32, 18 22, 25 18))').move(1, 0)
        .toWKT()).toBe('POLYGON ((31 10, 41 40, 21 40, 11 20, 31 10), (26 18, 31 31, 22 32, 19 22, 26 18))');
    });
  });

  describe('scale', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').scale(2, 1)
        .toWKT()).toBe('POLYGON ((60 10, 80 40, 40 40, 20 20, 60 10))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10),' +
        ' (25 18, 30 31, 21 32, 18 22, 25 18))').scale(2, 1)
        .toWKT()).toBe('POLYGON ((60 10, 80 40, 40 40, 20 20, 60 10), (50 18, 60 31, 42 32, 36 22, 50 18))');
    });
  });

  describe('divide', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').divide(2, 1)
        .toWKT()).toBe('POLYGON ((15 10, 20 40, 10 40, 5 20, 15 10))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10),' +
        ' (25 18, 30 31, 21 32, 18 22, 25 18))').divide(2, 1)
        .toWKT()).toBe('POLYGON ((15 10, 20 40, 10 40, 5 20, 15 10), (12.5 18, 15 31, 10.5 32, 9 22, 12.5 18))');
    });
  });

  describe('round', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2))').round()
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 21 41, 11 21, 30 10))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2),' +
        ' (25.2 18.3, 30.4 31.5, 21.6 32.7, 18.8 22.9, 25.1 18.2))').round()
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 21 41, 11 21, 30 10), (25 18, 30 32, 22 33, 19 23, 25 18))');
    });
  });

  describe('floor', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2))').floor()
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2),' +
        ' (25.2 18.3, 30.4 31.5, 21.6 32.7, 18.8 22.9, 25.1 18.2))').floor()
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10), (25 18, 30 31, 21 32, 18 22, 25 18))');
    });
  });

  describe('ceil', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2))').ceil()
        .toWKT()).toBe('POLYGON ((31 11, 41 41, 21 41, 11 21, 31 11))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2),' +
        ' (25.2 18.3, 30.4 31.5, 21.6 32.7, 18.8 22.9, 25.1 18.2))').ceil()
        .toWKT()).toBe('POLYGON ((31 11, 41 41, 21 41, 11 21, 31 11), (26 19, 31 32, 22 33, 19 23, 26 19))');
    });
  });

  describe('toFixed', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1123 10.2123, 40.3123 40.4123, 20.5123 40.6123,' +
        ' 10.7123 20.8123, 30.1123 10.2123))').toFixed()
        .toWKT()).toBe('POLYGON ((30.11 10.21, 40.31 40.41, 20.51 40.61, 10.71 20.81, 30.11 10.21))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1123 10.2123, 40.3123 40.4123, 20.5123 40.6123,' +
        ' 10.7123 20.8123, 30.1123 10.2123), (25.2534 18.33455, 30.4453 31.545346, 21.64534 32.7543,' +
        ' 18.83455 22.9453, 25.145345 18.234534))').toFixed(3)
        .toWKT()).toBe('POLYGON ((30.112 10.212, 40.312 40.412, 20.512 40.612, 10.712 20.812,' +
        ' 30.112 10.212), (25.253 18.335, 30.445 31.545, 21.645 32.754, 18.835 22.945, 25.145 18.235))');
    });
  });

  describe('map', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').map((p) => {
        p.x = 3;
        return p;
      })
        .toWKT()).toBe('POLYGON ((3 10, 3 40, 3 40, 3 20, 3 10))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10),' +
        ' (25 18, 30 31, 21 32, 18 22, 25 18))').map((p) => {
        p.x = 3;
        return p;
      })
        .toWKT()).toBe('POLYGON ((3 10, 3 40, 3 40, 3 20, 3 10), (3 18, 3 31, 3 32, 3 22, 3 18))');
    });
  });

  describe('p', () => {
    test('1', () => {
      const t = DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
      expect(t.p(0)).toEqual({
        x: 30,
        y: 10,
        z: undefined,
        properties: {}
      });
      expect(t.p(5)).toBe(undefined);
      expect(t.p(5, true)).toEqual({
        x: 30,
        y: 10,
        z: undefined,
        properties: {}
      });
      expect(t.p(-2)).toBe(undefined);
      expect(t.p(-2, true)).toEqual({
        x: 10,
        y: 20,
        z: undefined,
        properties: {}
      });
    });
  });

  describe('pop', () => {
    const t = new DPolygon([new DPoint(12, 34)]);
    test(('1'), () => {
      expect(t.pop()).toEqual({
        x: 12,
        y: 34,
        z: undefined,
        properties: {}
      });
    });
    test(('2'), () => {
      expect(t.pop()).toBe(undefined);
    });
  });

  describe('push', () => {
    const t = new DPolygon();
    test('1', () => {
      expect(t.push(new DPoint(12, 34))).toBe(1);
    });
    test('2', () => {
      expect(t).toEqual({
        holes: [],
        pPoints: [
          {
            x: 12,
            y: 34,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('shift', () => {
    const t = new DPolygon([new DPoint(12, 34)]);
    test(('1'), () => {
      expect(t.shift()).toEqual({
        x: 12,
        y: 34,
        z: undefined,
        properties: {}
      });
    });
    test(('2'), () => {
      expect(t.shift()).toBe(undefined);
    });
  });

  describe('unshift', () => {
    const t = new DPolygon();
    test('1', () => {
      expect(t.unshift(new DPoint(12, 34))).toBe(1);
    });
    test('2', () => {
      expect(t).toEqual({
        holes: [],
        pPoints: [
          {
            x: 12,
            y: 34,
            z: undefined,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('reverse', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').reverse()
        .toWKT()).toBe('POLYGON ((30 10, 10 20, 20 40, 40 40, 30 10))');
    });
  });

  describe('getValue', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')
        .getValue()).toBe('30,10,40,40,20,40,10,20,30,10');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35, 30 20, 20 30))')
        .getValue()).toBe('35,10,45,45,15,40,10,20,35,1020,30,35,35,30,20,20,30');
    });
  });

  describe('transform', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').metersToDegree()
        .toWKT()).toBe('POLYGON ((0.00026949458527337036 0.00008983152842745312, 0.0003593261136978272' +
        ' 0.0003593261137098125, 0.0001796630568489136 0.0003593261137098125, 0.0000898315284244568 0.00017966' +
        '305685490624, 0.00026949458527337036 0.00008983152842745312))');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10), (25 18, 30 31, 21 32, 18 22, 25 18))')
        .metersToDegree()
        .toWKT())
        .toBe('POLYGON ((0.00026949458527337036 0.00008983152842745312,' +
          ' 0.0003593261136978272 0.0003593261137098125, 0.0001796630568489136 0.0003593261137098125,' +
          ' 0.0000898315284244568 0.00017966305685490624, 0.00026949458527337036 0.00008983152842745312),' +
          ' (0.00022457882106114197 0.00016169675116373128, 0.00026949458527337036 0.0002784777381208414,' +
          ' 0.00018864620969135924 0.0002874608909451126, 0.00016169675116402222 0.00019762936253187036,' +
          ' 0.00022457882106114197 0.00016169675116373128))');
    });

    describe('radiansToMeters', () => {
      test('1', () => {
        expect(new DPolygon([new DPoint(Math.PI / 4, Math.PI / 4)]).radiansToMeters()
          .toWKT()).toBe('POLYGON ((5009377.085 5621521.485409545))');
      });
    });
    describe('metersToRadians', () => {
      test('1', () => {
        expect(new DPolygon([new DPoint(5009377.085, 5621521.485409545)]).metersToRadians()
          .equal(new DPolygon([new DPoint(Math.PI / 4, Math.PI / 4)]))).toBe(true);
      });
    });
  });

  describe('toString', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')
        .toString()).toBe('(30 10, 40 40, 20 40, 10 20, 30 10)');
    });
  });

  describe('close', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')
        .close()
        .toString()).toBe('(30 10, 40 40, 20 40, 10 20, 30 10)');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20))')
        .close()
        .toString()).toBe('(30 10, 40 40, 20 40, 10 20, 30 10)');
    });
  });

  describe('open', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')
        .open()
        .toString()).toBe('(30 10, 40 40, 20 40, 10 20)');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20))')
        .open()
        .toString()).toBe('(30 10, 40 40, 20 40, 10 20)');
    });
  });

  describe('height', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((35 10, 45 45), (20 30, 35 35))')
        .height(3)).toEqual({
        holes: [
          {
            holes: [],
            pPoints: [
              {
                x: 20,
                y: 30,
                z: 3,
                properties: {}
              },
              {
                x: 35,
                y: 35,
                z: 3,
                properties: {}
              }
            ],
            properties: {},
            searchStore: {}
          }
        ],
        pPoints: [
          {
            x: 35,
            y: 10,
            z: 3,
            properties: {}
          },
          {
            x: 45,
            y: 45,
            z: 3,
            properties: {}
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('add', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40), (20 30, 35 35))')
        .add(DPolygon.parseFromWKT('POLYGON ((10 20, 35 10), (30 20, 20 30))'))
        .toWKT()).toBe('POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10), (20 30, 35 35), (30 20, 20 30))');
    });
  });

  describe('has', () => {
    const t = DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40), (20 30, 35 35))');
    test('1', () => {
      expect(t.has(new DPoint(45, 45))).toBe(true);
    });
    test('2', () => {
      expect(t.has(DPoint.Zero())).toBe(false);
    });
  });

  describe('clone', () => {
    const t1 = DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40), (20 30, 35 35))');
    const t2 = t1.clone();
    test('1', () => {
      expect(t1.toWKT()).toBe(t2.toWKT());
    });
  });

  describe('equal', () => {
    const t1 = DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40), (20 30, 35 35))');
    const t2 = DPolygon.parseFromWKT('POLYGON ((45 45, 15 40, 35 10), (35 35, 20 30))');
    const t3 = DPolygon.parseFromWKT('POLYGON ((45 45, 15 40, 35 10), (35 35, 20 30, 0 0))');
    const t4 = DPolygon.parseFromWKT('POLYGON ((15 40, 35 10), (35 35, 20 30, 0 0))');
    test('1', () => {
      expect(t1.equal(t2)).toBe(true);
    });
    test('2', () => {
      expect(t1.equal(t3)).toBe(false);
    });
    test('3', () => {
      expect(t1.equal(null)).toBe(false);
    });
    test('3', () => {
      expect(t1.equal(t4)).toBe(false);
    });
  });

  describe('same', () => {
    const t1 = DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40), (20 30, 35 35))');
    const t2 = DPolygon.parseFromWKT('POLYGON ((45 45, 15 40, 35 10), (35 35, 20 30))');
    const t3 = DPolygon.parseFromWKT('POLYGON ((45 45, 15 40, 35 10), (35 35, 20 30, 0 0))');
    const t4 = DPolygon.parseFromWKT('POLYGON ((45 45, 15 40), (35 35, 20 30, 0 0))');
    test('1', () => {
      expect(t1.same(t2)).toBe(true);
    });
    test('2', () => {
      expect(t1.same(t3)).toBe(true);
    });
    test('2', () => {
      expect(t1.same(t4)).toBe(false);
    });
  });

  describe('findIndex', () => {
    const t1 = DPolygon.parseFromWKT('POLYGON ((35 10, 45 45, 15 40))');
    test('1', () => {
      expect(t1.findIndex(new DPoint(45, 45))).toBe(1);
    });
    test('2', () => {
      expect(t1.findIndex(DPoint.Zero())).toBe(-1);
    });
  });

  describe('approximation', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((40 40, 30 30, 40 20, 30 10))').approximation()
        .toString()).toBe('(40 40, 30 30, 40 20, 30 10)');
    });
    test('2', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((40 40, 30 30, 40 20, 30 10))').approximation(1000000000)
        .toString()).toBe('(40 40, 30 10)');
    });
  });

  describe('contain', () => {
    const t = DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
    test('1', () => {
      expect(t.contain(new DPoint(20, 20))).toBe(true);
    });
    test('2', () => {
      expect(t.contain(new DPoint(10, 20))).toBe(false);
    });
    test('3', () => {
      expect(t.contain(new DPoint(0, 0))).toBe(false);
    });
    test('4', () => {
      expect(t.contain(new DPoint(30, 40), true)).toBe(true);
    });
    test('5', () => {
      expect(t.contain(new DPoint(30, 40), false)).toBe(false);
    });
    test('6', () => {
      expect(t.contain(new DPoint(10, 20), true)).toBe(true);
    });
  });

  describe('onBorder', () => {
    const t = DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
    test('1', () => {
      expect(t.onBorder(new DPoint(20, 20))).toBe(false);
    });
    test('2', () => {
      expect(t.onBorder(new DPoint(10, 20))).toBe(true);
    });
    test('3', () => {
      expect(t.onBorder(new DPoint(0, 0))).toBe(false);
    });
    test('4', () => {
      expect(t.onBorder(new DPoint(30, 40))).toBe(true);
    });
  });

  describe('nextStart', () => {
    test('1', () => {
      const t1 = DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
      const t2 = DPolygon.parseFromWKT('POLYGON ((40 40, 20 40, 10 20, 30 10, 40 40))');
      expect(t1.clone().nextStart()
        .equal(t2)).toBe(true);
      expect(t1.clone().nextStart()
        .equal(t1)).toBe(true);
    });
  });

  describe('removeDuplicates', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 40 40, 20 40, 40 40, 10 20, 30 10))')
        .removeDuplicates()
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 20 40, 40 40, 10 20, 30 10))');
    });
  });

  describe('drawPolygonOnCanvas', () => {
    test('1', () => {
      const t = document.createElement('canvas');
      DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')
        .drawPolygonOnCanvas(
          t,
          '#ff0000',
          '#00ff00',
          '#0000ff',
          2
        );
      expect(t.toDataURL()).toMatchSnapshot();
    });
    test('2', () => {
      const t = document.createElement('canvas');
      DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')
        .drawPolygonOnCanvas(
          t,
          undefined,
          '#00ff00'
        );
      expect(t.toDataURL()).toMatchSnapshot();
    });
    test('3', () => {
      const t = document.createElement('canvas');
      DPolygon.parseFromWKT('POINT (30 10)')
        .drawPolygonOnCanvas(
          t,
          '#ff0000',
          '#00ff00',
          '#0000ff',
          2
        );
      expect(t.toDataURL()).toMatchSnapshot();
    });
  });

  describe('clearPolygonOnCanvas', () => {
    test('1', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'green';
      ctx.fillRect(0, 0, 150, 100);
      DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')
        .clearPolygonOnCanvas(canvas);
      expect(canvas.toDataURL()).toMatchSnapshot();
    });
  });

  describe('Contain - old', () => {
    describe('1', () => {
      const poly = DPolygon.parseFromWKT('POLYGON ((0 0, 0 2, 2 2, 2 0, 0 0))');
      test('1', () => {
        const point = DPoint.parseFromWKT('POINT (1 1)');
        expect(poly.contain(point)).toBe(true);
      });
      test('2', () => {
        const point = DPoint.parseFromWKT('POINT (1 3)');
        expect(poly.contain(point)).toBe(false);
      });
    });
    describe('2', () => {
      const poly = DPolygon.parseFromWKT('POLYGON ((1 8, 2 5, 5 8, 5 2, 1 2, 1 8), (2 7, 4 7, 4 3, 2 3, 2 7))');
      test('1', () => {
        const point = DPoint.parseFromWKT('POINT (2 6)');
        expect(poly.contain(point)).toBe(false);
      });
      test('2', () => {
        const point = DPoint.parseFromWKT('POINT (3 5)');
        expect(poly.contain(point)).toBe(true);
      });
    });
    describe('3', () => {
      const poly = DPolygon.parseFromWKT('POLYGON ((2 6, 4 6, 4 8, 8 8, 8 4, 6 4, 6 2, 2 2, 2 6))');
      test('1', () => {
        const point = DPoint.parseFromWKT('POINT (5 6)');
        expect(poly.contain(point)).toBe(true);
      });
    });
    describe('4', () => {
      const poly = DPolygon.parseFromWKT('POLYGON ((1 10, 10 10, 1 9,' +
        ' 10 9, 0 8, 10 8, 0 7, 9 7, 1 6, 7 6, 0 5, 9 5, ' +
        '1 4, 9 4, 0 3, 8 3, 0 2, 9 2, 0 1, 10 1, 0 0, 11 0, 1 10))');
      test('1', () => {
        const point = DPoint.parseFromWKT('POINT (5 6.1)');
        expect(poly.contain(point)).toBe(false);
      });
      test('2', () => {
        const point = DPoint.parseFromWKT('POINT (5 6)');
        expect(poly.contain(point)).toBe(false);
      });
      test('3', () => {
        const point = DPoint.parseFromWKT('POINT (5 5.1)');
        expect(poly.contain(point)).toBe(true);
      });
    });
  });

  test('fast search', () => {
    const poly = DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
    expect(poly.fastHas(new DPoint(11, 21))).toBe(false);
    expect(poly.fastHas(new DPoint(30, 10))).toBe(false);
    poly.prepareToFastSearch();
    expect(poly.fastHas(new DPoint(11, 21))).toBe(false);
    expect(poly.fastHas(new DPoint(10, 21))).toBe(false);
    expect(poly.fastHas(new DPoint(30, 10))).toBe(true);
  });

  describe('growingPiecesGenerator', () => {
    const poly = DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').divideToPieces(4);
    test('1', () => {
      expect([...poly.growingPiecesGenerator()].map((v: DPolygon) => v.toString())).toEqual([
        '(30 10, 35.84890578305056 27.546717349151674)',
        '(30 10, 35.84890578305056 27.546717349151674, 40 40, 34.63104841334295 40)',
        '(30 10, 35.84890578305056 27.546717349151674, 40 40, 34.63104841334295 40, 20 40,' +
        ' 18.27160188343253 36.54320376686506)',
        '(30 10, 35.84890578305056 27.546717349151674, 40 40, 34.63104841334295 40, 20 40, 18.27160188343253' +
        ' 36.54320376686506, 10.000000000000007 20.000000000000007)',
        '(30 10, 35.84890578305056 27.546717349151674, 40 40, 34.63104841334295 40, 20 40, 18.27160188343253' +
        ' 36.54320376686506, 10.000000000000007 20.000000000000007, 10 20, 26.543203766865044 11.728398116567476)'
      ]);
    });
  });

  describe('hasSimpleIntersection', () => {
    test('1', () => {
      expect(DPolygon.createSquareBySize(new DPoint(10, 10))
        .hasSimpleIntersection(DPolygon.createSquareBySize(new DPoint(10, 10))
          .move(20, 0))).toBe(false);
    });
    test('2', () => {
      expect(DPolygon.createSquareBySize(new DPoint(10, 10))
        .hasSimpleIntersection(DPolygon.createSquareBySize(new DPoint(10, 10))
          .move(9, 9))).toBe(true);
    });
  });

  describe('Parse', () => {
    test('LatLng', () => {
      const t = DPolygon.parse([{lat: 10, lng: 20}, {lat: 30, lng: 40}]);
      expect(t).toEqual({
        holes: [],
        properties: {},
        searchStore: {},
        pPoints: [
          {
            x: 10,
            y: 20,
            z: 0,
            properties: {}
          },
          {
            x: 30,
            y: 40,
            z: 0,
            properties: {}
          }
        ]
      });
    });
    test('Number[]', () => {
      const t = DPolygon.parse([[11, 12, 13, 14], [110, 120, 130, 140]]);
      expect(t).toEqual({
        holes: [],
        properties: {},
        searchStore: {},
        pPoints: [
          {
            x: 11,
            y: 12,
            z: 13,
            properties: {}
          },
          {
            x: 110,
            y: 120,
            z: 130,
            properties: {}
          }
        ]
      });
    });
    test('DCoord (2 elements)', () => {
      const t = DPolygon.parse([[110, 120], [111, 121]]);
      expect(t).toEqual({
        holes: [],
        properties: {},
        searchStore: {},
        pPoints: [
          {
            x: 110,
            y: 120,
            z: undefined,
            properties: {}
          },
          {
            x: 111,
            y: 121,
            z: undefined,
            properties: {}
          }
        ]
      });
    });
    test('DCoord (3 elements)', () => {
      const t = DPolygon.parse([[111, 121, 7]]);
      expect(t).toEqual({
        holes: [],
        properties: {},
        searchStore: {},
        pPoints: [
          {
            x: 111,
            y: 121,
            z: 7,
            properties: {}
          }
        ]
      });
    });
    test('Empty Array', () => {
      const t = DPoint.parse([]);
      expect(t).toEqual({
        properties: {},
        x: 0,
        y: 0,
        z: undefined
      });
    });
  });

  test('toArrayOfCoords', () => {
    expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').toArrayOfCoords()).toEqual([
      [30, 10],
      [40, 40],
      [20, 40],
      [10, 20],
      [30, 10]
    ]);
  });

  describe('simpleDifference', () => {
    test('1', () => {
      const A = DPolygon.parseFromWKT('POLYGON ((2 8, 4 8, 4 6, 2 6, 2 8))');
      const B = DPolygon.parseFromWKT('POLYGON ((3 9, 3 7, 5 7, 5 9, 3 9))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((3 9, 3 8, 4 8, 4 7, 5 7, 5 9, 3 9))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 8, 3 8, 3 7, 4 7, 4 6, 2 6, 2 8))');

      const res = A.simpleDifference(B) as DPolygon;
      expect(res.equal(res1) || res.equal(res2)).toBe(true);
    });

    test('2', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((5 8, 5 5, 6 5, 6 8, 5 8))');
      const b = DPolygon.parseFromWKT('POLYGON ((4 7, 7 7, 7 6, 4 6, 4 7))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((4 7, 5 7, 5 6, 4 6, 4 7))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((6 7, 7 7, 7 6, 6 6, 6 7))');
      const res3 = DPolygon.parseFromWKT('POLYGON ((5 8, 6 8, 6 7, 5 7, 5 8))');
      const res4 = DPolygon.parseFromWKT('POLYGON ((5 6, 6 6, 6 5, 5 5, 5 6))');
      const r = a.simpleDifference(b) as DPolygon[];
      const [r1, r2] = r;
      expect((r1.equal(res1) && r2.equal(res2)) ||
        (r1.equal(res2) && r2.equal(res1)) ||
        (r1.equal(res3) && r2.equal(res4)) ||
        (r1.equal(res4) && r2.equal(res3))).toBe(true);
    });

    test('3', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((4 8, 7 8, 7 5, 4 5, 4 8))');
      const b = DPolygon.parseFromWKT('POLYGON ((5 7, 6 7, 6 6, 5 6, 5 7))');

      const res1 = null;
      const res2 = DPolygon.parseFromWKT('POLYGON ((4 8, 7 8, 7 5, 4 5, 4 8), (5 7, 6 7, 6 6, 5 6, 5 7))');

      const res = a.simpleDifference(b);
      expect(res === res1 || (res as DPolygon).equal(res2)).toBe(true);
    });

    test('4', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((3 9, 5 9, 4 7, 3 9))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 7, 5 7, 5 5, 3 5, 3 7))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((3 9, 5 9, 4 7, 3 9))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((3 7, 4 7, 5 7, 5 5, 3 5, 3 7))');

      const res = a.simpleDifference(b) as DPolygon;
      expect(res.equal(res2) || res.equal(res1)).toBe(true);
    });

    test('5', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((3 8, 6 8, 6 5, 3 5, 3 8))');
      const b = DPolygon.parseFromWKT('POLYGON ((6 7, 9 7, 9 6, 6 6, 6 7))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((9 6, 6 6, 6 7, 9 7, 9 6))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((6 7, 6 6, 6 5, 3 5, 3 8, 6 8, 6 7))');

      const res = a.simpleDifference(b) as DPolygon;
      expect(res.equal(res2) || res.equal(res1)).toBe(true);
    });

    test('6', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((1 7, 3 7, 3 5, 1 5, 1 7))');
      const b = DPolygon.parseFromWKT('POLYGON ((6 8, 8 8, 8 3, 6 3, 6 8))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((1 7, 3 7, 3 5, 1 5, 1 7))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((6 8, 8 8, 8 3, 6 3, 6 8))');

      const res = a.simpleDifference(b) as DPolygon;
      expect(res.equal(res2) || res.equal(res1)).toBe(true);
    });

    test('7', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 5, 4 5, 4 3, 2 3, 2 5))');
      const b = DPolygon.parseFromWKT('POLYGON ((4 7, 4 5, 6 5, 6 7, 4 7))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 5, 4 5, 4 3, 2 3, 2 5))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((4 7, 4 5, 6 5, 6 7, 4 7))');

      const res = a.simpleDifference(b) as DPolygon;
      expect(res.equal(res2) || res.equal(res1)).toBe(true);
    });

    test('8', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((3 4, 3 7, 6 7, 6 4, 3 4))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 5, 4 5, 4 4, 3 4, 3 5))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((3 7, 6 7, 6 4, 4 4, 4 5, 3 5, 3 7))');
      const res2 = null;

      const res = a.simpleDifference(b);
      expect(res === res2 || (res as DPolygon).equal(res1)).toBe(true);
    });

    test('9', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((3 4, 7 4, 7 7, 3 7, 3 4))');
      const b = DPolygon.parseFromWKT('POLYGON ((4 4, 4 6, 5 6, 5 5, 6 5, 6 4, 4 4))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((3 7, 3 4, 4 4, 4 6, 5 6, 5 5, 6 5, 6 4, 7 4, 7 7, 3 7))');
      const res2 = null;

      const res = a.simpleDifference(b);
      expect(res === res2 || (res as DPolygon).equal(res1)).toBe(true);
    });

    test('10', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((5 8, 4 6, 6 6, 5 8))');
      const b = DPolygon.parseFromWKT('POLYGON ((2 8, 7 8, 7 4, 2 3, 2 8))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 8, 5 8, 7 8, 7 4, 2 3, 2 8), (5 8, 4 6, 6 6, 5 8))');
      const res2 = null;

      const res = a.simpleDifference(b);
      expect(res === res2 || (res as DPolygon).equal(res1)).toBe(true);
    });

    test('11', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 8, 7 8, 7 2, 2 2, 2 8))');
      const b = DPolygon.parseFromWKT('POLYGON ((5 6, 8 6, 7 3, 5 6))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((7 6, 7 3, 8 6, 7 6))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((7 8, 7 6, 5 6, 7 3, 7 2, 2 2, 2 8, 7 8))');

      const res = a.simpleDifference(b) as DPolygon;
      expect(res.equal(res1) || res.equal(res2)).toBe(true);
    });

    test('12', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 7, 9 7, 9 2, 2 2, 2 7))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 9, 6 9, 7 7, 6 5, 8 3, 3 5, 4 7, 3 9))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((3 9, 4 7, 7 7, 6 9, 3 9))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 7, 4 7, 3 5, 8 3, 6 5, 7 7, 9 7, 9 2, 2 2, 2 7))');

      const res = a.simpleDifference(b) as DPolygon;
      expect(res.equal(res1) || res.equal(res2)).toBe(true);
    });

    test('13', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((1 9, 4 9, 4 2, 1 2, 1 9))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 8, 6 8, 6 3, 3 3, 3 4, 5 4, 5 5, 3 5, 3 6, 5 6, 5 7, 3 7, 3 8))');

      const res1 = DPolygon.parseFromWKT('POLYGON ((1 9, 4 9, 4 8, 3 8, 3 7, 4 7, 4 6, 3 6, 3 5, 4 5, 4 4, 3 4,' +
        ' 3 3, 4 3, 4 2, 1 2, 1 9))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((4 8, 6 8, 6 3, 4 3, 4 4, 5 4, 5 5, 4 5, 4 6, 5 6, 5 7, 4 7, 4 8))');

      const res = a.simpleDifference(b) as DPolygon;
      expect(res.equal(res1) || res.equal(res2)).toBe(true);
    });
  });

  describe('simpleUnion/simpleIntersection', () => {
    test('basic', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 2 6, 6 6, 6 2))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((4 4, 4 8, 8 8, 8 4))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((6 2, 6 4, 8 4, 8 8, 4 8, 4 6, 2 6, 2 2))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((6 4, 6 6, 4 6, 4 4))').close();

      expect(a.simpleUnion(b)!.equal(res1)).toBe(true);
      expect((a.simpleIntersection(b)! as DPolygon).equal(res2)).toBe(true);
    });

    test('Contain', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 2 8, 8 8, 8 2))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((4 4, 4 6, 6 6, 6 4))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 2, 2 8, 8 8, 8 2))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((4 4, 4 6, 6 6, 6 4))').close();

      expect(a.simpleUnion(b)!.equal(res1)).toBe(true);
      expect((a.simpleIntersection(b)! as DPolygon).equal(res2)).toBe(true);
    });

    test('Moon', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 2 6, 6 6, 6 2))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((4 8, 8 8, 8 4, 5 4, 7 7, 4 5))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 4, 8 4, 8 8, 4 8, 4 6, 2 6, 2 2),' +
        ' (6 5.5, 6 6, 5.5 6, 7 7, 6 5.5))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((6 4, 6 5.5, 5 4, 6 4))');
      const res3 = DPolygon.parseFromWKT('POLYGON ((5.5 6, 4 6, 4 5, 5.5 6))');

      expect(a.simpleUnion(b)!.equal(res1)).toBe(true);
      const res = a.simpleIntersection(b) as DPolygon[];
      const [r1, r2] = res;
      expect((r1.equal(res2) && r2.equal(res3)) || (r2.equal(res2) && r1.equal(res3))).toBe(true);
    });

    test('touch', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 6, 2 6))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((6 3, 10 3, 10 5, 6 5))').close();
      const c = DPolygon.parseFromWKT('POLYGON ((6 6, 6 10, 10 10, 10 6))').close();
      const d = DPolygon.parseFromWKT('POLYGON ((4 6, 5 10, 3 10))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 3, 10 3, 10 5, 6 5, 6 6, 2 6))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((6 6, 6 10, 10 10, 10 6, 6 6, 6 2, 2 2, 2 6))').close();
      const res3 = DPolygon.parseFromWKT('POLYGON ((4 6, 3 10, 5 10, 4 6, 6 6, 6 2, 2 2, 2 6))').close();

      expect(a.simpleIntersection(b)).toBe(null);
      expect(a.simpleIntersection(c)).toBe(null);
      expect(a.simpleIntersection(d)).toBe(null);

      expect(a.simpleUnion(b)!.equal(res1)).toBe(true);
      expect(a.simpleUnion(c)!.equal(res2)).toBe(true);
      expect(a.simpleUnion(d)!.equal(res3)).toBe(true);
    });

    test('Touch inside', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 10 2, 10 10, 2 10))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((2 2, 4 2, 4 4, 2 4))').close();
      const c = DPolygon.parseFromWKT('POLYGON ((4 2, 6 2, 6 6, 4 6))').close();
      const d = DPolygon.parseFromWKT('POLYGON ((4 8, 6 8, 5 10))').close();

      expect((a.simpleIntersection(b)! as DPolygon).equal(b)).toBe(true);
      expect((a.simpleIntersection(c)! as DPolygon).equal(c)).toBe(true);
      expect((a.simpleIntersection(d)! as DPolygon).equal(d)).toBe(true);

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 2, 4 2, 10 2, 10 10, 2 10, 2 4))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 2, 4 2, 6 2, 10 2, 10 10, 2 10))').close();
      const res3 = DPolygon.parseFromWKT('POLYGON ((2 2, 10 2, 10 10, 5 10, 2 10))').close();

      expect((a.simpleUnion(b)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(c)! as DPolygon).equal(res2)).toBe(true);
      expect((a.simpleUnion(d)! as DPolygon).equal(res3)).toBe(true);
    });

    test('Outside only', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 4, 8 4, 8 6, 2 6))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((4 2, 6 2, 6 8, 4 8))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((4 4, 6 4, 6 6, 4 6))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((4 2, 6 2, 6 4, 8 4, 8 6, 6 6, 6 8, 4 8, 4 6,' +
        ' 2 6, 2 4, 4 4))').close();

      expect((a.simpleIntersection(b)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(b)! as DPolygon).equal(res2)).toBe(true);
    });

    test('Border corners', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 8 2, 8 10, 2 10))').close();
      const e = DPolygon.parseFromWKT('POLYGON ((7 6, 8 5, 9 6, 8 7))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((8 5, 8 7, 7 6))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 2, 8 2, 8 5, 9 6, 8 7, 8 10, 2 10))').close();

      expect((a.simpleIntersection(e)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(e)! as DPolygon).equal(res2)).toBe(true);
    });

    test('Custom test 1', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 6, 2 6))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((5 5, 7 5, 6 3))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((6 3, 6 5, 5 5))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 3, 7 5, 6 5, 6 6, 2 6))').close();

      expect((a.simpleIntersection(b)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(b)! as DPolygon).equal(res2)).toBe(true);
    });

    test('Custom test 2', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 6, 2 6))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((3 5, 4 5, 5 6, 4 7, 3 7, 4 6))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((3 5, 4 5, 5 6, 4 6))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 6, 5 6, 4 7, 3 7, 4 6, 2 6))').close();

      expect((a.simpleIntersection(b)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(b)! as DPolygon).equal(res2)).toBe(true);
    });
  });

  describe('smartUnion', () => {
    test('1', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((1 8, 5 8, 5 2, 1 2, 1 8), (2 7, 4 7, 4 3, 2 3, 2 7))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 1, 3 5, 8 5, 8 1, 3 1), (6 4, 6 2, 7 2, 7 4, 6 4))');

      const res = DPolygon.parseFromWKT('POLYGON ((1 8, 5 8, 5 5, 8 5, 8 1, 3 1, 3 2, 1 2, 1 8), (2 7, 4 7' +
        ', 4 3, 2 3, 2 7), (6 4, 6 2, 7 2, 7 4, 6 4))');
      expect(a.smartUnion(b)!.equal(res)).toBe(true);
    });
    test('2', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((1 8, 5 8, 5 2, 1 2, 1 8), (2 7, 4 7, 4 3, 2 3, 2 7))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 1, 3 5, 8 5, 8 1, 3 1), (4 4, 7 4, 7 3, 4 3, 4 4))');

      const res = DPolygon.parseFromWKT('POLYGON ((1 8, 5 8, 5 5, 8 5, 8 1, 3 1, 3 2, 1 2, 1 8), (2 7, 4 7, 4 4,' +
        ' 7 4, 7 3, 4 3, 2 3, 2 7))');
      expect(a.smartUnion(b)!.equal(res)).toBe(true);
    });
    test('3', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((1 8, 1 2, 7 2, 7 3, 2 3, 2 5, 7 5, 7 6, 2 6, 2 7, 7 7, 7 8, 1 8))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 9, 3 3, 4 3, 4 9, 5 9, 5 1, 6 1, 6 8, 7 8, 7 2, 8 2,' +
        ' 8 10, 3 10, 3 9))');

      const res = DPolygon.parseFromWKT('POLYGON ((1 8, 3 8, 3 9, 3 10, 8 10, 8 2, 7 2, 6 2, 6 1,' +
        ' 5 1, 5 2, 1 2, 1 8),' +
        ' (6 7, 7 7, 7 6, 6 6, 6 7),' +
        ' (4 7, 5 7, 5 6, 4 6, 4 7),' +
        ' (6 5, 7 5, 7 3, 6 3, 6 5),' +
        ' (4 3, 4 5, 5 5, 5 3, 4 3),' +
        ' (2 5, 3 5, 3 3, 2 3, 2 5),' +
        ' (2 7, 3 7, 3 6, 2 6, 2 7),' +
        ' (4 9, 5 9, 5 8, 4 8, 4 9))');
      expect(a.smartUnion(b)!.equal(res)).toBe(true);
    });
    test('4', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((6125404.576057136 2986490.5399693353, 6125404.576057136' +
        ' 2986377.0787554733,' +
        ' 6125420.69949279 2986377.0787554733, 6125420.69949279' +
        ' 2986490.5399693353, 6125404.576057136 2986490.5399693353))');
      const b = DPolygon.parseFromWKT('POLYGON ((6125469.069799753 2986387.2305482933,' +
        ' 6125469.069799753 2986375.2872626223,' +
        ' 6125368.149035845 2986375.2872626223, 6125368.149035845 2986401.5624910956,' +
        ' 6125453.543528381 2986401.5624910956, 6125453.543528381 2986427.2405552845,' +
        ' 6125357.997243024 2986427.2405552845, 6125357.997243024 2986451.724290908,' +
        ' 6125453.543528381 2986451.724290908, 6125453.543528381 2986497.705940736,' +
        ' 6125485.790399687 2986497.705940736, 6125485.790399687 2986387.2305482933,' +
        ' 6125469.069799753 2986387.2305482933))');

      const res = DPolygon.parseFromWKT('POLYGON ((6125404.576057136 2986451.724290908, 6125404.576057136' +
        ' 2986490.5399693353,' +
        ' 6125420.69949279 2986490.5399693353, 6125420.69949279 2986451.724290908,' +
        ' 6125453.543528381 2986451.724290908, 6125453.543528381 2986497.705940736,' +
        ' 6125485.790399687 2986497.705940736, 6125485.790399687 2986387.2305482933,' +
        ' 6125469.069799753 2986387.2305482933, 6125469.069799753 2986375.2872626223,' +
        ' 6125368.149035845 2986375.2872626223, 6125368.149035845 2986401.5624910956,' +
        ' 6125404.576057136 2986401.5624910956, 6125404.576057136 2986427.2405552845,' +
        ' 6125357.997243024 2986427.2405552845, 6125357.997243024 2986451.724290908,' +
        ' 6125404.576057136 2986451.724290908), (6125420.69949279 2986427.2405552845,' +
        ' 6125420.69949279 2986401.5624910956, 6125453.543528381 2986401.5624910956,' +
        ' 6125453.543528381 2986427.2405552845, 6125420.69949279 2986427.2405552845))');
      expect(a.smartUnion(b)!.equal(res)).toBe(true);
    });
    test('5', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((6125378.897992946 2986489.' +
        '345640765, 6125378.897992946 2986380.0645768913,' +
        ' 6125362.177393007 2986380.0645768913, 6125362.177393007 2986499.4974335856,' +
        ' 6125362.7745572915 2986499.4974335856, 6125362.7745572915 2986510.843554975,' +
        ' 6125484.596071121 2986510.843554975, 6125484.596071121 2986489.345640765,' +
        ' 6125420.699492789 2986489.345640765, 6125420.699492789 2986377.0787554733,' +
        ' 6125404.576057136 2986377.0787554733, 6125404.576057136 2986489.345640765,' +
        ' 6125378.897992946 2986489.345640765))');
      const b = DPolygon.parseFromWKT('POLYGON ((6125469.069799753 2986387.' +
        '2305482933, 6125469.069799753 2986375.2872626223,' +
        ' 6125368.149035845 2986375.2872626223, 6125368.149035845 2986401.5624910956,' +
        ' 6125453.543528381 2986401.5624910956, 6125453.543528381 2986427.2405552845,' +
        ' 6125357.997243024 2986427.2405552845, 6125357.997243024 2986451.724290908,' +
        ' 6125453.543528381 2986451.724290908, 6125453.543528381 2986497.705940736,' +
        ' 6125485.790399687 2986497.705940736, 6125485.790399687 2986387.2305482933,' +
        ' 6125469.069799753 2986387.2305482933))');

      const res = DPolygon.parseFromWKT('POLYGON ((6125368.149035845 2986380.0645768913, 6125362.177393007 ' +
        '2986380.0645768913,' +
        ' 6125362.177393007 2986427.2405552845, 6125357.997243024 2986427.2405552845,' +
        ' 6125357.997243024 2986451.724290908, 6125362.177393007 2986451.724290908,' +
        ' 6125362.177393007 2986499.4974335856, 6125362.7745572915 2986499.4974335856,' +
        ' 6125362.7745572915 2986510.843554975, 6125484.596071121 2986510.843554975,' +
        ' 6125484.596071121 2986497.705940736, 6125485.790399687 2986497.705940736,' +
        ' 6125485.790399687 2986387.2305482933, 6125469.069799753 2986387.2305482933,' +
        ' 6125469.069799753 2986375.2872626223, 6125368.149035845 2986375.2872626223,' +
        ' 6125368.149035845 2986380.0645768913), (6125453.543528381 2986489.345640765,' +
        ' 6125420.699492789 2986489.345640765, 6125420.699492789 2986451.724290908,' +
        ' 6125453.543528381 2986451.724290908, 6125453.543528381 2986489.345640765),' +
        ' (6125420.699492789 2986427.2405552845, 6125420.699492789 2986401.5624910956,' +
        ' 6125453.543528381 2986401.5624910956, 6125453.543528381 2986427.2405552845,' +
        ' 6125420.699492789 2986427.2405552845), (6125404.576057136 2986401.5624910956,' +
        ' 6125404.576057136 2986427.2405552845, 6125378.897992946 2986427.2405552845,' +
        ' 6125378.897992946 2986401.5624910956, 6125404.576057136 2986401.5624910956),' +
        ' (6125404.576057136 2986451.724290908, 6125404.576057136 2986489.345640765,' +
        ' 6125378.897992946 2986489.345640765, 6125378.897992946 2986451.724290908,' +
        ' 6125404.576057136 2986451.724290908))');
      expect(a.smartUnion(b)!.equal(res)).toBe(true);
    });
  });
});
