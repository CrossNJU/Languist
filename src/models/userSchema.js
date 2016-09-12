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
  star_repos: [String],
  followers: [String],
  followings: [String],
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
  }],
  rec_date: String,
  repo_sets: [{
    set_name: String,
    set_repos: [String]
  }],
  now_recommend:[{
    m_name: String,
    m_type: Number
  }],
  dislike:[{
    m_name: String,
    m_type: Number
  }],
  feedback: [String]
});

//make model and export
var userSchema = mongoose.model('user', user);
export {userSchema};
