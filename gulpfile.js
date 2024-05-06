var gulp = require('gulp')

require('./tasks/files')

gulp.task('dev', gulp.parallel(['files:watch']))

gulp.task('default', gulp.series(['files:copy']))
