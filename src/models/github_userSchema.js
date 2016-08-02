/**
 * Created by raychen on 16/7/28.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var github_user = schema({
  login: String,
  name: String,
  type: String,
  avatar_url: String,
  html_url: String,
  followers_count: Number,
  followings_count: Number,
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
  repos: [String],
  languages: [String]
});

//make model and export
var github_userSchema = mongoose.model('github_user', github_user);
export {github_userSchema};