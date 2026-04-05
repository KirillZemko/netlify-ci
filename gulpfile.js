const gulp = require('gulp'); // подключаем все функции, которые предоставляет Gulp (переменная)
const concat = require('gulp-concat-css'); // подключаем gulp-contact (склеивает CSS в один файл)
const plumber = require('gulp-plumber'); // подключаем gulp-blumper, позволяет запускать сборку, даже если есть ошибки
const del = require('del'); // подключаем del v.6.0.0, чтобы при удалении чего-то из исходников, файлы удалялись и из сборки
const browserSync = require('browser-sync').create(); // просмотр результатов в реальном времени (подключение особенным способом, см документацию)
const postcss = require('gulp-postcss');

function html() {
  return gulp.src('src/**/*.html')
          .pipe(plumber()) // проверка плагином plumber на ошибки при сборке
          .pipe(gulp.dest('dist/')) // отправка файлов в точку назначения
          .pipe(browserSync.reload({stream: true}));
}

function css() {
  const plugins = [];

  return gulp.src('src/blocks/**/*.css')
          .pipe(plumber())
          .pipe(concat('bundle.css'))
          .pipe(postcss(plugins))
                .pipe(gulp.dest('dist'))
          .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src('src/images/**/*.{jpg, png, svg, gif, ico, webp, avif}')
          .pipe(gulp.dest('dist/images'))
          .pipe(browserSync.reload({stream: true}));
}

function clean() {
  return del('dist')
}

// функция слежки за изменением файлов
function watchFiles() {
  gulp.watch(['src/**/*.html'], html);
  gulp.watch(['src/**/*.css'], css);
  gulp.watch(['src/**/*.{jpg, png, svg, gif, ico, webp, avif}'], images);
}

// функция создания сервера
function serve() {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
}

const build = gulp.series(clean, gulp.parallel(html, css, images));
const watchapp = gulp.parallel(build, watchFiles, serve); // парралельное выполнение build, отслеживания изменения файлов и запуск сервера

exports.html = html;
exports.css = css;
exports.images = images;
exports.clean = clean;
exports.build = build;
exports.watchapp = watchapp;

exports.default = watchapp; // функция watchapp будет вызываться по команде gulp