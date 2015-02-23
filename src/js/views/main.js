define([
    'underscore',
    'backbone',
    'templates/main',
    'views/canvas',
    'views/file-loader',
], function (_, Backbone, template, CanvasView, FileLoaderView) {
    'use strict';

    var MainView = Backbone.View.extend({

        template: template,

        subviews: {
            canvas: undefined,
            fileLoader: undefined,
        },

        initialize: function () {
            _.extend(this.subviews, {
                canvas: new CanvasView({
                    el: this.$('[data-backbone=canvas]'),
                }),
                fileLoader: new FileLoaderView({
                    el: this.$('[data-backbone=fileLoader]'),
                }),
            });

            this.listenTo(
                this.subviews.fileLoader,
                'load',
                this.subviews.canvas.loadImage.bind(this.subviews.canvas)
            );
        },

        render: function () {
            this.$el.html(this.template());

            _.map(this.subviews, function (subview, name) {
                subview.setElement(this.$('[data-backbone=' + name + ']'));
                subview.render();
            }.bind(this));

            return this;
        },

    });

    return MainView;
});
