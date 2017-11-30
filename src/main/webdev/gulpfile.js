var gulp = require('gulp'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require("gulp-uglify"),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require("gulp-minify-css"),
    less = require("gulp-less"),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    proxy = require('http-proxy-middleware');

var DevFiles = {
    js: [
        './src/config/*.config.js',
        './src/service/*.js',
        './src/situation/controller.js',
        './src/situation/*.directive.js',
        './src/analysis/controller.js',
        './src/analysis/*.directive.js'
    ],
    less: './src/**/*.less'
};

gulp.task('js', function () {
    gulp.src(DevFiles.js)
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src'))
        .pipe(connect.reload());
});

gulp.task('less', function () {
    gulp.src(DevFiles.less)
        .pipe(less())
        .pipe(concat('app.min.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./src'))
        .pipe(connect.reload());
});

gulp.task('connect', function () {
    connect.server({
        root: ['./src'],
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

gulp.task('watch', function () {
    gulp.watch(DevFiles.js, ['js']);
    gulp.watch(DevFiles.less, ['less']);
});

gulp.task('start', ['connect', 'watch']);