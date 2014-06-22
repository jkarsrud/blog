var fs = require('fs');

var Metalsmith = require('metalsmith');
var Handlebars = require('handlebars');

var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbs').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbs').toString());
Handlebars.registerPartial('navbar', fs.readFileSync(__dirname + '/templates/partials/navbar.hbs').toString());

Metalsmith(__dirname)
.use(permalinks())
.use(markdown({
  smartypants: true,
  gfm: true,
  tables: true
}))
.use(templates('handlebars'))
.build(function(err) {
  if(err) throw err;
});