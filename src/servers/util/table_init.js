/**
 * Created by raychen on 16/8/16.
 */

import {userSchema} from '../../models/userSchema'
import {connect} from '../config'

function addOneToUser(){
  let condition = {login: "test"};
  let update = {
    $set: {
      login: "test",
      language: [{lang_name: "Java", lang_level: 2}],
      star_repos: ["test_repo", "test2"]
    }
  };
  let option = {upsert: true};
  userSchema.update(condition, update, option, (err, res) => {
    console.log(res);
  });
}

function modifyUser(){
  let condition = {login: "RickChem"};
  let update = {
    $set: {
      language: [{lang_name: "Java", lang_level: 2}]
    }
  };
  userSchema.update(condition, update, (err, res) => {
    console.log(res);
  });
}

connect();
modifyUser();
