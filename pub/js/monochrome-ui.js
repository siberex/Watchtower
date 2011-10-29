$(function() {
  var currMode  = null;
	var preview   = $('#preview-img');
	var canvas    = $('#preview-canvas')[0];
  var ctx       = canvas.getContext('2d');

  var C = Z5qPdjllq81; // make sure monochrome.js is loaded

  var deferredUpdate = false;

  /**
   * Copies image data to canvas for manipulation.
   *
  function prepareCanvas() {
    var img = preview[0];
    ctx.drawImage(
      img,
      canvas.offsetLeft, canvas.offsetTop, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    );

    // Saving original pixel data.
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.pixelData = pixels.data;

    if (deferredUpdate) {
      deferredUpdate();
      deferredUpdate = false;
    }
  } // prepareCanvas

  if (preview[0].complete) {
    prepareCanvas();
  } else {
    preview.load(prepareCanvas);
  }*/


  $("#debug").click(function() {
    preview.toggle();
    console.debug( currMode );
    console.debug(
      $( "#slider-ared" ).slider("value") +
      $( "#slider-agreen" ).slider("value") +
      $( "#slider-ablue" ).slider("value")
    );
  });




  function drawPreviewOnCanvas(params) {
    var method = params.shift();
    console.debug(method);
    //console.debug(C.transform[method]);

    $("#loading-spinner").show();
    $("#loading-stopicon").show();

    //canvas.pixels.data

    /*var input = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var inputData = input.data;

    console.debug(inputData[1]);

    // get an empty slate to put the data into
    var output = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var outputData = output.data;
    outputData = C.transform[method](inputData, params);

    console.debug(outputData[1]);

    // put the image data back after manipulation
    ctx.putImageData(output, 0, 0, 0, 0, canvas.width, canvas.height);*/

    var img = preview[0];
    ctx.drawImage(
      img,
      canvas.offsetLeft, canvas.offsetTop, canvas.width, canvas.height,
      0, 0, canvas.width, canvas.height
    );

    // Fetch original pixel data.
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Выполняем трансформацию.
    C.transform[method](pixels.data, params);
    ctx.putImageData(pixels, 0, 0, 0, 0, canvas.width, canvas.height);

    $("#loading-spinner").hide();
    $("#loading-stopicon").hide();
  }


  function applyTransformations() {
    var href = $("#bookmarklet").prop("href");
    var sliders = $("#"+currMode).find(".ui-slider");

    var X = sliders.eq(0).slider("value");
    var Y = sliders.eq(1).slider("value");
    var Z = sliders.eq(2).slider("value");

    var params = [currMode.toLowerCase(), X, Y, Z];
    // Set new href for bookmarklet.
    href = href.replace( /\'(hsb|grayscale|rgb)\|?.*?\'/g, "'"+params.join("|")+"'" );
    $("#bookmarklet").prop("href", href);

    // Animation highlight.
    $("#bookmarklet").stop(true, true).effect("highlight", {color: "#FFFFAA"}, 1200);

    if (preview[0].complete) {
      drawPreviewOnCanvas(params);
    } else {
      preview.load(function() {
        drawPreviewOnCanvas(params);
      });
    }
  }

  /* Event: Changing tabs with modes and mode controls. */
  function tabMethodChange(event, ui) {
    var modeMap = [
      "HSB",
      "Grayscale",
      "RGB"
    ];

    var mode = $("#method-selector input[name='method-selector']:checked").val();
    //console.log(mode);
    currMode = mode;

    $.each(modeMap, function(index, value) {
      if (value != "mode")
        $("#" + value).hide().find(".ui-slider").slider("option", "disabled", true);
    });

    $("#" + mode).show().find(".ui-slider").slider("option", "disabled", false);

    applyTransformations();

  } // tabMethodChange
  $( "#method-selector" ).buttonset().change(tabMethodChange).ready(tabMethodChange);


  /**
   * Event: Changing Grayscale sliders.
   * Balance gray components in Grayscale mode
   * so values should always give 1 in sum.
   */
  function balanceGrayStimules(slider, value) {

    var sliderMap = {
      red   : ["green", "blue"],
      green : ["red", "blue"],
      blue  : ["red", "green"]
    }

    if ( !sliderMap[slider] )
      return false;

    var a, b, tmp;
    var remainder = 1 - value;

    a = $( "#slider-a" + sliderMap[slider][0] ).slider("value");
    b = $( "#slider-a" + sliderMap[slider][1] ).slider("value");

    if ( (a + b) == 0 ) {
      a = b = remainder / 2;
    } else {
      tmp = a * remainder / (a + b);
      b = b * remainder / (a + b);
      a = tmp;
    }

    $( "#slider-a" + sliderMap[slider][0] ).slider( "value", a );
    $( "#slider-a" + sliderMap[slider][1] ).slider( "value", b );

  } // balanceGrayStimules


  /* Event: Changing slider value */
  function sliderSetAmount(event, ui) {
    $(this).next().text(ui.value);

    if (typeof event.originalEvent != "undefined") {
      if (currMode == "Grayscale") {
        balanceGrayStimules( this.id.substring("slider-a".length), ui.value );
      }

      if (event.type == "slidechange") {
        applyTransformations();
      }
    }
  } // sliderSetAmount

  /* Adding slider elements */
  /* #slider-hue [-180, 180], #slider-saturation [-1, 1], #slider-brightness [-1, 1]
   * #slider-ared [0, 1], #slider-agreen [0, 1], #slider-ablue [0, 1]
   * #slider-red [-255, 255], #slider-green [-255, 255], #slider-blue [-255, 255]
   */
  $( ".ui-slider" ).slider({
    disabled    : true,
    animate     : false,
    slide       : sliderSetAmount,
    change      : sliderSetAmount
  });
  // Set borders.
  $( "#slider-hue" ).slider("option", "min", -180);
  $( "#slider-saturation, #slider-brightness" ).slider("option", "min", -1);
  $( "#slider-ared, #slider-agreen, #slider-ablue" ).slider("option", "min", 0);
  $( "#slider-red, #slider-green, #slider-blue" ).slider("option", "min", -255);

  $( "#slider-hue" ).slider("option", "max", 180);
  $( "#slider-saturation, #slider-brightness, #slider-ared, #slider-agreen, #slider-ablue" ).slider("option", "max", 1);
  $( "#slider-red, #slider-green, #slider-blue" ).slider("option", "max", 255);

  // Set steps.
  $( "#slider-hue, #slider-red, #slider-green, #slider-blue" ).slider("option", "step", 1);
  $( "#slider-saturation, #slider-brightness" ).slider("option", "step", 0.01);
  $( "#slider-ared, #slider-agreen, #slider-ablue" ).slider("option", "step", 0.001);

  // Set values.
  $( ".ui-slider" ).slider( "value", 0 );

  // Animate for Grayscale section.
  $( "#slider-ared, #slider-agreen, #slider-ablue" ).slider("option", "animate", true);

  // Initial Grayscale transform values corresponding to Rec. 709 definition:
  $( "#slider-ared" ).slider( "value", 0.213 );
  $( "#slider-agreen" ).slider( "value", 0.715 );
  $( "#slider-ablue" ).slider( "value", 0.072 );

});