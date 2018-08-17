import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import webpackConfig from './webpack.config.js';
import browserSync from 'browser-sync';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import cssmin from 'gulp-cssmin';
import del from 'del';

gulp.task("webpack", () => {
    return webpackStream(webpackConfig,webpack)
    .pipe(plumber())
    .pipe(gulp.dest("./public/js/"));
});

gulp.task("sass", function() {
    gulp.src("./src/scss/style.scss")
      .pipe(plumber())
      .pipe(autoprefixer())
      .pipe(sass())
      .pipe(cssmin())
      .pipe(gulp.dest("./public/css/"));
});

gulp.task('copy', function() {
    gulp.src(['./src/html/**/*']).pipe(gulp.dest('./public/'));
    gulp.src(['./src/assets/**/*']).pipe(gulp.dest('./public/assets/'));
});

gulp.task('browser-sync', () =>{
    browserSync.init({
        server:{
            baseDir:"public",
            index: "index.html"
        },
        open: false
    });
});

gulp.task('bs-reload', () =>{
    browserSync.reload();
})

gulp.task('clean', del.bind(null, ['./public/']));

gulp.task('default',['browser-sync','webpack','sass','copy'],() => {
    gulp.watch(['./src/js/**/*  '],['webpack']);
    gulp.watch('./src/scss/*.scss',['sass']);
    gulp.watch('./src/**/*',['copy']);
});