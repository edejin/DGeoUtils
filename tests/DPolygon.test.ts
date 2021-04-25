/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DPoint, DPolygon, PSEUDO_MERCATOR, WORLD_GEODETIC_SYSTEM} from '../src';

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
      expect(DPolygon.parseFromWKT('POINT (30 10)', {
        dataProjection: WORLD_GEODETIC_SYSTEM,
        featureProjection: PSEUDO_MERCATOR
      })).toEqual({
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
      expect(t.clone().clockWise.equal(t.reverse())).toEqual(true);
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
  });

  describe('scale', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').scale(2, 1)
        .toWKT()).toBe('POLYGON ((60 10, 80 40, 40 40, 20 20, 60 10))');
    });
  });

  describe('divide', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').divide(2, 1)
        .toWKT()).toBe('POLYGON ((15 10, 20 40, 10 40, 5 20, 15 10))');
    });
  });

  describe('round', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2))').round()
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 21 41, 11 21, 30 10))');
    });
  });

  describe('floor', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2))').floor()
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
    });
  });

  describe('ceil', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1 10.2, 40.3 40.4, 20.5 40.6, 10.7 20.8, 30.1 10.2))').ceil()
        .toWKT()).toBe('POLYGON ((31 11, 41 41, 21 41, 11 21, 31 11))');
    });
  });

  describe('toFixed', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30.1123 10.2123, 40.3123 40.4123, 20.5123 40.6123,' +
        ' 10.7123 20.8123, 30.1123 10.2123))').toFixed()
        .toWKT()).toBe('POLYGON ((30.11 10.21, 40.31 40.41, 20.51 40.61, 10.71 20.81, 30.11 10.21))');
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
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').transform()
        .toWKT()).toBe('POLYGON ((0.00026949458527337036 0.00008983152842745312, 0.0003593261136978272' +
        ' 0.0003593261137098125, 0.0001796630568489136 0.0003593261137098125, 0.0000898315284244568 0.00017966' +
        '305685490624, 0.00026949458527337036 0.00008983152842745312))');
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
});
