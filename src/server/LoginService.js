/**
 * Created by raychen on 16/7/15.
 */

var superagent = require('superagent');

var getAccessURL = 'https://github.com/login/oauth/access_token';

export var getApi = (req, res) => {
  superagent
    .post(getAccessURL)
    .send({ client_id: 'd310933db63d64f563a0', client_secret: '82093b09a6840ed8fba314dd7089a7bb45e687fe', code: req.query.code})
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
            res.send(err);
          }
          let json = JSON.parse(ssres.text);
          res.send(ssres.text);
        });
    });
};
