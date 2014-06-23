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
			path: '/content/{path*}',
			handler: {
				directory: { path: './build/content', listing: false, index: false}
			}
		}]);

		server.start();
		grunt.log.ok('Hapi dev server started on %s', server.info.uri);
	});

	grunt.initConfig({
		shell: {
			build: {
				command: 'node build.js'
			}
		},
		watch: {
			styles: {
				files: ['src/styles/**/*.css'],
				tasks: ['shell:build']
			},
			templates: {
				files: ['templates/**/*.hbs'],
				tasks: ['shell:build']
			},
			content: {
				files: ['src/**/*.md'],
				tasks: ['shell:build']
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['shell', 'watch']);
	grunt.registerTask('server', ['shell', 'hapiserver', 'watch']);
}