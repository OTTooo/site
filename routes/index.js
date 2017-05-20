var express = require('express');
var Movie = require('../models/model/movie');
var router = express.Router();

//首页  渲染index
router.get('/',function(req,res) {
  Movie.fetch(function(err,movies) {
    if(err){
      console.log(err);
    }
    res.render('index',{
      title:'首页',
      movies:movies
    })
  })
})
//登录页面  渲染signin
router.get('/signin',function(req,res) {
  res.render('signin',{
    title:'登录页面'
  })
})
//注册页面  渲染signup
router.get('/signup',function(req,res) {
  res.render('signup',{
    title:'注册页面'
  })
})

module.exports = router;
