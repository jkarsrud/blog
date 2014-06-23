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
			styles: {
				files: ['src/styles/**/*.css'],
				dev: {
					tasks: ['shell:dev']
				},
				dist: {
					tasks: ['shell:dist']
				}
			},
			templates: {
				files: ['templates/**/*.hbs'],
				dev: {
					tasks: ['shell:dev']
				},
				dist: {
					tasks: ['shell:dist']
				}
			},
			content: {
				files: ['src/**/*.md'],
				dev: {
					tasks: ['shell:dev']
				},
				dist: {
					tasks: ['shell:dist']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ['shell:dev', 'watch']);
	grunt.registerTask('build:dist', ['shell:dist']);

	grunt.registerTask('server', ['shell', 'hapiserver', 'watch']);
}