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
        directory: { path: './build/', listing: false, index: true}
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
    'gh-pages': {
      options: {
        branch: 'gh-pages',
        base: 'build'
      },
      publish: {
        options: {
          repo: 'https://github.com/jkarsrud/blog.git',
          message: 'Publish gh-pages (cli)'
        },
        src: ['**/*']
      },
      deploy: {
        options: {
          user: {
            name: 'travis-ci',
            email: 'jkarsrud@gmail.com'
          },
          repo: 'https://' + process.env.GH_TOKEN + '@github.com/jkarsrud/blog.git',
          message: 'Publish gh-pages (auto)' + getDeployMessage(),
          silent: true
        },
        src: ['**/*']
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
  grunt.loadNpmTasks('grunt-gh-pages');

  // get a formatted commit message to review changes from the commit log
  // github will turn some of these into clickable links
  function getDeployMessage() {
    var ret = '\n\n';
    if (process.env.TRAVIS !== 'true') {
      ret += 'missing env vars for travis-ci';
      return ret;
    }
    ret += 'branch:       ' + process.env.TRAVIS_BRANCH + '\n';
    ret += 'SHA:          ' + process.env.TRAVIS_COMMIT + '\n';
    ret += 'range SHA:    ' + process.env.TRAVIS_COMMIT_RANGE + '\n';
    ret += 'build id:     ' + process.env.TRAVIS_BUILD_ID  + '\n';
    ret += 'build number: ' + process.env.TRAVIS_BUILD_NUMBER + '\n';
    return ret;
  }

  grunt.registerTask('check-deploy', function() {
    // need this
    this.requires(['build']);

    // only deploy under these conditions
    if (process.env.TRAVIS === 'true'
      && process.env.TRAVIS_SECURE_ENV_VARS === 'true'
      && process.env.TRAVIS_PULL_REQUEST === 'false'
    ) {
      grunt.log.writeln('executing deployment');
      // queue deploy
      grunt.task.run('gh-pages:deploy');
    }
    else {
      grunt.log.writeln('skipped deployment');
    }
  });

  grunt.registerTask('build', 'Building blog with Metalsmith', [
    'shell:dist'
  ]);

  grunt.registerTask('deploy', 'Publish from Travis', [
    'build',
    'check-deploy'
  ]);

  grunt.registerTask('server', ['shell:dev', 'hapiserver', 'watch']);
}