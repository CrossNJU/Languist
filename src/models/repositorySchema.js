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
  collaborators_num: Number,
  issue_num: Number,
  language_id: [schema.Types.ObjectId],
  main_language: String,
  application_id: [schema.Types.ObjectId],
  description: String,
  url: String,
  create_time: Date,
  update_time: Date,
  tags: [String],
  avatar_url: String
});

//add instance methods
repositorySchema.methods.findSimilarTypes = function(fc) {
  return this.model('repos').find({ type: this.type}, fc);
};

//make model and export
var repo = mongoose.model('repo', repositorySchema);
export default repo;
