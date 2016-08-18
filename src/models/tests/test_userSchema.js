/**
 * Created by raychen on 16/8/18.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var test_user = schema({
  login: String,
  public_repos: Number,
  following: Number,
  star_num: Number,
  languages: [{
    lang_name: String,
    lang_level: Number
  }],
  star_repos: [String],
  followings_login: [String],
  repos: []
});

//make model and export
var test_userSchema = mongoose.model('test_user', test_user);
export {test_userSchema};
