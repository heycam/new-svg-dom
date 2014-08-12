// new-svg-dom.js
var protos;
(function() {
  const kSVGNS = "http://www.w3.org/2000/svg";
  const kXLINKNS = "http://www.w3.org/1999/xlink";
  const kMappedElements = {
    "graphics": "svg",
    "viewport": "svg",
    "animatemotion": "animateMotion",
    "animatetransform": "animateTransform",
    "clippath": "clipPath",
    "feblend": "feBlend",
    "fecustom": "feCustom",
    "fecolormatrix": "feColorMatrix",
    "fecomponenttransfer": "feComponentTransfer",
    "fecomposite": "feComposite",
    "feconvolvematrix": "feConvolveMatrix",
    "fediffuselighting": "feDiffuseLighting",
    "fedisplacementmap": "feDisplacementMap",
    "fedistantlight": "feDistantLight",
    "fedropshadow": "feDropShadow",
    "feflood": "feFlood",
    "fefuncr": "feFuncR",
    "fefuncg": "feFuncG",
    "fefuncb": "feFuncB",
    "fefunca": "feFuncA",
    "fegaussianblur": "feGaussianBlur",
    "feimage": "feImage",
    "femerge": "feMerge",
    "femergenode": "feMergeNode",
    "femorphology": "feMorphology",
    "feoffset": "feOffset",
    "fepointlight": "fePointLight",
    "fespecularlighting": "feSpecularLighting",
    "fespotlight": "feSpotLight",
    "fetile": "feTile",
    "feturbulence": "feTurbulence",
    "foreignobject": "foreignObject",
    "img": "image",
    "lineargradient": "linearGradient",
    "radialgradient": "radialGradient",
    "textpath": "textPath"
  };
  const kMappedAttributes = {
    "_": {
      "attributename": "attributeName",
      "attributetype": "attributeType",
      "basefrequency": "baseFrequency",
      "calcmode": "calcMode",
      "clippathunits": "clipPathUnits",
      "diffuseconstant": "diffuseConstant",
      "edgemode": "edgeMode",
      "filterres": "filterRes",
      "filterunits": "filterUnits",
      "gradienttransform": "gradientTransform",
      "gradientunits": "gradientUnits",
      "href": "xlink:href",
      "kernelmatrix": "kernelMatrix",
      "kernelunitlength": "kernelUnitLength",
      "keypoints": "keyPoints",
      "keysplines": "keySplines",
      "keytimes": "keyTimes",
      "lengthadjust": "lengthAdjust",
      "limitingconeangle": "limitingConeAngle",
      "markerheight": "markerHeight",
      "markerwidth": "markerWidth",
      "maskcontentunits": "maskContentUnits",
      "maskunits": "maskUnits",
      "numoctaves": "numOctaves",
      "pathlength": "pathLength",
      "patterncontentunits": "patternContentUnits",
      "patterntransform": "patternTransform",
      "patternunits": "patternUnits",
      "pointsatx": "pointsAtX",
      "pointsaty": "pointsAtY",
      "pointsatz": "pointsAtZ",
      "preservealpha": "preserveAlpha",
      "preserveaspectratio": "preserveAspectRatio",
      "primitiveunits": "primitiveUnits",
      "refx": "refX",
      "refy": "refY",
      "repeatcount": "repeatCount",
      "repeatdur": "repeatDur",
      "requiredextensions": "requiredExtensions",
      "requiredfeatures": "requiredFeatures",
      "specularconstant": "specularConstant",
      "specularexponent": "specularExponent",
      "spreadmethod": "spreadMethod",
      "startoffset": "startOffset",
      "stddeviation": "stdDeviation",
      "surfacescale": "surfaceScale",
      "systemlanguage": "systemLanguage",
      "tablevalues": "tableValues",
      "targetx": "targetX",
      "targety": "targetY",
      "textlength": "textLength",
      "viewbox": "viewBox",
      "viewtarget": "viewTarget",
      "xchannelselector": "xChannelSelector",
      "ychannelselector": "yChannelSelector",
      "zoomandpan": "zoomAndPan",
    },
  };
  const kPrototypes = {};
  protos = kPrototypes;

  // Prototypes for new elements.

  function makePrototype(aConstructorName, aElementName, aSuper, aCallback) {
    var ctor = function() {};
    window[aConstructorName] = ctor;

    ctor.prototype = Object.create(aSuper.prototype);
    ctor.prototype.constructor = ctor;
    ctor.prototype.name = aConstructorName + "Prototype";

    if (aElementName) {
      kPrototypes[aElementName] = ctor.prototype;
    }

    if (aCallback) {
      aCallback(ctor.prototype);
    }
  }

  function shadowFor(aNode) {
    if (!aNode) {
      return null;
    }
    var shadow = nodes.get(aNode);
    if (!shadow) {
      throw new TypeError("called on wrong object (expected node in SVG 2 subtree)");
    }
    return shadow;
  }

  function originalFor(aNode) {
    if (!aNode) {
      return null;
    }
    if (!aNode.original) {
      throw new TypeError("called on wrong object (expected node in shadow tree)");
    }
    return aNode.original;
  }

  function reflectString(aProto, aName, aDefault) {
    var attrName = aName.toLowerCase();
    var getter = function(aObject) {
      if (!this.hasAttribute(attrName)) {
        return aDefault;
      }
      return this.getAttribute(attrName);
    };
    var setter = function(aValue) {
      this.setAttribute(attrName, aValue);
    };
    Object.defineProperty(aProto, aName, { get: getter, set: setter });
  }

  function reflectLength(aProto, aName, aDefault) {
    var attrName = aName.toLowerCase();
    var getter, setter;
    if (!window.gLengthReflection ||
        gLengthReflection == "string") {
      reflectString(aProto, aName, aDefault);
    } else if (gLengthReflection == "string-or-number") {
      getter = function(aObject) {
        var shadow = shadowFor(this);
        if (!this.hasAttribute(attrName)) {
          return +aDefault;
        }
        return shadow[aName].baseVal.value;
      };
      setter = function(aValue) {
        this.setAttribute(attrName, aValue);
      };
      Object.defineProperty(aProto, aName, { get: getter, set: setter });
    } else if (gLengthReflection == "number") {
      getter = function(aObject) {
        var shadow = shadowFor(this);
        if (!this.hasAttribute(attrName)) {
          return +aDefault;
        }
        return shadow[aName].baseVal.value;
      };
      setter = function(aValue) {
        this.setAttribute(attrName, +aValue);
      };
      Object.defineProperty(aProto, aName, { get: getter, set: setter });
    } else if (gLengthReflection == "string-and-number") {
      reflectString(aProto, aName, aDefault);
      getter = function(aObject) {
        var shadow = shadowFor(this);
        if (!this.hasAttribute(attrName)) {
          return +aDefault;
        }
        return shadow[aName].baseVal.value;
      };
      setter = function(aValue) {
        this.setAttribute(attrName, +aValue);
      };
      Object.defineProperty(aProto, aName + "_px", { get: getter, set: setter });
    } else {
      throw "unexpected value of gLengthReflection";
    }
  }

  function reflectInteger(aProto, aName, aDefault) {
    var attrName = aName.toLowerCase();
    var getter = function() {
      if (!this.hasAttribute(attrName)) {
        return aDefault;
      }
      return +this.getAttribute(attrName);
    };
    var setter = function(aValue) {
      this.setAttribute(attrName, Math.floor(aValue));
    };
    Object.defineProperty(aProto, aName, { get: getter, set: setter });
  }

  function reflectEnum(aProto, aName, aValues, aDefault) {
    var attrName = aName.toLowerCase();
    var getter = function() {
      if (!this.hasAttribute(attrName)) {
        return aDefault;
      }
      return this.getAttribute(attrName);
    };
    var setter = function(aValue) {
      if (aValues.indexOf(aValue) == -1) {
        return;
      }
      this.setAttribute(attrName, aValue);
    };
    Object.defineProperty(aProto, aName, { get: getter, set: setter });
  }

  function reflectLengthListAsSingleValue(aProto, aName, aDefault) {
    var attrName = aName.toLowerCase();
    var getter, setter;
    if (!window.gLengthReflection ||
        gLengthReflection == "string") {
      getter = function(aObject) {
        var shadow = shadowFor(this);
        if (!this.hasAttribute(attrName) ||
            shadow[aName].baseVal.numberOfItems == 0) {
          return String(aDefault);
        }
        return shadow[aName].baseVal.getItem(0).valueAsString;
      };
      setter = function(aValue) {
        this.setAttribute(attrName, aValue);
      };
      Object.defineProperty(aProto, aName, { get: getter, set: setter });
    } else if (gLengthReflection == "string-or-number") {
      getter = function(aObject) {
        var shadow = shadowFor(this);
        if (!this.hasAttribute(attrName) ||
            shadow[aName].baseVal.numberOfItems == 0) {
          return +aDefault;
        }
        return shadow[aName].baseVal.getItem(0).value;
      };
      setter = function(aValue) {
        this.setAttribute(attrName, aValue);
      };
      Object.defineProperty(aProto, aName, { get: getter, set: setter });
    } else if (gLengthReflection == "number") {
      getter = function(aObject) {
        var shadow = shadowFor(this);
        if (!this.hasAttribute(attrName) ||
            shadow[aName].baseVal.numberOfItems == 0) {
          return +aDefault;
        }
        return shadow[aName].baseVal.getItem(0).value;
      };
      setter = function(aValue) {
        this.setAttribute(attrName, +aValue);
      };
      Object.defineProperty(aProto, aName, { get: getter, set: setter });
    } else if (gLengthReflection == "string-and-number") {
      getter = function(aObject) {
        var shadow = shadowFor(this);
        if (!this.hasAttribute(attrName) ||
            shadow[aName].baseVal.numberOfItems == 0) {
          return String(aDefault);
        }
        return shadow[aName].baseVal.getItem(0).valueAsString;
      };
      setter = function(aValue) {
        this.setAttribute(attrName, aValue);
      };
      Object.defineProperty(aProto, aName, { get: getter, set: setter });

      getter = function(aObject) {
        var shadow = shadowFor(this);
        if (!this.hasAttribute(attrName) ||
            shadow[aName].baseVal.numberOfItems == 0) {
          return +aDefault;
        }
        return shadow[aName].baseVal.getItem(0).value;
      };
      setter = function(aValue) {
        this.setAttribute(attrName, +aValue);
      };
      Object.defineProperty(aProto, aName + "_px", { get: getter, set: setter });
    } else {
      throw "unexpected value of gLengthReflection";
    }
  }

  function reflectNumberListAsSingleValue(aProto, aName, aDefault) {
    var attrName = aName.toLowerCase();
    var getter, setter;
    var getter = function(aObject) {
      var shadow = shadowFor(this);
      if (!this.hasAttribute(attrName) ||
          shadow[aName].baseVal.numberOfItems == 0) {
        return aDefault;
      }
      return shadow[aName].baseVal.getItem(0).value;
    };
    var setter = function(aValue) {
      this.setAttribute(attrName, aValue);
    };
    Object.defineProperty(aProto, aName, { get: getter, set: setter });
  }

  makePrototype("SVG2Element", null, HTMLElement, function(aProto) {
    Object.defineProperty(aProto, "viewportElement", { get: function() { return originalFor(shadowFor(this).viewportElement) } });
  });

  makePrototype("SVG2UnknownElement", null, SVG2Element);

  function defineTransformAccessors(aProto, aName, aGetName, aSetName) {
    function makeTransform(aTransformItem) {
      var m = aTransformItem.matrix;
      switch (aTransformItem.type) {
        case SVGTransform.SVG_TRANSFORM_MATRIX:
          return { type: "matrix", values: [m.a, m.b, m.c, m.d, m.e, m.f] };
        case SVGTransform.SVG_TRANSFORM_TRANSLATE:
          return { type: "translate", x: m.e, y: m.f };
        case SVGTransform.SVG_TRANSFORM_SCALE:
          return { type: "scale", x: m.a, y: m.d };
        case SVGTransform.SVG_TRANSFORM_ROTATE:
          return { type: "rotate", angle: aTransformItem.angle };  // include x and y
        case SVGTransform.SVG_TRANSFORM_SKEWX:
          return { type: "skewX", angle: aTransformItem.angle };
        case SVGTransform.SVG_TRANSFORM_SKEWY:
          return { type: "skewY", angle: aTransformItem.angle };
        default:
          return { type: "unknown "};
      }
    }

    function serializeTransform(aTransform) {
      switch (aTransform.type) {
        case "matrix":
          return "matrix(" + aTransform.values.join(" ") + ")";
        case "translate":
          return "translate(" + aTransform.x + "," + aTransform.y + ")";
        case "scale":
          return "scale(" + aTransform.x + "," + aTransform.y + ")";
        case "rotate":
          return "rotate(" + aTransform.angle + ")";  // handle x and y
        case "skewX":
        case "skewY":
          return aTransform.type + "(" + aTransform.angle + ")"; 
        default:
          return "";
      }
    }

    aProto[aGetName] = function() {
      var shadow = shadowFor(this);
      var a = [];
      for (var i = 0; i < shadow.transform.baseVal.numberOfItems; i++) {
        a.push(makeTransform(shadow.transform.baseVal.getItem(i)));
      }
      return a;
    };

    aProto[aSetName] = function(aValue) {
      this.setAttribute(aName, aValue.map(serializeTransform).join(" "));
    };
  }

  makePrototype("SVG2GraphicElement", null, SVG2Element, function(aProto) {
    reflectString(aProto, "transform", "");
    defineTransformAccessors(aProto, "transform", "getTransformItems", "setTransformItems");

    aProto.getBBox = function(aOptions) {
      return shadowFor(this).getBBox(aOptions);
    };

    aProto.getTransformToElement = function(aElement) {
      return shadowFor(this).getTransformToElement(aElement);
    };
  });

  makePrototype("SVG2GraphicsElement", "graphics", SVG2GraphicElement, function(aProto) {
    // The default values should maybe something else?
    reflectInteger(aProto, "width", 0);
    reflectInteger(aProto, "height", 0);
  });

  makePrototype("SVG2GeometryElement", null, SVG2GraphicElement, function(aProto) {
  });

  makePrototype("SVG2RectElement", "rect", SVG2GeometryElement, function(aProto) {
    reflectLength(aProto, "x", "0");
    reflectLength(aProto, "y", "0");
    reflectLength(aProto, "width", "0");
    reflectLength(aProto, "height", "0");
    reflectLength(aProto, "rx", "0");
    reflectLength(aProto, "ry", "0");
  });

  makePrototype("SVG2CircleElement", "circle", SVG2GeometryElement, function(aProto) {
    reflectLength(aProto, "cx", "0");
    reflectLength(aProto, "cy", "0");
    reflectLength(aProto, "r", "0");
  });

  makePrototype("SVG2EllipseElement", "ellipse", SVG2GeometryElement, function(aProto) {
    reflectLength(aProto, "cx", "0");
    reflectLength(aProto, "cy", "0");
    reflectLength(aProto, "rx", "0");
    reflectLength(aProto, "ry", "0");
  });

  makePrototype("SVG2LineElement", "line", SVG2GeometryElement, function(aProto) {
    reflectLength(aProto, "x1", "0");
    reflectLength(aProto, "y1", "0");
    reflectLength(aProto, "x2", "0");
    reflectLength(aProto, "y2", "0");
  });

  function definePointsAccessors(aProto) {
    aProto.getPoints = function() {
      var shadow = shadowFor(this);
      var a = [];
      for (var i = 0; i < shadow.points.length; i++) {
        a.push({ x: shadow.points[i].x, y: shadow.points[i].y });
      }
      return a;
    };

    aProto.setPoints = function(aPoints) {
      this.setAttribute("points", aPoints.map((p) => [p.x, p.y]).join(" "));
    };
  }

  makePrototype("SVG2PolylineElement", "polyline", SVG2GeometryElement, function(aProto) {
    reflectString(aProto, "points", "");
    definePointsAccessors(aProto);
  });

  makePrototype("SVG2PolygonElement", "polygon", SVG2GeometryElement, function(aProto) {
    reflectString(aProto, "points", "");
    definePointsAccessors(aProto);
  });

  makePrototype("SVG2PathElement", "path", SVG2GeometryElement, function(aProto) {
    function makeSeg(aPathSeg) {
      const kSegNames = {
        "m": "move",
        "z": "close",
        "l": "lineto",
        "h": "horizontal-lineto",
        "v": "vertical-lineto",
        "c": "curveto",
        "s": "smooth-curveto",
        "q": "quadratic-curveto",
        "t": "smooth-quadratic-curveto",
        "a": "arc",
      };
      const kSegLetters = (function() {
        var r = {};
        for (var k in kSegNames) {
          r[kSegNames[k]] = k;
        }
        return r;
      })();

      var letter = aPathSeg.pathSegTypeAsLetter;
      var seg = {
        "type": kSegNames[letter.toLowerCase()],
        "letter": letter,
        "relative": letter == letter.toLowerCase() && letter != "z",
      };
      switch (aPathSeg.pathSegTypeAsLetter.toLowerCase()) {
        case "m":
        case "l":
          seg.x = aPathSeg.x;
          seg.y = aPathSeg.y;
          break;
        case "h":
          seg.x = aPathSeg.x;
          break;
        case "v":
          seg.y = aPathSeg.y;
          break;
        case "c":
          seg.x = aPathSeg.x;
          seg.y = aPathSeg.y;
          seg.x1 = aPathSeg.x1;
          seg.y1 = aPathSeg.y1;
          seg.x2 = aPathSeg.x2;
          seg.y2 = aPathSeg.y2;
          break;
        case "s":
          seg.x = aPathSeg.x;
          seg.y = aPathSeg.y;
          seg.x2 = aPathSeg.x2;
          seg.y2 = aPathSeg.y2;
          break;
        case "q":
          seg.x = aPathSeg.x;
          seg.y = aPathSeg.y;
          seg.x1 = aPathSeg.x1;
          seg.y1 = aPathSeg.y1;
          break;
        case "t":
          seg.x = aPathSeg.x;
          seg.y = aPathSeg.y;
          break;
        case "a":
          seg.x = aPathSeg.x;
          seg.y = aPathSeg.y;
          seg.r1 = aPathSeg.r1;
          seg.r2 = aPathSeg.r2;
          seg.angle = aPathSeg.angle;
          seg.largeArcFlag = aPathSeg.largeArcFlag;
          seg.sweepFlag = aPathSeg.sweepFlag;
          break;
      }
      return seg;
    }

    function serializeSeg(aSeg) {
      var letter = aSeg.letter;
      if (!letter) {
        letter = kSegLetters[aSeg.type];
        if (!aSeg.relative) {
          letter = letter.toUpperCase();
        }
      }
      var s = letter;
      switch (letter.toLowerCase()) {
        case "m":
        case "l":
          s += " " + [aSeg.x, aSeg.y];
          break;
        case "h":
          s += " " + aSeg.x;
          break;
        case "v":
          s += " " + aSeg.y;
          break;
        case "c":
          s += " " + [[aSeg.x1, aSeg.y1], [aSeg.x2, aSeg.y2], [aSeg.x, aSeg.y]].join(" ");
          break;
        case "s":
          s += " " + [[aSeg.x2, aSeg.y2], [aSeg.x, aSeg.y]].join(" ");
          break;
        case "q":
          s += " " + [[aSeg.x1, aSeg.y1], [aSeg.x, aSeg.y]].join(" ");
          break;
        case "t":
          s += " " + [aSeg.x, aSeg.y];
          break;
        case "a":
          s += " " + aSeg.r1 + " " + aSeg.r2 + " " + aSeg.angle + " " + +!!aSeg.largeArcFlag + " " + +!!aSeg.sweepFlag + " " + [aSeg.x, aSeg.y];
          break;
      }
      return s;
    }

    reflectString(aProto, "d", "");

    aProto.getPathSegments = function() {
      var shadow = shadowFor(this);
      var a = [];
      for (var i = 0; i < shadow.pathSegList.length; i++) {
        a.push(makeSeg(shadow.pathSegList[i]));
      }
      return a;
    };

    aProto.setPathSegments = function(aSegments) {
      this.setAttribute("d", aSegments.map(serializeSeg).join(" "));
    };
  });

  makePrototype("SVG2TextContentElement", null, SVG2GraphicElement, function(aProto) {
    reflectEnum(aProto, "lengthAdjust", ["spacing", "spacingAndGlyphs"], "spacing");
    reflectLength(aProto, "textLength", 123);  // need to compute default textLength value; or maybe support "auto"

    aProto.getNumberOfChars = function() { return shadowFor(this).getNumberOfChars(); };
    aProto.getComputedTextLength = function() { return shadowFor(this).getComputedTextLength(); };
    aProto.getSubStringLength = function(a, b) { return shadowFor(this).getSubStringLength(a, b); };
    aProto.getStartPositionOfChar = function(n) { return shadowFor(this).getStartPositionOfChar(n); };
    aProto.getEndPositionofChar = function(n) { return shadowFor(this).getEndPositionofChar(n); };
    aProto.getExtentOfChar = function(n) { return shadowFor(this).getExtentOfChar(n); };
    aProto.getRotationOfChar = function(n) { return shadowFor(this).getRotationOfChar(n); };
    aProto.getCharNumAtPosition = function(p) { return shadowFor(this).getCharNumAtPosition(p); };
  });

  makePrototype("SVG2TextPositioningElement", "text", SVG2TextContentElement, function(aProto) {
    reflectLengthListAsSingleValue(aProto, "x", "0");
    reflectLengthListAsSingleValue(aProto, "y", "0");
    reflectLengthListAsSingleValue(aProto, "dx", "0");
    reflectLengthListAsSingleValue(aProto, "dy", "0");
    reflectNumberListAsSingleValue(aProto, "rotate", "0");
  });

  makePrototype("SVG2TextElement", "text", SVG2TextPositioningElement, function(aProto) {
  });

  makePrototype("SVG2TSpanElement", "text", SVG2TextPositioningElement, function(aProto) {
  });

  makePrototype("SVG2TextPathElement", "textpath", SVG2TextContentElement, function(aProto) {
    reflectEnum(aProto, "method", ["align", "stretch"], "align");
    reflectEnum(aProto, "spacing", ["auto", "exact"], "auto");
    reflectLength(aProto, "startOffset", 0);
  });

  makePrototype("SVG2ClipPathElement", "clippath", SVG2Element, function(aProto) {
    reflectEnum(aProto, "clipPathUnits", ["userSpaceOnUse", "objectBoundingBox"], "userSpaceOnUse");
  });

  makePrototype("SVG2DefsElement", "defs", SVG2GraphicElement, function(aProto) {
  });

  makePrototype("SVG2GElement", "g", SVG2GraphicElement, function(aProto) {
  });

  makePrototype("SVG2ImageElement", "img", SVG2GraphicElement, function(aProto) {
    // We may want to leave this with HTMLImageElement as its prototype and to
    // add accessors for x and y to it, as well as getBBox() etc.
    reflectLength(aProto, "x", "0");
    reflectLength(aProto, "y", "0");
    reflectLength(aProto, "width", "0");
    reflectLength(aProto, "height", "0");
    reflectString(aProto, "src", "");
  });

  makePrototype("SVG2UseElement", "use", SVG2GraphicElement, function(aProto) {
    reflectLength(aProto, "x", "0");
    reflectLength(aProto, "y", "0");
    reflectLength(aProto, "width", "0");
    reflectLength(aProto, "height", "0");
    reflectString(aProto, "href", "");
  });

  // Extending HTMLAnchorElement.prototype with things that would appear
  // on SVGAElement objects.

  reflectString(HTMLAnchorElement.prototype, "transform", "");
  defineTransformAccessors(HTMLAnchorElement.prototype, "transform", "getTransformItems", "setTransformItems");

  HTMLAnchorElement.prototype.getBBox = function(aOptions) {
    return shadowFor(this).getBBox(aOptions);
  };

  HTMLAnchorElement.prototype.getTransformToElement = function(aElement) {
    return shadowFor(this).getTransformToElement(aElement);
  };

  Object.defineProperty(HTMLAnchorElement.prototype, "viewportElement", { get: function() { return originalFor(shadowFor(this).viewportElement) } });

  // Work around https://bugzilla.mozilla.org/show_bug.cgi?id=1051643.

  var workaroundAdded = false;

  function addWorkaround() {
    if (document.body && !workaroundAdded) {
      var workaround = document.createElementNS(kSVGNS, "svg");
      workaround.setAttribute("style", "display: none");
      document.body.appendChild(workaround);
      workaroundAdded = true;
    }
  }

  // Map of nodes in a <graphics> subtree we are tracking to records of the
  // form:
  var nodes = new Map();

  function mapSingleAttribute(aNewElement, aOldElement, aNewAttributeName) {
    var oldName = kMappedAttributes[aNewElement.localName] &&
                  kMappedAttributes[aNewElement.localName][aNewAttributeName] ||
                  kMappedAttributes._[aNewAttributeName] ||
                  aNewAttributeName;
    if (!oldName) {
      return;
    }
    if (aNewElement.hasAttribute(aNewAttributeName)) {
      if (oldName.startsWith("xlink:")) {
        aOldElement.setAttributeNS(kXLINKNS, oldName.substring(6), aNewElement.getAttribute(aNewAttributeName));
      } else {
        aOldElement.setAttribute(oldName, aNewElement.getAttribute(aNewAttributeName));
      }
    } else {
      if (oldName.startsWith("xlink:")) {
        aOldElement.removeAttributeNS(kXLINKNS, oldName.substring(6));
      } else {
        aOldElement.removeAttribute(oldName);
      }
    }
  }

  function mapAttributes(aNewElement, aOldElement) {
    [...aNewElement.attributes].forEach(function(aNewAttrNode) {
      var newName = aNewAttrNode.localName;
      mapSingleAttribute(aNewElement, aOldElement, newName);
    });
  }

  function createShadowNode(aNode) {
    switch (aNode.nodeType) {
      case Node.ELEMENT_NODE:
        var newName = aNode.localName;
        var oldName = kMappedElements[newName] || newName;
        var e = document.createElementNS(kSVGNS, oldName);
        mapAttributes(aNode, e);
        if (newName == "graphics") {
          e.setAttribute("style", "border: 1px solid black");
        }
        var proto = kPrototypes[newName] || SVG2UnknownElement.prototype;
        Object.setPrototypeOf(aNode, proto);
        return e;

      case Node.TEXT_NODE:
        return document.createTextNode(aNode.textContent);
    }
  }

  function createShadowTree(aNode) {
    var n = createShadowNode(aNode);
    if (!n) {
      return;
    }

    nodes.set(aNode, n);
    n.original = aNode;
    aNode.shadow = n;
    [...aNode.childNodes].forEach((child) => n.appendChild(createShadowTree(child)));

    return n;
  }

  function createGraphicsShadowTree(aElement) {
    addWorkaround();
    aElement.createShadowRoot().appendChild(createShadowTree(aElement));
  }

  // Create shadow trees for any initial <graphics> elements in the document.
  [...document.querySelectorAll("graphics")].forEach(createGraphicsShadowTree);

  // Watch for the insertion of any <graphics> elements and create a shadow
  // tree mapping it to an <svg> element.
  var obs = new MutationObserver(function(aMutations, aObserver) {
    aMutations.forEach(function(aRecord) {
      switch (aRecord.type) {
        case "childList":
          [...aRecord.addedNodes].forEach(function(aNode) {
            var shadowNode = nodes.get(aNode);
            if (shadowNode) {
              return;
            }
            var parentShadow = nodes.get(aNode.parentNode);
            if (parentShadow) {
              // We're inserting a node into an SVG 2 subtree.  If it's a
              // <graphics>, don't create a shadow node.
              if (aNode.nodeType != Node.ELEMENT_NODE ||
                  aNode.localName != "graphics") {
                var next, nextShadow;
                do {
                  next = aNode.nextSibling;
                  nextShadow = nodes.get(next);
                } while (next && !nextShadow);
                shadowNode = createShadowTree(aNode);
                parentShadow.insertBefore(shadowNode, nextShadow);
              }
            } else {
              // We're inserting a node as a child of an HTML element.  We want
              // to handle only <graphics> elements.
              if (aNode.localName == "graphics") {
                createGraphicsShadowTree(aNode);
              }
            }
          });
          [...aRecord.removedNodes].forEach(function(aNode) {
            var shadowNode = nodes.get(aNode);
            if (!shadowNode) {
              return;
            }
            shadowNode.remove();
            nodes.delete(aNode);
          });
          break;

        case "attributes":
          var shadowNode = nodes.get(aRecord.target);
          if (!shadowNode) {
            break;
          }
          mapSingleAttribute(aRecord.target, shadowNode, aRecord.attributeName);
          break;
      }
    });
  });
  obs.observe(document.documentElement, { attributes: true, characterData: true, childList: true, subtree: true });
})();
