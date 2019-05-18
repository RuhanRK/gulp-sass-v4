const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const del = require("del");

const paths = {
  styles: {
    src: "src/scss/**/*.scss",
    dest: "dist/css"
  }
};

function style() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", sass.logError)
    .pipe(
      postcss([
        autoprefixer({
          browsers: ["last 2 versions", "> 2%"]
        }),
        cssnano()
      ])
    )
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function styleBuild() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest(paths.styles.dest));
}

function cleanDist() {
  return del(["./dist/css/main.min.css"]);
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist/"
    }
  });
  gulp.watch(paths.styles.src, style);
  gulp.watch("./dist/**/*.html").on("change", browserSync.reload);
  gulp.watch("./dist/js/**/*.js").on("change", browserSync.reload);
}

const build = gulp.series(cleanDist, styleBuild);

exports.style = style;
exports.build = build;
exports.watch = watch;
