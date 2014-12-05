var deploy = require('gulp-gh-pages');
var file = require('gulp-file');
var exec = require('child_process').exec;
var gulp = require('gulp');
var os = require('os');

gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe(file('CNAME', 'coretheloothound.com' + os.EOL))
    .pipe(deploy());
});

gulp.task('doc', function(next) {
  exec('node_modules/groc/bin/groc "app/**/*" "README.md"', function(err, stdout, stderr) {
    gulp.src([]).pipe(file('CNAME', 'docs.coretheloothound.com' + os.EOL)).pipe(gulp.dest('doc')).on('end', next);
  });
});
