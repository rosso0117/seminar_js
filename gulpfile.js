var gulp = require("gulp");
var babel = require("gulp-babel");
var rename = require("gulp-rename");

gulp.task('build', function() {
  gulp.src('js/*.es6.js')
    .pipe(babel())
    // 名前変更
    .pipe(rename(function (path) {
      var cutLength = path.basename.length - 4;
      path.basename = path.basename.slice(0, cutLength);
    }))
    .pipe(gulp.dest("js"));
});

gulp.task('watch', function() {
  gulp.watch('/.*.es6', ['babel'])
});

gulp.task('default', ['build', 'watch']);
