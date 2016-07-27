/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var repositorySchema = schema({
  fullname: String,
  owner: String,
  star_num: Number,
  fork_num: Number,
  view_num: Number,
  subscriber_num: Number,
  contributor_num: Number,
  collaborator_num: Number,
  issue_num: Number,
  description: String,
  url: String,
  create_time: Date,
  update_time: Date,
  avatar_url: String,
  tags: [String],
  application_id: [schema.Types.ObjectId],
  language_id: [schema.Types.ObjectId],
  main_language: String
});

//add instance methods
repositorySchema.methods.findSimilarTypes = function(fc) {
  return this.model('github_repo').find({ type: this.type}, fc);
};

//make model and export
var repoSchema = mongoose.model('github_repo', repositorySchema);
export default repoSchema;
