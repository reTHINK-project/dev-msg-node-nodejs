var gulp = require('gulp');
var exec = require('child_process').exec;

// Gulp task to generate development documentation;
gulp.task('doc', function (done) {
  console.log('Generating documentation...');
  exec('node_modules/.bin/jsdoc -R readme.md -d docs src/js/*', function (err, stdout, stderr) {
    if (err) return done(err);
    console.log('Documentation generated in "docs" directory');
    done();
  });
});

// Task and dependencies to convert ES6 to ES5 with babel;
//var babel = require('babelify');
//var browserify = require('browserify');
//var source = require('vinyl-source-stream');
//
//gulp.task('build', function() {
//  var bundler = browserify('./src/js/NodejsProtoStub.js', {
//    standalone: 'activate',
//    debug: false
//  }).transform(babel);
//
//  function rebundle() {
//    bundler.bundle()
//    .on('error', function(err) {
//      console.error(err);
//      this.emit('end');
//    })
//    .pipe(source('NodejsProtoStub.js'))
//    .pipe(gulp.dest('./target'));
//  }
//
//  rebundle();
//});


gulp.task('build', function () {

  return browserify('./src/js/NodejsProtoStub.js', {
      standalone: 'activate',
      bare: true,
      browserField: false,
      builtins: false
    })
    .transform(babel)
    .bundle()
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('NodejsProtoStub.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(insert.prepend('// Node JS ProtoStub \n\n// version: {{version}}\n\n'))
    .pipe(replace('{{version}}', pkg.version))
    .pipe(gulp.dest('./target'));
});

// Task and dependencies to convert ES6 to ES5 with babel distribute for all environments;
var babel = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var replace = require('gulp-replace');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var bump = require('gulp-bump');

var pkg = require('./package.json');

gulp.task('build', function () {

  return browserify('./src/js/NodejsProtoStub.js', {
      standalone: 'activate',
      debug: false,
    })
    .transform(babel)
    .bundle()
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source('NodejsProtoStub.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(insert.prepend('// Node JS ProtoStub \n\n// version: {{version}}\n\n'))
    .pipe(replace('{{version}}', pkg.version))
    .pipe(gulp.dest('./target'));
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
    .pipe(bump({ type: importance }))

    // save it back to filesystem
   .pipe(gulp.dest('./'));
}

gulp.task('patch', ['test'], function () { return inc('patch'); });

gulp.task('feature', ['test'], function () {  return inc('minor'); });

gulp.task('release', ['test'], function () {  return inc('major'); });

var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true,
  }, done).start();
});

var replace = require('gulp-replace');
var argv = require('yargs').argv;
var through = require('through2');
var path = require('path');
var gulpif = require('gulp-if');
var insert = require('gulp-insert');

gulp.task('license', function () {
  var clean = argv.clean;
  if (!clean) clean = false;

  return gulp.src(['src/**/*.java', 'src/**/*.js'])
  .pipe(prependLicense(clean));

});

function prependLicense(clean) {

  var license = '/**\n' +
'* Copyright 2016 PT Inovação e Sistemas SA\n' +
'* Copyright 2016 INESC-ID\n' +
'* Copyright 2016 QUOBIS NETWORKS SL\n' +
'* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V\n' +
'* Copyright 2016 ORANGE SA\n' +
'* Copyright 2016 Deutsche Telekom AG\n' +
'* Copyright 2016 Apizee\n' +
'* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN\n' +
'*\n' +
'* Licensed under the Apache License, Version 2.0 (the "License");\n' +
'* you may not use this file except in compliance with the License.\n' +
'* You may obtain a copy of the License at\n' +
'*\n' +
'*   http://www.apache.org/licenses/LICENSE-2.0\n' +
'*\n' +
'* Unless required by applicable law or agreed to in writing, software\n' +
'* distributed under the License is distributed on an "AS IS" BASIS,\n' +
'* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n' +
'* See the License for the specific language governing permissions and\n' +
'* limitations under the License.\n' +
'**/\n\n';

  return through.obj(function (file, enc, cb) {

    if (file.isNull()) {
      return cb(new Error('Fil is null'));
    }

    if (file.isStream()) {
      return cb(new Error('Streaming not supported'));
    }

    var dest = path.dirname(file.path);

    return gulp.src(file.path)
    .pipe(replace(license, ''))
    .pipe(gulpif(!clean, insert.prepend(license)))
    .pipe(gulp.dest(dest))
    .on('end', function () {
      cb();
    });

  });

}
