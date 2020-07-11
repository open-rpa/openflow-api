var fs = require('fs');
var gulp = require('gulp');
var shell = require('gulp-shell');
var merge = require('merge-stream');
var browserify = require('browserify');
const tsify = require('tsify');


gulp.task('tsc', shell.task([
    'echo "tsc for nodejs"',
    'tsc -p tsconfig.json',
    'echo "tsc for browser"'
]));
// 'tsc -p tsconfig-cjs.json'

gulp.task('browserify', function () {
    var bfi = browserify({
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
    var web = gulp.watch([].concat("./src/**/*.ts"), gulp.series('tsc', 'browserify'));
    return web;
});


gulp.task('default', gulp.series('tsc', 'browserify', 'watch'));