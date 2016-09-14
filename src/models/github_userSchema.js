/**
 * Created by raychen on 16/7/28.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var github_user = schema({
  login: String,
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
  bio: String,
  blog: String,
  followings_login: [String],
  use_languages: [],
  star_repos: [String],
  repos: [],
  joinRepos: [],
  joinRepo_count: Number,
  star_repo_all: Number,
  join_repo_all: Number
});

//make model and export
var github_userSchema = mongoose.model('github_user', github_user);
export {github_userSchema};
