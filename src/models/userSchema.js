/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var userSchema = schema({
  name: String,
  language:{
    language_id: schema.Types.ObjectId,
    level: Number
  },
  application_id: [schema.Types.ObjectId],
  email: String,
  starred: Number,
  fork: Number,
  follower: Number,
  following: Number,
  star_repo_ids: [schema.Types.ObjectId],
  fork_repo_ids: [schema.Types.ObjectId]
});

//add instance methods
userSchema.methods.findSimilarTypes = function(fc) {
  return this.model('users').find({ type: this.type}, fc);
};

//make model and export
var user = mongoose.model('user', tagSchema);
export default user;
