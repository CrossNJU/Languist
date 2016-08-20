/**
 * Created by raychen on 16/7/26.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var user = schema({
  login: String,
  level: Number,
  access_token: String,
  password: String,
  language: [{
    lang_name: String,
    lang_level: Number
  }]
});

//make model and export
var userSchema = mongoose.model('user', user);
export {userSchema};
