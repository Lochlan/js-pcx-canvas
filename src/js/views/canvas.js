define([
    'underscore',
    'backbone',
], function (_, Backbone) {
    'use strict';

    var CanvasView = Backbone.View.extend({

        drawPixelArray: function (pixelArray) {
            pixelArray.forEach(this.drawPixel.bind(this));
        },

        drawPixel: function (pixel) {
            var ctx = this.el.getContext('2d');
            ctx.fillStyle = 'rgb(' + pixel.r + ',' + pixel.g +',' + pixel.b + ')';
            ctx.fillRect(pixel.x, pixel.y, 1, 1);
        },

        loadImage: function (image) {
            this.resize(image.get('width'), image.get('height'));
            this.drawPixelArray(image.get('data'));
        },

        resize: function (width, height) {
            this.el.width = width;
            this.el.height = height;
        },

    });

    return CanvasView;
});
