/**
 * Created by raychen on 16/7/20.
 */

//import {getUserStarred} from './User_github';
var github = require('octonode');
var client = github.client();

let test_code = 0;

switch (test_code){
  case 0: {
    client.get('users/mattdesl/starred', {page:1}, function (err, status, body, headers) {
      let full_name_array = [];
      for (let i=0;i<body.length;i++){
        let json = body[i];
        full_name_array[i] = json.full_name;
      }
      console.log(full_name_array); //json object
    });
  }break;

  case 1: {
    var user = client.user('RickChem');
    var me = client.me();

    me.starred((err, data, header) => {
      console.log('err: '+ err);
      console.log('data: '+ JSON.stringify(data));
      console.log('header: '+ header);
    });
  }break;

  case 2:{
    let t = getUserStarred('mattdesl');
    console.log(t);
  }
}

