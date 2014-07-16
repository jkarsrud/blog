module.exports = function(grunt) {
  grunt.loadTasks('tasks');

  grunt.initConfig({
    shell: {
      dev: {
        command: 'node build.js development'
      },
      dist: {
        command: 'node build.js production'
      }
    },
    sass: {
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: 'styles',
          src: ['**/*.scss'],
          dest: 'build/',
          ext: '.css'
        }]
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'styles',
          src: ['**/*.scss'],
          dest: 'build/',
          ext: '.css'
        }]
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: false,
            src: 'CNAME',
            dest: 'build/CNAME'
          },
          {
            expand: true,
            src: ['media/**/*'],
            dest: 'build/',
            flatten: false,
            filter: 'isFile'
          }
        ]
      }
    },
    jshint: {
      options: {
        force: true,
        reporter: require('jshint-stylish')
      },
      plugins: {
        src: ['plugins/*.js']
      },
      tooling: {
        src: [
          'Gruntfile.js',
          'tasks/**/*.js'
        ]
      },
      build: {
        src: ['build.js']
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
            email: 'jesper.karsrud@gmail.com'
          },
          repo: 'https://' + process.env.GH_TOKEN + '@github.com/jkarsrud/blog.git',
          message: 'Publish from Travis' + getDeployMessage(),
          silent: true
        },
        src: ['**/*']
      }
    },
    watch: {
      sass: {
        files: ['styles/**/*.scss'],
        tasks: ['sass', 'copy']
      },
      templates: {
        files: ['templates/**/*.hbs'],
        tasks: ['shell:dev', 'copy']
      },
      content: {
        files: ['src/**/*.md'],
        tasks: ['shell:dev', 'copy']
      },
      js: {
        files: ['plugins/*.js', 'build.js', 'Gruntfile.js'],
        tasks: ['jshint']
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');

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
    if (process.env.TRAVIS === 'true' &&
      process.env.TRAVIS_SECURE_ENV_VARS === 'true' &&
      process.env.TRAVIS_PULL_REQUEST === 'false'
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
    'jshint',
    'shell:dist',
    'sass:dist',
    'copy'
  ]);

  grunt.registerTask('deploy', 'Publish from Travis', [
    'build',
    'check-deploy'
  ]);

  grunt.registerTask('server', ['jshint', 'shell:dev', 'sass:dev', 'copy', 'hapiserver', 'watch']);
};