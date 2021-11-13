module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jsdoc: {
            dist : {
                src: ['assets/**/*.js'],
                options: {
                    destination: 'doc',
                    template: 'node_modules/ink-docstrap/template',
                    configure: 'node_modules/ink-docstrap/template/jsdoc.conf.json'
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