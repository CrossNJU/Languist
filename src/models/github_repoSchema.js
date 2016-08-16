/**
 * Created by raychen on 16/7/28.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var repo = schema({
  full_name: String,
  owner: String,
  owner_avatar_url: String,
  description: String,
  url: String,
  clone_url: String,
  subscribers_count: Number,
  forks_count: Number,
  stars_count: Number,
  contributors_count: Number,
  contributors: [String],
  collaborators_count: Number,
  collaborators: [String],
  pullrequests_count: Number,
  issues_count: Number,
  size: Number,
  updated_at: String,
  created_at: String,
  main_language: String,
  languages: [String]
});

//make model and export
var github_repoSchema = mongoose.model('github_repo', repo);
export {github_repoSchema};
