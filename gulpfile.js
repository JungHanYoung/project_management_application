const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    gulpPug = require('gulp-pug'),
    del = require('del'),
    gulpImage = require('gulp-image'),
    gulpBabel = require('gulp-babel'),
    imageResize = require('gulp-image-resize'),
    bro = require('gulp-bro'),
    babelify = require('babelify'),
    ghPages = require('gulp-gh-pages');


sass.compiler = require('node-sass');

function clean() {
    return del(`${__dirname}/dist`);
}

function image() {
    gulp.src("./src/assets/profile/*")
        .pipe(imageResize({
            width: 32,
            height: 32,
            crop: true
        }))
        .pipe(gulpImage())
        .pipe(gulp.dest('./dist/images/profile'));
    return gulp.src("./src/assets/logo/*")
        .pipe(imageResize({
            width: 50,
            height: 50,
            crop: true
        }))
        .pipe(gulpImage())
        .pipe(gulp.dest('./dist/images'))
}

// compile scss into css
function style() {
    // 1. where is my scss file
    return gulp.src('./src/scss/style.scss')
    // 2. pass that file through sass compiler
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
    // 3. where do I save the compiled CSS?
        .pipe(gulp.dest('./dist/css'))
    // 4. stream changes to all browser
        .pipe(browserSync.stream())
}

function pug() {
    return gulp.src("./src/*.pug")
        .pipe(gulpPug())
        .pipe(gulp.dest('./dist'))
        .pipe(browserSync.stream());
}

function babel() {
    return gulp.src('./src/js/main.js')
        .pipe(bro({
            transform: [
                babelify.configure({ presets: ['@babel/preset-env'] }),
                [ 'uglifyify', { global: true } ]
              ]
        }))
        .pipe(gulpBabel())
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
}

function ghDeploy() {
    return gulp.src("dist/**/*").pipe(ghPages())
}

function watch() {

    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch('./src/scss/**/*.scss', style);
    gulp.watch('./src/**/*.pug', pug);
    gulp.watch('./src/js/**/*.js').on('change', babel);
}

const prepare = gulp.series([clean, image]);
const assets = gulp.series([pug, style, babel]);

const dev = gulp.series([prepare, assets, watch]);
const build = gulp.series([prepare, assets]);
const deploy = gulp.series([build, ghDeploy]);


exports.dev = dev;
exports.build = build;
exports.deploy = deploy;