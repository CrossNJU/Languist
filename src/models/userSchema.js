/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var userSchema = schema({
  name: String
});

//add instance methods
userSchema.methods.findSimilarTypes = function(fc) {
  return this.model('users').find({ type: this.type}, fc);
};

//make model and export
var user = mongoose.model('user', tagSchema);
export default user;
