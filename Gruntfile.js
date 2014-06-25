module.exports = function(grunt) {
  grunt.registerTask('hapiserver', function() {
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
        directory: { path: './build/', listing: false, index: false}
      }
    }]);

    server.start();
    grunt.log.ok('Hapi dev server started on %s', server.info.uri);
  });

  grunt.initConfig({
    shell: {
      dev: {
        command: 'node build.js development'
      },
      dist: {
        command: 'node build.js production'
      }
    },
    watch: {
      dev: {
        files: ['src/styles/**/*.css', 'templates/**/*.hbs', 'src/**/*.md'],
        tasks: ['shell:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['shell:dist']);

  grunt.registerTask('server', ['shell:dev', 'hapiserver', 'watch']);
}