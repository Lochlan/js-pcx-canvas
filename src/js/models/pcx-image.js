define([
    'underscore',
    'backbone',
], function (_, Backbone) {
    'use strict';

    // PCX file format information http://www.fileformat.info/format/pcx/egff.htm

    var PCXImage = Backbone.Model.extend({
        defaults: {
            arrayBuffer: undefined,
            data: undefined,
            header: undefined,
            height: undefined,
            palette: undefined,
            scanLineLength: undefined,
            width: undefined,
        },

        initialize: function (options) {
            options = options || {};

            if (!options.arrayBuffer) {
                throw new Error('PCXImage needs ArrayBuffer to initialize');
            }

            this.parseArrayBuffer(options.arrayBuffer);
        },

        decode: function (data, palette, pixelRowLength) {
            var i;
            var runCount;
            var pixelPaletteIndices = [];
            var pixels = [];

            for (i = 0; i < data.length; i++) {
                // check if this byte is the first of a 2-byte run code (upper two bits = 11)
                if ((data[i] & 192) === 192) { // 192 = 0b11000000
                    // write the pixel in the next byte runCount times
                    runCount = data[i] & 63; // 63 = 0b00111111
                    i++;
                    while (runCount > 0) {
                        pixelPaletteIndices.push(data[i]);
                        runCount--;
                    }
                } else {
                    // write the pixel in this byte
                    pixelPaletteIndices.push(data[i]);
                }
            }

            pixels = _.map(pixelPaletteIndices, function (paletteIndex, i) {
                return {
                    x: i % pixelRowLength,
                    y: Math.floor(i / pixelRowLength),
                    r: palette[paletteIndex].r,
                    g: palette[paletteIndex].g,
                    b: palette[paletteIndex].b,
                };
            });

            return pixels;
        },

        parseArrayBuffer: function (arrayBuffer) {
            var fileHeader;
            var fileData;
            var filePalette;
            var palette = [];

            fileHeader = _.object([
                'identifier',
                'version',
                'encoding',
                'bitsPerPixel',
                'xStart',
                'yStart',
                'xEnd',
                'yEnd',
                'horzRes',
                'vertRes',
                'palette',
                'reserved1',
                'numBitPlanes',
                'bytesPerLine',
                'paletteType',
                'horzScreenSize',
                'vertScreenSize',
                'reserved2',
            ], [].concat(
                _.toArray(new Int8Array(arrayBuffer, 0, 4)),
                _.toArray(new Int16Array(arrayBuffer, 4, 6)),
                [_.toArray(new Int8Array(arrayBuffer, 16, 48))],
                _.toArray(new Int8Array(arrayBuffer, 64, 2)),
                _.toArray(new Int16Array(arrayBuffer, 66, 4)),
                [_.toArray(new Int8Array(arrayBuffer, 74, 54))]
            ));

            fileData = _.toArray(new Uint8Array(arrayBuffer, 128));

            // check if palette is stored in the last 768 bytes
            // TODO improve this check, I think 12 could instead be palette number?
            if (fileData.length > 768 && fileData[fileData.length - 769] === 12) {
                filePalette = fileData.splice(fileData.length - 768, 768);
                fileData = _.initial(fileData); // remove the 12
            }

            while (filePalette.length > 0) {
                palette.push(_.object(['r','g','b'], filePalette.splice(0, 3)));
            }

            this.set({
                dataRaw: fileData,
                data: this.decode(fileData, palette, fileHeader.xEnd - fileHeader.xStart + 1),
                header: fileHeader,
                height: fileHeader.yEnd - fileHeader.yStart + 1,
                palette: palette,
                width: fileHeader.xEnd - fileHeader.xStart + 1,
                scanLineLength: fileHeader.numBitPlanes * fileHeader.bytesPerLine,
            });
        },
    });

    return PCXImage;
});
