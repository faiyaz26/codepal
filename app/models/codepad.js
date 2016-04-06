var mongoose = require('mongoose');
var Schema          = mongoose.Schema;
var CreateUpdatedAt = require('mongoose-timestamp');
var shortid = require('short-id-gen')
var randomstring = require("randomstring")

var CodePad = new Schema({
  _id :{
      type: String,
      unique: true,
      'default': randomstring.generate(6)
  },
  language : {
      type : Number,
      min : 0,
      max : 5,
      required: true,
      'default' : 0
  },
  code : {
      type : String,
      'default' : ''
  },
  editKey : {
      type : String,
      'default' : shortid.generate(10)
  }
});

CodePad.plugin(CreateUpdatedAt);

CodePad.statics = {
  /**
   * Find codepad by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id }).exec(cb)
  }
}

module.exports = mongoose.model('CodePad', CodePad)
