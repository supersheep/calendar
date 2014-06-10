var gulp = require('gulp');
var stylus = require('gulp-stylus');


gulp.task('stylus', function() {
  gulp.src('css/**/*.styl')
    .pipe(stylus())
    .pipe(gulp.dest('css'));
});

gulp.task('default', ['stylus']);