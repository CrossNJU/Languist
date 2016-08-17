/**
 * Created by raychen on 16/7/28.
 */
import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var language = schema({
  language: String,
  repo_num: Number,
  user_num: Number,
  ranked_repo: [String],
  tags: [String],
  wiki: String
});

//make model and export
var languageSchema = mongoose.model('language', language);
export {languageSchema};
