define(['handlebars.runtime'], function(Handlebars) {
  Handlebars = Handlebars["default"];  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
return templates['main.hbs'] = template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<form data-backbone=\"fileLoader\"></form>\n\n<canvas data-backbone=\"canvas\"></canvas>\n";
  },"useData":true});
});