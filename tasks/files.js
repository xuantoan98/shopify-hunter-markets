'use strict'

const gulp = require('gulp')
const path = require('path')
const del = require('delete')
const flatten = require('gulp-flatten')
const processLog = require('./util/log')
const concat = require('gulp-concat')
const wrap = require('gulp-wrapper')

/**
 * Relative to the tasks/ dir
 */
const rootPath = path.resolve(__dirname, '..')
/**
 * @param {string|array} arg Array of globs, or single glob
 */
function getPath (arg) {
  if (Array.isArray(arg)) {
    return arg.map((str) => `${rootPath}/${str}`)
  }
  return `${rootPath}/${arg}`
}

/**
 * DEFAULT
 * Source globs and dest paths
 *
 * TODO
 * [Assets] will need to be expanded on to
 * accommodate more file types
 */
const files = {
  layout: {
    src: 'src/layout',
    glob: 'src/layout/*.liquid',
    dest: 'dist/layout'
  },
  templates: {
    src: 'src/templates',
    glob: ['src/templates/**/*.liquid'],
    dest: 'dist/templates'
  },
  snippets: {
    src: 'src/snippets',
    glob: ['src/snippets/**/*.liquid'],
    dest: 'dist/snippets'
  },
  functions: {
    src: 'src/functions',
    glob: ['src/functions/**/*.liquid'],
    dest: 'dist/snippets',
    opts: {flatten: true}
  },
  modules: {
    src: 'src/modules',
    glob: ['src/modules/**/*.liquid'],
    dest: 'dist/snippets',
    opts: {flatten: true}
  },
  sections: {
    src: 'src/sections',
    glob: ['src/sections/**/*.liquid'],
    dest: 'dist/sections',
    opts: {flatten: true}
  },
  vendors: {
    src: 'src/assets/vendor',
    glob: [
      'src/assets/vendor/**/*.js.liquid',
      'src/assets/vendor/**/*.js'
    ],
    dest: 'dist/assets'
  },
  legacyStyles: {
    src: 'src/assets/legacy/css',
    glob: [
      'src/assets/legacy/css/**/*.css.liquid',
      'src/assets/legacy/css/**/*.css',
      'src/assets/legacy/css/**/*.scss',
      'src/assets/legacy/css/**/*.scss.liquid',
    ],
    dest: 'dist/assets',
    opts: {flatten: true}
  },
  legacyScripts: {
    src: 'src/assets/legacy/js',
    glob: [
      'src/assets/legacy/js/**/*.js.liquid',
      'src/assets/legacy/js/**/*.js',
    ],
    dest: 'dist/assets'
  },
  legacyMisc: {
    src: 'src/assets/legacy/misc',
    glob: [
      'src/assets/legacy/misc/**/*',
    ],
    dest: 'dist/assets'
  },
  assets: {
    src: 'src/assets',
    glob: [
      'src/assets/**/*.png',
      'src/assets/**/*.jpg',
      'src/assets/**/*.svg',
      'src/assets/**/*.ttf',
      'src/assets/**/*.woff',
      'src/assets/**/*.woff2',
      'src/assets/**/*.eot'
    ],
    dest: 'dist/assets',
    opts: {flatten: true}
  },
  config: {
    glob: [
      'src/config/lib/*.json'
    ],
    dest: 'dist/config'
  },
  locales: {
    glob: 'src/locales/*.json',
    dest: 'dist/locales'
  }
}

/**
 * Concats src/config/lib/*.json into
 * a single settings_schema.json
 */
gulp.task('config:concat', (done) => {
  gulp.src(getPath(files.config.glob))
    .pipe(concat('settings_schema.json', {newLine: ','}))
    .pipe(wrap({
      header: '[',
      footer: ']'
    }))
    .pipe(gulp.dest(getPath(files.config.dest)))
  done()
})

/**
 * DEFAULT Copy Task
 * Copies all files from /src to /dist
 */
gulp.task('files:copy', gulp.series(['config:concat'], (done) => {
  processLog.start('all files', 'Copying') // start log
  for (let type in files) {
    if (type === 'config') {
      continue
    }
    copy(getPath(files[type].glob), getPath(files[type].dest), processLog.end.bind(null, type), files[type].opts || {})
  }
  done()
}))

/**
 * DEV Copy Task
 * Watches filepaths for changes and
 * copies changed files.
 */
gulp.task('files:watch', function (done) {
  for (let type in files) {
    if (type === 'config') {
      continue
    }
    gulp.watch(getPath(files[type].glob)).on('all', function (event, path) {
      processFiles(event, path, type, files[type].opts || {})
    })
  }
  gulp.watch(getPath(files.config.glob), gulp.series(['config:concat'], done => {
    done()
  }))
})

/**
 * Watch Handler
 * Scrubs event type (change|unlink) and
 * either copies or deletes file
 *
 * @param {stream} event The object returned from gulp.watch()
 * @param {string} type The type of file being processed
 * @param {object} opts Options to pass to copy() task (optional)
 */

function processFiles (event, srcPath, type, opts = {}) {
  /**
   * File and first level directory if present.
   * Regex removes trailing/preceding / and spaces
   */

  let srcName = null

  // split /src/ to detect file inside this folder
  if (srcPath.match(/src/)) {
    srcName = srcPath.split(/src/)[1]
  } else {
    // fallback to root folder
    srcName = srcPath.split('/').pop()
  }
  srcName = srcName.replace(/^((\w)|^(\/\w))+\//, '')

  /**
   * Get full *relative* destination path
   * including file name
   */
  let destName = getPath(`${files[type].dest}/${srcName}`)

  /**
   * The path to the destination file
   */
  let destPath = path.dirname(destName)

  if (opts.flatten) {
    destPath = destName.replace(new RegExp(srcName), '')
  }

  /**
   * Delete event
   */
  if (event === 'unlink') {
    processLog.start(destName, 'Deleting') // start log
    del(destPath, { force: true }, function (err) {
      if (err) throw err
      processLog.end()
    })
  }
  /**
   * Otherwise copy it over
   */
  else {
    processLog.start(srcName, 'Copying') // start log
    copy(srcPath, destPath, processLog.end, opts)
  }
}

/**
 * MAIN Copy Function
 * A wrapper for gulp.(src|dest)
 *
 * @param {string|array} files The default glob patterns in the files object
 * @param {string} dest The default dist path in the files object
 * @param {object} opts Options (optional)
 * @param {function} cb The processLog callback function
 */
function copy (files, dest, cb, opts = {}) {
  /**
   * Debug helper
   */
  // console.log(`Source: ${files}, Destination: ${dest}`)

  /**
   * Flatten all paths, only affects assets because
   * the `files` param in this scope is the full path of
   * the changed files, i.e. assets/images/image.jpg instead
   * of assets/image.jpg like we want.
   */
  if (opts.flatten) {
    gulp.src(files).pipe(flatten()).pipe(gulp.dest(dest))
  } else {
    gulp.src(files).pipe(gulp.dest(dest))
  }

  cb()
}
