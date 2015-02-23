define([
    'underscore',
    'backbone',
    'views/main',
], function (_, Backbone, MainView) {
    'use strict';

    var Router = Backbone.Router.extend({

        routes: {
            '': 'main',
            'main': 'main',
        },

        views: {
            main: undefined,
        },

        initialize: function () {
            _.extend(this.views, {
                main: new MainView({
                    el: '[data-backbone=main]',
                }),
            });

            Backbone.history.start({
                root: location.pathname,
            });
        },

        main: function () {
            this.views.main.render();
        },

    });

    return Router;
});
