/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var userSchema = schema({
  login: String,
  name: String,
  type: String,
  avatar_url: String,
  html_url: String,
  language:[{
    language_id: schema.Types.ObjectId,
    level: Number
  }],
  application_id: [schema.Types.ObjectId],
  email: String,
  star_num: Number,
  starred_num: Number,
  fork_num: Number,
  followers_num: Number,
  followings_num: Number,
  subscription_num: Number,
  public_gist_num: Number,
  public_repo_num: Number,
  location: String,
  blog: String,
  company: String,
  created_at: Date,
  star_repo_ids: [schema.Types.ObjectId],
  fork_repo_ids: [schema.Types.ObjectId],
  star_repo_fullname: [String],
  is_done: Boolean
});

//add instance methods
userSchema.methods.findSimilarTypes = function(fc) {
  return this.model('github_user').find({ type: this.type}, fc);
};

//make model and export
var github_userSchema = mongoose.model('github_user', userSchema);
export default github_userSchema;

//user.methods.findUsers = function(fc){
//    return find()
//};
