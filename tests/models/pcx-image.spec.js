define([
    'underscore',
    'models/pcx-image',
], function (_, PCXImage) {
    'use strict';

    describe('PCXImage model', function () {
        var model;

        describe('when constructing', function () {
            describe('without an ArrayBuffer', function () {
                it('should throw exception', function () {
                    expect(function () {
                        new PCXImage();
                    }).toThrowError('PCXImage needs ArrayBuffer to initialize');
                });
            });

            describe('with an ArrayBuffer', function () {
                // TODO
            });
        });
    });

});
