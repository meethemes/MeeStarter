/*!
 * MeeStarter v1.0.0
 * Simple starter template for faster creating HTML layouts.
 * http://meethemes.com/
 */

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    open = require('gulp-open'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    zip = require('gulp-zip');

var pkg = require('./package.json');

var date = new Date();

var archiveName = {
    date: date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + date.getDate(),
    time: date.getHours() + '-' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() + '-' + date.getSeconds()
};

var utils = {
    merge: function(obj1, obj2) {
        for (var p in obj2) {
            try {
                obj1[p] = (obj2[p].constructor == Object ? utils.merge(obj1[p], obj2[p]) : obj2[p]);
            } catch(e) {
                obj1[p] = obj2[p];
            }
        }

        return obj1;
    },

    isInArray: function(value, array) {
        return (array.indexOf(value) > 0);
    }
};


var options = {
    defaults: {
        archive: {
            name: {
                all: pkg.name + ' ' + archiveName.date + ' ' + archiveName.time + ' (all).zip',
                built: pkg.name + ' ' + archiveName.date + ' ' + archiveName.time + ' (built).zip'
            }
        },
        html: {},
        images: {
            minify: false
        },
        js: {
            uglify: false
        },
        sass: {
            outputStyle: 'nested',
            sourcemaps: false
        },
        server: {
            port: 8575
        },
        watch: {}
    },

    build: {
        tasks: ['html', 'images', 'js', 'sass'],

        images: {
            minify: true
        },
        js: {
            uglify: true
        },
        sass: {
            outputStyle: 'compressed'
        }
    },

    dev: {
        tasks: ['html', 'images', 'js', 'sass', 'server'],

        sass: {
            sourcemaps: true
        },
        watch: {
            html: true,
            images: true,
            js: true,
            sass: true
        }
    },

    pack_all: {
        tasks: ['build', 'zip:all']
    },

    pack_built: {
        tasks: ['build', 'zip:built']
    }
};

var path = {
    build: {
        html: './built',
        images: './built/img',
        js: './built/js',
        sass: './built/css',
        zip: './packed'
    },
    serverRoot: './built',
    src: {
        html: './src/html/*.html',
        images: './src/img/**/*.*',
        js: './src/js/*.js',
        sass: './src/scss/**/*.scss',
        zip: {
            all: [
                './src/**/*.*',
                './built/**/*.*',
                './bower.json',
                './gulpfile.js',
                './package.json'
            ],
            built: [
                './built/*'
            ]
        }
    },
    watch: {
        html: './src/html/**/*.html',
        images: './src/img/**/*.*',
        js: './src/js/**/*.js',
        sass: './src/scss/**/*.scss'
    }
};

var _options = options.defaults;


// === HTML === //
gulp.task('html', function() {
    gulp.src(path.src.html)
        .pipe( rigger() )
        .pipe( gulp.dest(path.build.html) )
        .pipe( gulpif( utils.isInArray('server', _options.tasks), connect.reload()) );

    if(_options.watch.html === true) {
        watch([path.watch.html], function() {
            gulp.start('html');
        });
    }
});


//=== Images === //
gulp.task('images', function() {
    gulp.src(path.src.images)
        .pipe( gulpif(_options.images.minify, imagemin({
            progressive: true
        })) )
        .pipe( gulp.dest(path.build.images) )
        .pipe( gulpif( utils.isInArray('server', _options.tasks), connect.reload()) );

    if(_options.watch.images === true) {
        watch([path.watch.images], function() {
            gulp.start('images');
        });
    }
});


// === JavaScript === //
gulp.task('js', function() {
    gulp.src(path.src.js)
        .pipe( rigger() )
        .pipe( gulpif(_options.js.uglify, uglify()) )
        .pipe( gulp.dest(path.build.js) )
        .pipe( gulpif( utils.isInArray('server', _options.tasks), connect.reload()) );

    if(_options.watch.js === true) {
        watch([path.watch.js], function() {
            gulp.start('js');
        });
    }
});


// === SASS === //
gulp.task('sass', function() {
    gulp.src(path.src.sass)
        .pipe( gulpif(_options.sass.sourcemaps, sourcemaps.init()) )
        .pipe( sass({
            outputStyle: _options.sass.outputStyle
        }).on('error', sass.logError) )
        .pipe( gulpif(_options.sass.sourcemaps, sourcemaps.write()) )
        .pipe( gulp.dest(path.build.sass) )
        .pipe( gulpif( utils.isInArray('server', _options.tasks), connect.reload()) );

    if(_options.watch.sass === true) {
        watch([path.watch.sass], function() {
            gulp.start('sass');
        });
    }
});


// === Server === //
gulp.task('server', function () {
    connect.server({
        root: path.serverRoot,
        port: _options.server.port,
        livereload: true
    });

    gulp.src(__filename)
        .pipe( open({uri: 'http://localhost:' + _options.server.port}) );
});


// === ZIP === //
// all
gulp.task('zip:all', ['build'], function() {
    gulp.src(path.src.zip.all,  {base: __dirname})
        .pipe( zip(_options.archive.name.all) )
        .pipe( gulp.dest(path.build.zip) );
});
// built
gulp.task('zip:built', ['build'], function() {
    gulp.src(path.src.zip.all)
        .pipe( zip(_options.archive.name.built) )
        .pipe( gulp.dest(path.build.zip) );
});


gulp.task('dev', function() {
    _options = utils.merge(_options, options.dev);

    gulp.run(_options.tasks);
});

gulp.task('build', function() {
    _options = utils.merge(_options, options.build);

    gulp.run(_options.tasks);
});

gulp.task('pack:all', function() {
    _options = utils.merge(_options, options.pack_all);

    gulp.run(_options.tasks);
});

gulp.task('pack:built', function() {
    _options = utils.merge(_options, options.pack_built);

    gulp.run(_options.tasks);
});
