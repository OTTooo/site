var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;//计算强度，默认值是10


var UserSchema = new Schema({
  name:{
    unique:true,
    type:String
  },
  password:String,
  role:{
    type:Number,
    default:0
  },
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
});
//每次存储数据，都需要先调用pre方法，然后调用next,执行app.js对于逻辑
UserSchema.pre('save',function(next){
  this.meta.createAt = Date.now();
  this.meta.updateAt = Date.now();
  //生成一个随机的盐，第一个参数代表计算强度，计算强度越大，攻击者建立彩虹表就越困难，破解就越困难，在回调方法里面能拿到生成的盐
  bcrypt.genSalt(SALT_WORK_FACTOR,(err,salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(this.password,salt,(err,hash) => {
      if (err) {
        return next(err);
      }
      this.password = hash;
      next();
    })
  })
})
//添加实例方法
UserSchema.methods = {
  comparePassword:function(_password,cb) {
    bcrypt.compare(_password,this.password,function(err,isMatch) {
      if (err) {
        return cb(err);
      }
      cb(null,isMatch);
    })
  }
}
//实例化之后才具有这个方法
UserSchema.statics = {
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
module.exports = UserSchema;
