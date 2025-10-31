/*
 * Grunt file
 *
 * - Run JSHint
 * - Combine JS and CSS into single respective files
 *
 * @author Alistair Brown <github@alistairjcbrown.com>
 */

module.exports = function(grunt) {
    "use strict";

    var js_paths = [
            "./*.js",
            "./**/*.js",
            "!./js/google-analytics.js", // Exclude analytics code
            "!./*.min.js",
            "!./**/*.min.js",
            "!./node_modules/**/*.js",
            "!./**/node_modules/**/*.js",
            "!./.git/"
        ],
        jshint, uglify, cssmin;

    // ------

    // Strict JSHint rules
    jshint = {
        "all": js_paths,
        "options": {
            "curly":      true,
            "devel":      false,
            "eqeqeq":     true,
            "eqnull":     true,
            "expr":       true,
            "immed":      true,
            "indent":     4,
            "latedef":    true,
            "maxdepth":   4,
            "maxlen":     140,
            "maxparams":  10,
            "newcap":     true,
            "noarg":      true,
            "noempty":    true,
            "quotmark":   "double",
            "strict":     true,
            "trailing":   true,
            "undef":      true,
            "unused":     true,
            "globals": {
                "window":    true,
                "document":  true,
                "module":    true,
                "require":   true
            }
        }
    };

    // Minify and uglify the Javascript source
    uglify = {
        options: {
            compress: {
                drop_console: true
            },
            banner: "/*\n" +
                    " * <%= pkg.name %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>" +
                    "\n" +
                    " * Unminifed versions can be found at: " +
                    "http://jsfiddle.net/user/alistairjcbrown/" +
                    "\n" +
                    " */\n"
        },
        my_target: {
            files: {
                "js/script.min.js": [
                    "js/google-analytics.js",
                    "js/slide-toggle.js",
                    "js/subset.js"
                ]
            }
        }
    };

    // Minify the CSS source
    cssmin = {
        combine: {
            files: {
                "css/style.min.css": [
                    "css/reset.css",
                    "css/style.css"
                ]
            }
        }
    };

    grunt.initConfig({
        "pkg":          grunt.file.readJSON("package.json"),
        "jshint":       jshint,
        "uglify":       uglify,
        "cssmin":       cssmin,
    });

    // Load Tasks
    require("load-grunt-tasks")(grunt);

    // Define tasks
    grunt.registerTask("lint",    [ "jshint" ]);
    grunt.registerTask("go",      [ "build" ]);
    grunt.registerTask("build",   [ "lint", "uglify", "cssmin" ]);
    grunt.registerTask("default", [ "go" ]);

};

// End of file
