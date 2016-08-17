/**
 * Created by raychen on 16/8/17.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var userSchema = schema({
  login: String,
  level: Number,
  company: String,
  location: String,
  email: String,
  public_repos: Number,
  public_gists: Number,
  followers: Number,
  following: Number,
  created_at: String,
  updated_at: String,
  star_num: Number,
  language: [{
    lang_name: String,
    lang_level: Number
  }],
  star_repos: [String],
  access_token: String,
  password: String
});

//make model and export
var userSchema = mongoose.model('user', userSchema);
export {userSchema};
