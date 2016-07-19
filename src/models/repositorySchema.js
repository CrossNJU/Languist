/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var repositorySchema = schema({
  fullname: String,
  owner: String,
  star: Number,
  fork: Number,
  view: Number,
  language_id: [schema.Types.ObjectId],
  application_id: [schema.Types.ObjectId],
  description: String,
  url: String,
  createTime: Date,
  updateTime: Date,
  tag: [schema.Types.ObjectId],
  avatar_url: String

});

//add instance methods
repositorySchema.methods.findSimilarTypes = function(fc) {
  return this.model('repositories').find({ type: this.type}, fc);
};

//make model and export
var repository = mongoose.model('repository', repositorySchema);
export default repository;
