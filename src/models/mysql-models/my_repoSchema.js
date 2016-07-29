/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var my_repo = schema({
  full_name: String,
  description: String,
  url: String,
  clone_url: String,
  subscribers_count: Number,
  forks_count: Number,
  stars_count: Number,
  contributors_count: Number,
  collaborators_count: Number,
  pullrequests_count: Number,
  issues_count: Number,
  size: Number,
  updated_at: Number,
  created_at: Number,
  language: String,
  score: Number,
  is_language_fetched: Number,
  is_contributor_fetched: Number,
  is_collaborator_fetched: Number,
  is_pullrequest_fetched: Number,
  is_punch_fetched: Number,
  is_issue_fetched: Number,
  is_awe: Number,
  is_watcher_fetched: Number
});

//make model and export
var my_repoSchema = mongoose.model('my_repo', my_repo);
export {my_repoSchema};
