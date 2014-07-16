var fs = require('fs');

var metalsmith = require('metalsmith');
var Handlebars = require('handlebars');
var moment = require('handlebars-helper-moment')().moment;

var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var metadata = require('metalsmith-metadata');
var collections = require('metalsmith-collections');
var drafts = require('metalsmith-drafts');
var filemetadata = require('metalsmith-filemetadata');

var strippedExceprts = require('./plugins/excerpts');

Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbs').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbs').toString());
Handlebars.registerPartial('navbar', fs.readFileSync(__dirname + '/templates/partials/navbar.hbs').toString());

Handlebars.registerHelper('moment', moment);

var env = process.argv[2] || 'development';
var configPath = 'config/' + env + '.json';

metalsmith(__dirname)
.use(metadata({
  env: configPath,
  site: 'config/site.json'
}))
.use(drafts())
.use(filemetadata([
  {pattern: 'posts/*.md', metadata: {
    type: 'post',
    template: 'post.hbs'
  }}
]))
.use(collections({
  posts: {
    pattern: 'posts/*.md',
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
.use(strippedExceprts({
  strip: true
}))
.use(permalinks({
  pattern: ':date/:title/'
}))
.use(templates('handlebars'))
.build(function(err) {
  if(err) throw err;
});