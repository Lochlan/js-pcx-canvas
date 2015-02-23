define([
    'jquery',
    'views/canvas',
], function ($, CanvasView) {
    'use strict';

    describe('CanvasView', function () {
        var view;

        beforeEach(function () {
            $('<canvas></canvas>').appendTo('body');
            view = new CanvasView('canvas');
        });

        afterEach(function () {
            $('canvas').remove();
        });

        describe('when constructing', function () {
            it ('should exist', function () {
                expect(view).toBeDefined();
            });

            it("should have a drawPixelArray method", function () {
                expect(view.drawPixelArray).toBeDefined();
            });

            it("should have a drawPixel method", function () {
                expect(view.drawPixel).toBeDefined();
            });

            it("should have a loadImage method", function () {
                expect(view.loadImage).toBeDefined();
            });

            it("should have a resize method", function () {
                expect(view.resize).toBeDefined();
            });
        });

        describe('when drawing an array of pixels', function () {
            beforeEach(function () {
                var pixelArray = [
                    { x: 0, y: 0, r: 255, g: 0, b: 0 },
                    { x: 1, y: 1, r: 0, g: 255, b: 0 },
                    { x: 2, y: 2, r: 0, g: 0, b: 255 },
                ];
                spyOn(view, 'drawPixel');
                view.delegateEvents();
                view.drawPixelArray(pixelArray);
            });

            it ('should call draw pixel', function () {
                expect(view.drawPixel).toHaveBeenCalled();
            });
        });

        describe('when loading an image file', function () {
            beforeEach(function () {
                var image = jasmine.createSpyObj('image', ['get']);
                spyOn(view, 'resize');
                spyOn(view, 'drawPixelArray');
                view.delegateEvents();

                view.loadImage(image);
            });

            it ('should resize canvas', function () {
                expect(view.resize).toHaveBeenCalled();
            });

            it ('should draw the pixel array', function () {
                expect(view.drawPixelArray).toHaveBeenCalled();
            });
        });

        describe('when resized', function () {
            var width = 123;
            var height = 456;

            beforeEach(function () {
                view.resize(width, height);
            });

            it ('should have a resized canvas', function () {
                expect(view.el.width).toEqual(width);
                expect(view.el.height).toEqual(height);
            });
        });

    });

});

