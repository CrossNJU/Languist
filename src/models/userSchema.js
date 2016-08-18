/**
 * Created by raychen on 16/7/26.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var user = schema({
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
  star_num: Number,
  language: [{
    lang_name: String,
    lang_level: Number
  }],
  star_repos: [String],
  access_token: String,
  password: String,
  bio: String,
  blog: String,
  follower_login: [String],
  use_languages: [],
  repos: []
});

//make model and export
var userSchema = mongoose.model('user', user);
export {userSchema};
