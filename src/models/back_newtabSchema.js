/**
 * Created by raychen on 16/7/28.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var newtab = schema({
  type: String,
  avatarUrl: String,
  owner: String,
  description: String,
  tags: [],
  update: String,
  star: Number,
  full_name: String,
  from: String
});

//make model and export
var back_newtabSchema = mongoose.model('newtab', newtab);
export {back_newtabSchema};
