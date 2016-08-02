/**
 * Created by raychen on 16/8/3.
 */
import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var global = schema({
  global_num: Number,
  current_user: String
});

//make model and export
var globalSchema = mongoose.model('global', global);
export {globalSchema};
