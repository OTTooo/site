var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
  doctor:String,
  title:String,
  language:String,
  country:String,
  summary:String,
  flash:String,
  poster:String,
  year:Number,
  meta:{
    createAt: {
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  }
})
//每次存储数据，都需要调用pre方法
MovieSchema.pre('save',function(next) {
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else {
    this.meta.updateAt = Date.now()
  }
  next();
})

//实例化之后才具有这个方法
MovieSchema.statics = {
  fetch:function(cb) {
    return this.find()
               .sort('meta.updateAt')
               .exec(cb)
  },
  findById:function(id,cb) {
    return this.findOne({_id:id})
               .exec(cb)
  }
}
module.exports = MovieSchema;
