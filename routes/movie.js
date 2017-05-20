var express = require('express');
var Movie = require('../models/model/movie');
var  router = express.Router();

//电影详情页  渲染detail
router.get('/:id',function(req,res) {
  var id = req.params.id;
  Movie.findById(id,function(err,movie) {
    console.log(movie);
    res.render('detail',{
      title:'电影详情页',
      movie:movie
    })
  })
})

module.exports = router;
