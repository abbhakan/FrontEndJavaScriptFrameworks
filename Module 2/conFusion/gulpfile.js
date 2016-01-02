var gulp = require('gulp'),
jshint = require('gulp-jshint'),
stylish = require('jshint-stylish'),
minifycss = require('gulp-minify-css'),
uglify = require('gulp-uglify'),
usemin = require('gulp-usemin'),
imagemin = require('gulp-imagemin'),
rename = require('gulp-rename'),
 concat = require('gulp-concat'),
notify = require('gulp-notify'),
cache = require('gulp-cache'),
changed = require('gulp-changed'),
rev = require('gulp-rev'),
browserSync = require('browser-sync'),
ngannotate = require('gulp-ng-annotate'),
del = require('del');

gulp.task('jshint', function() {
  gulp.src('app/scripts/**/*.js')
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
});

gulp.task('imagemin', function() {
  return gulp.src('app/images/**/*')
  .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
  .pipe(gulp.dest('dist/images'))
  .pipe(notify({message: 'Images task complete'}));
});

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('copyfonts', ['clean'], function() {
  gulp.src('./bower_components/font-awesome/fonts/**/*.{tttf,woff, eof, svg}*')
  .pipe(gulp.dest('./dist/fonts'));
  gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{tttf,woff,eof,svg}*')
  .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('usemin', ['jshint'], function() {
  return gulp.src('./app/menu.html')
  .pipe(usemin({
    css:[minifycss(), rev()],
    js:[ngannotate(), uglify(), rev()] }))
  .pipe(gulp.dest('dist/'));
});

gulp.task('browser-sync', ['default'], function() {
  var files = ['app/**/*.html', 'app/styles/**/*.css', 'app/images/**/*.png', 'app/scripts/**/*.js', 'dist/**/*'];
  browserSync.init(files, {
    server: { baseDir: "dist", index: "menu.html"}
  });

  // Watch any files in dist/, reload on Change
  gulp.watch(['dist/**']).on('change', browserSync.reload);

});

gulp.task('watch', ['browser-sync'], function() {

  gulp.watch('{app/scripts/**/*.js, app/styles/**/*.css, app/**/*.html}', ['usemin']);

  gulp.watch('app/images/**/*', ['imagemin']);
});

gulp.task('default', ['clean'], function() {
  gulp.start('usemin', 'imagemin', 'copyfonts');
});
