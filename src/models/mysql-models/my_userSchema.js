/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var my_user = schema({
  login: String,
  name: String,
  type: String,
  avatar_url: String,
  html_url: String,
  followers_count: Number,
  followings_count: Number,
  repo_score: Number,
  repo_star_count: Number,
  starred_count: Number,
  subscription_count: Number,
  public_gists: Number,
  public_repo: Number,
  email: String,
  location: String,
  blog: String,
  company: String,
  create_at: Number,
  score: Number,
  is_repo_fetched: Number,
  is_old: Number,
  is_star_fetched: Number,
  is_watch_fetched: Number

});

//make model and export
var my_userSchema = mongoose.model('my_user', my_user);
export {my_userSchema};

//user.methods.findUsers = function(fc){
//    return find()
//};
