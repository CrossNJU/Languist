/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var applicationSchema = schema({
  name: String
});

//add instance methods
applicationSchema.methods.findSimilarTypes = function(fc) {
  return this.model('applications').find({ type: this.type}, fc);
};

//make model and export
var application = mongoose.model('application', applicationSchema);
export default application;
