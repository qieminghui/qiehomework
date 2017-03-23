/**
 * Created by Administrator on 2017/3/15.
 */
/*
* console和debug区别
* console：在任何环境下都会进行输出
* debug：可以选择性的打印
* */
var successDebug = require('debug')('blog:success');

var failDebug = require('debug')('blog:fail');

var warnDebug = require('debug')('blog:warn');

console.log(1111111)
successDebug('success')

failDebug('fail')

warnDebug('warn')