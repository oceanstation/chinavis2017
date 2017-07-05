var gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require("gulp-uglify"),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require("gulp-minify-css"),
    less = require("gulp-less"),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    source = require('vinyl-source-stream'),
    proxy = require('http-proxy-middleware');

var Src = './src';
var Dest = './dist';

var Build = {
    js: [
        './src/app.config.js',
        './src/service/*.js',
        './src/Situation/controller.js',
        './src/Situation/*.directive.js',
        './src/Analysis/controller.js',
        './src/Analysis/*.directive.js'
    ],
    less: './src/**/*.less',
    others: ['./src/**/*.html', './src/**/*.png', './src/**/*.min.js', './src/*/*.json', './src/**/web.xml']
};

gulp.task('build', function () {
    gulp.src(Build.js)
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(Dest));

    gulp.src(Build.less)
        .pipe(less())
        .pipe(concat('app.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(Dest));

    gulp.src(Build.others)
        .pipe(gulp.dest(Dest));
});

gulp.task('connect', function () {
    connect.server({
        root: ['./'],
        port: 8000,
        livereload: true,
        middleware: function (connect, opt) {
            return [
                proxy('/api/', {
                    target: 'http://192.168.1.189:8080/',
                    changeOrigin: true
                })
            ]
        }
    });
});

gulp.task('js', function () {
    gulp.src(Build.js)
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(Src))
        .pipe(connect.reload());
});

gulp.task('less', function () {
    gulp.src(Build.less)
        .pipe(less())
        .pipe(concat('app.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest(Src))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch(Build.js, ['js']);
    gulp.watch(Build.less, ['less']);
});

gulp.task('start', ['connect', 'watch']);