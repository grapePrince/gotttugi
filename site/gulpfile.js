const { series, watch, parallel, src, dest } = require('gulp');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();


const SRC = {
    JS: 'js/*',
    CSS: 'css/app.less',
    HTML: '*.html'
};

const DEST = {
    JS: 'js',
    CSS: 'css',
    HTML: ''
};

const build_css = series(task_less);
function task_less() {
    return src(SRC.CSS)
    .pipe(less())
        .on('error', console.log.bind(console))
    .pipe(sourcemaps.write())
    .pipe(dest(DEST.CSS))
    .pipe(browserSync.reload( {stream : true} ));
}

const reload_js = series(task_js);
function task_js() {
    return src(SRC.JS)
    .pipe(browserSync.reload( {stream : true} ));
}


const reload_html = series(task_html);
function task_html() {
    return src(SRC.HTML)
    .pipe(browserSync.reload( {stream : true} ));
}


exports.default = function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    const cssWatcher = watch('css/*.less', { events: 'all', delay: 500 }, build_css);
    cssWatcher.on('change', function(path, stats) {
        console.log(`File ${path} was changed`);
    });

    const jsWatcher = watch('js/*', { events: 'all', delay: 500 }, reload_js);
    jsWatcher.on('change', function(path, stats) {
        console.log(`File ${path} was changed`);
    });

    const htmlWatcher = watch('*.html', { events: 'all', delay: 500 }, reload_html);
    htmlWatcher.on('change', function(path, stats) {
        console.log(`File ${path} was changed`);
    });   

};

exports.build = build_css;