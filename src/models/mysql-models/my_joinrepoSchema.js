/**
 * Created by raychen on 16/7/28.
 */
import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var my_joinrepo = schema({
  id: Number,
  user_login: String,
  repo_full_name: String
});

//make model and export
var my_joinrepoSchema = mongoose.model('my_joinrepo', my_joinrepo);
export {my_joinrepoSchema};
