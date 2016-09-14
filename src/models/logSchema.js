/**
 * Created by raychen on 16/8/3.
 */
import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var log = schema({
  time: String,
  content: String,
  user: String,
  operation: String
});

//make model and export
var logSchema = mongoose.model('log', log);
export {logSchema};
