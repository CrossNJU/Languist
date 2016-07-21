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
  follower_num: Number,
  following_num: Number,
  subscription_num: Number,
  public_gist_num: Number,
  public_repo_num: Number,
  location: String,
  blog: String,
  company: String,
  created_at: Date,
  star_repo_ids: [schema.Types.ObjectId],
  fork_repo_ids: [schema.Types.ObjectId]
});



//add instance methods
userSchema.methods.findSimilarTypes = function(fc) {
  return this.model('user').find({ type: this.type}, fc);
};

//make model and export
var user = mongoose.model('user', userSchema);
export default user;

//user.methods.findUsers = function(fc){
//    return find()
//};
