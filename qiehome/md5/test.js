

var crypto = require('crypto')

console.log(crypto.getHashes())

//创建md5加密
var md5 = crypto.createHash('md5');

//向算法中输入数据
md5.update('1')
md5.update('2')
md5.update('3')
var result = md5.digest('hex');
console.log(result)




