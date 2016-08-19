/**
 * Created by raychen on 16/8/18.
 */

import mongoose from 'mongoose'
var schema =  mongoose.Schema;

//add schema
var repo = schema({
  full_name: String,
  stars_count: Number,
  languages: [String],
  star_users: [String]
});

//make model and export
var test_repoSchema = mongoose.model('test_repo', repo);
export {test_repoSchema};
