var j = Object.defineProperty;
var H = (o, e, t) => e in o ? j(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var l = (o, e, t) => (H(o, typeof e != "symbol" ? e + "" : e, t), t);
class se {
  constructor() {
    l(this, "_map");
    l(this, "_indoor");
    l(this, "_indoorMap");
    l(this, "_container");
    l(this, "_levelsButtons");
    l(this, "_selectedButton");
    l(this, "_onMapLoaded", ({ indoorMap: e }) => {
      this._indoorMap = e, this._updateNavigationBar(), this._setSelected(this._indoor.getLevel());
    });
    l(this, "_onMapUnLoaded", () => {
      this._indoorMap = null, this._updateNavigationBar();
    });
    l(this, "_onLevelChanged", ({ level: e }) => this._setSelected(e));
    this._levelsButtons = [], this._selectedButton = null, this._indoorMap = null;
  }
  onAdd(e) {
    if (e.indoor === void 0)
      throw Error("call addIndoorTo(map) before creating the IndoorControl");
    this._map = e, this._indoor = this._map.indoor;
    const t = this._container = document.createElement("div");
    return t.classList.add("mapboxgl-ctrl"), t.classList.add("mapboxgl-ctrl-group"), t.style.display = "none", t.addEventListener("contextmenu", this._onContextMenu), this._indoorMap = this._indoor.getSelectedMap(), this._indoor.getSelectedMap() !== null && (this._updateNavigationBar(), this._setSelected(this._indoor.getLevel())), this._map.on("indoor.map.loaded", this._onMapLoaded), this._map.on("indoor.map.unloaded", this._onMapUnLoaded), this._map.on("indoor.level.changed", this._onLevelChanged), t;
  }
  onRemove() {
    var e, t, i, r, d;
    (e = this._container) == null || e.removeEventListener("contextmenu", this._onContextMenu), (t = this._container) == null || t.remove(), delete this._container, (i = this._map) == null || i.off("indoor.map.loaded", this._onMapLoaded), (r = this._map) == null || r.off("indoor.map.unloaded", this._onMapUnLoaded), (d = this._map) == null || d.off("indoor.level.changed", this._onLevelChanged), delete this._map;
  }
  _updateNavigationBar() {
    if (!this._container)
      return;
    if (this._indoorMap === null) {
      this._container.style.display = "none";
      return;
    }
    for (this._container.style.display = "block", this._levelsButtons = []; this._container.firstChild; )
      this._container.removeChild(this._container.firstChild);
    const e = this._indoorMap.levelsRange;
    for (let t = e.max; t >= e.min; t--)
      this._levelsButtons[t] = this._createLevelButton(this._container, t);
  }
  _setSelected(e) {
    this._levelsButtons.length !== 0 && (this._selectedButton && (this._selectedButton.style.fontWeight = "normal"), e !== null && this._levelsButtons[e] && (this._levelsButtons[e].style.fontWeight = "bold", this._selectedButton = this._levelsButtons[e]));
  }
  _createLevelButton(e, t) {
    const i = document.createElement("button");
    return i.innerHTML = t.toString(), i.classList.add("mapboxgl-ctrl-icon"), e.appendChild(i), i.addEventListener("click", () => {
      var r;
      (r = this._map) == null || r.fire("indoor.control.clicked", { level: t }), this._indoor.getLevel() !== t && this._indoor.setLevel(t);
    }), i;
  }
  _onContextMenu(e) {
    e.preventDefault();
  }
}
var f = 63710088e-1, O = {
  centimeters: f * 100,
  centimetres: f * 100,
  degrees: f / 111325,
  feet: f * 3.28084,
  inches: f * 39.37,
  kilometers: f / 1e3,
  kilometres: f / 1e3,
  meters: f,
  metres: f,
  miles: f / 1609.344,
  millimeters: f * 1e3,
  millimetres: f * 1e3,
  nauticalmiles: f / 1852,
  radians: 1,
  yards: f * 1.0936
};
function z(o, e, t) {
  t === void 0 && (t = {});
  var i = { type: "Feature" };
  return (t.id === 0 || t.id) && (i.id = t.id), t.bbox && (i.bbox = t.bbox), i.properties = e || {}, i.geometry = o, i;
}
function $(o, e, t) {
  if (t === void 0 && (t = {}), !o)
    throw new Error("coordinates is required");
  if (!Array.isArray(o))
    throw new Error("coordinates must be an Array");
  if (o.length < 2)
    throw new Error("coordinates must be at least 2 numbers long");
  if (!P(o[0]) || !P(o[1]))
    throw new Error("coordinates must contain numbers");
  var i = {
    type: "Point",
    coordinates: o
  };
  return z(i, e, t);
}
function q(o, e) {
  e === void 0 && (e = "kilometers");
  var t = O[e];
  if (!t)
    throw new Error(e + " units is invalid");
  return o * t;
}
function Z(o, e) {
  e === void 0 && (e = "kilometers");
  var t = O[e];
  if (!t)
    throw new Error(e + " units is invalid");
  return o / t;
}
function S(o) {
  var e = o % (2 * Math.PI);
  return e * 180 / Math.PI;
}
function _(o) {
  var e = o % 360;
  return e * Math.PI / 180;
}
function P(o) {
  return !isNaN(o) && o !== null && !Array.isArray(o);
}
function w(o) {
  if (!o)
    throw new Error("coord is required");
  if (!Array.isArray(o)) {
    if (o.type === "Feature" && o.geometry !== null && o.geometry.type === "Point")
      return o.geometry.coordinates;
    if (o.type === "Point")
      return o.coordinates;
  }
  if (Array.isArray(o) && o.length >= 2 && !Array.isArray(o[0]) && !Array.isArray(o[1]))
    return o;
  throw new Error("coord must be GeoJSON Point or an Array of numbers");
}
function L(o, e, t) {
  t === void 0 && (t = {});
  var i = w(o), r = w(e), d = _(r[1] - i[1]), a = _(r[0] - i[0]), n = _(i[1]), s = _(r[1]), h = Math.pow(Math.sin(d / 2), 2) + Math.pow(Math.sin(a / 2), 2) * Math.cos(n) * Math.cos(s);
  return q(2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)), t.units);
}
function J(o, e) {
  return !(o[0] > e[2] || e[0] > o[2] || o[3] < e[1] || e[3] < o[1]);
}
function Y(o, e, t = !1) {
  return [
    "all",
    o,
    [
      "any",
      t ? ["!", ["has", "level"]] : !1,
      [
        "all",
        [
          "has",
          "level"
        ],
        [
          "any",
          [
            "==",
            ["get", "level"],
            e.toString()
          ],
          [
            "all",
            [
              "!=",
              [
                "index-of",
                ";",
                ["get", "level"]
              ],
              -1
            ],
            [
              ">=",
              e,
              [
                "to-number",
                [
                  "slice",
                  ["get", "level"],
                  0,
                  [
                    "index-of",
                    ";",
                    ["get", "level"]
                  ]
                ]
              ]
            ],
            [
              "<=",
              e,
              [
                "to-number",
                [
                  "slice",
                  ["get", "level"],
                  [
                    "+",
                    [
                      "index-of",
                      ";",
                      ["get", "level"]
                    ],
                    1
                  ]
                ]
              ]
            ]
          ]
        ]
      ]
    ]
  ];
}
function A(o) {
  const [e, t, i, r] = o;
  return [(e + i) / 2, (t + r) / 2];
}
function B(o, e) {
  const [t, i, r, d] = o, [a, n] = e, s = i <= n && n <= d;
  let h = t <= a && a <= r;
  return t > r && (h = t >= a && a >= r), s && h;
}
const C = "indoor";
class K {
  constructor(e) {
    l(this, "_map");
    l(this, "_level");
    l(this, "_indoorMaps");
    l(this, "_selectedMap");
    l(this, "_previousSelectedMap");
    l(this, "_previousSelectedLevel");
    l(this, "_savedFilters");
    l(this, "_mapLoadedPromise");
    l(this, "_updateMapPromise");
    this._map = e, this._level = null, this._indoorMaps = [], this._savedFilters = [], this._selectedMap = null, this._previousSelectedMap = null, this._previousSelectedLevel = null, this._updateMapPromise = Promise.resolve(), this._map.loaded() ? this._mapLoadedPromise = Promise.resolve() : this._mapLoadedPromise = new Promise((t) => this._map.on("load", t)), this._map.on("moveend", () => this._updateSelectedMapIfNeeded());
  }
  getSelectedMap() {
    return this._selectedMap;
  }
  getLevel() {
    return this._level;
  }
  setLevel(e, t = !0) {
    if (this._selectedMap === null)
      throw new Error("Cannot set level, no map has been selected");
    this._level = e, this._updateFiltering(), t && this._map.fire("indoor.level.changed", { level: e });
  }
  _addLayerForFiltering(e, t) {
    this._map.addLayer(e, t), this._savedFilters.push({
      layerId: e.id,
      filter: this._map.getFilter(e.id) || ["all"]
    });
  }
  addLayerForFiltering(e, t) {
    this._addLayerForFiltering(e, t), this._updateFiltering();
  }
  _removeLayerForFiltering(e) {
    this._savedFilters = this._savedFilters.filter(({ layerId: t }) => e !== t), this._map.removeLayer(e);
  }
  removeLayerForFiltering(e) {
    this._removeLayerForFiltering(e), this._updateFiltering();
  }
  _updateFiltering() {
    const e = this._level;
    let t;
    if (e !== null) {
      const i = this._selectedMap ? this._selectedMap.showFeaturesWithEmptyLevel : !1;
      t = (r) => Y(r, e, i);
    } else
      t = (i) => i;
    this._savedFilters.forEach(({ layerId: i, filter: r }) => {
      this._map.setFilter(i, t(r));
    });
  }
  async addMap(e) {
    this._indoorMaps.push(e), await this._updateSelectedMapIfNeeded();
  }
  async removeMap(e) {
    this._indoorMaps = this._indoorMaps.filter((t) => t !== e), await this._updateSelectedMapIfNeeded();
  }
  async _updateSelectedMapIfNeeded() {
    await this._mapLoadedPromise, await this._updateMapPromise, this._updateMapPromise = (async () => {
      const e = this._closestMap();
      e !== this._selectedMap && this._updateSelectedMap(e);
    })(), await this._updateMapPromise;
  }
  _updateSelectedMap(e) {
    const t = this._selectedMap;
    if (t !== null && (t.layersToHide.forEach((s) => this._map.setLayoutProperty(s, "visibility", "visible")), t.layers.forEach(({ id: s }) => this._removeLayerForFiltering(s)), this._map.removeSource(C), e || (this._previousSelectedLevel = this._level, this._previousSelectedMap = t), this.setLevel(null, !1), this._map.fire("indoor.map.unloaded", { indoorMap: t })), this._selectedMap = e, !e)
      return;
    const { geojson: i, layers: r, levelsRange: d, beforeLayerId: a } = e;
    this._map.addSource(C, {
      type: "geojson",
      data: i
    }), r.forEach((s) => this._addLayerForFiltering(s, a)), e.layersToHide.forEach((s) => this._map.setLayoutProperty(s, "visibility", "none"));
    const n = this._previousSelectedMap === e ? this._previousSelectedLevel : Math.max(Math.min(e.defaultLevel, d.max), d.min);
    this.setLevel(n, !1), this._map.fire("indoor.map.loaded", { indoorMap: e });
  }
  _closestMap() {
    if (this._map.getZoom() < 17)
      return null;
    const e = this._map.getBounds(), t = [
      e.getWest(),
      e.getSouth(),
      e.getEast(),
      e.getNorth()
    ], i = this._indoorMaps.filter(
      (a) => J(a.bounds, t)
    );
    if (i.length === 0)
      return null;
    if (i.length === 1)
      return i[0];
    let r = Number.POSITIVE_INFINITY, d = i[0];
    for (const a of i) {
      const n = L(A(a.bounds), A(t));
      n < r && (d = a, r = n);
    }
    return d;
  }
}
const V = [
  {
    filter: [
      "any",
      [
        "has",
        "building"
      ],
      [
        "has",
        "building:part"
      ]
    ],
    id: "buildings-background",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#E6E4E0",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            16.5,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "indoor",
      "level"
    ],
    id: "level-background",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#E6E4E0",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            16.5,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    id: "indoor-gardens",
    type: "fill",
    source: "indoor",
    filter: [
      "filter-==",
      "leisure",
      "garden"
    ],
    layout: {
      visibility: "visible"
    },
    paint: {
      "fill-color": "#cde8a2",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "amenity",
      "parking"
    ],
    id: "indoor-parkings",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#D7CCC8",
      "fill-outline-color": "#000000",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "amenity",
      "parking"
    ],
    id: "indoor-parkings-patterns",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            0.1
          ]
        ]
      },
      "fill-pattern": "si-main-3",
      "fill-translate-anchor": "viewport"
    }
  },
  {
    filter: [
      "filter-==",
      "indoor",
      "corridor"
    ],
    id: "indoor-corridors",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#D7CCC8",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "any",
      [
        "filter-in-small",
        "indoor",
        [
          "literal",
          [
            "room",
            "area"
          ]
        ]
      ],
      [
        "filter-==",
        "railway",
        "platform"
      ]
    ],
    id: "indoor-rooms",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#A1887F",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "any",
      [
        "filter-==",
        "indoor",
        "room"
      ]
    ],
    id: "indoor-rooms-borders",
    type: "line",
    source: "indoor",
    paint: {
      "line-color": "#000",
      "line-width": [
        "case",
        [
          "has",
          "stroke-width"
        ],
        [
          "get",
          "stroke-width"
        ],
        10
      ],
      "line-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "indoor",
      "area"
    ],
    id: "indoor-areas",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#D7CCC8",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "all",
      [
        "filter-==",
        "highway",
        "pedestrian"
      ],
      [
        "has",
        "level"
      ]
    ],
    id: "indoor-highways-area",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": {
        base: 1,
        stops: [
          [
            16,
            "hsl(230, 16%, 94%)"
          ],
          [
            16.25,
            "hsl(230, 50%, 98%)"
          ]
        ]
      },
      "fill-outline-color": "hsl(230, 26%, 88%)",
      "fill-opacity": 1
    }
  },
  {
    filter: [
      "all",
      [
        "filter-==",
        "highway",
        "pedestrian"
      ],
      [
        "has",
        "level"
      ]
    ],
    id: "indoor-highways-area-pattern",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "hsl(0, 0%, 100%)",
      "fill-outline-color": "hsl(35, 10%, 83%)",
      "fill-pattern": "pedestrian-polygon",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "all",
      [
        "filter-==",
        "indoor",
        "area"
      ],
      [
        "filter-==",
        "balcony",
        "yes"
      ]
    ],
    id: "indoor-balcony",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#BDBDBD",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "any",
      [
        "filter-==",
        "stairs",
        "yes"
      ],
      [
        "filter-==",
        "elevator",
        "yes"
      ],
      [
        "filter-==",
        "highway",
        "elevator"
      ]
    ],
    id: "indoor-stairs",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#7B635A",
      "fill-outline-color": "#000000",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "indoor",
      "wall"
    ],
    id: "indoor-walls",
    type: "line",
    source: "indoor",
    paint: {
      "line-color": "#000000",
      "line-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "has",
      "barrier"
    ],
    id: "indoor-barriers",
    type: "line",
    source: "indoor",
    paint: {
      "line-color": "#000000",
      "line-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "indoor",
      "block"
    ],
    id: "indoor-blocks",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#000000",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            18,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "handrail",
      "yes"
    ],
    id: "indoor-handrail",
    type: "line",
    source: "indoor",
    paint: {
      "line-color": "#000000",
      "line-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            19,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "railway",
      "rail"
    ],
    id: "indoor-rails",
    type: "line",
    source: "indoor",
    paint: {
      "line-color": "hsl(230, 10%, 74%)",
      "line-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            19,
            1
          ]
        ]
      }
    }
  },
  {
    filter: [
      "filter-==",
      "railway",
      "rail"
    ],
    id: "indoor-rails-tracks",
    type: "line",
    source: "indoor",
    paint: {
      "line-color": "hsl(230, 10%, 74%)",
      "line-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            19,
            1
          ]
        ]
      },
      "line-width": {
        base: 1.5,
        stops: [
          [
            14,
            4
          ],
          [
            20,
            8
          ]
        ]
      },
      "line-dasharray": [
        0.1,
        15
      ]
    }
  },
  {
    filter: [
      "any",
      [
        "filter-in-small",
        "indoor",
        [
          "literal",
          [
            "table",
            "cupboard",
            "chair",
            "kitchen",
            "sofa",
            "tv",
            "shelf",
            "furniture-item"
          ]
        ]
      ],
      [
        "filter-==",
        "trashcan",
        "yes"
      ],
      [
        "filter-==",
        "copier",
        "yes"
      ],
      [
        "filter-==",
        "amenity",
        "vending_machine"
      ]
    ],
    id: "indoor-furniture",
    type: "fill",
    source: "indoor",
    paint: {
      "fill-color": "#000",
      "fill-outline-color": "#000",
      "fill-opacity": {
        base: 1,
        stops: [
          [
            18,
            0
          ],
          [
            19,
            0.2
          ]
        ]
      }
    }
  },
  {
    id: "indoor-steps",
    paint: {
      "line-width": {
        base: 1.5,
        stops: [
          [
            17,
            1
          ],
          [
            18,
            1.6
          ],
          [
            19,
            6
          ]
        ]
      },
      "line-color": "hsl(0, 0%, 100%)",
      "line-dasharray": {
        base: 1,
        stops: [
          [
            17,
            [
              1,
              0
            ]
          ],
          [
            17.5,
            [
              1.75,
              1
            ]
          ],
          [
            18,
            [
              1,
              0.75
            ]
          ],
          [
            19,
            [
              0.3,
              0.3
            ]
          ]
        ]
      },
      "line-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            17.25,
            1
          ]
        ]
      }
    },
    type: "line",
    source: "indoor",
    filter: [
      "all",
      [
        "filter-==",
        "highway",
        "steps"
      ],
      [
        "!",
        [
          "has",
          "conveying"
        ]
      ]
    ],
    layout: {
      "line-join": "round"
    }
  },
  {
    id: "indoor-conveying",
    paint: {
      "line-width": {
        base: 1.5,
        stops: [
          [
            17,
            1
          ],
          [
            18,
            1.6
          ],
          [
            19,
            6
          ]
        ]
      },
      "line-color": "#FF0000",
      "line-dasharray": {
        base: 1,
        stops: [
          [
            17,
            [
              1,
              0
            ]
          ],
          [
            17.5,
            [
              1.75,
              1
            ]
          ],
          [
            18,
            [
              1,
              0.75
            ]
          ],
          [
            19,
            [
              0.3,
              0.3
            ]
          ]
        ]
      },
      "line-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            17.25,
            1
          ]
        ]
      }
    },
    type: "line",
    source: "indoor",
    filter: [
      "all",
      [
        "filter-==",
        "highway",
        "steps"
      ],
      [
        "has",
        "conveying"
      ]
    ],
    layout: {
      "line-join": "round"
    }
  },
  {
    interactive: !0,
    minzoom: 17,
    layout: {
      "text-line-height": 1.2,
      "text-size": {
        base: 1,
        stops: [
          [
            17,
            10
          ],
          [
            20,
            12
          ]
        ]
      },
      "text-allow-overlap": !1,
      "text-ignore-placement": !1,
      "text-max-angle": 38,
      "text-font": [
        "DIN Offc Pro Medium",
        "Arial Unicode MS Regular"
      ],
      "symbol-placement": "point",
      "text-padding": 2,
      visibility: "visible",
      "text-rotation-alignment": "viewport",
      "text-anchor": "center",
      "text-field": "{name}",
      "text-letter-spacing": 0.02,
      "text-max-width": 8
    },
    filter: [
      "filter-==",
      "indoor",
      "room"
    ],
    type: "symbol",
    source: "indoor",
    id: "poi-indoor-text-ref",
    paint: {
      "text-color": "#65513d",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1,
      "text-opacity": {
        base: 1,
        stops: [
          [
            18,
            0
          ],
          [
            18.5,
            0.5
          ],
          [
            19,
            1
          ]
        ]
      }
    }
  },
  {
    interactive: !0,
    minzoom: 17,
    layout: {
      "text-line-height": 1.2,
      "icon-size": {
        base: 1,
        stops: [
          [
            17,
            0.5
          ],
          [
            20,
            1
          ]
        ]
      },
      "text-size": {
        base: 1,
        stops: [
          [
            17,
            11
          ],
          [
            20,
            13
          ]
        ]
      },
      "text-allow-overlap": !1,
      "icon-image": "{maki}-15",
      "icon-anchor": "center",
      "text-ignore-placement": !1,
      "text-max-angle": 38,
      "symbol-spacing": 250,
      "text-font": [
        "DIN Offc Pro Medium",
        "Arial Unicode MS Regular"
      ],
      "symbol-placement": "point",
      "text-padding": 2,
      visibility: "visible",
      "text-offset": [
        0,
        1
      ],
      "icon-optional": !1,
      "text-rotation-alignment": "viewport",
      "text-anchor": "top",
      "text-field": "{name}",
      "text-letter-spacing": 0.02,
      "text-max-width": 8,
      "icon-allow-overlap": !0
    },
    filter: [
      "boolean",
      !1
    ],
    type: "symbol",
    source: "indoor",
    id: "poi-indoor",
    paint: {
      "text-color": "#65513d",
      "text-halo-color": "#ffffff",
      "text-halo-width": 1,
      "text-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            17.5,
            0.5
          ],
          [
            19,
            1
          ]
        ]
      },
      "icon-opacity": {
        base: 1,
        stops: [
          [
            17,
            0
          ],
          [
            17.5,
            0.5
          ],
          [
            19,
            1
          ]
        ]
      }
    }
  }
];
let M = V;
const R = "poi-indoor", N = [
  {
    filter: ["filter-==", "amenity", "fast_food"],
    maki: "fast-food"
  },
  {
    filter: ["filter-==", "amenity", "restaurant"],
    maki: "restaurant"
  },
  {
    filter: ["filter-==", "amenity", "cafe"],
    maki: "cafe"
  },
  {
    filter: ["filter-in-small", "amenity", ["literal", ["bank", "vending_machine"]]],
    maki: "bank"
  },
  {
    filter: ["filter-==", "amenity", "toilets"],
    maki: "toilet"
  },
  {
    filter: ["any", ["filter-==", "highway", "elevator"], ["has", "elevator"]],
    maki: "triangle-stroked"
  },
  {
    filter: ["filter-==", "natural", "tree"],
    maki: "park"
  },
  {
    filter: ["filter-==", "shop", "travel_agency"],
    maki: "suitcase"
  },
  {
    filter: ["filter-==", "shop", "convenience"],
    maki: "grocery"
  },
  {
    filter: ["filter-==", "shop", "bakery"],
    maki: "bakery"
  },
  {
    filter: ["filter-==", "shop", "chemist"],
    maki: "pharmacy"
  },
  {
    filter: ["filter-==", "shop", "clothes"],
    maki: "clothing-store"
  },
  {
    filter: ["filter-==", "highway", "steps"],
    maki: "entrance"
  }
];
function X(o) {
  const e = {
    filter: [
      "all",
      ["has", "shop"],
      [
        "!",
        [
          "filter-in-small",
          "shop",
          [
            "literal",
            N.filter((t) => t.filter[1] === "shop").map((t) => t.filter[2])
          ]
        ]
      ]
    ],
    maki: "shop"
  };
  return N.concat(e).map((t) => {
    const i = Object.assign({}, o);
    return i.id += `-${t.maki}`, i.filter = t.filter, i.layout = Object.assign({}, o.layout), i.layout["icon-image"] = `${t.maki}-15`, i;
  });
}
const D = M.find((o) => o.id === R);
D && (X(D).forEach((o) => M.push(o)), M = M.filter((o) => o.id !== R));
const Q = M, ee = { DefaultLayers: Q };
function T(o, e, t) {
  if (o !== null)
    for (var i, r, d, a, n, s, h, u = 0, c = 0, g, k = o.type, F = k === "FeatureCollection", U = k === "Feature", G = F ? o.features.length : 1, m = 0; m < G; m++) {
      h = F ? o.features[m].geometry : U ? o.geometry : o, g = h ? h.type === "GeometryCollection" : !1, n = g ? h.geometries.length : 1;
      for (var b = 0; b < n; b++) {
        var p = 0, v = 0;
        if (a = g ? h.geometries[b] : h, a !== null) {
          s = a.coordinates;
          var y = a.type;
          switch (u = t && (y === "Polygon" || y === "MultiPolygon") ? 1 : 0, y) {
            case null:
              break;
            case "Point":
              if (e(
                s,
                c,
                m,
                p,
                v
              ) === !1)
                return !1;
              c++, p++;
              break;
            case "LineString":
            case "MultiPoint":
              for (i = 0; i < s.length; i++) {
                if (e(
                  s[i],
                  c,
                  m,
                  p,
                  v
                ) === !1)
                  return !1;
                c++, y === "MultiPoint" && p++;
              }
              y === "LineString" && p++;
              break;
            case "Polygon":
            case "MultiLineString":
              for (i = 0; i < s.length; i++) {
                for (r = 0; r < s[i].length - u; r++) {
                  if (e(
                    s[i][r],
                    c,
                    m,
                    p,
                    v
                  ) === !1)
                    return !1;
                  c++;
                }
                y === "MultiLineString" && p++, y === "Polygon" && v++;
              }
              y === "Polygon" && p++;
              break;
            case "MultiPolygon":
              for (i = 0; i < s.length; i++) {
                for (v = 0, r = 0; r < s[i].length; r++) {
                  for (d = 0; d < s[i][r].length - u; d++) {
                    if (e(
                      s[i][r][d],
                      c,
                      m,
                      p,
                      v
                    ) === !1)
                      return !1;
                    c++;
                  }
                  v++;
                }
                p++;
              }
              break;
            case "GeometryCollection":
              for (i = 0; i < a.geometries.length; i++)
                if (T(a.geometries[i], e, t) === !1)
                  return !1;
              break;
            default:
              throw new Error("Unknown Geometry Type");
          }
        }
      }
    }
}
function E(o) {
  var e = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
  return T(o, function(t) {
    e[0] > t[0] && (e[0] = t[0]), e[1] > t[1] && (e[1] = t[1]), e[2] < t[0] && (e[2] = t[0]), e[3] < t[1] && (e[3] = t[1]);
  }), e;
}
E.default = E;
class te {
  static extractLevelFromFeature(e) {
    if (!!e.properties && e.properties.level !== null) {
      const t = e.properties.level;
      if (typeof t == "string") {
        const i = t.split(";");
        if (i.length === 1) {
          const r = parseFloat(t);
          if (!isNaN(r))
            return r;
        } else if (i.length === 2) {
          const r = parseFloat(i[0]), d = parseFloat(i[1]);
          if (!isNaN(r) && !isNaN(d))
            return {
              min: Math.min(r, d),
              max: Math.max(r, d)
            };
        }
      }
    }
    return null;
  }
  static extractLevelsRangeAndBounds(e) {
    let t = 1 / 0, i = -1 / 0;
    const r = E(e), d = (a) => {
      const n = this.extractLevelFromFeature(a);
      n !== null && (typeof n == "number" ? (t = Math.min(t, n), i = Math.max(i, n)) : typeof n == "object" && (t = Math.min(t, n.min), i = Math.max(i, n.max)));
    };
    if (e.type === "FeatureCollection" && e.features.forEach(d), t === 1 / 0 || i === -1 / 0)
      throw new Error("No level found");
    return {
      levelsRange: { min: t, max: i },
      bounds: r
    };
  }
}
class x {
  constructor(e, t, i, r, d, a, n, s) {
    l(this, "bounds");
    l(this, "geojson");
    l(this, "layers");
    l(this, "levelsRange");
    l(this, "beforeLayerId");
    l(this, "layersToHide");
    l(this, "defaultLevel");
    l(this, "showFeaturesWithEmptyLevel");
    this.bounds = e, this.geojson = t, this.layers = i, this.levelsRange = r, this.layersToHide = d, this.defaultLevel = a, this.showFeaturesWithEmptyLevel = n, this.beforeLayerId = s;
  }
  static fromGeojson(e, t = {}) {
    const { bounds: i, levelsRange: r } = te.extractLevelsRangeAndBounds(e);
    return new x(
      i,
      e,
      t.layers ? t.layers : ee.DefaultLayers,
      r,
      t.layersToHide ? t.layersToHide : [],
      t.defaultLevel ? t.defaultLevel : 0,
      t.showFeaturesWithEmptyLevel ? t.showFeaturesWithEmptyLevel : !1,
      t.beforeLayerId
    );
  }
}
function I(o, e, t, i) {
  i === void 0 && (i = {});
  var r = w(o), d = _(r[0]), a = _(r[1]), n = _(t), s = Z(e, i.units), h = Math.asin(Math.sin(a) * Math.cos(s) + Math.cos(a) * Math.sin(s) * Math.cos(n)), u = d + Math.atan2(Math.sin(n) * Math.sin(s) * Math.cos(a), Math.cos(s) - Math.sin(a) * Math.sin(h)), c = S(u), g = S(h);
  return $([c, g], i.properties);
}
function ie(o) {
  return Object.defineProperty(
    o,
    "indoor",
    {
      get: function() {
        return this._indoor || (this._indoor = new K(this)), this._indoor;
      }
    }
  ), o;
}
const oe = 17, re = 1e3;
class W {
  constructor(e, t, i) {
    l(this, "serverUrl");
    l(this, "map");
    l(this, "remoteMapsDownloaded");
    l(this, "downloadedBounds");
    l(this, "loadMapsPromise", Promise.resolve());
    l(this, "indoorMapOptions");
    l(this, "loadMapsIfNecessary", async () => {
      if (this.map.getZoom() < oe)
        return;
      const e = this.map.getBounds();
      if (this.downloadedBounds !== null && B(this.downloadedBounds, e.getNorthEast().toArray()) && B(this.downloadedBounds, e.getSouthWest().toArray()))
        return;
      const t = L(e.getNorthEast().toArray(), e.getNorthWest().toArray()), i = L(e.getNorthEast().toArray(), e.getSouthEast().toArray()), r = Math.max(t, i), d = Math.max(re, r * 2), a = this.map.getCenter(), n = d * Math.sqrt(2), s = I(a.toArray(), n, Math.PI / 4).geometry.coordinates, h = I(a.toArray(), n, -3 * Math.PI / 4).geometry.coordinates, u = [h[1], h[0], s[1], s[0]];
      this.downloadedBounds = u, await this.loadMapsPromise, this.loadMapsPromise = this.loadMapsInBounds(u);
    });
    l(this, "loadMapsInBounds", async (e) => {
      const t = this.serverUrl + `/maps-in-bounds/${e[0]},${e[1]},${e[2]},${e[3]}`, i = await (await fetch(t)).json(), r = this.remoteMapsDownloaded.reduce((a, n) => (i.find((s) => s.path === n.path) || a.push(n), a), []);
      i.reduce((a, n) => (this.remoteMapsDownloaded.find((s) => s.path === n.path) || a.push(n), a), []).forEach(this.addCustomMap), r.forEach(this.removeCustomMap);
    });
    l(this, "addCustomMap", async (e) => {
      const t = await (await fetch(this.serverUrl + e.path)).json();
      e.indoorMap = x.fromGeojson(t, this.indoorMapOptions), this.map.indoor.addMap(e.indoorMap), this.remoteMapsDownloaded.push(e);
    });
    l(this, "removeCustomMap", async (e) => {
      this.map.indoor.removeMap(e.indoorMap), this.remoteMapsDownloaded.splice(this.remoteMapsDownloaded.indexOf(e), 1);
    });
    this.serverUrl = e, this.map = t, this.indoorMapOptions = i, this.remoteMapsDownloaded = [], this.downloadedBounds = null, t.loaded() ? this.loadMapsIfNecessary() : t.on("load", () => this.loadMapsIfNecessary()), t.on("move", () => this.loadMapsIfNecessary());
  }
  static manage(e, t, i) {
    return new W(e, ie(t), i);
  }
}
export {
  ee as DefaultStyle,
  se as IndoorControl,
  K as IndoorLayer,
  x as IndoorMap,
  W as MapServerHandler,
  ie as addIndoorTo
};
