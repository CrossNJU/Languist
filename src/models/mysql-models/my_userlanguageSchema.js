/**
 * Created by raychen on 16/7/28.
 */
import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var my_userlanguage = schema({
  id: Number,
  user_login: String,
  language: String
});

//make model and export
var my_userlanguageSchema = mongoose.model('my_userlanguage', my_userlanguage);
export {my_userlanguageSchema};
