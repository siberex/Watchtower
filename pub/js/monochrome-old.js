(function () {
  if (typeof Z5qPdjllq81 !== "string")
    return false;

  /**
   * RGB → HSB conversion.
   */
  function rgb2hsb(r, g, b) {
    var h, s;

    r /= 255; g /= 255; b /= 255;

    var max = (r > g && r > b)
            ? r
            : (g > b ? g : b); // eq. Math.max(r, g, b),
    var min = (r < g && r < b)
            ? r
            : (g < b ? g : b); // eq. Math.min(r, g, b);

    if (max === min) {
      h = 0;              // We have gray (r == g == b)
    } else if (max === r) {
      h = (60 * (g - b) / (max - min) + 360) % 360;
    } else if (max === g) {
      h = 60 * (b - r) / (max - min) + 120;
    } else {                // if (max === b)
      h = 60 * (r - g) / (max - min) + 240;
    }

    s = (max === 0) ? 0 : 1 - min / max;
    return [~~h, s, max];  // ~~h eq. parseInt(h)
  } // rgb2hsb

  /**
   * HSB → RGB conversion.
   */
  function hsb2rgb(h, s, v) {
    h /= 60;
    var f = h - (h = ~~h); // ~~h eq. parseInt(h)
    h %= 6;
    var p = v * (1 - s);
    var f = (h & 1)
          ? v * (1 - f * s)
          : v * (1 - (1 - f) * s);
    p = ~~(p * 255); f = ~~(f * 255); v = ~~(v * 255);
    if (h === 0) return [v, f, p];
    if (h === 1) return [f, v, p];
    if (h === 2) return [p, v, f];
    if (h === 3) return [p, f, v];
    if (h === 4) return [f, p, v];
    return [v, p, f]; // if (h === 5)
  } // hsb2rgb














  /**
   * Нахождение центровзвешенного цвета.
   */
  function filterAverage(data) {
    var r = 0, g = 0, b = 0, a = 0;
    for (var i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i+1];
      b += data[i+2];
      a += data[i+3];
    }
    i = i >> 2;
    r /= i;
    g /= i;
    b /= i;
    a /= i;
    return [ Math.round(r), Math.round(g), Math.round(b), Math.round(a) ];
    //return [~~r, ~~g, ~~b, ~~a];
  } // filterAverage

  /**
   * Приведение изображения к монохромному.
   */
  function filterGrayscale(data, w) {
    var r,g,b,a, x,y, mid;

    for (var i = 0; i < data.length; i += 4) {
      r = data[i];
      g = data[i+1];
      b = data[i+2];
      //a = data[i+3];

      mid = ~~((r+g+b)/3);
      //mid = parseInt( (0.2125 * r) + (0.7154 * g) + (0.0721 * b), 10 );

      data[i] = data[i+1] = data[i+2] = mid;

      //x = ~~((i>>2) / w);
      //y = (i>>2) % w;
    }

    return data;
  } // filterGrayscale

  /**
   * Сдвиг цветового тона.
   */
  function filterHueShift(data) {
    var r,g,b,a, hsb,rgb;

    for (var i = 0; i < data.length; i += 4) {
      r = data[i];
      g = data[i+1];
      b = data[i+2];

      hsb = rgb2hsb(r, g, b);
      hsb[0] += 30;
      rgb = hsb2rgb(hsb[0], hsb[1], hsb[2]);
      data[i]   = rgb[0];
      data[i+1] = rgb[1];
      data[i+2] = rgb[2];
    }

    return data;
  } // filterHueShift

  /**
   * Поиск контрастных переходов.
   */
  function filterFindEdges(canvas) {
    var context = canvas.getContext('2d');
    // get the image data to manipulate
    var input = context.getImageData(0, 0, canvas.width, canvas.height);

    // get an empty slate to put the data into
    var output = context.createImageData(canvas.width, canvas.height);

    // alias some variables for convenience
    // notice that we are using input.width and input.height here
    // as they might not be the same as canvas.width and canvas.height
    // (in particular, they might be different on high-res displays)
    var w = input.width, h = input.height;
    var inputData = input.data;
    var outputData = output.data;

    // edge detection
    for (var y = 1; y < h-1; y += 1) {
      for (var x = 1; x < w-1; x += 1) {
        for (var c = 0; c < 3; c += 1) {
          var i = (y*w + x)*4 + c;
          outputData[i] = 127 + -inputData[i - w*4 - 4] -   inputData[i - w*4] - inputData[i - w*4 + 4] +
                                -inputData[i - 4]       + 8*inputData[i]       - inputData[i + 4] +
                                -inputData[i + w*4 - 4] -   inputData[i + w*4] - inputData[i + w*4 + 4];
        }
        outputData[(y*w + x)*4 + 3] = 255; // alpha
      }
    }

    // put the image data back after manipulation
    context.putImageData(output, 0, 0);
  }

  /*function traverse(win) {
    try {
      // Работа с win.document
      var doc = win.document;

    } catch(e) {
      // Ошибка доступа к фрейму
      console.log(e.name + ": " + e.message);
    }
    // Вызов traverse для вложенных фреймов
    for (var i = 0; i < win.frames.length; i++) {
      traverse(win.frames[i]);
    }
  } // traverse
  //try {
    traverse(window);
  } catch (e) {
    console.log(e.name + ": " + e.message);
  }*/

  function convertImage(img) {
    iW = img.width;
    iH = img.height;

    canvas = document.createElement('canvas');
    canvas.width = iW;
    canvas.height = iH;
    ctx = canvas.getContext('2d');
    canvas.ctx = ctx;

    // Клонируем изображение на canvas.
    ctx.drawImage(img, 0, 0, iW, iH);

    // Получаем массив пикселей.
    // Если изображение загружается со стороннего домена, здесь будет
    // нарушение Same Origin Policy, в catch попадёт ошибка
    // NS_ERROR_DOM_SECURITY_ERR: Security error
    pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Выполняем трансформацию.
    pixels.data = filterHueShift(pixels.data);
    ctx.putImageData(pixels, 0, 0, 0, 0, iW, iH);

    // Use this for compatibility with IE and others not supporting canvas.toDataURL()
    //img.parentNode.insertBefore(canvas, img);
    //img.parentNode.removeChild(img);

    var src = canvas.toDataURL("image/png");
    img.src = src;
  }

  function monochromeDoImagesConvertion(params) {
    //if (!params) return false;
    alert(params);
    return;
    var ilist = document.getElementsByTagName('img');
    //var ilist = document.images;

    var img, iW, iH,
        canvas, ctx,
        pixels;
    for (var i = 0; i < ilist.length; i++) {
      img = ilist[i];
      //if (!img.complete) continue;

      try {
        convertImage(img);


      } catch (e) {
        console.log(e.name + ": " + e.message);
      }
    }
  }

  //var findedParams = 444444;
  //monochromeDoImagesConvertion(findedParams);
  alert("Wheeeeeeeee!");
})();