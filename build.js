var fs = require('fs');

var Metalsmith = require('metalsmith');
var Handlebars = require('handlebars');

var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var metadata = require('metalsmith-metadata');
var collections = require('metalsmith-collections');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbs').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbs').toString());
Handlebars.registerPartial('navbar', fs.readFileSync(__dirname + '/templates/partials/navbar.hbs').toString());

var env = process.argv[2] || 'development';
var configPath = 'config/' + env + '.json';

Metalsmith(__dirname)
.use(metadata({
  env: configPath
}))
.use(collections({
  posts: {
    pattern: 'content/posts/*.md',
    sortBy: 'date',
    reverse: true
  }
}))
.use(markdown({
  smartypants: true,
  gfm: true,
  tables: true,
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  }
}))
.use(permalinks({
  pattern: ':collection/:title/'
}))
.use(templates('handlebars'))
.build(function(err) {
  if(err) throw err;
});