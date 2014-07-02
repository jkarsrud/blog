var debug = require('debug')('jkarsrud-excerpts');
var extname = require('path').extname;
var cheerio = require('cheerio');

module.exports = plugin;

function plugin(options){
  var opts = options || {};

  return function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!html(file)) return;
      var data = files[file];

      debug('storing excerpt: %s', file);
      var $ = cheerio.load(data.contents.toString());
      var p = $('p').first();

      var excerpt;

      if(opts.strip){
        excerpt = p.html();
      }
      else{
        excerpt = $.html(p);
      }

      data.excerpt = excerpt.trim();
    });
  };
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function html(file){
  return /\.html?/.test(extname(file));
}