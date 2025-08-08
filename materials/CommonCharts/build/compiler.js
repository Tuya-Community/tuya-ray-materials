const gulp = require('gulp');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const tasks = {};
const src = path.resolve(__dirname, '../lib');
const exampleDistDir = path.resolve(__dirname, '../example/dist');

const copier = (dist, ext) =>
  function copy() {
    const srcPath = [`${src}/**/*.${ext}`];
    return gulp
      .src(srcPath)
      .pipe(gulp.dest(dist));
  };

const staticCopier = (dist) =>
  gulp.parallel(
    copier(dist, 'tyml'),
    copier(dist, 'tyss'),
    copier(dist, 'rjs'),
    copier(dist, 'json'),
    copier(dist, 'js')
  );

const cleaner = (path) =>
  function clean() {
    return exec(`npx rimraf ${path}`);
  };

tasks.buildExample = gulp.series(
  cleaner(exampleDistDir),
  staticCopier(exampleDistDir),
    () => {
      gulp.watch(`${src}/**/*.tyml`, copier(exampleDistDir, 'tyml'));
      gulp.watch(`${src}/**/*.tyss`, copier(exampleDistDir, 'tyss'));
      gulp.watch(`${src}/**/*.js`, copier(exampleDistDir, 'js'));
      gulp.watch(`${src}/**/*.rjs`, copier(exampleDistDir, 'rjs'));
      gulp.watch(`${src}/**/*.json`, copier(exampleDistDir, 'json'));
    }
  )

  tasks.build = gulp.series(
    cleaner(exampleDistDir),
    staticCopier(exampleDistDir)
  )

module.exports = tasks;
