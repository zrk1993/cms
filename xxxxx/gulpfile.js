const gulp = require('gulp');
const clean = require('gulp-clean');
const fileinclude = require('gulp-file-include');
const rev = require('gulp-rev');
const revReplace = require('gulp-rev-replace');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const spriter = require('gulp-css-spriter');
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');

const sass = require('gulp-sass');
const runSequence = require('run-sequence');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const path = require('path');

const config = {
    'ENV': 'dev',//dev or product
    'public': path.resolve(__dirname, '../public'),		//发布静态资源 css js img 路径
    'view': path.resolve(__dirname, '../views')			//发布'html路径'
};
const webpackConfig = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};

const tempdir = path.resolve(__dirname, 'temp');//临时目录

//清理目标文件夹/文件
gulp.task('clean', function () {
    return gulp.src([config.public, config.view, tempdir])
        .pipe(clean({force: true}));
});

//用于在html文件中直接include文件  并保存到目标路径
gulp.task('fileinclude', function () {
    return gulp.src(['html/*.html'])
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(config.view));
});

//将图片拷贝到目标目录
gulp.task('copy:img', function () {
    return gulp.src('img/**/*')
        .pipe(gulp.dest(path.join(config.public, 'img')));
});

//css 压缩 文件名添加MD5
gulp.task('build:css', function () {
    const timestamp = +new Date();
    return gulp.src(['css/*.css', 'css/*.scss'])
        .pipe(plumber())
        .pipe(rev()) //添加MD5
        .pipe(sass().on('error', sass.logError))
        .pipe(spriter({
            includeMode: 'implicit',//explicit：默认不加入雪碧图，，implicit：默认加入雪碧图/* @meta {"spritesheet": {"include": true}} */
            spriteSheet: config.public + '/img/spritesheet' + timestamp + '.png',//img保存路径
            pathToSpriteSheetFromCSS: '../img/spritesheet' + timestamp + '.png'//在css文件中img的路径
        }))
        .pipe(cssmin()) //压缩
        .pipe(gulp.dest(path.join(config.public, 'css')))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.join(tempdir, 'rev/css')));
});

//js 打包 压缩 混淆 文件名添加MD5
gulp.task('build:js', function () {
    return gulp.src('js/*.js')
        .pipe(plumber())
        .pipe(named())
        .pipe(webpackStream(webpackConfig))
        .pipe(rev())  //添加MD5
        .pipe(uglify())	//压缩 混淆
        .pipe(gulp.dest(path.join(config.public, 'js')))
        .pipe(rev.manifest())
        .pipe(gulp.dest(path.join(tempdir, 'rev/js')));
});

// 将html的css js 引用路径 替换为  修改(增加MD5)后的路径   并压缩
gulp.task("revreplace", function () {
    const manifest = gulp.src(path.join(tempdir, 'rev/**/rev-manifest.json'));
    //noinspection JSUnusedGlobalSymbols
    const revReplaceOptions = {
        manifest: manifest,
        replaceInExtensions: ['.js', '.css', '.html', '.scss'],
        modifyUnreved: (filename) => {
            if (filename.indexOf('.js') > -1) {
                return '../js/' + filename;
            }
            if (filename.indexOf('.scss') > -1) {
                return '../css/' + filename;
            }
        },
        modifyReved: (filename) => {
            if (filename.indexOf('.js') > -1) {
                return '/js/' + filename;
            }
            if (filename.indexOf('.css') > -1) {
                return '/css/' + filename;
            }
        }
    };
    return gulp.src(config.view + '/*.html')
        .pipe(revReplace(revReplaceOptions))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(config.view));
});


const watchFiles = ['js/**/*.js', 'css/*.css', 'css/*.sass', 'css/**/*.scss', 'html/**/*.html'];

gulp.task('watch', function () {
    gulp.watch(watchFiles, function (event) {
        gulp.start('default', function () {
            console.log('File ' + event.path + ' was ' + event.type + ', build finished');
        });
    });
});


gulp.task('dev', ['default', 'watch']);

gulp.task('default', function (done) {
    runSequence('clean',
        ['fileinclude', 'copy:img', 'build:css', 'build:js'],
        'revreplace',
        done);
});

