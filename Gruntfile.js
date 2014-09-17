module.exports = function(grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({

    assemble: {
      options: {
        flatten: false,
        expand: true,
        layout: 'src/layouts/default.hbs',
        partials: ['src/partials/*.hbs'],
        assets: '../demo/assets',
        data: 'config.json'
      },
      root: {
        files: [
          {expand: true,
          cwd: 'src/pages/',
          src: '**/*.hbs',
          dest: '../demo/',
          ext: '.html'
        }]
      }
    },
    copy: {
      main: {
        files: [ 
          {expand: true, cwd: 'src/pages/', src: ['**', '!**/*.hbs'], dest: '../demo/', filter: 'isFile'}
        ]
      }
    },
    clean: {
      all: ['../demo'],
      main: ['../demo/*.html']
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/assets/js/*.js', 'src/assets/js/lib/*.js'],
        dest: '../demo/assets/js/patterns.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> ' +
          '<%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '../demo/assets/js/patterns.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/assets/js/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'src/assets/scss',
          cssDir: '../demo/assets/css',
          outputStyle: 'expanded'
        }
      }
    },
    prettify: {
      options: {
        indent: 2,
        wrap_line_length: 78,
        brace_style: 'expand',
      },
      all: {
        files: [
          {expand: true, cwd: '../demo/', src: ['**/*.html'], dest: '../demo/', ext: '.html'}
        ]
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      css: {
        files: ['src/assets/scss/**/*.scss'],
        tasks: ['compass'],
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint', 'concat']
      },
      assemble: {
        files: ['src/layouts/*.hbs', 'src/helpers/*.js', 'src/patterns/*', 'src/*.hbs'],
        tasks: ['clean:main', 'assemble']
      }
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-prettify');

  // Default tasks to be run.
  grunt.registerTask('default', ['compass', 'concat', 'assemble', 'copy', 'prettify']);
};