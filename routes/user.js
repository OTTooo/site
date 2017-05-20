var express = require('express');
var User = require('../models/model/user');
var router = express.Router();


//登录逻辑
router.post('/signin',function(req,res) {
  var _user = req.body.user;
  var name = _user.name;
  var password = _user.password;
  User.findOne({name:name},function(err,user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      return res.redirect('/signup')
    }
    user.comparePassword(password,function(err,isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        req.session.user = user;
        return res.redirect('/');
      }else {
        res.redirect('/signup')
      }
    })
  })
})
//登出逻辑
router.get('/logout',function(req,res) {
  delete req.session.user;
  delete res.locals.user;
  res.redirect('/');
})
//注册逻辑
router.post('/signup',function(req,res) {
  var _user = req.body.user;
  User.find({name:_user.name},function(err,user) {
    if (err) {
      console.log(err);
    }
    console.log(user);
    if (user.length > 0) {
      return res.redirect('/signin');
    }
    else {
      var user = new User(_user);
      user.save(function(err,user) {
        if (err) {
          console.log(err);
        }
        res.redirect('/admin/userlist');
      })
    }
  })

})

module.exports = router;
