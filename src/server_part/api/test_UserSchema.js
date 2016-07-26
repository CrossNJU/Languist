/**
 * Created by raychen on 16/7/21.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var userSchema = schema({
  login: String,
  send: [String],
  is_done: Boolean
});

//add instance methods
//kittySchema.methods.findSimilarTypes = function(fc) {
//  return this.model('kitten').find({ type: this.type}, fc);
//};

//make model and export
var user = mongoose.model('user', userSchema);
export default user;
