const { task, watch, series, src, dest } = require('gulp');
const uglify = require('gulp-uglify-es').default;
const ts = require('gulp-typescript');
const sass = require('gulp-sass');
//TS解析
function compilerTypeScript(cb) {
    return src('src/**/*.ts')
        .pipe(ts({
            "module": "CommonJS",
            "esModuleInterop": true,
            "target": "es6",
            "noImplicitAny": true,
            "moduleResolution": "node",
            "sourceMap": false
        })
        )
        .pipe(dest('./dist'));
}
function jsCompress(cb) {
    return src('src/**/*.js')
    .pipe(uglify())
    .pipe(dest('dist'));
}
//编译sass
function compilerSass(cb) {
    return src('src/html/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('dist/html'));
}

// 迁移html
function moveHtml(cb) {
    return src('src/html/**/*.html')
    .pipe(dest('dist/html'));
}

if(process.env.NODE_ENV === 'development') {
    task('default', series(compilerTypeScript, compilerSass, moveHtml));
    watch(['src/**/*.ts', 'src/**/*.scss', 'src/html/**/*.html'], series(compilerTypeScript, compilerSass, moveHtml));
} else {
    task('default', series(compilerTypeScript, jsCompress, compilerSass, moveHtml));
}
