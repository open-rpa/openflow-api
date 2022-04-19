const fs = require('fs');
const gulp = require('gulp');
const shell = require('gulp-shell');
const merge = require('merge-stream');
const browserify = require('browserify');
const tsify = require('tsify');


gulp.task('tsc', shell.task([
    'echo "tsc for nodejs"',
    'tsc -p src/tsconfig.json',
]));
// 'echo "tsc for browser"'
// 'tsc -p tsconfig-cjs.json'

gulp.task('browserify', function () {
    const bfi = browserify({
        entries: ['./src/index.ts'],
        debug: true,
        basedir: '.'
    })
        .plugin(tsify, { noImplicitAny: false })
        .bundle()

        .pipe(fs.createWriteStream('./lib/openflow-api.js'));
    return bfi;
});

gulp.task("watch", function () {
    const web = gulp.watch([].concat("./src/**/*.ts"), gulp.series('tsc', 'browserify'));
    return web;
});
gulp.task('compose', gulp.series('tsc', 'browserify'));
gulp.task('build', gulp.series('tsc', 'browserify'));

gulp.task('default', gulp.series('tsc', 'browserify', 'watch'));