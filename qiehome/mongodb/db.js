var mongoose = require('mongoose');//引入mongoose模块

/**
 * mongodb: 连接数据库
 * mongodb: 协议名
 * 27017: mongodb数据库默认端口号
 * 0304db: 连接的数据库名字
 * */
mongoose.connect(require('../dbUrl').dbUrl)


/**
 * 定义集合(模型)的骨架，确定集合中拥有的字段名称
 * */
var userSchema = new mongoose.Schema({
    username: String,  //属性名：类型
    email: String,
    password: String,
    avatar:String
});

/**
 * model: 创建模型(集合)
 * personModel: 模型(集合)中的字段
 * 创建集合完成后，通过集合创建对应文档
 * */
var userModel = mongoose.model('user', userSchema);

//创建文章相关的模型
var articleSchema = new mongoose.Schema({
    title: String,  //属性名：类型
    content: String,
    poster:String,//上传的图片
    createAt:{
        type:Date,
        defail:Date.now()
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
});
var articleModel = mongoose.model('article',articleSchema)

//将userModel地址的数据返回
module.exports.userModel = userModel
module.exports.articleModel = articleModel
