/**
 * Created by Veket on 2017/10/16.
 * 压缩备份项目
 */
const gulp = require("gulp");
const zip = require("gulp-zip");
const moment = require("moment");
const zipPath ='./zip';
const sftp = require("gulp-sftp");

/**
 * 备份正式环境代码
 * gulp zip:pro
 * **/
gulp.task('zip:pro',function () {
    gulp.src('./dist/**/**/*')
        .pipe(zip(moment().format("YYYYMMDD")+'.pro.imip.zip'))
        .pipe(gulp.dest(zipPath));
});

/**
 * 备份uat环境代码
 * gulp zip:uat
 * **/
gulp.task('zip:uat',function () {
    gulp.src('./dist/**/**/*')
        .pipe(zip(moment().format("YYYYMMDD")+'.uat.imip.zip'))
        .pipe(gulp.dest(zipPath));
});


gulp.task("default", ['zip:pro']);

/**
 * 发布正式环境代码
 * gulp p:pro
 * **/
gulp.task('p:pro',function () {
    return gulp.src('dist/**/**/*')
        .pipe(gulp.dest('../../../../MIP4.0/UAT/imip_fg_p/'));
});

/**
 * 发布ver环境代码
 * gulp p:v
 * **/
gulp.task('p:v',function () {
    return gulp.src('dist/**/*')
        .pipe(gulp.dest('../../../../MIP4.0/UAT/imip_fg_v/'));
});


/**uat**/
gulp.task('p:uat1', function () {
    return gulp.src('dist/**')
        .pipe(sftp({
            host: '10.16.73.120',
            user: 'apps',
            pass:'mipUat123#edc',
            remotePath : '/apps/ldap4a/apache_webgate/apache12580/htdocs'
        }));
});

gulp.task('p:uat2', function () {
    return gulp.src('dist/**')
        .pipe(sftp({
            host: '10.16.73.121',
            user: 'apps',
            pass:'mipUat123#edc',
            remotePath : '/apps/ldap4a/apache_webgate/apache12580/htdocs'
        }));
});

/*

gulp.task('p:ver', function () {
    return gulp.src('dist/!**')
        .pipe(sftp({
            host: '10.17.146.223',
            user: 'apps',
            pass:'ci7Bc3H#xlU6D',
            remotePath : '/apps/svr/ldap4a/apache12580/htdocs'
        }));
});
*/
