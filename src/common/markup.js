/**
 * notion-enhancer
 * (c) 2023 dragonwocky <thedragonring.bod@gmail.com> (https://dragonwocky.me/)
 * (https://notion-enhancer.github.io/) under the MIT license
 */

"use strict";

const { twind, htm, lucide } = globalThis,
  { iconColour, iconMonochrome } = globalThis.__enhancerApi;

const kebabToPascalCase = (string) =>
    string[0].toUpperCase() +
    string.replace(/-[a-z]/g, (match) => match.slice(1).toUpperCase()).slice(1),
  hToString = (type, props, ...children) =>
    `<${type}${Object.entries(props)
      .map(([attr, value]) => ` ${attr}="${value}"`)
      .join("")}>${children
      .map((child) => (Array.isArray(child) ? hToString(...child) : child))
      .join("")}</${type}>`;

const encodeSvg = (svg) =>
    // https://gist.github.com/jennyknuth/222825e315d45a738ed9d6e04c7a88d0
    svg
      .replace(
        "<svg",
        ~svg.indexOf("xmlns")
          ? "<svg"
          : '<svg xmlns="http://www.w3.org/2000/svg"'
      )
      .replace(/"/g, "'")
      .replace(/%/g, "%25")
      .replace(/#/g, "%23")
      .replace(/{/g, "%7B")
      .replace(/}/g, "%7D")
      .replace(/</g, "%3C")
      .replace(/>/g, "%3E")
      .replace(/\s+/g, " "),
  presetIcons = ([, icon, mode]) => {
    let svg;
    // manually register i-notion-enhancer: renders the colour
    // version by default, renders the monochrome version when
    // mask mode is requested via i-notion-enhancer?mask
    if (icon === "notion-enhancer") {
      svg = mode === "mask" ? iconMonochrome : iconColour;
    } else {
      icon = kebabToPascalCase(icon);
      if (!lucide[icon]) return;
      const [type, props, children] = lucide[icon];
      svg = hToString(type, props, ...children);
    }
    // https://antfu.me/posts/icons-in-pure-css
    const dataUri = `url("data:image/svg+xml;utf8,${encodeSvg(svg)}")`;
    if (mode === "auto") mode = undefined;
    mode ??= svg.includes("currentColor") ? "mask" : "bg";
    return {
      display: "inline-block",
      height: "1em",
      width: "1em",
      ...(mode === "mask"
        ? {
            mask: `${dataUri} no-repeat`,
            "mask-size": "100% 100%",
            "background-color": "currentColor",
            color: "inherit",
          }
        : {
            background: `${dataUri} no-repeat`,
            "background-size": "100% 100%",
            "background-color": "transparent",
          }),
    };
  };

// at-runtime utility class evaluation w/ twind:
// - feature parity w/ tailwind v3
// - useful for building self-contained components
//   (mods can extend interfaces w/out needing to
//   import additional stylesheets)
// - integrated with lucide to render icons w/out
//   complex markup, e.g. `<i class="i-bookmark" />`
twind.install({
  darkMode: "class",
  rules: [
    ["text-(wrap|nowrap|balance|pretty)", "textWrap"],
    [/^i-((?:\w|-)+)(?:\?(mask|bg|auto))?$/, presetIcons],
  ],
  variants: [
    // https://github.com/tw-in-js/twind/blob/main/packages/preset-ext/src/variants.ts
    [
      "not-([a-z-]+|\\[.+\\])",
      ({ 1: $1 }) => `&:not(${($1[0] == "[" ? "" : ":") + $1})`,
    ],
    ["children", "&>*"],
    ["siblings", "&~*"],
    ["sibling", "&+*"],
    [/^&/, (match) => match.input],
    [/^has-\[([^\]]+)\]/, (match) => `&:has(${match[1]})`],
  ],
});

// https://developer.mozilla.org/en-US/docs/Web/SVG/Element
const svgElements = [
    "animate",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "defs",
    "desc",
    "discard",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "foreignObject",
    "g",
    "hatch",
    "hatchpath",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "script",
    "set",
    "stop",
    "style",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "title",
    "tspan",
    "use",
    "view",
  ],
  htmlAttributes = [
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes
    "accept",
    "accept-charset",
    "accesskey",
    "action",
    "align",
    "allow",
    "alt",
    "async",
    "autocapitalize",
    "autocomplete",
    "autofocus",
    "autoplay",
    "background",
    "bgcolor",
    "border",
    "buffered",
    "capture",
    "challenge",
    "charset",
    "checked",
    "cite",
    "class",
    "code",
    "codebase",
    "color",
    "cols",
    "colspan",
    "content",
    "contenteditable",
    "contextmenu",
    "controls",
    "coords",
    "crossorigin",
    "csp",
    "data",
    "data-*",
    "datetime",
    "decoding",
    "default",
    "defer",
    "dir",
    "dirname",
    "disabled",
    "download",
    "draggable",
    "enctype",
    "enterkeyhint",
    "for",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "headers",
    "height",
    "hidden",
    "high",
    "href",
    "hreflang",
    "http-equiv",
    "icon",
    "id",
    "importance",
    "integrity",
    "inputmode",
    "ismap",
    "itemprop",
    "keytype",
    "kind",
    "label",
    "lang",
    "loading",
    "list",
    "loop",
    "low",
    "max",
    "maxlength",
    "minlength",
    "media",
    "method",
    "min",
    "multiple",
    "muted",
    "name",
    "novalidate",
    "open",
    "optimum",
    "pattern",
    "ping",
    "placeholder",
    "playsinline",
    "poster",
    "preload",
    "radiogroup",
    "readonly",
    "referrerpolicy",
    "rel",
    "required",
    "reversed",
    "role",
    "rows",
    "rowspan",
    "sandbox",
    "scope",
    "selected",
    "shape",
    "size",
    "sizes",
    "slot",
    "span",
    "spellcheck",
    "src",
    "srcdoc",
    "srclang",
    "srcset",
    "start",
    "step",
    "style",
    "tabindex",
    "target",
    "title",
    "translate",
    "type",
    "usemap",
    "value",
    "width",
    "wrap",
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute[
    "accent-height",
    "accumulate",
    "additive",
    "alignment-baseline",
    "alphabetic",
    "amplitude",
    "arabic-form",
    "ascent",
    "attributeName",
    "attributeType",
    "azimuth",
    "baseFrequency",
    "baseline-shift",
    "baseProfile",
    "bbox",
    "begin",
    "bias",
    "by",
    "calcMode",
    "cap-height",
    "clip",
    "clipPathUnits",
    "clip-path",
    "clip-rule",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "contentScriptType",
    "contentStyleType",
    "cursor",
    "cx",
    "cy",
    "d",
    "decelerate",
    "descent",
    "diffuseConstant",
    "direction",
    "display",
    "divisor",
    "dominant-baseline",
    "dur",
    "dx",
    "dy",
    "edgeMode",
    "elevation",
    "enable-background",
    "end",
    "exponent",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "filterRes",
    "filterUnits",
    "flood-color",
    "flood-opacity",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "format",
    "from",
    "fr",
    "fx",
    "fy",
    "g1",
    "g2",
    "glyph-name",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "hanging",
    "horiz-adv-x",
    "horiz-origin-x",
    "ideographic",
    "image-rendering",
    "in",
    "in2",
    "intercept",
    "k",
    "k1",
    "k2",
    "k3",
    "k4",
    "kernelMatrix",
    "kernelUnitLength",
    "kerning",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "lengthAdjust",
    "letter-spacing",
    "lighting-color",
    "limitingConeAngle",
    "local",
    "marker-end",
    "marker-mid",
    "marker-start",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "mask",
    "maskContentUnits",
    "maskUnits",
    "mathematical",
    "mode",
    "numOctaves",
    "offset",
    "opacity",
    "operator",
    "order",
    "orient",
    "orientation",
    "origin",
    "overflow",
    "overline-position",
    "overline-thickness",
    "panose-1",
    "paint-order",
    "path",
    "pathLength",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "pointer-events",
    "points",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "r",
    "radius",
    "referrerPolicy",
    "refX",
    "refY",
    "rendering-intent",
    "repeatCount",
    "repeatDur",
    "requiredExtensions",
    "requiredFeatures",
    "restart",
    "result",
    "rotate",
    "rx",
    "ry",
    "scale",
    "seed",
    "shape-rendering",
    "slope",
    "spacing",
    "specularConstant",
    "specularExponent",
    "speed",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stemh",
    "stemv",
    "stitchTiles",
    "stop-color",
    "stop-opacity",
    "strikethrough-position",
    "strikethrough-thickness",
    "string",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "surfaceScale",
    "systemLanguage",
    "tableValues",
    "targetX",
    "targetY",
    "text-anchor",
    "text-decoration",
    "text-rendering",
    "textLength",
    "to",
    "transform",
    "transform-origin",
    "u1",
    "u2",
    "underline-position",
    "underline-thickness",
    "unicode",
    "unicode-bidi",
    "unicode-range",
    "units-per-em",
    "v-alphabetic",
    "v-hanging",
    "v-ideographic",
    "v-mathematical",
    "values",
    "vector-effect",
    "version",
    "vert-adv-y",
    "vert-origin-x",
    "vert-origin-y",
    "viewBox",
    "viewTarget",
    "visibility",
    "widths",
    "word-spacing",
    "writing-mode",
    "x",
    "x-height",
    "x1",
    "x2",
    "xChannelSelector",
    "xlink:actuate",
    "xlink:arcrole",
    "xlink:href",
    "xlink:role",
    "xlink:show",
    "xlink:title",
    "xlink:type",
    "xml:base",
    "xml:lang",
    "xml:space",
    "y",
    "y1",
    "y2",
    "yChannelSelector",
    "z",
    "zoomAndPan",
  ];

// enables use of the jsx-like htm syntax
// for building components and interfaces
// with tagged templates. instantiates dom
// elements directly, does not use a vdom.
// e.g. html`<div class=${className}></div>`
const h = (type, props, ...children) => {
    children = children.flat(Infinity);
    // html`<${Component} attr="value">Click Me<//>`
    if (typeof type === "function") {
      return type(props ?? {}, ...children);
    }
    const elem = svgElements.includes(type)
      ? document.createElementNS("http://www.w3.org/2000/svg", type)
      : document.createElement(type);
    for (const prop in props ?? {}) {
      if (typeof props[prop] === "undefined") continue;
      const isAttr =
        htmlAttributes.includes(prop) ||
        prop.startsWith("data-") ||
        prop.startsWith("aria-");
      if (isAttr) {
        if (typeof props[prop] === "boolean") {
          if (!props[prop]) continue;
          elem.setAttribute(prop, "");
        } else elem.setAttribute(prop, props[prop]);
      } else elem[prop] = props[prop];
    }
    if (type === "style") {
      elem.append(children.join("").replace(/\s+/g, " "));
    } else elem.append(...children);
    return elem;
  },
  // combines instance-provided element props
  // with a template of element props such that
  // island/component/template props handlers
  // and styles can be preserved and extended
  // rather than overwritten
  extendProps = (props, extend) => {
    for (const key in extend) {
      const { [key]: userProvided } = props;
      if (typeof extend[key] === "function") {
        props[key] = (...args) => {
          extend[key](...args);
          userProvided?.(...args);
        };
      } else if (key === "class") {
        if (userProvided) props[key] += " ";
        if (!userProvided) props[key] = "";
        props[key] += extend[key];
      } else props[key] = extend[key] ?? userProvided;
    }
    return props;
  },
  html = htm.bind(h);

Object.assign((globalThis.__enhancerApi ??= {}), {
  html,
  extendProps,
});
