/**
 * @file Class representing a site color in SiteVision.
 * @author Hampus Nordin <nordin.hampus@gmail.com>
 * @copyright Hampus Nordin 2018
 * @license MIT
 * @module SiteColor
 */
/* globals require, module */
(function (root, factory) {
  if (typeof define === 'function') {
    // AMD. Register as an anonymous module.
    define(factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.SiteColor = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  var HEX_REGEXP       = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  var RGB_REGEXP       = /^rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)$/i;
  var RGBA_REGEXP      = /^rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9.]{1,3})\s*\)$/i;
  var SHORT_HEX_REGEXP = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  /**
   * Class constructor
   */
  var SiteColor = function SiteColor () {
    this.r = null;
    this.g = null;
    this.b = null;
    this.opacity = null;
  };

  /**
   * Set red value to an integer between 0 and 255.
   *
   * @param {Integer} red
   * @returns {SiteColor}
   */
  SiteColor.prototype.setRed = function setRed (red) {
    red = numberBound(parseInt(red), 0, 255);
    this.r = isNaN(red) ? null : red;
    return this;
  };

  /**
   * Set green value to an integer between 0 and 255.
   *
   * @param {Integer} green
   * @returns {SiteColor}
   */
  SiteColor.prototype.setGreen = function setGreen (green) {
    green = numberBound(parseInt(green), 0, 255);
    this.g = isNaN(green) ? null : green;
    return this;
  };

  /**
   * Set blue value to an integer between 0 and 255.
   *
   * @param {Integer} blue
   * @returns {SiteColor}
   */
  SiteColor.prototype.setBlue = function setBlue (blue) {
    blue = numberBound(parseInt(blue), 0, 255);
    this.b = isNaN(blue) ? null : blue;
    return this;
  };

  /**
   * Set opacity to a float between 0 and 1.
   *
   * @param {Float} opacity
   * @returns {SiteColor}
   */
  SiteColor.prototype.setOpacity = function setOpacity (opacity) {
    opacity = numberBound(parseFloat(opacity), 0, 1);
    this.opacity = isNaN(opacity) ? null : opacity;
    return this;
  };

  /**
   * Fill color values by hex string. For example,
   * `#ff00aa` will result in 255 red, 0 green and 170 blue.
   *
   * @param {String} hex
   * @returns {SiteColor}
   */
  SiteColor.prototype.fillHex = function fillHex (hex) {
    var res = HEX_REGEXP.exec(hex);

    if (res) {
      res = res.slice(1)[0];

      if (res.length === 3) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        res = res.replace(SHORT_HEX_REGEXP, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });
      }

      this
        .setRed(parseInt(res[0] + res[1], 16))
        .setGreen(parseInt(res[2] + res[3], 16))
        .setBlue(parseInt(res[4] + res[5], 16))
        .setOpacity(1);
    }

    return this;
  };

  /**
   * Fill color values by rgb string in the format `rgb(255, 0, 170)`.
   *
   * @param {String} rgb
   * @returns {SiteColor}
   */
  SiteColor.prototype.fillRgb = function fillRgb (rgb) {
    var res = RGB_REGEXP.exec(rgb);

    if (res) {
      res = res.slice(1);

      this
        .setRed(res[0])
        .setGreen(res[1])
        .setBlue(res[2])
        .setOpacity(1);
    }

    return this;
  };

  /**
   * Fill color values by rgba string in the format `rgb(255, 0, 170, 0.6)`.
   *
   * @param {String} rgba
   * @returns {SiteColor}
   */
  SiteColor.prototype.fillRgba = function fillRgba (rgba) {
    var res = RGBA_REGEXP.exec(rgba);

    if (res) {
      res = res.slice(1);

      this
        .setRed(res[0])
        .setGreen(res[1])
        .setBlue(res[2])
        .setOpacity(res[3]);
    }

    return this;
  };

  /**
   * Fill color values by passing a color string in either hex, rgb or rgba format.
   *
   * @param {String} colorString
   * @returns {SiteColor}
   */
  SiteColor.prototype.fill = function fill (colorString) {
    if (HEX_REGEXP.test(colorString)) {
      this.fillHex(colorString);
    } else if (RGB_REGEXP.test(colorString)) {
      this.fillRgb(colorString);
    } else if (RGBA_REGEXP.test(colorString)) {
      this.fillRgba(colorString);
    }
    return this;
  };

  /**
   * Returns the luminance of the color represented as a float between `0` and `1`.
   *
   * @returns {Float}
   */
  SiteColor.prototype.getLuminance = function getLuminance () {
    return luminanace(this.r, this.g, this.b);
  };

  /**
   * Returns the contrast between the two colors. The contrast returned is
   * represented as a float between `1` and `21` where `1` is no contrast
   * whatsoever and `21` is full contrast (black on white).
   *
   * @param {SiteColor} color
   * @returns {Float}
   */
  SiteColor.prototype.compareContrastTo = function compareContrastTo (color) {
    return contrast(this.toRgbArray(), color.toRgbArray());
  };

  /**
   * Darkens the color. Pass `0.2` to darken the color by `20 %`.
   *
   * @param {Float} percent
   * @returns {SiteColor}
   */
  SiteColor.prototype.darken = function darken (percent) {
    percent = 1 - numberBound(parseFloat(percent), 0, 1);

    this
      .setRed(this.r * percent)
      .setGreen(this.g * percent)
      .setBlue(this.b * percent);

    return this;
  };

  /**
   * Lightens the color. Pass `0.2` to lighten the color by `20 %`.
   *
   * @param {Float} percent
   * @returns {SiteColor}
   */
  SiteColor.prototype.lighten = function lighten (percent) {
    percent = 1 + numberBound(parseFloat(percent), 0, 1);

    this
      .setRed(this.r * percent)
      .setGreen(this.g * percent)
      .setBlue(this.b * percent);

    return this;
  };

  /**
   * Merge color with another color object.
   *
   * @param {SiteColor} color
   * @param {Float} percent
   * @returns {SiteColor}
   */
  SiteColor.prototype.blendWith = function blendWith (color, percent) {
    percent = numberBound(parseFloat(percent), 0, 1);

    this
      .setRed((color.r - this.r) * percent + this.r)
      .setGreen((color.g - this.g) * percent + this.g)
      .setBlue((color.b - this.b) * percent + this.b);

    return this;
  };

  /**
   * Returns the rgb value as an array of integers in the order red, green and blue.
   *
   * @returns {Array}
   */
  SiteColor.prototype.toRgbArray = function toRgbArray () {
    return [this.r, this.g, this.b];
  };

  /**
   * Returns the color as an rgb string suitable for css.
   *
   * @returns {String}
   */
  SiteColor.prototype.toRgb = function toRgb () {
    return 'rgb(' + [this.r, this.g, this.b].join(', ') + ')';
  };

  /**
   * Returns the color as an rgba string suitable for css.
   *
   * @returns {String}
   */
  SiteColor.prototype.toRgba = function toRgba () {
    return 'rgba(' + [this.r, this.g, this.b, this.opacity].join(', ') + ')';
  };

  /**
   * Returns the color as a hex string suitable for css.
   *
   * @returns {String}
   */
  SiteColor.prototype.toHex = function toHex () {
    return "#" + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
  };

  /**
   * Returns a string representation of the color suitable for css.
   *
   * @returns {String}
   */
  SiteColor.prototype.toString = function toString () {
    return this.opacity === 1 ? this.toHex() : this.toRgba();
  };

  // Internal utility functions

  function numberBound (num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  function luminanace (r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function contrast (rgb1, rgb2) {
    var c = (luminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05) / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
    return (c < 1) ? 1 / c : c;
  }

  // Return class
  return SiteColor;
}));
