var express = require('express');
var router = express.Router();

var userModel = require('../mongodb/db').userModel

var md5 = require('../md5/md5')

//权限控制
var auth = require('../middleware/auth')

//app.use(bodyParser())
/* GET user listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


//注册
router.get('/reg', auth.checkNotLogin, function (req, res) {
    res.render('user/reg', {title:"用户注册", content: '注册页内容'});
});
//用户注册表单提交
router.post('/reg', auth.checkNotLogin, function(req,res){
    //1.获取表单提交的内容
    var userInfo = req.body;
  //console.log(userInfo)
    //2.保存到数据库中
    userInfo.password = md5(userInfo.password)
    userInfo.avatar = 'https://secure.gravatar.com/avatar/'+userInfo.email+'?s=48'
    //需求：用户名和密码不能和数据库中的数据完全一样
    var query = {username:userInfo.username,password:userInfo.password};
    userModel.findOne(query,function(err,doc){
        if(!err){
            if(doc){
                //console.log('该用户已存在，请重新输入')
                req.flash('error','该用户已存在，请重新注册')
                res.redirect('back')
            }else{
                userModel.create(userInfo,function(err,doc){
                    if(!err){
                        //console.log('用户注册成功')
                        req.flash('success','用户注册成功')
                        res.redirect('/user/login')
                    }else{
                        //console.log('用户登录失败')
                        req.flash('error','用户注册失败')
                        res.redirect('back')
                    }
                })
            }
        }else{
          console.log('查询数据库失败')
            req.flash('error','查询数据库失败')
          res.redirect('back')
        }
    })
})
//登陆
router.get('/login', auth.checkNotLogin, function (req, res) {
    res.render('user/login', {title:"用户登陆", content: '登陆页内容'})
});
//登录表单提交请求处理
router.post('/login', auth.checkNotLogin, function(req,res){
    //1.获取登录信息
    var userInfo = req.body
    userInfo.password = md5(userInfo.password)
    //2.数据库中查找该用户的注册信息
    userModel.findOne(userInfo,function(err,doc){
        if(!err){//成功
            if(doc){//doc不为空
                console.log('该用户登陆成功')
                req.flash('success','用户登陆成功')
                //_id:主键（外键 populate）
                req.session.user = doc//将用户登陆的信息保存到session中
                res.redirect('/')
            }else{//doc为空
                //console.log('当前用户没有注册，请先注册')
                req.flash('error','当前用户没有注册，请先注册')
                res.redirect('/user/reg')
            }
        }else{//失败
            //console.log('数据库中查找用户信息失败')
            req.flash('error','数据库中查找用户信息失败')
            res.redirect('back')
        }
    })
})
//退出
router.get('/logout', auth.checkLogin, function (req, res) {
    req.session.user = null;
    req.flash('success','成功退出')
    res.redirect('/');
});



module.exports = router;
