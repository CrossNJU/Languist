/**
 * Created by chendanni on 16/7/19.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var tagSchema = schema({
  name: String
});

//add instance methods
tagSchema.methods.findSimilarTypes = function(fc) {
  return this.model('tags').find({ type: this.type}, fc);
};

//make model and export
var tag = mongoose.model('tag', tagSchema);
export default tag;
