/*!
 * MeeStarter
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

// TODO
var options = {
    server: {
        port: 8575
    },
    archive: {
        name: {
            all: pkg.name + ' ' + archiveName.date + ' ' + archiveName.time + ' (all).zip',
            built: pkg.name + ' ' + archiveName.date + ' ' + archiveName.time + ' (built).zip'
        }
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
        images: './built/img',
        js: './built/js',
        sass: './built/css',
        zip: './packed'
    },
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

// build
gulp.task('sass:build', function() {
    gulp.src(path.src.sass)
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest(path.build.sass));
});


// === JavaScript === //
// dev
gulp.task('js:dev', function() {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(connect.reload());
});

// build
gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js));
});


// === HTML === //
// dev
gulp.task('html:dev', function() {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(connect.reload());
});

// build
gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html));
});


//=== IMAGES === //
// dev
gulp.task('images:dev', function() {
    gulp.src(path.src.images)
        .pipe(gulp.dest(path.build.images))
        .pipe(connect.reload());
});

// build
gulp.task('images:build', function() {
    gulp.src(path.src.images)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(path.build.images));
});


// === Watch === //
// dev
gulp.task('watch:dev', function() {
    // HTML
    watch([path.watch.html], function() {
        gulp.start('html:dev');
    });

    // Images
    watch([path.watch.images], function() {
        gulp.start('images:dev');
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


// === ZIP === //
// all
gulp.task('zip:all', function() {
    gulp.src(path.src.zip.all,  {base: __dirname})
        .pipe(zip(options.archive.name.all))
        .pipe(gulp.dest(path.build.zip));
});
// built
gulp.task('zip:built', function() {
    gulp.src(path.src.zip.all)
        .pipe(zip(options.archive.name.built))
        .pipe(gulp.dest(path.build.zip));
});


gulp.task('dev', function() {
    gulp.run('html:dev');
    gulp.run('images:dev');
    gulp.run('js:dev');
    gulp.run('sass:dev');

    gulp.run('server:dev');
    gulp.run('watch:dev');
});

gulp.task('build', function() {
    gulp.run('html:build');
    gulp.run('js:build');
    gulp.run('sass:build');
});

gulp.task('pack:all', function() {
    gulp.run('build');
    gulp.run('zip:all');
});

gulp.task('pack:built', function() {
    gulp.run('build');
    gulp.run('zip:built');
});
