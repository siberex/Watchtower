/**
 * Monochrome bookmarklet.
 * Applying color-space transformations to current document images.
 * © 2010 Stephan Legachev <siberex@gmail.com>
 * http://www.jingel.ru/monochrome
 * http://www.sib.li
 */

// We need to set this global to access functions from outside.
if (typeof Z5qPdjllq81 == "undefined") Z5qPdjllq81 = null;

(function () {
  // Save params if passed in global (first use of bookmarklet).
  var passedParams = (typeof Z5qPdjllq81 == "string")
                   ? Z5qPdjllq81 : false;

  /**
   * Converts RGB triplet to HSB (not HSL!) triplet.
   * Input:
   * r,g,b — integers, [0..255].
   * Output:
   * h,s,b — floats,
   * h = [0..360), s = [0..1], b = [0..1].
   */
  function rgb2hsb(r, g, b) {
    var h, s;

    r /= 255; g /= 255; b /= 255; // [0..255] → [0..1]

    var max = (r > g && r > b)
            ? r
            : (g > b ? g : b); // eq. Math.max(r, g, b),
    var min = (r < g && r < b)
            ? r
            : (g < b ? g : b); // eq. Math.min(r, g, b);

    // NB!: reusing “min” for optimization reasons:
    min = max - min;
    if (min === 0) {
      h = 0;              // We have gray (r == g == b)
    } else if (max === r) {
      h = 60 * ( ( (g - b) / min ) % 6 );
      if (h < 0)
        h += 360;
    } else if (max === g) {
      h = 60 * (b - r) / min + 120;
    } else {              // max === b
      h = 60 * (r - g) / min + 240;
    }

    s = (max === 0) ? 0 : min / max;
    return [h, s, max];
  } // rgb2hsb


  /**
   * Converts HSB values to RGB.
   * Input:
   * h,s,b — floats; h = [0..360), s = [0..1], b = [0..1].
   * Output:
   * r,g,b — integers, [0..255].
   */
  function hsb2rgb(h, s, v) {
      h /= 60;
      var f = h - (h = ~~h); // ~~h eq. parseInt(h)

      // h %= 6; // Required only to normalize hues >= 360.
      var p = v * (1 - s);

      // if H'=(1,3,5): f=q=V(1-fS);
      // if H'=(0,2,4): f=t=V(1-S(1-f)).
      var f = (h & 1)
          ? v * (1 - f * s)
          : v * (1 - (1 - f) * s);

      // ↓ this equals to f = (f * 255).toFixed(0);
      p *= 255; if (p - (p = ~~p) >= 0.5) p++;
      f *= 255; if (f - (f = ~~f) >= 0.5) f++;
      v *= 255; if (v - (v = ~~v) >= 0.5) v++;

      if (h === 0) return [v, f, p];
      if (h === 1) return [f, v, p];
      if (h === 2) return [p, v, f];
      if (h === 3) return [p, f, v];
      if (h === 4) return [f, p, v];
      return [v, p, f]; // h === 5
  } // hsb2rgb


  var transform = {
    /**
     * Сдвиги цветового тона, насыщенности и яркости.
     */
    hsb: function(data, params) {
      var r, g, b,
          hsb, rgb;

      if ( params[0] == 0 && params[1] == 0 && params[2] == 0 )
        return data; // H = S = B = 0, nothing to do.

      for (var i = 0; i < data.length; i += 4) {
        r = data[i];
        g = data[i+1];
        b = data[i+2];

        hsb = rgb2hsb(r, g, b);

        hsb[0] += 360 + params[0];
        hsb[0] %= 360;

        hsb[1] += params[1];
        if (hsb[1] < 0) hsb[1] = 0;
        if (hsb[1] > 1) hsb[1] = 1;

        hsb[2] += params[2];
        if (hsb[2] < 0) hsb[2] = 0;
        if (hsb[2] > 1) hsb[2] = 1;

        rgb = hsb2rgb(hsb[0], hsb[1], hsb[2]);

        data[i]   = rgb[0];
        data[i+1] = rgb[1];
        data[i+2] = rgb[2];
      }

      return data;
    },

    /**
     * Приведение изображения к монохромному.
     */
    grayscale: function(data, params) {
      var mid;

      for (var i = 0; i < data.length; i += 4) {
        mid = parseInt( params[0] * data[i] +    // xR * r
                        params[1] * data[i+1] +  // xG * g
                        params[2] * data[i+2],   // xB * b
                        10 );

        data[i] = data[i+1] = data[i+2] = mid;
      }

      return data;
    },


    rgb: function(data, params) {

      if ( !( params[0] | params[1] | params[2] ) )
        return data; // R = G = B = 0, nothing to do.

      for (var i = 0; i < data.length; i += 4) {
        data[i]   += params[0];
        if (data[i] < 0) data[i] = 0;
        if (data[i] > 255) data[i] = 255;

        data[i+1] += params[1];
        if (data[i+1] < 0) data[i+1] = 0;
        if (data[i+1] > 255) data[i+1] = 255;

        data[i+2] += params[2];
        if (data[i+2] < 0) data[i+2] = 0;
        if (data[i+2] > 255) data[i+2] = 255;

      }

      return data;
    }
  };


  /**
   *
   *
   */
  function convertImage(img, params, document) {
    var document = document || window.document;
    var iW = img.width,
        iH = img.height;
    //var params = params || passedParams;
    var method = params[0];

    //console.debug(method);
    //console.debug(params);

    // grayscale → Grayscale
    // method = method.charAt(0).toUpperCase() + method.slice(1);

    try {

      var canvas    = document.createElement('canvas');
      canvas.width  = iW;
      canvas.height = iH;
      var ctx       = canvas.getContext('2d');


      // Клонируем изображение на canvas.
      ctx.drawImage(img, 0, 0, iW, iH);

      // Получаем массив пикселей.
      // Если изображение загружается со стороннего домена, здесь будет
      // нарушение Same Origin Policy, в catch попадёт ошибка
      // NS_ERROR_DOM_SECURITY_ERR: Security error
      pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
      // Выполняем трансформацию.
      transform[method]( pixels.data, params.slice(1) );

      ctx.putImageData(pixels, 0, 0, 0, 0, iW, iH);

      if (canvas.toDataURL) {

        var src = canvas.toDataURL("image/png");
        img.src = src;

      } else {
        // Implemented only for compatibility purposes,
        // for IE and others not supporting canvas.toDataURL().
        // This way Bookmarklet can only be called once.
        img.parentNode.insertBefore(canvas, img);
        img.parentNode.removeChild(img);
      }

    } catch (e) {
      console.log(e.name + ": " + e.message);
    }
  } // convertImage


  /**
   * Goes over document images passing it one by one
   * to converting function.
   */
  function documentImagesConvertion(document, params) {
    var document = document || window.document;

    var ilist = document.getElementsByTagName('img');
    //var ilist = document.images;

    var img;
    for (var i = 0; i < ilist.length; i++) {
      img = ilist[i];

      // Image is not loaded yet, attaching listener.
      // Warning: We need to remove listener after the first fire,
      // or we can get image updated again and again;
      if (!img.complete) {
        if (img.addEventListener) {
          img.addEventListener("load", function() {
            this.removeEventListener("load", arguments.callee, false);
            convertImage(this, params, document);
          }, false);
        } else if (img.attachEvent) {
          img.attachEvent("onload", function() {
            img.detachEvent('onload', arguments.callee);
            convertImage(img, params, document);
          });
        } else {
          // This way from DOM level 1 should not be used due to
          // risk of breaking some original behavior.
          //img.onload = function() {
          //  img.onload = undefined;
          //  convertImage(img, params, document);
          //}
        }

      } else {
        convertImage(img, params, document);
      }
    }

  } // documentImagesConvertion


  /**
   * Recursive function to traverse all frames.
   * Call: traverseFrames(window);
   */
  function traverseFrames(win, params) {
    try {
      // Working with win.document.
      var doc = win.document;
      documentImagesConvertion(doc, params);

    } catch(e) {
      // Error while accessing frame.
      console.log(e.name + ": " + e.message);
    }
    // Recursively traverse frames.
    for (var i = 0; i < win.frames.length; i++) {
      traverseFrames(win.frames[i], params);
    }
  } // traverseFrames


  function init(params) {
    try {
      params = params.split("|");
      for (var i = 1; i < params.length; i++) {
        params[i] = parseFloat(params[i]);
      }
      //passedParams = params;

      traverseFrames(window, params);
    } catch (e) {
      console.log(e.name + ": " + e.message);
    }
  } // init

  // Saving references in global namespace.
  Z5qPdjllq81 = {
    init      : init,
    transform : transform,
    rgb2hsb   : rgb2hsb,
    hsb2rgb   : hsb2rgb
  };

  if (passedParams) Z5qPdjllq81.init(passedParams);

})();