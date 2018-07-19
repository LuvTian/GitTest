var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    del = require('del'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    revmy = require('gulp-my'),
    revCollector = require('gulp-rev-collector'),
    minifyHTML = require('gulp-minify-html'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    zip = require('gulp-zip'),
    runSequence = require('gulp-run-sequence'),
    gutil = require('gulp-util'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer');

gulp.task("clean", function () {
    return gulp.src('temp')
        .pipe(clean());
});

gulp.task('deljs',function(cb){
	return del([dsturl + 'js/**/*'], cb);
});

//"D:\zillion\Tang.Code\唐小僧项目跟踪\50 Source\30 WeChat\Branches\TangApp2.3.0发布分支\Madison.TangApp3.0\e\20161109001"
var array_srcurl = [''];//在这输入要压缩的目录列表，不需要activity_src

var srcurl = ''; // 源码路径
var dsturl = '';         // 打包路径

gulp.task('minifycss', function () {
	var postc = [autoprefixer];
    return gulp.src(srcurl + '\\**\\*.css')      //压缩的文件
        // .pipe(revmy({
        //     configfile: 'configfile.json'
        // }))
        // .pipe(postcss(postc))
        .pipe(minifycss())   //执行压缩
        .pipe(gulp.dest(dsturl))   //输出文件夹   
});

gulp.task('minifyjs', ['deljs'], function () {
    return gulp.src([srcurl + '\\**\\*.js',
    '!' + srcurl + '\\**\\baidumap_*.js',
    '!' + srcurl + '\\**\\baiducity.js',
    '!' + srcurl + '\\**\\city.js',
    '!' + srcurl + '\\**\\cn_city.js',
    '!' + srcurl + '\\**\\cn_citytree.js',
    '!' + srcurl + '\\**\\sinacity.js',
    '!' + srcurl + '\\**\\message.js'
    ])
        //.pipe(concat('app.js'))    //合并所有js到main.js
        //.pipe(gulp.dest('minified/js'))    //输出main.js到文件夹
        //.pipe(rename({ suffix: '.min' }))   //rename压缩后的文件名
        /*.pipe(uglify())    //压缩*/
        .pipe(uglify().on('error',function(err){
        	gutil.log(err);
        	this.emit('end');
        }))
        .pipe(gulp.dest(dsturl));  //输出
});
// gulp.task('img', function () {
//     return gulp.src([srcurl + '\\**\\*.png', srcurl + '\\**\\*.jpg'])
//         //.pipe(concat('app.js'))    //合并所有js到main.js
//         //.pipe(gulp.dest('minified/js'))    //输出main.js到文件夹
//         //.pipe(rename({ suffix: '.min' }))   //rename压缩后的文件名
//         .pipe(gulp.dest(dsturl));  //输出
// });
function taskrevmy(task, cdnurl) {
    gulp.task(task, function () {
        var options = {
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        };
        //.pipe(htmlmin(options))
        return gulp.src([srcurl + '\\**\\*.html',
    	'!' + srcurl + '\\**\\producttransferlist-old.html',
        '!' + srcurl + '\\**\\jifenshuoming\\index.html',
        '!' + srcurl + '\\**\\jifenshuoming\\fuli.html'
    	])
            .pipe(htmlmin(options))
            .pipe(revmy({
                //configfile: 'configfile.json'
                cdn: cdnurl
            }))
            .pipe(gulp.dest(dsturl))
    });
}

taskrevmy('fat-revmyHtml', '');
taskrevmy('uat-revmyHtml', 'https://accept.txslicai.com');
taskrevmy('pre-revmyHtml', 'https://txs06-oss-h501.oss-cn-hangzhou.aliyuncs.com');
taskrevmy('master-revmyHtml', 'https://txsres.txslicai.com');

// // 更改html引用资源的路径，验收环境
// gulp.task('uat-revmyHtml', function () {
//     var options = {
//         collapseWhitespace: true,
//         collapseBooleanAttributes: true,
//         removeComments: true,
//         removeEmptyAttributes: true,
//         removeScriptTypeAttributes: true,
//         removeStyleLinkTypeAttributes: true,
//         minifyJS: true,
//         minifyCSS: true
//     };
//     //.pipe(htmlmin(options))
//     return gulp.src(srcurl + '\\**\\*.html')
//         .pipe(revmy({
//             //configfile: 'configfile.json'
//             cdn: 'https://accept.txslicai.com'
//         }))
//         .pipe(htmlmin(options))
//         .pipe(gulp.dest(dsturl))
// });

// // 更改html引用资源的路径，测试环境
// gulp.task('fat-revmyHtml', function () {
//     var options = {
//         collapseWhitespace: true,
//         collapseBooleanAttributes: true,
//         removeComments: true,
//         removeEmptyAttributes: true,
//         removeScriptTypeAttributes: true,
//         removeStyleLinkTypeAttributes: true,
//         minifyJS: true,
//         minifyCSS: true
//     };
//     //.pipe(htmlmin(options))
//     return gulp.src(srcurl + '\\**\\*.html')
//         // .pipe(revmy({
//         //     //configfile: 'configfile.json'
//         //     cdn: ''
//         // }))
//         .pipe(htmlmin(options))
//         .pipe(gulp.dest(dsturl))
// });

// // 更改html引用资源的路径，生产环境
// gulp.task('master-revmyHtml', function () {
//     var options = {
//         collapseWhitespace: true,
//         collapseBooleanAttributes: true,
//         removeComments: true,
//         removeEmptyAttributes: true,
//         removeScriptTypeAttributes: true,
//         removeStyleLinkTypeAttributes: true,
//         minifyJS: true,
//         minifyCSS: true
//     };
//     //.pipe(htmlmin(options))
//     return gulp.src([srcurl + '\\**\\*.html'])
//         .pipe(htmlmin(options))
//         .pipe(revmy({
//             //configfile: 'configfile.json'
//             cdn: 'https://txsres.txslicai.com'
//         }))
//         .pipe(gulp.dest(dsturl))
// });
// 压缩图片任务

// 在命令行输入 gulp images 启动此任务
// 只压缩修改的图片。压缩图片时比较耗时，在很多情况下我们只修改了某些图片，
// 没有必要压缩所有图片，使用”gulp-cache”只压缩修改的图片，没有修改的图片直接从缓存文件读取
gulp.task('images', function () {
    // 1. 找到图片
    gulp.src(srcurl + '\\**\\*.{png,jpg,gif,ico}')
        // // 2. 压缩图片
        .pipe(cache(imagemin({
            progressive: false
        })))
        // 3. 另存图片
        .pipe(gulp.dest(dsturl))
});

// 拷贝其他文件
gulp.task('copy', function () {
    // 1. 找到图片
    gulp.src([srcurl + '\\**\\*.json',
    srcurl + '\\**\\baidumap_*.js',
    srcurl + '\\**\\baiducity.js',
    srcurl + '\\**\\city.js',
    srcurl + '\\**\\cn_city.js',
    srcurl + '\\**\\cn_citytree.js',
    srcurl + '\\**\\sinacity.js',
    srcurl + '\\**\\message.js',
    srcurl + '\\**\\iconfont.ttf',
    srcurl + '\\**\\jifenshuoming\\index.html',
    srcurl + '\\**\\jifenshuoming\\fuli.html'
    ]).pipe(gulp.dest(dsturl))
});

// '../wechat/H5TangApp/Html/Store/jifenshuoming/index.html',
// '../wechat/H5TangApp/Html/Store/jifenshuoming/fuli.html'
// //压缩打包文件夹
// gulp.task('zipF', function () {
//     // var now = new Date();
//     // var filename = [];
//     // filename.push(now.getFullYear());
//     // filename.push(now.getMonth() + 1);
//     // filename.push(now.getDate());
//     // filename.push(now.getHours());
//     // filename.push(now.getMinutes());
//     // filename.push(now.getSeconds());
//     // filename.push(now.getMilliseconds());
//     // filename.push(".zip");
//     gulp.src("dest/wechat/**/*.*")
//         .pipe(zip('wechat.zip'))
//         .pipe(gulp.dest("dest/"))
// })
// srcurl = '../wechat/H5TangApp/';
srcurl = './H5TangApp/';
//srcurl = 'wechat/';
dsturl = './H5TangappActivity-txslicai/';
// 测试环境打包
gulp.task("test", ['clean'], function () {
    // for (var i = 0; i < array_srcurl.length; i++) {
    //     srcurl = 'H5TangApp/' + array_srcurl[i];
    //     dsturl = 'dest/wechat/' + array_srcurl[i];
    //     runSequence('minifycss', 'minifyjs', 'revmyHtml', 'images', 'zipF');
    // }
    // srcurl = '../wechat/H5TangApp/';
    // dsturl = 'dest/wechat/';
    runSequence('minifycss', 'minifyjs', 'fat-revmyHtml', 'images', 'copy');
});


// 验收环境打包
gulp.task("uat", ['clean'], function () {
    // for (var i = 0; i < array_srcurl.length; i++) {
    //     srcurl = 'H5TangApp/' + array_srcurl[i];
    //     dsturl = 'dest/wechat/' + array_srcurl[i];
    //     runSequence('minifycss', 'minifyjs', 'revmyHtml', 'images', 'zipF');
    // }
    // srcurl = '../wechat/H5TangApp/';
    // dsturl = 'dest/wechat/';
    runSequence('minifycss', 'minifyjs', 'uat-revmyHtml', 'images', 'copy');
});

// 预发布环境打包
gulp.task("pre", ['clean'], function () {
    // for (var i = 0; i < array_srcurl.length; i++) {
    //     srcurl = 'H5TangApp/' + array_srcurl[i];
    //     dsturl = 'dest/wechat/' + array_srcurl[i];
    //     runSequence('minifycss', 'minifyjs', 'revmyHtml', 'images', 'zipF');
    // }
    // srcurl = '../wechat/H5TangApp/';
    // dsturl = 'dest/wechat/';
    runSequence('minifycss', 'minifyjs', 'pre-revmyHtml', 'images', 'copy');
});

// 生产打包
gulp.task("master", ['clean'], function () {
    // for (var i = 0; i < array_srcurl.length; i++) {
    //     srcurl = 'H5TangApp/' + array_srcurl[i];
    //     dsturl = 'dest/wechat/' + array_srcurl[i];
    //     runSequence('minifycss', 'minifyjs', 'revmyHtml', 'images', 'zipF');
    // }
    // srcurl = '../wechat/H5TangApp/';
    // dsturl = 'dest/wechat/';
    runSequence('minifycss', 'minifyjs', 'master-revmyHtml', 'images', 'copy');
});

// gulp.task("default", ['clean'], function () {
//     gulp.start('minifycss', 'minifyjs');
// });