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
  //0-user, 1-repo, 2-lang
  //1-un rec, 0-today, -1-last day...
  //0-null, 1-like, -1-dislike
  recommend: [{
    m_name: String,
    m_type: Number,
    m_date: Number,
    m_like: Number
  }],
  rec_date: String
});

//make model and export
var userSchema = mongoose.model('user', user);
export {userSchema};
