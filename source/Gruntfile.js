module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jsdoc: {
            dist : {
                src: ['assets/**/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'assets/**/*.js'],
            options: {
                'esversion': 6
            }
        }
    });

    // Load the plugin that provides the "jsdoc" task.
    grunt.loadNpmTasks('grunt-jsdoc');

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'jsdoc']);
};