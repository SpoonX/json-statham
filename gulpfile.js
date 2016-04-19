var gulp                  = require('gulp');
var conventionalChangelog = require('gulp-conventional-changelog');

gulp.task('changelog', function() {
  return gulp.src('CHANGELOG.md', {
      buffer: false
    })
    .pipe(conventionalChangelog({
      preset: 'angular'
    }))
    .pipe(gulp.dest('./'));
});
