var gulp  		= require('gulp');
var clean 		= require('gulp-clean');
var fileinclude = require('gulp-file-include');
var rev 		= require('gulp-rev');
var revCollector= require('gulp-rev-collector');
var minifyHTML  = require('gulp-minify-html');
var uglify 		= require('gulp-uglify');
var cssmin      = require('gulp-cssmin');
var spriter     = require('gulp-css-spriter');
var plumber     = require('gulp-plumber');
var runSequence = require('run-sequence');
var webpackStream = require('webpack-stream');
var named         = require('vinyl-named');
var path 		      = require('path');

var config ={
	'ENV':'dev',//dev or product
	'public':path.resolve(__dirname, 'dist'),		//发布静态资源 css js img 路径
	'view':path.resolve(__dirname, 'dist')			//发布'html路径'
}
var webpackconfig = {};

var tempdir = path.resolve(__dirname, 'temp');//临时目录

//清理目标文件夹/文件
gulp.task('clean',function(){
  return gulp.src([config.public, config.view, tempdir])
    .pipe(clean());
});

//用于在html文件中直接include文件  并保存到目标路径
gulp.task('fileinclude',function () {
    return gulp.src(['html/*.html'])
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest(config.view));
});

//将图片拷贝到目标目录
gulp.task('copy:img', function () {
    return gulp.src('img/**/*')
    	.pipe(gulp.dest(path.join(config.public,'img')));
});

//css 压缩 文件名添加MD5
gulp.task('build:css', function () {
	var timestamp = +new Date();
    return gulp.src('css/*.css')
    	.pipe(plumber())
        .pipe(spriter({
        	includeMode:'implicit',//explicit：默认不加入雪碧图，，implicit：默认加入雪碧图/* @meta {"spritesheet": {"include": true}} */
            spriteSheet: 'dist/img/spritesheet' + timestamp + '.png',//img保存路径
            pathToSpriteSheetFromCSS: '../img/spritesheet' + timestamp + '.png',//在css文件img的路径
        }))
        .pipe(rev()) //添加MD5
        .pipe(cssmin()) //压缩
        .pipe(gulp.dest(path.join(config.public,'css')))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( path.join(tempdir,'rev/css') ) );
});

//js 打包 压缩 混淆 文件名添加MD5
gulp.task('build:js', function () {
    return gulp.src('js/*.js')
    	.pipe(plumber())
    	.pipe(named())
    	.pipe(webpackStream(webpackconfig))
        .pipe(rev())  //添加MD5
        .pipe(uglify())	//压缩 混淆
        .pipe(gulp.dest(path.join(config.public,'js')))
        .pipe( rev.manifest() )
        .pipe( gulp.dest( path.join(tempdir,'rev/js') ) );
});

// 将html的css js 引用路径 替换为  修改(增加MD5)后的路径
gulp.task('rev', function () {
    return gulp.src([path.join(tempdir,'rev/**/*.json'), config.view+'/*.html'])
        .pipe( revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': '/dist/css',
                'js': '/dist/js',
                'cdn/': function(manifest_value) {
                    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                }
            }
        }) )
        .pipe( minifyHTML({
                empty:true,
                spare:true
            }) )
        .pipe( gulp.dest(config.view) );
});

var watchfiles = ['js/*.js','css/*.css','html/*.html'];

gulp.task('watch',function(done){
  gulp.watch(watchfiles, function(event) {
    gulp.start('default');
    console.log('File ' + event.path + ' was ' + event.type + ', build finished');
  });
});


gulp.task('dev',['default','watch']);

gulp.task('default', function(done) {                          
  runSequence('clean',
              ['fileinclude', 'copy:img','build:css','build:js'],
              'rev',
              done);
});

