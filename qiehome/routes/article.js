var express = require('express');
var routers = express.Router();
var markdown = require('markdown').markdown

var url = require('url');
//权限控制
var auth = require('../middleware/auth')

//文章相关的集合
var articleModel = require('../mongodb/db').articleModel

//引入multer模块实现图片的上传
var multer = require('multer');

var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../public/uploads')//上传图片后保存的路径地址
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);//
    }
})

var upload = multer({storage:storage})
routers.get('/add', auth.checkLogin, function (req, res) {
    res.render('article/add', {title: "发表文章", content: "发表文章内容"});
});

routers.post('/add',auth.checkLogin,  upload.single('poster'), function(req,res){
    //1.获取表单提交的文章信息
    var articleInfo = req.body;

    if(req.file){
        articleInfo.poster = '/uploads/'+req.file.filename
    }
    //设置发表文章的时间
    articleInfo.createAt = Date.now().toLocaleDateString();

    //文章的作者
    articleInfo.user = req.session.user._id;

    //2.将文章保存到信息库里
    articleModel.create(articleInfo,function(err,doc){
        if(!err){
            req.flash('success','用户发表文章成功')
            res.redirect('/')
        }else{
            req.flash('error','用户发表文章失败')
            res.redirect('back')
        }
    })
})

routers.get('/detail',auth.checkLogin,function(req,res){
    var urlObj = url.parse(req.url, true);
    var query = urlObj.query;
    var id = query.id;
    console.log(id);
    articleModel.findById(id)
        .populate('user')
        .exec(function(err,article){
            if(!err){
                console.log(article.user.username)
                res.render('article/detail',{title: "文章详情", article: article});
            }else{
                console.log(err)
            }
        })
})
routers.get('/delete',auth.checkLogin,function(req,res){
    var urlObj = url.parse(req.url, true);
    var query = urlObj.query;
    var id = query.id;
    articleModel.remove({_id:id},function(err,doc){
        if(!err){
            req.flash('success','删除成功')
            res.redirect('/')
        }
    })

})

routers.get('/update',auth.checkLogin,function(req,res){
    var urlObj = url.parse(req.url, true);
    var query = urlObj.query;
    var id = query.id;
    articleModel.findById(id)
        .populate('user')
        .exec(function(err,article){
            if(!err){
                res.render('article/update',{title: "修改文章", article: article});
            }else{
                console.log(err)
            }
        })
})
routers.post('/update',auth.checkLogin,  upload.single('poster'), function(req,res){
    var urlObj = url.parse(req.url, true);
    var query = urlObj.query;
    var id = query.id;
    //1.获取表单提交的文章信息
    var articleInfo = req.body;

    if(req.file){
        articleInfo.poster = '/uploads/'+req.file.filename
    }
    //设置修改文章的时间
    articleInfo.createAt = Date.now();

    //文章的作者
    articleInfo.user = req.session.user._id;

    //2.将文章保存到信息库里
    articleModel.update({_id:id},articleInfo,function(err,doc){
        if(!err){
            req.flash('success','用户更改文章成功')
            res.redirect('/')
        }else{
            req.flash('error','用户更改文章失败')
            res.redirect('back')
        }
    })
})
module.exports = routers;