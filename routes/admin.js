var express = require('express');
var Movie = require('../models/model/movie');
var User = require('../models/model/user');
var router = express.Router();
//拥有管理员权限才能进入的页面路由

router.all('*',[signinRequired,adminRequired])
//后台电影录入页  渲染admin
router.get('/movie',function(req,res) {
  res.render('admin',{
    title:'后台电影录入页',
    movie:{
      title:'',
      doctor:'',
      country:'',
      year:'',
      poster:'',
      flash:'',
      summary:'',
      language:''
    }
  })
})
//后台电影录入页中的录入按钮  重定向到/movie/:id  渲染detail
router.post('/movie/new',function(req,res) {
  console.log(req.body);
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  console.log("1111",id);
  //提交过来的数据先判断数据库里面有没有这条数据
  if (id) {
    //数据里存在这条数据，需要进行更新
    Movie.findById(id,function(err,movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie,movieObj);
      // Movie.findOneAndRemove({_id:id})
      // console.log('good');
      _movie.save(function(err,movie) {
        if (err) {
          console.log(err);
        }
        console.log('111');
        res.redirect('/movie/' + movie._id);
      })
    })
  }else {
    _movie = new Movie({
      doctor:movieObj.doctor,
      title:movieObj.title,
      country:movieObj.country,
      language:movieObj.language,
      year:movieObj.year,
      poster:movieObj.poster,
      summary:movieObj.summary,
      flash:movieObj.flash
    })
    _movie.save(function(err,movie) {
      if (err) {
        console.log(err);
      }
      console.log('222');
      //movie._id是数据库中的_id
      res.redirect('/movie/' + movie._id);
    })
  }
})
//后台电影列表页  渲染list
router.get('/movie/list',function(req,res) {
  Movie.fetch(function(err,movies) {
    if(err){
      console.log(err);
    }
    res.render('list',{
      title:'后台电影列表页',
      movies:movies
    })
  })
})
//后台电影列表页中的更新按钮  渲染admin
router.get('/movie/update/:id',function(req,res) {
  var id = req.params.id;
  if (id) {
    Movie.findById(id,function(err,movie) {
      res.render('admin',{
        title:'后台更新页',
        movie:movie
      })
    })
  }
})
//后台电影列表页中的删除按钮
router.delete('/movie/list/',function(req,res) {
  var id = req.query.id;
  if (id) {
    Movie.remove({_id:id},function(err,movie) {
      if (err) {
        console.log(err);
      }else {
        res.json({success:1})
      }
    })
  }
})

//后台用户列表页
router.get('/user/list',function(req,res) {
  User.fetch(function(err,users) {
    if(err){
      console.log(err);
    }
    res.render('userlist',{
      title:'后台用户列表页',
      users:users
    })
  })
})



function signinRequired(req,res,next) {
  var user = req.session.user;
  if (!user) {
    return res.redirect('/signin');
  }
  next();
}

function adminRequired(req,res,next) {
  var user = req.session.user;
  if(user.role <= 10){
    return res.redirect('/signin');
  }
  next();
}

module.exports = router;
