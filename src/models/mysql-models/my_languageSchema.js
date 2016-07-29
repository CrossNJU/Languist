/**
 * Created by raychen on 16/7/28.
 */
import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var my_language = schema({
  language: String,
  repo_num: Number,
  user_num: Number,
  score: Number,
  wiki: String,
  wiki_url: String,
  hw: String
});

//make model and export
var my_languageSchema = mongoose.model('my_language', my_language);
export {my_languageSchema};
