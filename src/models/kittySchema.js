/**
 * Created by raychen on 16/7/14.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var kittySchema = schema({
  name: String,
  type: String
});

//add instance methods
kittySchema.methods.findSimilarTypes = function(fc) {
  return this.model('kitten').find({ type: this.type}, fc);
};

//make model and export
var kitten = mongoose.model('kitten', kittySchema);
export default kitten;
