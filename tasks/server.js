module.exports = function(grunt) {
  grunt.registerTask('hapiserver', function hapiserver() {
    var Hapi = require('hapi');
    var server = Hapi.createServer('localhost', 8000);

    server.route([
    {
      method: 'GET',
      path: '/',
      handler: {
        file: { path: './build/index.html'}
      }
    },
    {
      method: 'GET',
      path: '/{path*}',
      handler: {
        directory: { path: './build/', listing: false, index: true}
      }
    }]);

    server.start();
    grunt.log.ok('Hapi dev server started on %s', server.info.uri);
  });
};

