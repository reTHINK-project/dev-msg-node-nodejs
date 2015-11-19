var gulp = require('gulp');
var exec = require('child_process').exec;

// Gulp task to generate development documentation;
gulp.task('doc', function(done) {
  console.log('Generating documentation...');
  exec('node_modules/.bin/jsdoc -R readme.md -d docs src/js/*', function(err, stdout, stderr) {
    if (err) return done(err);
    console.log('Documentation generated in "docs" directory');
    done();
  });
});

// Task and dependencies to convert ES6 to ES5 with babel;
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('build', function() {
  var bundler = browserify('./src/js/NodejsProtoStub.js', {
    standalone: 'NodejsProtoStub',
    debug: false
  }).transform(babel);

  function rebundle() {
    bundler.bundle()
    .on('error', function(err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('NodejsProtoStub.js'))
    .pipe(gulp.dest('./target'));
  }

  rebundle();
});

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function inc(importance) {
  // get all the files to bump version in
  return gulp.src(['./package.json'])

    // bump the version number in those files
    .pipe(bump({type: importance}))

    // save it back to filesystem
   .pipe(gulp.dest('./'));
}

gulp.task('patch', ['test'], function() { return inc('patch'); });

gulp.task('feature', ['test'], function() {  return inc('minor'); });

gulp.task('release', ['test'], function() {  return inc('major'); });

var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});
