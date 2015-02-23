define([
    'jquery',
    'views/file-loader',
], function ($, FileLoaderView) {
    'use strict';

    describe('FileLoaderView', function () {
        var view;

        beforeEach(function () {
            view = new FileLoaderView();
        });

        describe('when constructed', function () {
            it('should exist', function () {
                expect(view).toBeDefined();
            });

            it('should have a template', function () {
                expect(view.template).toBeDefined();
            });

            it('should have a render method', function () {
                expect(view.render).toBeDefined();
            });

            it('should have a onFileInputChanged method', function () {
                expect(view.onFileInputChanged).toBeDefined();
            });

            it('should have a onLoadFileReader method', function () {
                expect(view.onLoadFileReader).toBeDefined();
            });
        });

        describe('when rendered', function () {
            beforeEach(function () {
                view.render();
            });

            it('should have content in el', function () {
                expect(view.el.innerHTML).not.toEqual('');
            });

            describe('when file input is changed', function () {

                it ('should call the onFileInputChanged method', function () {
                    spyOn(view, 'onFileInputChanged');
                    view.delegateEvents();

                    view.$('input[type=file]').trigger('change');

                    expect(view.onFileInputChanged).toHaveBeenCalled();
                });

                describe('when no file chosen', function () {
                    it('should throw exception', function () {
                        var event = {
                            preventDefault: jasmine.createSpy('preventDefault'),
                            target: view.el.querySelector('input[type=file]'),
                        };

                        expect(view.onFileInputChanged.bind(view, event)).toThrowError('No file chosen');
                    });
                });

            });
        });
    });

});

