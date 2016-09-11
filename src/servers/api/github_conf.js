/**
 * Created by raychen on 16/7/22.
 */

import {userSchema} from '../../models/userSchema'
import {connect} from '../config'

var github = require('octonode');
var client = github.client();

function setClient(access_token){
  client = github.client(access_token);
}

function getClient(){
  return client;
}

export {setClient, getClient}

//connect();
//userSchema.findOne({login:'ChenDanni'}, (err, user) => {
//  setClient(user.access_token);
//  console.log(user.access_token);
//  client.limit(function (err, left, max) {
//    console.log(left); // 4999
//    console.log(max);  // 5000
//  });
//});
