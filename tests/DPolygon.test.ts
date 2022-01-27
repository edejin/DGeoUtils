/* eslint-disable max-lines,max-statements,max-lines-per-function */
import {DPoint, DPolygon, createCanvas} from '../src';
import {JSDOM} from 'jsdom';
const {document} = (new JSDOM('...')).window;

createCanvas.document = document;

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
    test('2', () => {
      expect(DPolygon.parse([
        [1, 1],
        [11, 1],
        [11, 11],
        [9, 10],
        [6, 7],
        [7, 6],
        [9, 10],
        [1, 11]
      ]).deintersection.open().toArrayOfCoords()).toEqual([
        [1, 1],
        [11, 1],
        [11, 11],
        [9, 10],
        [7, 6],
        [6, 7],
        [9, 10],
        [1, 11]
      ]);
    });
    test('3', () => {
      expect(DPolygon.parse([
        [1, 1],
        [11, 1],
        [11, 11],
        [9, 10],
        [6, 7],
        [7, 6],
        [9, 10],
        [12, 12],
        [10, 12],
        [9, 10],
        [1, 11]
      ]).deintersection.open().toArrayOfCoords()).toEqual([
        [1, 1],
        [11, 1],
        [11, 11],
        [9, 10],
        [7, 6],
        [6, 7],
        [9, 10],
        [12, 12],
        [10, 12],
        [9, 10],
        [1, 11]
      ]);
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
        new DPoint(4, 3),
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
    test('2', () => {
      expect(new DPolygon([
        new DPoint(1, 1),
        new DPoint(5, 5),
        new DPoint(9, 1),
        new DPoint(4, 3),
        new DPoint(1, 1)
      ]).reverse().convex).toEqual({
        holes: [],
        properties: {},
        searchStore: {},
        pPoints: [
          {
            x: 1,
            y: 1,
            z: undefined,
            properties: {}
          },
          {
            x: 9,
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
            x: 1,
            y: 1,
            z: undefined,
            properties: {}
          }
        ]
      });
    });
  });

  describe('hasSimpleIntersection', () => {
    test('1', () => {
      expect(DPolygon.createSquareBySize(new DPoint(10, 10))
        .hasSimpleIntersection(DPolygon.createSquareBySize(new DPoint(10, 10))
          .loop()
          .move(20, 0)
          .run())).toBe(false);
    });
    test('2', () => {
      expect(DPolygon.createSquareBySize(new DPoint(10, 10))
        .hasSimpleIntersection(DPolygon.createSquareBySize(new DPoint(10, 10))
          .loop()
          .move(9, 9)
          .run())).toBe(true);
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
    test('2', () => {
      expect(DPolygon.minAreaRectangleDirection(new DPolygon())).toBe(0);
    });
    test('3', () => {
      expect(DPolygon.minAreaRectangleDirection(new DPolygon([
        new DPoint(10, 20),
        new DPoint(30, 40),
        new DPoint(50, 50),
        new DPoint(70, 70)
      ]).minAreaRectangle.reverse())).toBe(2.498091544796509);
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
    test('2', () => {
      expect(new DPolygon([
        new DPoint(0, 10),
        new DPoint(0, 20),
        new DPoint(0, 30)
      ]).divideToPieces(2)).toEqual({
        holes: [],
        pPoints: [
          {
            properties: {},
            x: 0,
            y: 10,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 0,
            y: 20,
            z: undefined
          },
          {
            properties: {
              pieceBorder: true
            },
            x: 0,
            y: 30,
            z: undefined
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('filter', () => {
    test('1', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))').filter((p: DPoint) => p.x > 20)
        .toWKT()).toBe('POLYGON ((30 10, 40 40, 30 10))');
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

  describe('at', () => {
    test('1', () => {
      const t = DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
      expect(t.at(0)).toEqual({
        x: 30,
        y: 10,
        z: undefined,
        properties: {}
      });
      expect(t.at(5)).toEqual({
        x: 30,
        y: 10,
        z: undefined,
        properties: {}
      });
      expect(t.at(-2)).toEqual({
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
      expect(t.has(DPoint.zero())).toBe(false);
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
      expect(t1.findIndex(DPoint.zero())).toBe(-1);
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
    test('7', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((' +
        '104.30941772460938 42.41554259064343,' +
        ' 139.97471004509413 44.11388932737724,' +
        ' 140.7854321633292 25.197157289769727,' +
        ' 104.30941772460938 22.935078076843972' +
        '))').contain(new DPoint(122.14206388485175, 33.5244837021106))).toBe(true);
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
      const [t] = createCanvas(100);
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
      const [t] = createCanvas(100);
      DPolygon.parseFromWKT('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))')
        .drawPolygonOnCanvas(
          t,
          undefined,
          '#00ff00'
        );
      expect(t.toDataURL()).toMatchSnapshot();
    });
    test('3', () => {
      const [t] = createCanvas(100);
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
      const [canvas] = createCanvas(150, 100);
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
    expect(poly.fastHas(new DPoint(30, 10, 7))).toBe(false);
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

      expect(a.simpleUnion(b)!.same(res1)).toBe(true);
      expect((a.simpleIntersection(b)! as DPolygon).equal(res2)).toBe(true);
    });

    test('Contain', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 2 8, 8 8, 8 2))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((4 4, 4 6, 6 6, 6 4))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 2, 2 8, 8 8, 8 2))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((4 4, 4 6, 6 6, 6 4))').close();

      expect(a.simpleUnion(b)!.same(res1)).toBe(true);
      expect((a.simpleIntersection(b)! as DPolygon).equal(res2)).toBe(true);
    });

    test('Moon', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 2 6, 6 6, 6 2))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((4 8, 8 8, 8 4, 5 4, 7 7, 4 5))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 4, 8 4, 8 8, 4 8, 4 6, 2 6, 2 2),' +
        ' (6 5.5, 6 6, 5.5 6, 7 7, 6 5.5))');
      const res2 = DPolygon.parseFromWKT('POLYGON ((6 4, 6 5.5, 5 4, 6 4))');
      const res3 = DPolygon.parseFromWKT('POLYGON ((5.5 6, 4 6, 4 5, 5.5 6))');

      expect(a.simpleUnion(b)!.same(res1)).toBe(true);
      const res = a.simpleIntersection(b) as DPolygon[];
      const [r1, r2] = res;
      expect((r1.equal(res2) && r2.equal(res3)) || (r2.equal(res2) && r1.equal(res3))).toBe(true);
    });

    test('touch', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 6, 2 6))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((6 3, 10 3, 10 5, 6 5))').close();
      const c = DPolygon.parseFromWKT('POLYGON ((6 6, 6 10, 10 10, 10 6))').close();
      const d = DPolygon.parseFromWKT('POLYGON ((4 6, 5 10, 3 10))').close();
      const e = DPolygon.parseFromWKT('POLYGON ((5 10, 3 10, 4 6))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 3, 10 3, 10 5, 6 5, 6 6, 2 6))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((6 6, 6 10, 10 10, 10 6, 6 6, 6 2, 2 2, 2 6))').close();
      const res3 = DPolygon.parseFromWKT('POLYGON ((4 6, 3 10, 5 10, 4 6, 6 6, 6 2, 2 2, 2 6))').close();

      expect(a.simpleIntersection(b)).toBe(null);
      expect(a.simpleIntersection(c)).toBe(null);
      expect(a.simpleIntersection(d)).toBe(null);

      expect(a.simpleUnion(b)!.same(res1)).toBe(true);
      expect(a.simpleUnion(c)!.same(res2)).toBe(true);
      expect(a.simpleUnion(d)!.same(res3)).toBe(true);
      expect(a.simpleUnion(e)!.same(res3)).toBe(true);
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

      expect((a.simpleUnion(b)! as DPolygon).same(res1)).toBe(true);
      expect((a.simpleUnion(c)! as DPolygon).same(res2)).toBe(true);
      expect((a.simpleUnion(d)! as DPolygon).same(res3)).toBe(true);
    });

    test('Outside only', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 4, 8 4, 8 6, 2 6))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((4 2, 6 2, 6 8, 4 8))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((4 4, 6 4, 6 6, 4 6))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((4 2, 6 2, 6 4, 8 4, 8 6, 6 6, 6 8, 4 8, 4 6,' +
        ' 2 6, 2 4, 4 4))').close();

      expect((a.simpleIntersection(b)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(b)! as DPolygon).same(res2)).toBe(true);
    });

    test('Border corners', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 8 2, 8 10, 2 10))').close();
      const e = DPolygon.parseFromWKT('POLYGON ((7 6, 8 5, 9 6, 8 7))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((8 5, 8 7, 7 6))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 2, 8 2, 8 5, 9 6, 8 7, 8 10, 2 10))').close();

      expect((a.simpleIntersection(e)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(e)! as DPolygon).same(res2)).toBe(true);
    });

    test('Custom test 1', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 6, 2 6))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((5 5, 7 5, 6 3))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((6 3, 6 5, 5 5))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 3, 7 5, 6 5, 6 6, 2 6))').close();

      expect((a.simpleIntersection(b)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(b)! as DPolygon).same(res2)).toBe(true);
    });

    test('Custom test 2', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 6, 2 6))').close();
      const b = DPolygon.parseFromWKT('POLYGON ((3 5, 4 5, 5 6, 4 7, 3 7, 4 6))').close();

      const res1 = DPolygon.parseFromWKT('POLYGON ((3 5, 4 5, 5 6, 4 6))').close();
      const res2 = DPolygon.parseFromWKT('POLYGON ((2 2, 6 2, 6 6, 5 6, 4 7, 3 7, 4 6, 2 6))').close();

      expect((a.simpleIntersection(b)! as DPolygon).equal(res1)).toBe(true);
      expect((a.simpleUnion(b)! as DPolygon).same(res2)).toBe(true);
    });
  });

  describe('smartUnion', () => {
    test('1', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((1 8, 5 8, 5 2, 1 2, 1 8), (2 7, 4 7, 4 3, 2 3, 2 7))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 1, 3 5, 8 5, 8 1, 3 1), (6 4, 6 2, 7 2, 7 4, 6 4))');

      const res = DPolygon.parseFromWKT('POLYGON ((1 8, 5 8, 5 5, 8 5, 8 1, 3 1, 3 2, 1 2, 1 8), (2 7, 4 7' +
        ', 4 3, 2 3, 2 7), (6 4, 6 2, 7 2, 7 4, 6 4))');
      expect(a.smartUnion(b)!.same(res)).toBe(true);
    });
    test('2', () => {
      const a = DPolygon.parseFromWKT('POLYGON ((1 8, 5 8, 5 2, 1 2, 1 8), (2 7, 4 7, 4 3, 2 3, 2 7))');
      const b = DPolygon.parseFromWKT('POLYGON ((3 1, 3 5, 8 5, 8 1, 3 1), (4 4, 7 4, 7 3, 4 3, 4 4))');

      const res = DPolygon.parseFromWKT('POLYGON ((1 8, 5 8, 5 5, 8 5, 8 1, 3 1, 3 2, 1 2, 1 8), (2 7, 4 7, 4 4,' +
        ' 7 4, 7 3, 4 3, 2 3, 2 7))');
      expect(a.smartUnion(b)!.same(res)).toBe(true);
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
      expect(a.smartUnion(b)!.same(res)).toBe(true);
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
      // expect(a.smartUnion(b)!.same(res)).toBe(true);
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
      // expect(a.smartUnion(b)!.same(res)).toBe(true);
    });
  });

  describe('toTriangles', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 0),
        new DPoint(10, 0),
        new DPoint(10, 10),
        new DPoint(0, 10)
      ]);
      expect(p.toTriangles().map((v: DPolygon) => v.toString())
        .join()).toBe('(0 0, 10 0, 10 10),(0 0, 10 10, 0 10)');
    });
    test('2', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((1 1, 4 1, 4 2, 2 2, 2 3, 5 3, 5 4, 3 4, 3 5, 4 5, 4 6,' +
        ' 1 6, 1 5, 2 5, 2 4, 1 4))')
        .loop()
        .scale(10)
        .run()
        .close();
      expect(p
        .toTriangles()
        .map((v: DPolygon) => v.toString())
        .join()).toBe('(10 10, 40 10, 40 20),' +
        '(10 10, 40 20, 20 20),' +
        '(10 10, 20 20, 20 30),' +
        '(20 30, 50 30, 50 40),' +
        '(20 30, 50 40, 30 40),' +
        '(20 30, 30 40, 30 50),' +
        '(30 50, 40 50, 40 60),' +
        '(30 50, 40 60, 10 60),' +
        '(10 60, 10 50, 20 50),' +
        '(20 40, 10 40, 10 10),' +
        '(20 40, 10 10, 20 30),' +
        '(20 40, 20 30, 30 50),' +
        '(30 50, 10 60, 20 50),' +
        '(30 50, 20 50, 20 40)');
    });
    test('3', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((1 1, 4 1, 4 2, 2 2, 2 3, 5 3, 5 4, 3 4, 3 5, 4 5, 4 6,' +
        ' 1 6, 1 5, 2 5, 2 4, 1 4), (1.2 1.2, 1.8 1.2, 1.8 3.8, 1.2 3.8))')
        .loop()
        .scale(10)
        .run()
        .close();
      const triangles = p.toTriangles();
      expect(triangles
        .map((v: DPolygon) => v.toString())
        .join()).toBe('(12 12, 12 38, 10 10),' +
        '(12 12, 10 10, 40 10),' +
        '(40 10, 40 20, 20 20),' +
        '(20 30, 50 30, 50 40),' +
        '(20 30, 50 40, 30 40),' +
        '(20 30, 30 40, 30 50),' +
        '(30 50, 40 50, 40 60),' +
        '(30 50, 40 60, 10 60),' +
        '(10 60, 10 50, 20 50),' +
        '(10 40, 10 10, 12 38),' +
        '(10 40, 12 38, 18 38),' +
        '(18 12, 12 12, 40 10),' +
        '(18 12, 40 10, 20 20),' +
        '(18 12, 20 20, 20 30),' +
        '(30 50, 10 60, 20 50),' +
        '(30 50, 20 50, 20 40),' +
        '(20 40, 10 40, 18 38),' +
        '(20 40, 18 38, 18 12),' +
        '(20 40, 18 12, 20 30),' +
        '(20 40, 20 30, 30 50)');
    });
    test('4', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((40 20, 18 12, 12 12, 40 10))')
        .close();
      expect(p.toTriangles()
        .map((v: DPolygon) => v.toString())
        .join()).toBe('(18 12, 12 12, 40 10),(18 12, 40 10, 40 20)');
    });
    test('5', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((1 1, 4 1, 4 2, 2 2, 2 3, 5 3, 5 4, 3 4, 3 5, 4 5, 4 6,' +
        ' 1 6, 1 5, 2 5, 2 4, 1 4), (1.2 1.2, 1.8 1.2, 1.8 3.8, 1.2 3.8), (3.2 3.2, 3.2 3.8, 3.8 3.8, 3.8 3.2))')
        .loop()
        .scale(10)
        .run()
        .close();
      const triangles = p.toTriangles();
      expect(triangles
        .map((v: DPolygon) => v.toString())
        .join()).toBe('(18 38, 32 32, 32 38),' +
        '(12 12, 12 38, 10 10),' +
        '(12 12, 10 10, 40 10),' +
        '(40 10, 40 20, 20 20),' +
        '(30 50, 40 50, 40 60),' +
        '(30 50, 40 60, 10 60),' +
        '(10 60, 10 50, 20 50),' +
        '(10 40, 10 10, 12 38),' +
        '(10 40, 12 38, 18 38),' +
        '(10 40, 18 38, 32 38),' +
        '(10 40, 32 38, 38 38),' +
        '(18 12, 12 12, 40 10),' +
        '(18 12, 40 10, 20 20),' +
        '(18 12, 20 20, 20 30),' +
        '(30 50, 10 60, 20 50),' +
        '(30 50, 20 50, 20 40),' +
        '(20 40, 10 40, 38 38),' +
        '(18 38, 18 12, 20 30),' +
        '(30 40, 30 50, 20 40),' +
        '(30 40, 20 40, 38 38),' +
        '(32 32, 18 38, 20 30),' +
        '(32 32, 20 30, 50 30),' +
        '(50 40, 30 40, 38 38),' +
        '(50 40, 38 38, 38 32),' +
        '(38 32, 32 32, 50 30),' +
        '(38 32, 50 30, 50 40)');
    });
  });

  describe('arrayOfTrianglesToVertices', () => {
    test('1', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((1 1, 4 1, 4 2, 2 2, 2 3, 5 3, 5 4, 3 4, 3 5, 4 5, 4 6,' +
        ' 1 6, 1 5, 2 5, 2 4, 1 4), (1.2 1.2, 1.8 1.2, 1.8 3.8, 1.2 3.8), (32 32, 32 38, 38 38, 38 32))')
        .loop()
        .scale(10)
        .run()
        .close();
      expect(DPolygon.arrayOfTrianglesToVertices(p.toTriangles(), 1))
        .toEqual([
          12,
          12,
          1,
          12,
          38,
          1,
          10,
          10,
          1,
          12,
          12,
          1,
          10,
          10,
          1,
          40,
          10,
          1,
          40,
          10,
          1,
          40,
          20,
          1,
          20,
          20,
          1,
          20,
          30,
          1,
          50,
          30,
          1,
          50,
          40,
          1,
          20,
          30,
          1,
          50,
          40,
          1,
          30,
          40,
          1,
          20,
          30,
          1,
          30,
          40,
          1,
          30,
          50,
          1,
          30,
          50,
          1,
          40,
          50,
          1,
          40,
          60,
          1,
          30,
          50,
          1,
          40,
          60,
          1,
          10,
          60,
          1,
          10,
          60,
          1,
          10,
          50,
          1,
          20,
          50,
          1,
          10,
          40,
          1,
          10,
          10,
          1,
          12,
          38,
          1,
          10,
          40,
          1,
          12,
          38,
          1,
          18,
          38,
          1,
          18,
          12,
          1,
          12,
          12,
          1,
          40,
          10,
          1,
          18,
          12,
          1,
          40,
          10,
          1,
          20,
          20,
          1,
          18,
          12,
          1,
          20,
          20,
          1,
          20,
          30,
          1,
          30,
          50,
          1,
          10,
          60,
          1,
          20,
          50,
          1,
          30,
          50,
          1,
          20,
          50,
          1,
          20,
          40,
          1,
          20,
          40,
          1,
          10,
          40,
          1,
          18,
          38,
          1,
          20,
          40,
          1,
          18,
          38,
          1,
          18,
          12,
          1,
          20,
          40,
          1,
          18,
          12,
          1,
          20,
          30,
          1,
          20,
          40,
          1,
          20,
          30,
          1,
          30,
          50,
          1
        ]);
    });
  });

  describe('buffer', () => {
    test('line', () => {
      expect(new DPolygon([
        new DPoint(0, 0),
        new DPoint(10, 10)
      ]).buffer(2)
        .toWKT()).toBe('POLYGON ((8.585786437626904 11.414213562373096, 8.620918910525866 11.448494165902934,' +
        ' 8.656882090305963 11.481902250709918, 8.693654314092447 11.51441769301297,' +
        ' 8.731213431672709 11.546020906725474, 8.769536818838747 11.576692855253214,' +
        ' 8.808601391015133 11.60641506296129, 8.848383617164309 11.635169626303167,' +
        ' 8.888859533960796 11.66293922460509, 8.930004760225806 11.689707130499414,' +
        ' 8.971794511613556 11.715457220000545, 9.014203615540431 11.740173982217422,' +
        ' 9.057206526348004 11.76384252869671, 9.100777340690787 11.78644860239103,' +
        ' 9.144889813139436 11.807978586246886, 9.189517371990021 11.828419511407061,' +
        ' 9.23463313526982 11.847759065022574, 9.280209926930024 11.865985597669479,' +
        ' 9.32622029321556 11.883088130366042, 9.372636519202217 11.899056361186073,' +
        ' 9.419430645491076 11.913880671464417, 9.466574485050204 11.927552131590879,' +
        ' 9.514039640193472 11.940062506389088, 9.56179751968626 11.951404260077057,' +
        ' 9.609819355967744 11.96157056080646, 9.658076222479398 11.970555284777882,' +
        ' 9.706539051089276 11.978353019929562, 9.755178649601568 11.98495906919742,' +
        ' 9.803965719340878 11.990369453344394, 9.852870872800665 11.99458091335738,' +
        ' 9.901864651345164 11.997590912410345, 9.950917542954176 11.99939763739241,' +
        ' 10 12, 10.049082457045824 11.99939763739241, 10.098135348654836 11.997590912410345,' +
        ' 10.147129127199335 11.99458091335738, 10.196034280659122 11.990369453344394, 10.244821350398432' +
        ' 11.98495906919742, 10.293460948910724 11.978353019929562, 10.341923777520602 11.970555284777882,' +
        ' 10.390180644032256 11.96157056080646, 10.43820248031374 11.951404260077057, 10.485960359806528' +
        ' 11.940062506389088, 10.533425514949798 11.927552131590879, 10.580569354508924 11.913880671464417,' +
        ' 10.627363480797783 11.899056361186073, 10.67377970678444 11.883088130366042, 10.719790073069976' +
        ' 11.865985597669479, 10.76536686473018 11.847759065022574, 10.81048262800998 11.828419511407061,' +
        ' 10.855110186860564 11.807978586246886, 10.899222659309213 11.786448602391031, 10.942793473651996' +
        ' 11.76384252869671, 10.985796384459569 11.740173982217422, 11.028205488386444 11.715457220000545,' +
        ' 11.069995239774194 11.689707130499414, 11.111140466039204 11.66293922460509, 11.151616382835691' +
        ' 11.635169626303167, 11.191398608984867 11.60641506296129, 11.230463181161253 11.576692855253212,' +
        ' 11.268786568327291 11.546020906725474, 11.306345685907553 11.51441769301297, 11.343117909694037' +
        ' 11.481902250709918, 11.379081089474134 11.448494165902934, 11.414213562373096 11.414213562373096,' +
        ' 11.448494165902934 11.379081089474134, 11.481902250709918 11.343117909694037, 11.51441769301297' +
        ' 11.306345685907553, 11.546020906725474 11.268786568327291, 11.576692855253214 11.230463181161253,' +
        ' 11.60641506296129 11.191398608984867, 11.635169626303167 11.151616382835691, 11.66293922460509' +
        ' 11.111140466039204, 11.689707130499414 11.069995239774194, 11.715457220000545 11.028205488386444,' +
        ' 11.740173982217422 10.985796384459569, 11.76384252869671 10.942793473651996, 11.786448602391031' +
        ' 10.899222659309213, 11.807978586246886 10.855110186860564, 11.828419511407061 10.81048262800998,' +
        ' 11.847759065022574 10.76536686473018, 11.865985597669479 10.719790073069976, 11.88308813036604' +
        ' 10.67377970678444, 11.899056361186073 10.627363480797783, 11.913880671464417 10.580569354508924,' +
        ' 11.927552131590879 10.533425514949796, 11.940062506389088 10.485960359806528, 11.951404260077057' +
        ' 10.43820248031374, 11.96157056080646 10.390180644032258, 11.970555284777882 10.341923777520602,' +
        ' 11.978353019929562 10.293460948910724, 11.98495906919742 10.244821350398432, 11.990369453344394' +
        ' 10.196034280659122, 11.99458091335738 10.147129127199335, 11.997590912410345 10.098135348654836,' +
        ' 11.99939763739241 10.049082457045824, 12 10, 11.99939763739241 9.950917542954176, 11.997590912410345' +
        ' 9.901864651345164, 11.99458091335738 9.852870872800665, 11.990369453344394 9.803965719340878,' +
        ' 11.98495906919742 9.755178649601568, 11.978353019929562 9.706539051089276, 11.970555284777882' +
        ' 9.658076222479398, 11.96157056080646 9.609819355967742, 11.951404260077057 9.56179751968626,' +
        ' 11.940062506389088 9.514039640193472, 11.927552131590879 9.466574485050204, 11.913880671464417' +
        ' 9.419430645491076, 11.899056361186073 9.372636519202217, 11.88308813036604 9.32622029321556,' +
        ' 11.865985597669479 9.280209926930024, 11.847759065022574 9.23463313526982, 11.828419511407061' +
        ' 9.18951737199002, 11.807978586246886 9.144889813139436, 11.78644860239103 9.100777340690787,' +
        ' 11.76384252869671 9.057206526348004, 11.740173982217422 9.014203615540431, 11.715457220000545' +
        ' 8.971794511613556, 11.689707130499414 8.930004760225806, 11.66293922460509 8.888859533960796,' +
        ' 11.635169626303167 8.848383617164309, 11.60641506296129 8.808601391015133, 11.576692855253214' +
        ' 8.769536818838747, 11.546020906725474 8.731213431672709, 11.51441769301297 8.693654314092447,' +
        ' 11.481902250709918 8.656882090305963, 11.448494165902934 8.620918910525866, 11.414213562373096' +
        ' 8.585786437626904, 1.414213562373095 -1.414213562373095, 1.3790810894741339 -1.4484941659029338,' +
        ' 1.3431179096940369 -1.4819022507099182, 1.3063456859075537 -1.5144176930129691, 1.268786568327291' +
        ' -1.5460209067254738, 1.2304631811612536 -1.5766928552532125, 1.191398608984867 -1.6064150629612897,' +
        ' 1.1516163828356907 -1.6351696263031674, 1.1111404660392046 -1.6629392246050905, 1.0699952397741945' +
        ' -1.689707130499414, 1.0282054883864433 -1.7154572200005442, 0.9857963844595682 -1.7401739822174227,' +
        ' 0.9427934736519956 -1.7638425286967099, 0.8992226593092132 -1.7864486023910306, 0.8551101868605644' +
        ' -1.8079785862468867, 0.8104826280099797 -1.8284195114070614, 0.7653668647301797 -1.8477590650225735,' +
        ' 0.7197900730699766 -1.8659855976694777, 0.6737797067844401 -1.8830881303660416, 0.6273634807977831' +
        ' -1.8990563611860733, 0.5805693545089247 -1.9138806714644179, 0.5334255149497968 -1.9275521315908797,' +
        ' 0.48596035980652796 -1.940062506389088, 0.43820248031374 -1.951404260077057, 0.39018064403225666' +
        ' -1.9615705608064609, 0.34192377752060227 -1.9705552847778824, 0.2934609489107235 -1.978353019929562,' +
        ' 0.24482135039843256 -1.98495906919742, 0.19603428065912154 -1.9903694533443936, 0.1471291271993349' +
        ' -1.9945809133573804, 0.09813534865483625 -1.9975909124103448, 0.04908245704582453 -1.9993976373924085,' +
        ' 1.2246467991473532e-16 -2, -0.049082457045824285 -1.9993976373924085, -0.09813534865483602' +
        ' -1.9975909124103448, -0.14712912719933466 -1.9945809133573804, -0.1960342806591213 -1.9903694533443939,' +
        ' -0.2448213503984323 -1.98495906919742, -0.2934609489107233 -1.978353019929562, -0.34192377752060205' +
        ' -1.9705552847778827, -0.3901806440322564 -1.9615705608064609, -0.4382024803137393 -1.9514042600770571,' +
        ' -0.48596035980652774 -1.940062506389088, -0.5334255149497966 -1.9275521315908797, -0.5805693545089243' +
        ' -1.9138806714644179, -0.6273634807977828 -1.8990563611860733, -0.6737797067844399 -1.8830881303660416,' +
        ' -0.7197900730699763 -1.8659855976694777, -0.7653668647301795 -1.8477590650225735, -0.8104826280099795' +
        ' -1.8284195114070614, -0.8551101868605645 -1.8079785862468865, -0.8992226593092134 -1.7864486023910304,' +
        ' -0.9427934736519954 -1.76384252869671, -0.985796384459568 -1.740173982217423, -1.028205488386443' +
        ' -1.7154572200005442, -1.069995239774194 -1.6897071304994145, -1.111140466039204 -1.6629392246050907,' +
        ' -1.15161638283569 -1.6351696263031679, -1.1913986089848667 -1.6064150629612899, -1.2304631811612534' +
        ' -1.5766928552532127, -1.2687865683272908 -1.5460209067254742, -1.3063456859075537 -1.514417693012969,' +
        ' -1.3431179096940369 -1.481902250709918, -1.3790810894741339 -1.4484941659029338, -1.414213562373095' +
        ' -1.4142135623730951, -1.4484941659029336 -1.379081089474134, -1.4819022507099178 -1.343117909694037,' +
        ' -1.5144176930129687 -1.3063456859075542, -1.546020906725474 -1.268786568327291, -1.5766928552532125' +
        ' -1.2304631811612539, -1.6064150629612897 -1.191398608984867, -1.6351696263031676 -1.1516163828356902,' +
        ' -1.6629392246050907 -1.1111404660392044, -1.6897071304994142 -1.0699952397741943, -1.715457220000544' +
        ' -1.0282054883864435, -1.7401739822174227 -0.9857963844595683, -1.7638425286967099 -0.9427934736519957,' +
        ' -1.7864486023910304 -0.8992226593092137, -1.8079785862468865 -0.8551101868605648, -1.8284195114070614' +
        ' -0.8104826280099798, -1.8477590650225735 -0.7653668647301798, -1.8659855976694777 -0.7197900730699767,' +
        ' -1.8830881303660414 -0.6737797067844407, -1.8990563611860733 -0.6273634807977828, -1.9138806714644176' +
        ' -0.5805693545089248, -1.9275521315908797 -0.533425514949797, -1.940062506389088 -0.48596035980652813,' +
        ' -1.951404260077057 -0.4382024803137401, -1.9615705608064609 -0.3901806440322572, -1.9705552847778824' +
        ' -0.34192377752060243, -1.978353019929562 -0.2934609489107236, -1.98495906919742 -0.2448213503984327,' +
        ' -1.9903694533443936 -0.19603428065912165, -1.9945809133573804 -0.14712912719933546, -1.9975909124103448' +
        ' -0.09813534865483593, -1.9993976373924085 -0.04908245704582465, -2 -2.4492935982947064e-16,' +
        ' -1.9993976373924085 0.04908245704582416, -1.9975909124103448 0.09813534865483545, -1.9945809133573804' +
        ' 0.147129127199335, -1.9903694533443939 0.19603428065912118, -1.98495906919742 0.2448213503984322,' +
        ' -1.978353019929562 0.29346094891072316, -1.9705552847778827 0.34192377752060193, -1.9615705608064609' +
        ' 0.3901806440322567, -1.9514042600770571 0.4382024803137396, -1.940062506389088 0.48596035980652763,' +
        ' -1.92755213159088 0.5334255149497965, -1.9138806714644179 0.5805693545089242, -1.8990563611860736' +
        ' 0.6273634807977824, -1.8830881303660416 0.6737797067844401, -1.865985597669478 0.7197900730699762,' +
        ' -1.8477590650225737 0.7653668647301793, -1.8284195114070614 0.8104826280099794, -1.807978586246887' +
        ' 0.8551101868605636, -1.7864486023910306 0.8992226593092133, -1.76384252869671 0.9427934736519953,' +
        ' -1.740173982217423 0.9857963844595679, -1.7154572200005442 1.028205488386443, -1.6897071304994145' +
        ' 1.0699952397741939, -1.662939224605091 1.111140466039204, -1.6351696263031674 1.1516163828356907,' +
        ' -1.6064150629612899 1.1913986089848665, -1.5766928552532127 1.2304631811612534, -1.5460209067254742' +
        ' 1.2687865683272905, -1.5144176930129696 1.306345685907553, -1.4819022507099182 1.3431179096940369,' +
        ' -1.448494165902934 1.3790810894741337, -1.414213562373095 1.414213562373095, 8.585786437626904' +
        ' 11.414213562373096))');
    });
    test('polyline', () => {
      expect(new DPolygon([
        new DPoint(0, 0),
        new DPoint(10, 10),
        new DPoint(20, 0)
      ]).buffer(2)
        .toWKT()).toBe('POLYGON ((8.585786437626904 11.414213562373096, 8.620918910525866' +
        ' 11.448494165902934, 8.656882090305963 11.481902250709918, 8.693654314092447 11.51441769301297,' +
        ' 8.731213431672709 11.546020906725474, 8.769536818838747 11.576692855253214, 8.808601391015133' +
        ' 11.60641506296129, 8.848383617164309 11.635169626303167, 8.888859533960796 11.66293922460509,' +
        ' 8.930004760225806 11.689707130499414, 8.971794511613556 11.715457220000545, 9.014203615540431' +
        ' 11.740173982217422, 9.057206526348004 11.76384252869671, 9.100777340690787 11.78644860239103,' +
        ' 9.144889813139436 11.807978586246886, 9.189517371990021 11.828419511407061, 9.23463313526982' +
        ' 11.847759065022574, 9.280209926930024 11.865985597669479, 9.32622029321556 11.883088130366042,' +
        ' 9.372636519202217 11.899056361186073, 9.419430645491076 11.913880671464417, 9.466574485050204' +
        ' 11.927552131590879, 9.514039640193472 11.940062506389088, 9.56179751968626 11.951404260077057,' +
        ' 9.609819355967744 11.96157056080646, 9.658076222479398 11.970555284777882, 9.706539051089276' +
        ' 11.978353019929562, 9.755178649601568 11.98495906919742, 9.803965719340878 11.990369453344394,' +
        ' 9.852870872800665 11.99458091335738, 9.901864651345164 11.997590912410345, 9.950917542954176' +
        ' 11.99939763739241, 10 12, 10.049082457045824 11.99939763739241, 10.098135348654836 11.997590912410345,' +
        ' 10.147129127199335 11.99458091335738, 10.196034280659122 11.990369453344394, 10.244821350398432' +
        ' 11.98495906919742, 10.293460948910724 11.978353019929562, 10.341923777520602 11.970555284777882,' +
        ' 10.390180644032256 11.96157056080646, 10.43820248031374 11.951404260077057, 10.485960359806528' +
        ' 11.940062506389088, 10.533425514949798 11.927552131590879, 10.580569354508924 11.913880671464417,' +
        ' 10.627363480797783 11.899056361186073, 10.67377970678444 11.883088130366042, 10.719790073069976' +
        ' 11.865985597669479, 10.76536686473018 11.847759065022574, 10.81048262800998 11.828419511407061,' +
        ' 10.855110186860564 11.807978586246886, 10.899222659309213 11.786448602391031, 10.942793473651996' +
        ' 11.76384252869671, 10.985796384459569 11.740173982217422, 11.028205488386444 11.715457220000545,' +
        ' 11.069995239774194 11.689707130499414, 11.111140466039204 11.66293922460509, 11.151616382835691' +
        ' 11.635169626303167, 11.191398608984867 11.60641506296129, 11.230463181161253 11.576692855253212,' +
        ' 11.268786568327291 11.546020906725474, 11.306345685907553 11.51441769301297, 11.343117909694037' +
        ' 11.481902250709918, 11.379081089474134 11.448494165902934, 11.414213562373096 11.414213562373096,' +
        ' 21.414213562373096 1.414213562373095, 21.448494165902932 1.3790810894741337, 21.48190225070992' +
        ' 1.3431179096940367, 21.51441769301297 1.3063456859075535, 21.546020906725474 1.268786568327291,' +
        ' 21.576692855253214 1.2304631811612536, 21.60641506296129 1.1913986089848667, 21.635169626303167' +
        ' 1.1516163828356907, 21.66293922460509 1.1111404660392044, 21.689707130499414 1.0699952397741943,' +
        ' 21.715457220000545 1.0282054883864433, 21.740173982217424 0.9857963844595681, 21.76384252869671' +
        ' 0.9427934736519953, 21.78644860239103 0.8992226593092131, 21.807978586246886 0.8551101868605642,' +
        ' 21.828419511407063 0.8104826280099797, 21.847759065022572 0.7653668647301796, 21.86598559766948' +
        ' 0.7197900730699762, 21.88308813036604 0.6737797067844401, 21.899056361186073 0.627363480797783,' +
        ' 21.91388067146442 0.5805693545089247, 21.92755213159088 0.5334255149497967, 21.940062506389086' +
        ' 0.48596035980652785, 21.95140426007706 0.43820248031373965, 21.96157056080646 0.3901806440322565,' +
        ' 21.970555284777884 0.3419237775206024, 21.97835301992956 0.2934609489107234, 21.98495906919742' +
        ' 0.24482135039843245, 21.990369453344393 0.1960342806591212, 21.99458091335738 0.1471291271993348,' +
        ' 21.997590912410345 0.09813534865483614, 21.99939763739241 0.04908245704582463, 22 0, 21.99939763739241' +
        ' -0.04908245704582463, 21.997590912410345 -0.09813534865483614, 21.99458091335738 -0.1471291271993348,' +
        ' 21.990369453344393 -0.1960342806591212, 21.98495906919742 -0.24482135039843245, 21.97835301992956' +
        ' -0.2934609489107234, 21.970555284777884 -0.3419237775206024, 21.96157056080646 -0.3901806440322565,' +
        ' 21.95140426007706 -0.43820248031373943, 21.940062506389086 -0.48596035980652785, 21.92755213159088' +
        ' -0.5334255149497967, 21.91388067146442 -0.5805693545089246, 21.899056361186073 -0.627363480797783,' +
        ' 21.88308813036604 -0.67377970678444, 21.86598559766948 -0.7197900730699764, 21.847759065022572' +
        ' -0.7653668647301796, 21.828419511407063 -0.8104826280099796, 21.807978586246886 -0.8551101868605643,' +
        ' 21.78644860239103 -0.8992226593092131, 21.76384252869671 -0.9427934736519955, 21.740173982217424' +
        ' -0.9857963844595681, 21.715457220000545 -1.0282054883864433, 21.689707130499414 -1.0699952397741945,' +
        ' 21.66293922460509 -1.1111404660392044, 21.635169626303167 -1.1516163828356905, 21.60641506296129' +
        ' -1.1913986089848667, 21.576692855253214 -1.2304631811612536, 21.546020906725474 -1.2687865683272908,' +
        ' 21.51441769301297 -1.3063456859075535, 21.48190225070992 -1.3431179096940367, 21.448494165902932' +
        ' -1.3790810894741339, 21.414213562373096 -1.414213562373095, 21.379081089474134 -1.4484941659029338,' +
        ' 21.343117909694037 -1.4819022507099182, 21.306345685907555 -1.5144176930129691, 21.26878656832729' +
        ' -1.546020906725474, 21.230463181161255 -1.5766928552532125, 21.191398608984866 -1.6064150629612897,' +
        ' 21.15161638283569 -1.6351696263031674, 21.111140466039206 -1.6629392246050905, 21.069995239774194' +
        ' -1.689707130499414, 21.028205488386444 -1.7154572200005442, 20.98579638445957 -1.7401739822174227,' +
        ' 20.942793473651996 -1.7638425286967099, 20.899222659309213 -1.7864486023910306, 20.855110186860564' +
        ' -1.8079785862468867, 20.81048262800998 -1.8284195114070614, 20.76536686473018 -1.8477590650225735,' +
        ' 20.719790073069976 -1.8659855976694777, 20.67377970678444 -1.8830881303660414, 20.627363480797783' +
        ' -1.8990563611860733, 20.580569354508924 -1.9138806714644179, 20.533425514949798 -1.9275521315908797,' +
        ' 20.485960359806526 -1.940062506389088, 20.43820248031374 -1.951404260077057, 20.390180644032256' +
        ' -1.9615705608064609, 20.341923777520602 -1.9705552847778824, 20.293460948910724 -1.978353019929562,' +
        ' 20.244821350398432 -1.98495906919742, 20.19603428065912 -1.9903694533443936, 20.147129127199335' +
        ' -1.9945809133573804, 20.098135348654836 -1.9975909124103448, 20.049082457045824 -1.9993976373924085,' +
        ' 20 -2, 19.950917542954176 -1.9993976373924085, 19.901864651345164 -1.9975909124103448, 19.852870872800665' +
        ' -1.9945809133573804, 19.80396571934088 -1.9903694533443939, 19.755178649601568 -1.98495906919742,' +
        ' 19.706539051089276 -1.978353019929562, 19.658076222479398 -1.9705552847778827, 19.609819355967744' +
        ' -1.9615705608064609, 19.56179751968626 -1.9514042600770571, 19.514039640193474 -1.940062506389088,' +
        ' 19.466574485050202 -1.9275521315908797, 19.419430645491076 -1.9138806714644179, 19.372636519202217' +
        ' -1.8990563611860736, 19.32622029321556 -1.8830881303660414, 19.280209926930024 -1.8659855976694777,' +
        ' 19.23463313526982 -1.8477590650225735, 19.18951737199002 -1.8284195114070614, 19.144889813139436' +
        ' -1.807978586246887, 19.100777340690787 -1.7864486023910304, 19.057206526348004 -1.76384252869671,' +
        ' 19.01420361554043 -1.740173982217423, 18.971794511613556 -1.7154572200005442, 18.930004760225806' +
        ' -1.6897071304994145, 18.888859533960797 -1.6629392246050907, 18.84838361716431 -1.6351696263031674,' +
        ' 18.808601391015134 -1.6064150629612899, 18.769536818838745 -1.5766928552532127, 18.73121343167271' +
        ' -1.5460209067254742, 18.69365431409245 -1.5144176930129694, 18.656882090305963 -1.481902250709918,' +
        ' 18.620918910525866 -1.4484941659029338, 18.585786437626904 -1.414213562373095, 10 7.17157287525381,' +
        ' 1.414213562373095 -1.414213562373095, 1.3790810894741339 -1.4484941659029338, 1.3431179096940369' +
        ' -1.4819022507099182, 1.3063456859075537 -1.5144176930129691, 1.268786568327291 -1.5460209067254738,' +
        ' 1.2304631811612536 -1.5766928552532125, 1.191398608984867 -1.6064150629612897, 1.1516163828356907' +
        ' -1.6351696263031674, 1.1111404660392046 -1.6629392246050905, 1.0699952397741945 -1.689707130499414,' +
        ' 1.0282054883864433 -1.7154572200005442, 0.9857963844595682 -1.7401739822174227, 0.9427934736519956' +
        ' -1.7638425286967099, 0.8992226593092132 -1.7864486023910306, 0.8551101868605644 -1.8079785862468867,' +
        ' 0.8104826280099797 -1.8284195114070614, 0.7653668647301797 -1.8477590650225735, 0.7197900730699766' +
        ' -1.8659855976694777, 0.6737797067844401 -1.8830881303660416, 0.6273634807977831 -1.8990563611860733,' +
        ' 0.5805693545089247 -1.9138806714644179, 0.5334255149497968 -1.9275521315908797, 0.48596035980652796' +
        ' -1.940062506389088, 0.43820248031374 -1.951404260077057, 0.39018064403225666 -1.9615705608064609,' +
        ' 0.34192377752060227 -1.9705552847778824, 0.2934609489107235 -1.978353019929562, 0.24482135039843256' +
        ' -1.98495906919742, 0.19603428065912154 -1.9903694533443936, 0.1471291271993349 -1.9945809133573804,' +
        ' 0.09813534865483625 -1.9975909124103448, 0.04908245704582453 -1.9993976373924085, 1.2246467991473532e-16' +
        ' -2, -0.049082457045824285 -1.9993976373924085, -0.09813534865483602 -1.9975909124103448,' +
        ' -0.14712912719933466 -1.9945809133573804, -0.1960342806591213 -1.9903694533443939, -0.2448213503984323' +
        ' -1.98495906919742, -0.2934609489107233 -1.978353019929562, -0.34192377752060205 -1.9705552847778827,' +
        ' -0.3901806440322564 -1.9615705608064609, -0.4382024803137393 -1.9514042600770571, -0.48596035980652774' +
        ' -1.940062506389088, -0.5334255149497966 -1.9275521315908797, -0.5805693545089243 -1.9138806714644179,' +
        ' -0.6273634807977828 -1.8990563611860733, -0.6737797067844399 -1.8830881303660416, -0.7197900730699763' +
        ' -1.8659855976694777, -0.7653668647301795 -1.8477590650225735, -0.8104826280099795 -1.8284195114070614,' +
        ' -0.8551101868605645 -1.8079785862468865, -0.8992226593092134 -1.7864486023910304, -0.9427934736519954' +
        ' -1.76384252869671, -0.985796384459568 -1.740173982217423, -1.028205488386443 -1.7154572200005442,' +
        ' -1.069995239774194 -1.6897071304994145, -1.111140466039204 -1.6629392246050907, -1.15161638283569' +
        ' -1.6351696263031679, -1.1913986089848667 -1.6064150629612899, -1.2304631811612534 -1.5766928552532127,' +
        ' -1.2687865683272908 -1.5460209067254742, -1.3063456859075537 -1.514417693012969, -1.3431179096940369' +
        ' -1.481902250709918, -1.3790810894741339 -1.4484941659029338, -1.414213562373095 -1.4142135623730951,' +
        ' -1.4484941659029336 -1.379081089474134, -1.4819022507099178 -1.343117909694037, -1.5144176930129687' +
        ' -1.3063456859075542, -1.546020906725474 -1.268786568327291, -1.5766928552532125 -1.2304631811612539,' +
        ' -1.6064150629612897 -1.191398608984867, -1.6351696263031676 -1.1516163828356902, -1.6629392246050907' +
        ' -1.1111404660392044, -1.6897071304994142 -1.0699952397741943, -1.715457220000544 -1.0282054883864435,' +
        ' -1.7401739822174227 -0.9857963844595683, -1.7638425286967099 -0.9427934736519957, -1.7864486023910304' +
        ' -0.8992226593092137, -1.8079785862468865 -0.8551101868605648, -1.8284195114070614 -0.8104826280099798,' +
        ' -1.8477590650225735 -0.7653668647301798, -1.8659855976694777 -0.7197900730699767, -1.8830881303660414' +
        ' -0.6737797067844407, -1.8990563611860733 -0.6273634807977828, -1.9138806714644176 -0.5805693545089248,' +
        ' -1.9275521315908797 -0.533425514949797, -1.940062506389088 -0.48596035980652813, -1.951404260077057' +
        ' -0.4382024803137401, -1.9615705608064609 -0.3901806440322572, -1.9705552847778824 -0.34192377752060243,' +
        ' -1.978353019929562 -0.2934609489107236, -1.98495906919742 -0.2448213503984327, -1.9903694533443936' +
        ' -0.19603428065912165, -1.9945809133573804 -0.14712912719933546, -1.9975909124103448 -0.09813534865483593,' +
        ' -1.9993976373924085 -0.04908245704582465, -2 -2.4492935982947064e-16, -1.9993976373924085' +
        ' 0.04908245704582416, -1.9975909124103448 0.09813534865483545, -1.9945809133573804 0.147129127199335,' +
        ' -1.9903694533443939 0.19603428065912118, -1.98495906919742 0.2448213503984322, -1.978353019929562' +
        ' 0.29346094891072316, -1.9705552847778827 0.34192377752060193, -1.9615705608064609 0.3901806440322567,' +
        ' -1.9514042600770571 0.4382024803137396, -1.940062506389088 0.48596035980652763, -1.92755213159088' +
        ' 0.5334255149497965, -1.9138806714644179 0.5805693545089242, -1.8990563611860736 0.6273634807977824,' +
        ' -1.8830881303660416 0.6737797067844401, -1.865985597669478 0.7197900730699762, -1.8477590650225737' +
        ' 0.7653668647301793, -1.8284195114070614 0.8104826280099794, -1.807978586246887 0.8551101868605636,' +
        ' -1.7864486023910306 0.8992226593092133, -1.76384252869671 0.9427934736519953, -1.740173982217423' +
        ' 0.9857963844595679, -1.7154572200005442 1.028205488386443, -1.6897071304994145 1.0699952397741939,' +
        ' -1.662939224605091 1.111140466039204, -1.6351696263031674 1.1516163828356907, -1.6064150629612899' +
        ' 1.1913986089848665, -1.5766928552532127 1.2304631811612534, -1.5460209067254742 1.2687865683272905,' +
        ' -1.5144176930129696 1.306345685907553, -1.4819022507099182 1.3431179096940369, -1.448494165902934' +
        ' 1.3790810894741337, -1.414213562373095 1.414213562373095, 8.585786437626904 11.414213562373096))');
    });
    test('polygon', () => {
      expect(new DPolygon([
        new DPoint(10, 0),
        new DPoint(10, 10),
        new DPoint(0, 10),
        new DPoint(0, 0)
      ]).close()
        .buffer(2)
        .toWKT()).toBe('POLYGON ((10 -2, 0 -2, -0.049082457045824285 -1.9993976373924085,' +
        ' -0.09813534865483602 -1.9975909124103448, -0.14712912719933466 -1.9945809133573804,' +
        ' -0.1960342806591213 -1.9903694533443939, -0.2448213503984323 -1.98495906919742,' +
        ' -0.2934609489107233 -1.978353019929562, -0.3419237775206025 -1.9705552847778824,' +
        ' -0.3901806440322564 -1.9615705608064609, -0.4382024803137393 -1.9514042600770571,' +
        ' -0.48596035980652774 -1.940062506389088, -0.5334255149497966 -1.9275521315908797,' +
        ' -0.5805693545089243 -1.9138806714644179, -0.6273634807977828 -1.8990563611860733,' +
        ' -0.6737797067844399 -1.8830881303660416, -0.7197900730699763 -1.8659855976694777,' +
        ' -0.7653668647301795 -1.8477590650225735, -0.8104826280099795 -1.8284195114070614,' +
        ' -0.8551101868605645 -1.8079785862468865, -0.8992226593092134 -1.7864486023910304,' +
        ' -0.9427934736519954 -1.76384252869671, -0.985796384459568 -1.740173982217423,' +
        ' -1.028205488386443 -1.7154572200005442, -1.069995239774194 -1.6897071304994145,' +
        ' -1.111140466039204 -1.6629392246050907, -1.1516163828356907 -1.6351696263031674,' +
        ' -1.1913986089848667 -1.6064150629612899, -1.2304631811612534 -1.5766928552532127,' +
        ' -1.2687865683272908 -1.5460209067254742, -1.3063456859075537 -1.514417693012969,' +
        ' -1.3431179096940369 -1.481902250709918, -1.3790810894741339 -1.4484941659029338,' +
        ' -1.414213562373095 -1.4142135623730951, -1.4484941659029336 -1.379081089474134,' +
        ' -1.4819022507099178 -1.343117909694037, -1.5144176930129687 -1.3063456859075542,' +
        ' -1.546020906725474 -1.268786568327291, -1.5766928552532125 -1.2304631811612539,' +
        ' -1.6064150629612897 -1.191398608984867, -1.6351696263031672 -1.151616382835691,' +
        ' -1.6629392246050907 -1.1111404660392044, -1.6897071304994142 -1.0699952397741943,' +
        ' -1.715457220000544 -1.0282054883864435, -1.7401739822174227 -0.9857963844595683,' +
        ' -1.7638425286967099 -0.9427934736519957, -1.7864486023910304 -0.8992226593092137,' +
        ' -1.8079785862468867 -0.8551101868605641, -1.8284195114070614 -0.8104826280099798,' +
        ' -1.8477590650225735 -0.7653668647301798, -1.8659855976694777 -0.7197900730699767,' +
        ' -1.8830881303660414 -0.6737797067844407, -1.8990563611860733 -0.6273634807977828,' +
        ' -1.9138806714644176 -0.5805693545089248, -1.9275521315908797 -0.533425514949797,' +
        ' -1.940062506389088 -0.48596035980652813, -1.951404260077057 -0.4382024803137401,' +
        ' -1.9615705608064609 -0.3901806440322572, -1.9705552847778824 -0.34192377752060243,' +
        ' -1.978353019929562 -0.2934609489107236, -1.98495906919742 -0.2448213503984327,' +
        ' -1.9903694533443936 -0.19603428065912165, -1.9945809133573804 -0.14712912719933546,' +
        ' -1.9975909124103448 -0.09813534865483593, -1.9993976373924085 -0.04908245704582465,' +
        ' -2 0, -2 10, -1.9993976373924085 10.049082457045825, -1.9975909124103448 10.098135348654836,' +
        ' -1.9945809133573804 10.147129127199335, -1.9903694533443936 10.196034280659122,' +
        ' -1.98495906919742 10.244821350398432, -1.978353019929562 10.293460948910724,' +
        ' -1.9705552847778824 10.341923777520604, -1.9615705608064609 10.390180644032258,' +
        ' -1.951404260077057 10.43820248031374, -1.940062506389088 10.485960359806528,' +
        ' -1.9275521315908797 10.533425514949798, -1.9138806714644176 10.580569354508924,' +
        ' -1.8990563611860733 10.627363480797783, -1.8830881303660416 10.67377970678444,' +
        ' -1.8659855976694777 10.719790073069976, -1.8477590650225735 10.76536686473018,' +
        ' -1.8284195114070614 10.81048262800998, -1.8079785862468865 10.855110186860564,' +
        ' -1.7864486023910304 10.899222659309213, -1.7638425286967099 10.942793473651996,' +
        ' -1.7401739822174227 10.985796384459569, -1.715457220000544 11.028205488386444,' +
        ' -1.6897071304994142 11.069995239774194, -1.6629392246050907 11.111140466039204,' +
        ' -1.6351696263031672 11.151616382835691, -1.6064150629612897 11.191398608984867,' +
        ' -1.5766928552532125 11.230463181161253, -1.546020906725474 11.268786568327291,' +
        ' -1.5144176930129687 11.306345685907555, -1.4819022507099178 11.343117909694037,' +
        ' -1.4484941659029336 11.379081089474134, -1.414213562373095 11.414213562373096,' +
        ' -1.3790810894741339 11.448494165902934, -1.3431179096940369 11.481902250709918,' +
        ' -1.3063456859075537 11.51441769301297, -1.2687865683272908 11.546020906725474,' +
        ' -1.2304631811612534 11.576692855253214, -1.1913986089848667 11.60641506296129,' +
        ' -1.1516163828356907 11.635169626303167, -1.111140466039204 11.66293922460509,' +
        ' -1.069995239774194 11.689707130499414, -1.028205488386443 11.715457220000545,' +
        ' -0.985796384459568 11.740173982217422, -0.9427934736519954 11.76384252869671,' +
        ' -0.8992226593092134 11.78644860239103, -0.8551101868605637 11.807978586246886,' +
        ' -0.8104826280099795 11.828419511407061, -0.7653668647301795 11.847759065022574,' +
        ' -0.7197900730699763 11.865985597669479, -0.6737797067844399 11.883088130366042,' +
        ' -0.6273634807977828 11.899056361186073, -0.5805693545089243 11.913880671464417,' +
        ' -0.5334255149497966 11.927552131590879, -0.48596035980652774 11.940062506389088,' +
        ' -0.4382024803137393 11.951404260077057, -0.3901806440322564 11.96157056080646,' +
        ' -0.3419237775206025 11.970555284777882, -0.2934609489107233 11.978353019929562,' +
        ' -0.2448213503984323 11.98495906919742, -0.1960342806591213 11.990369453344394,' +
        ' -0.14712912719933466 11.99458091335738, -0.09813534865483602 11.997590912410345,' +
        ' -0.049082457045824285 11.99939763739241, 0 12, 10 12, 10.049082457045824 11.99939763739241,' +
        ' 10.098135348654836 11.997590912410345, 10.147129127199335 11.99458091335738,' +
        ' 10.196034280659122 11.990369453344394, 10.244821350398432 11.98495906919742,' +
        ' 10.293460948910724 11.978353019929562, 10.341923777520602 11.970555284777882,' +
        ' 10.390180644032256 11.96157056080646, 10.43820248031374 11.951404260077057,' +
        ' 10.485960359806528 11.940062506389088, 10.533425514949798 11.927552131590879,' +
        ' 10.580569354508924 11.913880671464417, 10.627363480797783 11.899056361186073,' +
        ' 10.67377970678444 11.883088130366042, 10.719790073069976 11.865985597669479,' +
        ' 10.76536686473018 11.847759065022574, 10.81048262800998 11.828419511407061,' +
        ' 10.855110186860564 11.807978586246886, 10.899222659309213 11.786448602391031,' +
        ' 10.942793473651996 11.76384252869671, 10.985796384459569 11.740173982217422,' +
        ' 11.028205488386444 11.715457220000545, 11.069995239774194 11.689707130499414,' +
        ' 11.111140466039204 11.66293922460509, 11.151616382835691 11.635169626303167,' +
        ' 11.191398608984867 11.60641506296129, 11.230463181161253 11.576692855253212,' +
        ' 11.268786568327291 11.546020906725474, 11.306345685907553 11.51441769301297,' +
        ' 11.343117909694037 11.481902250709918, 11.379081089474134 11.448494165902934,' +
        ' 11.414213562373096 11.414213562373096, 11.448494165902934 11.379081089474134,' +
        ' 11.481902250709918 11.343117909694037, 11.51441769301297 11.306345685907553,' +
        ' 11.546020906725474 11.268786568327291, 11.576692855253214 11.230463181161253,' +
        ' 11.60641506296129 11.191398608984867, 11.635169626303167 11.151616382835691,' +
        ' 11.66293922460509 11.111140466039204, 11.689707130499414 11.069995239774194,' +
        ' 11.715457220000545 11.028205488386444, 11.740173982217422 10.985796384459569,' +
        ' 11.76384252869671 10.942793473651996, 11.786448602391031 10.899222659309213,' +
        ' 11.807978586246886 10.855110186860564, 11.828419511407061 10.81048262800998,' +
        ' 11.847759065022574 10.76536686473018, 11.865985597669479 10.719790073069976,' +
        ' 11.883088130366042 10.67377970678444, 11.899056361186073 10.627363480797783,' +
        ' 11.913880671464417 10.580569354508924, 11.927552131590879 10.533425514949796,' +
        ' 11.940062506389088 10.485960359806528, 11.951404260077057 10.43820248031374,' +
        ' 11.96157056080646 10.390180644032256, 11.970555284777882 10.341923777520602,' +
        ' 11.978353019929562 10.293460948910724, 11.98495906919742 10.244821350398432,' +
        ' 11.990369453344394 10.196034280659122, 11.99458091335738 10.147129127199335,' +
        ' 11.997590912410345 10.098135348654836, 11.99939763739241 10.049082457045824,' +
        ' 12 10, 12 0, 11.99939763739241 -0.04908245704582441, 11.997590912410345 -0.09813534865483614,' +
        ' 11.99458091335738 -0.1471291271993348, 11.990369453344394 -0.19603428065912143,' +
        ' 11.98495906919742 -0.24482135039843245, 11.978353019929562 -0.2934609489107234,' +
        ' 11.970555284777882 -0.3419237775206026, 11.96157056080646 -0.3901806440322565,' +
        ' 11.951404260077057 -0.43820248031373943, 11.940062506389088 -0.48596035980652785,' +
        ' 11.927552131590879 -0.5334255149497967, 11.913880671464417 -0.5805693545089246,' +
        ' 11.899056361186073 -0.627363480797783, 11.883088130366042 -0.67377970678444,' +
        ' 11.865985597669479 -0.7197900730699764, 11.847759065022574 -0.7653668647301796,' +
        ' 11.828419511407061 -0.8104826280099796, 11.807978586246886 -0.8551101868605643,' +
        ' 11.786448602391031 -0.8992226593092131, 11.76384252869671 -0.9427934736519955,' +
        ' 11.740173982217422 -0.9857963844595681, 11.715457220000545 -1.0282054883864433,' +
        ' 11.689707130499414 -1.0699952397741945, 11.66293922460509 -1.1111404660392044,' +
        ' 11.635169626303167 -1.1516163828356907, 11.60641506296129 -1.1913986089848667,' +
        ' 11.576692855253214 -1.2304631811612536, 11.546020906725474 -1.268786568327291,' +
        ' 11.51441769301297 -1.3063456859075535, 11.481902250709918 -1.3431179096940367,' +
        ' 11.448494165902934 -1.3790810894741337, 11.414213562373096 -1.414213562373095,' +
        ' 11.379081089474134 -1.4484941659029338, 11.343117909694037 -1.4819022507099182,' +
        ' 11.306345685907553 -1.5144176930129691, 11.268786568327291 -1.5460209067254738,' +
        ' 11.230463181161253 -1.5766928552532125, 11.191398608984867 -1.6064150629612897,' +
        ' 11.151616382835691 -1.6351696263031674, 11.111140466039204 -1.6629392246050905,' +
        ' 11.069995239774194 -1.6897071304994142, 11.028205488386444 -1.7154572200005442,' +
        ' 10.985796384459569 -1.7401739822174227, 10.942793473651996 -1.7638425286967099,' +
        ' 10.899222659309213 -1.7864486023910306, 10.855110186860564 -1.8079785862468867,' +
        ' 10.81048262800998 -1.8284195114070614, 10.76536686473018 -1.8477590650225735,' +
        ' 10.719790073069976 -1.8659855976694777, 10.67377970678444 -1.8830881303660416,' +
        ' 10.627363480797783 -1.8990563611860733, 10.580569354508924 -1.9138806714644179,' +
        ' 10.533425514949798 -1.9275521315908797, 10.485960359806528 -1.940062506389088,' +
        ' 10.43820248031374 -1.9514042600770571, 10.390180644032256 -1.9615705608064609,' +
        ' 10.341923777520602 -1.9705552847778824, 10.293460948910724 -1.978353019929562,' +
        ' 10.244821350398432 -1.98495906919742, 10.196034280659122 -1.9903694533443936,' +
        ' 10.147129127199335 -1.9945809133573804, 10.098135348654836 -1.9975909124103448,' +
        ' 10.049082457045824 -1.9993976373924085, 10 -2))');
    });
    test('quadrant segments = 4', () => {
      expect(new DPolygon([
        new DPoint(10, 0),
        new DPoint(10, 10),
        new DPoint(0, 10),
        new DPoint(0, 0)
      ]).buffer(2, 4)
        .toWKT()).toBe('POLYGON ((8 8, 2 8, 2 0, 1.8477590650225735 -0.7653668647301796, 1.4142135623730951' +
        ' -1.414213562373095, 0.7653668647301797 -1.8477590650225735, 1.2246467991473532e-16 -2, -0.7653668647301795' +
        ' -1.8477590650225735, -1.414213562373095 -1.4142135623730951, -1.8477590650225735 -0.7653668647301798, -2 0,' +
        ' -2 10, -1.8477590650225735 10.76536686473018, -1.414213562373095 11.414213562373096, -0.7653668647301795' +
        ' 11.847759065022574, 0 12, 10 12, 10.76536686473018 11.847759065022574, 11.414213562373096' +
        ' 11.414213562373096, 11.847759065022574 10.76536686473018, 12 10, 12 0, 11.847759065022574' +
        ' -0.7653668647301796, 11.414213562373096 -1.414213562373095, 10.76536686473018 -1.8477590650225735,' +
        ' 10 -2, 9.23463313526982 -1.8477590650225735, 8.585786437626904 -1.4142135623730951, 8.152240934977426 ' +
        '-0.7653668647301798, 8 0, 8 8))');
    });
    test('CAP_FLAT', () => {
      expect(new DPolygon([
        new DPoint(10, 0),
        new DPoint(10, 10),
        new DPoint(0, 10)
      ]).buffer(2, 8, DPolygon.CAP_FLAT)
        .toWKT()).toBe('POLYGON ((8 8, 0 8, 0 12, 10 12, 10.390180644032256 11.96157056080646,' +
        ' 10.76536686473018 11.847759065022574, 11.111140466039204 11.66293922460509, 11.414213562373096' +
        ' 11.414213562373096, 11.66293922460509 11.111140466039204, 11.847759065022574 10.76536686473018,' +
        ' 11.96157056080646 10.390180644032256, 12 10, 12 0, 8 0, 8 8))');
    });
    test('CAP_SQUARE', () => {
      expect(new DPolygon([
        new DPoint(10, 0),
        new DPoint(10, 10),
        new DPoint(0, 10)
      ]).buffer(2, 8, DPolygon.CAP_SQUARE)
        .toWKT()).toBe('POLYGON ((8 8, 0 8, -2 8, -2 12, 10 12, 10.390180644032256 11.96157056080646,' +
        ' 10.76536686473018 11.847759065022574, 11.111140466039204 11.66293922460509, 11.414213562373096' +
        ' 11.414213562373096, 11.66293922460509 11.111140466039204, 11.847759065022574 10.76536686473018,' +
        ' 11.96157056080646 10.390180644032256, 12 10, 12 0, 12 -2, 8 -2, 8 8))');
    });
  });

  describe('getTrianglesPointIndexes', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(0, 0),
        new DPoint(10, 0),
        new DPoint(10, 10),
        new DPoint(0, 10)
      ]);
      expect(p.getTrianglesPointIndexes()).toEqual([0, 1, 2, 0, 2, 3]);
    });
    test('2', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((1 1, 4 1, 4 2, 2 2, 2 3, 5 3, 5 4, 3 4, 3 5, 4 5, 4 6,' +
        ' 1 6, 1 5, 2 5, 2 4, 1 4))')
        .loop()
        .scale(10)
        .run()
        .close();
      expect(p
        .getTrianglesPointIndexes()).toEqual([
        0,
        1,
        2,
        0,
        2,
        3,
        0,
        3,
        4,
        4,
        5,
        6,
        4,
        6,
        7,
        4,
        7,
        8,
        8,
        9,
        10,
        8,
        10,
        11,
        11,
        12,
        13,
        14,
        15,
        0,
        14,
        0,
        4,
        14,
        4,
        8,
        8,
        11,
        13,
        8,
        13,
        14
      ]);
    });
    test('3', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((1 1, 4 1, 4 2, 2 2, 2 3, 5 3, 5 4, 3 4, 3 5, 4 5, 4 6,' +
        ' 1 6, 1 5, 2 5, 2 4, 1 4), (1.2 1.2, 1.8 1.2, 1.8 3.8, 1.2 3.8))')
        .loop()
        .scale(10)
        .run()
        .close();
      const triangles = p.getTrianglesPointIndexes();
      expect(triangles).toEqual([
        17,
        20,
        0,
        17,
        0,
        1,
        1,
        2,
        3,
        4,
        5,
        6,
        4,
        6,
        7,
        4,
        7,
        8,
        8,
        9,
        10,
        8,
        10,
        11,
        11,
        12,
        13,
        15,
        0,
        20,
        15,
        20,
        19,
        18,
        17,
        1,
        18,
        1,
        3,
        18,
        3,
        4,
        8,
        11,
        13,
        8,
        13,
        14,
        14,
        15,
        19,
        14,
        19,
        18,
        14,
        18,
        4,
        14,
        4,
        8
      ]);
    });
    test('4', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((40 20, 18 12, 12 12, 40 10))')
        .close();
      expect(p.getTrianglesPointIndexes()).toEqual([
        1,
        2,
        3,
        1,
        3,
        0
      ]);
    });
    test('5', () => {
      const p = DPolygon.parseFromWKT('POLYGON ((1 1, 4 1, 4 2, 2 2, 2 3, 5 3, 5 4, 3 4, 3 5, 4 5, 4 6,' +
        ' 1 6, 1 5, 2 5, 2 4, 1 4), (1.2 1.2, 1.8 1.2, 1.8 3.8, 1.2 3.8), (3.2 3.2, 3.2 3.8, 3.8 3.8, 3.8 3.2))')
        .loop()
        .scale(10)
        .run()
        .close();
      expect(p.getTrianglesPointIndexes()).toEqual([
        19,
        21,
        22,
        17,
        20,
        0,
        17,
        0,
        1,
        1,
        2,
        3,
        8,
        9,
        10,
        8,
        10,
        11,
        11,
        12,
        13,
        15,
        0,
        20,
        15,
        20,
        19,
        15,
        19,
        22,
        15,
        22,
        23,
        18,
        17,
        1,
        18,
        1,
        3,
        18,
        3,
        4,
        8,
        11,
        13,
        8,
        13,
        14,
        14,
        15,
        23,
        19,
        18,
        4,
        7,
        8,
        14,
        7,
        14,
        23,
        21,
        19,
        4,
        21,
        4,
        5,
        6,
        7,
        23,
        6,
        23,
        24,
        24,
        21,
        5,
        24,
        5,
        6
      ]);
    });
    test('6', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((' +
        '104.30941772460938 42.41554259064343,' +
        ' 139.97471004509413 44.11388932737724,' +
        ' 140.7854321633292 25.197157289769727,' +
        ' 104.30941772460938 22.935078076843972' +
        '))').getTrianglesPointIndexes()).toEqual([3, 2, 1, 3, 1, 0]);
    });
    test('7', () => {
      expect(DPolygon.parseFromWKT('POLYGON ((' +
        '104.30941772460938 22.935078076843972 4, ' +
        '140.7854321633292 25.197157289769727 4, ' +
        '139.97471004509413 44.11388932737724 4, ' +
        '104.30941772460938 42.41554259064343 4' +
        '))').getTrianglesPointIndexes()).toEqual([0, 1, 2, 0, 2, 3]);
    });
  });

  describe('bezier', () => {
    test('2 points', () => {
      expect(new DPolygon([new DPoint(0, 0), new DPoint(10, 10)]).bezier()
        .toWKT())
        .toBe('POLYGON ((' +
          '0 0, ' +
          '1 1, ' +
          '2 2, ' +
          '3.0000000000000004 3.0000000000000004, ' +
          '4 4, ' +
          '5 5, ' +
          '6 6, ' +
          '7 7, ' +
          '7.999999999999999 7.999999999999999, ' +
          '9 9, ' +
          '9.999999999999998 9.999999999999998, ' +
          '0 0' +
          '))');
    });
    test('2 points reverse', () => {
      expect(new DPolygon([new DPoint(10, 10), new DPoint(0, 0)]).bezier()
        .toWKT())
        .toBe('POLYGON ((' +
          '10 10, ' +
          '9 9, ' +
          '8 8, ' +
          '7 7, ' +
          '6 6, ' +
          '5 5, ' +
          '4 4, ' +
          '3 3, ' +
          '2.000000000000001 2.000000000000001, ' +
          '1 1, ' +
          '1.7763568394002505e-15 1.7763568394002505e-15, ' +
          '10 10' +
          '))');
    });
    test('3 points', () => {
      expect(new DPolygon([
        new DPoint(0, 50),
        new DPoint(30, 0),
        new DPoint(80, 50)
      ]).bezier()
        .toWKT()).toBe('POLYGON ((' +
        '0 50, ' +
        '6.2 41, ' +
        '12.8 34, ' +
        '19.800000000000004 29, ' +
        '27.200000000000003 26, ' +
        '35 25, ' +
        '43.2 26, ' +
        '51.8 29, ' +
        '60.8 34, ' +
        '70.19999999999999 40.99999999999999, ' +
        '79.99999999999999 49.999999999999986, ' +
        '0 50' +
        '))');
    });
    test('3 points reverse', () => {
      expect(new DPolygon([
        new DPoint(0, 50),
        new DPoint(30, 0),
        new DPoint(80, 50)
      ]).reverse()
        .bezier()
        .toWKT()).toBe('POLYGON ((' +
        '80 50, ' +
        '70.2 41, ' +
        '60.8 34, ' +
        '51.8 29, ' +
        '43.2 26, ' +
        '35 25, ' +
        '27.2 26, ' +
        '19.8 29, ' +
        '12.8 34, ' +
        '6.20000000000001 40.99999999999999, ' +
        '7.105427357601002e-15 49.999999999999986, ' +
        '80 50' +
        '))');
    });
  });

  describe('setGrowingHeight', () => {
    test('1', () => {
      const p = new DPolygon([
        new DPoint(1, 1),
        new DPoint(5, 5)
      ]);
      expect(p.setGrowingHeight(1, 5)).toEqual({
        holes: [],
        pPoints: [
          {
            properties: {},
            x: 1,
            y: 1,
            z: 1
          },
          {
            properties: {},
            x: 5,
            y: 5,
            z: 5
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
    test('2', () => {
      const p = new DPolygon([
        new DPoint(1, 1),
        new DPoint(1, 10),
        new DPoint(10, 10),
        new DPoint(10, 1)
      ]);
      expect(p.setGrowingHeight(1, 4)).toEqual({
        holes: [],
        pPoints: [
          {
            properties: {},
            x: 1,
            y: 1,
            z: 1
          },
          {
            properties: {},
            x: 1,
            y: 10,
            z: 2
          },
          {
            properties: {},
            x: 10,
            y: 10,
            z: 3
          },
          {
            properties: {},
            x: 10,
            y: 1,
            z: 4
          }
        ],
        properties: {},
        searchStore: {}
      });
    });
  });

  describe('sort', () => {
    test('1', () => {
      expect(new DPolygon([
        new DPoint(1, 2),
        new DPoint(3, 2),
        new DPoint(2, 2),
        new DPoint(6, 2)
      ]).sort((a: DPoint, b: DPoint) => b.x - a.x)
        .toArrayOfCoords()).toEqual([[6, 2], [3, 2], [2, 2], [1, 2]]);
    });
  });
});
