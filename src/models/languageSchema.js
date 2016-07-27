/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var languageSchema = schema({
  language: String,
  repo_num: Number,
  user_num: Number,
  ranked_repo: [String],
  application_id: [ schema.Types.ObjectId]
});

//add instance methods
languageSchema.methods.findSimilarTypes = function(fc) {
  return this.model('languages').find({ type: this.type}, fc);
};

//make model and export
var language = mongoose.model('language', languageSchema);
export default language;
