define([
    'views/main',
], function (MainView) {
    'use strict';

    describe('MainView', function () {
        var view;

        beforeEach(function () {
            view = new MainView();
        });

        describe('when constructing', function () {
            it ('should exist', function () {
                expect(view).toBeDefined();
            });

            it('should have a template', function () {
                expect(view.template).toBeDefined();
            });

            it('should have subviews', function () {
                expect(view.subviews).toBeDefined();
                expect(view.subviews.canvas).toBeDefined();
                expect(view.subviews.fileLoader).toBeDefined();
            });

            it('should have an initialize method', function () {
                expect(view.initialize).toBeDefined();
            });

            it('should have a render method', function () {
                expect(view.render).toBeDefined();
            });
        });

        describe('when rendered', function () {
            beforeEach(function () {
                view.render();
            });

            it('should have content in el', function () {
                expect(view.el.innerHTML).not.toEqual('');
            });
        });
    });

});

