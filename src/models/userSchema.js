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
  }],
  recommend: [{
    name: String,
    //0-user, 1-repo, 2-lang
    type: Number,
    //1-un rec, 0-today, -1-last day...
    date: Number,
    //0-null, 1-like, -1-dislike
    like: Number
  }],
  rec_date: String
});

//make model and export
var userSchema = mongoose.model('user', user);
export {userSchema};
