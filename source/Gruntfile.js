module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    eslint: {
      target: ['Gruntfile.js', 'assets/**/*.js'],
    },
    jsdoc: {
      dist: {
        src: ['assets/**/*.js'],
        options: {
          destination: 'doc',
        },
      },
    },
  });

  // Load the plugin that provides the "jsdoc" task.
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['eslint', 'jsdoc']);
};
