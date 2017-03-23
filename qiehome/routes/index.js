var express = require('express');
var router = express.Router();
var articleModel = require('../mongodb/db').articleModel

var markdown = require('markdown').markdown
/* GET home page. */

router.get('/', function(req, res, next) {

    var query = {};//到数据库中查找文章的条件
    var keyword = req.query.keyword;//搜索提交的关键字
    if (keyword){ //提交搜索的表单
        req.session.keyword = keyword; //将搜索关键字保存到session中
        //文章  标题或者内容包含keyword关键字即可
        var reg = new RegExp(keyword, 'i');//创建正则
        query = {$or: [{title: reg}, {content: reg}]};
    }

    var pageNum = parseInt(req.query.pageNum) || 1;
    var pageSize = parseInt(req.query.pageSize) || 6;

    articleModel.find(query)
        .skip((pageNum-1)*pageSize)
        .limit(pageSize)
        .populate('user')
        .exec(function(err,articles){
            if(!err){
                req.flash('success','获取文章列表成功')
                articles.forEach(function(article,index){
                    article.content = markdown.toHTML(article.content)
                })

                articleModel.count(query, function (err, count) {
                    if(!err){
                        res.render('index', {
                            title: '首页标题',
                            articles: articles,
                            keyword: keyword, //渲染模版引擎文件
                            pageNum: pageNum,  //页数
                            pageSize: pageSize,   //一页显示多少条
                            totalPage: Math.ceil(parseInt(count)/pageSize)
                        })
                    }else{
                        req.flash('error','获取总条数失败')
                        res.redirect('back')
                    }
                })

            }else{
              req.flash('error','获取文章列表失败')
              res.redirect('back')
            }
        })
})
module.exports = router;