/**
 * Created by raychen on 16/7/28.
 */
import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var my_joinlanguage = schema({
  id: Number,
  repo_full_name: String,
  language: String,
  size: Number,
  year: Number,
  is_done: Boolean
});

//make model and export
var my_joinlanguageSchema = mongoose.model('my_joinlanguage', my_joinlanguage);
export {my_joinlanguageSchema};
