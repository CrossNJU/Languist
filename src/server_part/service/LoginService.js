/**
 * Created by raychen on 16/7/15.
 */

import userSchema from '../../models/userSchema'
var superagent = require('superagent');

var getAccessURL = 'https://github.com/login/oauth/access_token';

export var saveUser = (code, callback) => {
  superagent
    .post(getAccessURL)
    .send({ client_id: 'd310933db63d64f563a0', client_secret: '82093b09a6840ed8fba314dd7089a7bb45e687fe', code: code})
    .set('Accept', 'application/json')
    .end(function(err, sres){
      if (err) {
        console.log('err: ' + err);
        return;
      }
      console.log(sres.body);
      let access_token = sres.body.access_token;
      superagent
        .get('https://api.github.com/user')
        .query({ access_token: access_token})
        .accept('json')
        .end((err, ssres) => {
          if (err){
            return console.log(err);
          }
          let json = JSON.parse(ssres.text);
          //console.log(ssres.text);
          //insert new users
          userSchema.findOne({ 'login': json.login }, function (err, person) {
            if (err) return console.error(err);
            if (person == null){
              let new_user = new userSchema({
                login: json.login,
                avatar_url: json.avatar_url,
                type: json.type,
                name: json.name,
                company: json.company,
                location: json.location,
                email: json.email,
                public_repos: json.public_repos,
                public_gists: json.public_gists,
                followers: json.followers,
                following: json.following,
                created_at: json.created_at,
                updated_at: json.updated_at,
                level: 0,
                language: []});
              new_user.save((err, res) => {
                if (err) return console.error(err);
                callback(res);
              })
            }else {
              callback(person);
            }
          });
        });
    });
};
