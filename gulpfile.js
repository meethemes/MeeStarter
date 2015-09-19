/*!
 * MeeStarter
 * Simple starter template for faster creating HTML layouts.
 * http://meethemes.com/
 */

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    open = require('gulp-open'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch');


// TODO
var options = {
    server: {
        port: 8575
    }

    //dev: {
    //    sass: {
    //        outputStyle: 'nested',
    //        sourcemaps: true
    //    },
    //    watch: {
    //        html: true,
    //        js: true,
    //        sass: true
    //    }
    //},
    //
    //build: {
    //    sass: {
    //        outputStyle: 'compressed',
    //        sourcemaps: false
    //    }
    //}
};


var path = {
    build: {
        html: './built',
        js: './built/js',
        sass: './built/css'
    },
    src: {
        html: './src/html/*.html',
        js: './src/js/*.js',
        sass: './src/scss/**/*.scss'
    },
    watch: {
        html: './src/html/**/*.html',
        js: './src/js/**/*.js',
        sass: './src/scss/**/*.scss'
    }
};


gulp.task('server:dev', function () {
    connect.server({
        root: ['built'],
        port: options.server.port,
        livereload: true
    });

    gulp.src(__filename)
        .pipe(open({uri: 'http://localhost:' + options.server.port}));
});


// === SASS === //
// dev
gulp.task('sass:dev', function() {
    gulp.src(path.src.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.sass))
        .pipe(connect.reload());
});


// === JavaScript === //
// dev
gulp.task('js:dev', function() {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload());
});


// === HTML === //
// dev
gulp.task('html:dev', function() {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload());
});


// === Watch === //
// dev
gulp.task('watch:dev', function() {
    // HTML
    watch([path.watch.html], function() {
        gulp.start('html:dev');
    });

    // JS
    watch([path.watch.js], function() {
        gulp.start('js:dev');
    });

    // SASS
    watch([path.watch.sass], function() {
        gulp.start('sass:dev');
    });
});


gulp.task('dev', function() {
    gulp.run('html:dev');
    gulp.run('js:dev');
    gulp.run('sass:dev');

    gulp.run('server:dev');
    gulp.run('watch:dev');
});
