module.exports.checkLogin = function(req,res,next){
    if(req.session.user){
        next()
    }else{
        req.flash('error','当前用户未登录，不能执行此操作，请先登录')
        res.redirect('/user/login')
    }
}

module.exports.checkNotLogin = function(req,res,next){
    if(req.session.user){
        req.flash('error','当前用户未登录，不能执行此操作，请先登录')
        req.redirect('/')
    }else{
        next()
    }
}