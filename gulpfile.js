var deploy = require('gulp-gh-pages');
var exec = require('child_process').exec;
var gulp = require('gulp');

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(deploy());
});

gulp.task('doc', function(next) {
  exec('node_modules/groc/bin/groc "app/**/*" "README.md"', function(err, stdout, stderr) {
    next(err);
  });
});
