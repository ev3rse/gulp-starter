const {
  series, parallel, src, dest, watch,
} = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const eslint = require('gulp-eslint');
const gulpPug = require('gulp-pug');

const paths = {
  pug: {
    src: 'src/**/*.pug',
    dest: 'dist',
  },
  css: {
    src: 'src/scss/styles.scss',
    dest: 'dist/assets/css',
  },
  js: {
    src: [
      'src/js/**/*.js',
      '!src/js/vendors/**/*.js',
    ],
    dest: 'dist/assets/js',
  },
  vendors: {
    src: 'src/js/vendors/**/*.js',
    dest: 'dist/assets/js/vendors',
  },
  img: {
    src: 'src/images/**/*',
    dest: 'dist/assets/images',
  },
  font: {
    src: 'src/fonts/**/*',
    dest: 'dist/assets/fonts',
  },
};

function clean() {
  return del('dist/**', { force: true });
}

function pug() {
  return src(paths.pug.src)
    .pipe(gulpPug({ pretty: '\t' }))
    .pipe(dest('dist/'));
}

function css() {
  return src(paths.css.src)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(sourcemaps.write())
    .pipe(dest(paths.css.dest));
}

function javascript() {
  return src(paths.js.src)
    .pipe(sourcemaps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({ presets: [['@babel/preset-env']] }))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.js.dest));
}

function vendors() {
  return src(paths.vendors.src)
    .pipe(dest(paths.vendors.dest));
}

function images() {
  return src(paths.img.src)
    .pipe(newer(paths.img.dest))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ]),
    )
    .pipe(dest(paths.img.dest));
}

function fonts() {
  return src(paths.font.src)
    .pipe(dest(paths.font.dest));
}

function browserLive(done) {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    port: 3000,
    notify: false,
  });
  done();
}

function watchCss() {
  return watch('src/scss/**/*.scss', css).on('change', browserSync.reload);
}

function watchPug() {
  return watch(paths.pug.src, pug).on('change', browserSync.reload);
}

function watchJs() {
  return watch('src/js/**/*.js', javascript).on('change', browserSync.reload);
}


// exports (public tasks)
exports.build = series(clean, parallel(pug, css, javascript, vendors, images, fonts));
exports.clean = clean;
exports.pug = pug;
exports.css = css;
exports.js = javascript;
exports.vendors = vendors;
exports.img = images;
exports.fonts = fonts;
exports.watch = parallel(watchCss, watchPug, watchJs, browserLive);
