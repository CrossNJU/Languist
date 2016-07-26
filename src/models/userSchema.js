/**
 * Created by raychen on 16/7/26.
 */
/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var userSchema = schema({
  login: String,
  level: Number,
  avatar_url: String,
  type: String,
  name: String,
  company: String,
  location: String,
  email: String,
  public_repos: Number,
  public_gists: Number,
  followers: Number,
  following: Number,
  created_at: String,
  updated_at: String,
  language: [{
    lang_name: String,
    lang_level: Number
  }]
});

//add instance methods

//make model and export
var userSchema = mongoose.model('user', userSchema);
export default userSchema;

//user.methods.findUsers = function(fc){
//    return find()
//};
