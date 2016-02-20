var del = require('del')
var exec = require('child_process').exec

var gulp = require('gulp')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer');

var htmlmin = require('gulp-htmlmin')
var livereload = require('gulp-livereload')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')

var browserify = require('browserify')

var paths = {
  src:{
    imba: 'src/imba/**/*.imba',
    js: 'src/js/**/*.js',
    solContracts: ['src/sol/**/*.sol', '!src/sol/test/**/*.sol'],
    solTests: 'src/sol/test/**/*.sol',
    index: 'src/index.html'
  },
  tmp:{
    lib: 'tmp/lib/',
    imba:  'tmp/imba/',
    dapple: 'tmp/dapple/',
    dappleBuild: 'tmp/dappleBuild/'
  },
  dist: {
    js: 'dist/js/',
    index: 'dist/'
  }
}

gulp.task('copy-index', function () {
  gulp.src(paths.src.index)
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest(paths.dist.index))
  .pipe(livereload())
})

gulp.task('copy-js', function (){
  gulp.src(paths.src.js)
  .pipe(uglify())
  .pipe(gulp.dest(paths.tmp.lib))
})

gulp.task('build-imba', function (cb) {
  exec('imba compile src/imba/ -o ' + paths.tmp.imba , function(err,res){
    // TODO minifiy
    if(err){ console.log(err) }
    cb()
  })
})

gulp.task('build-dapple', function (cb) {
  exec('dapple build', function(err,res){
    if(err){ console.log(err) }
    browserify({
      entries: paths.tmp.dappleBuild+'js_module.js',
      standalone: 'Contracts'
    })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.tmp.dapple))
    .on('end', function(){
      del.sync([paths.tmp.dappleBuild])
      cb()
    })
  })
})

gulp.task('test-dapple', function(cb){
  process.stdout.write('Testing...\r')
  exec('dapple test', function(err,res,failed){
    if(err){
      console.log(err)
    } else if (failed) {
      process.stdout.write(failed)
    } else {
      process.stdout.write("\u001b[32mPassed all tests! \n")
    }
    cb()
  })
})

var mergeJsSource = function(cb){
  return gulp.src([
    paths.tmp.lib+'**/*.js',
    paths.tmp.dapple+'**/*.js',
    paths.tmp.imba+'**/*.js'
  ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest(paths.dist.js))
  .pipe(livereload())
}

gulp.task('merge-all', ['build-dapple','build-imba', 'copy-js'], mergeJsSource)
gulp.task('merge-js', ['copy-js'], mergeJsSource)
gulp.task('merge-dapple', ['build-dapple'], mergeJsSource)
gulp.task('merge-imba', ['build-imba'], mergeJsSource)

gulp.task('clean', function () {
  del.sync(['tmp/', 'dist/*'])
})
gulp.task('test', ['test-dapple'])

gulp.task('rebuild', ['clean', 'merge-all', 'copy-index'])
gulp.task('default', ['rebuild', 'test'])

gulp.task('watch', ['default'], function() {
  livereload.listen()
  gulp.watch('src/sol/**/*.sol', ['test-dapple'])
  gulp.watch(paths.src.js, ['merge-js'])
  gulp.watch(paths.src.imba, ['merge-imba'])
  gulp.watch(paths.src.solContracts, ['merge-dapple'])
  gulp.watch(paths.src.index, ['copy-index'])
})
