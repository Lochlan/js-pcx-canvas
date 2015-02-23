define([
    'underscore',
    'backbone',
    'models/pcx-image',
    'templates/file-loader'
], function (_, Backbone, PCXImage, template) {
    'use strict';

    var FileLoaderView = Backbone.View.extend({

        template: template,

        render: function () {
            this.$el.html(this.template());

            return this;
        },

        onFileInputChanged: function (event) {
            event.preventDefault();
            var fileReader = new FileReader();
            var file = event.target.files[0];

            if (!file) {
                throw new Error('No file chosen');
            }

            fileReader.onload = this.onLoadFileReader.bind(this, fileReader);
            fileReader.readAsArrayBuffer(file);
        },

        onLoadFileReader: function (fileReader) {
            var pcx = new PCXImage({
                arrayBuffer: fileReader.result,
            });

            this.trigger('load', pcx);
        },

        events: {
            'change input[type=file]': 'onFileInputChanged',
        },

    });

    return FileLoaderView;
});
