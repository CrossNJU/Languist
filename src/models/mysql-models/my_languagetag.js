/**
 * Created by raychen on 16/8/16.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var my_languagetag = schema({
  id: Number,
  tag_name: String,
  language: String,
  is_app: Number
});

//make model and export
var my_languagetagSchema = mongoose.model('my_languagetag', my_languagetag);
export {my_languagetagSchema};
