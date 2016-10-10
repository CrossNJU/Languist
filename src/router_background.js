/**
 * Created by raychen on 16/9/14.
 */

import {reloadUser} from './servers/service/UserService'
import {getLog} from './servers/service/LogService'
import {getAllUserInfo, getUserInfo} from './servers/service/BackService'
import {
  getRelatedRecommend,
  getRepoLanguage
} from './servers/service/RepoService'
import {logger} from './servers/config'
var async = require('async');

function addTestApi(server) {
  server.get('/api/test/session', (req, res)=> {
    //console.log('cookie time: ');
    res.send({res: req.session.cookie.expires});
  });
  server.get('/api/test/reload', (req, res) => {
    //console.log('in');
    reloadUser(req.query.user, ()=> {
      res.send({res: 1});
    })
  });
  server.get('/api/test/null', (req, res) => {
    if (req.query.user !== undefined) res.send(req.query.user);
    else res.send('undefined');
  });
}

function addAdministerApi(server) {
  server.get('/api/admin/log/get', (req, res) => {
    getLog(req.query.user, req.query.op, req.query.begin, req.query.end, (ans) => {
      res.send(ans);
    })
  });
  server.get('/api/admin/user', (req, res) => {
    if (req.query.login === undefined) {
      getAllUserInfo((resa) => {
        res.send(resa)
      });
    } else {
      getUserInfo(req.query.login, (resa)=> {
        res.send(resa);
      });
    }
  });
}

function addPluginApi(server) {
  server.get('/api/plugin/test', (req, res) => {
    res.send({
      titile: "github",
      author: "raychen",
      postDate: "1996-01-08",
      firstAccess: "1000-01-01"
    });
  });
  server.get('/api/plugin/related', (req, res) => {
    logger.info('plugin request to get data');
    getRelatedRecommend(req.query.fullName, async (resa) => {
      let met = [];
      for (let i = 0; i < resa.length; i++) {
        met.push((call) => {
          getRepoLanguage(resa[i].full_name, (lang) => {
            logger.debug('finish get language for: ' + resa[i].full_name);
            resa[i].tags = lang;
            call(null, 'donelang!')
          });
        })
      }
      async.parallel(met, (err, ress) => {
        logger.debug(ress);
        res.send(resa);
      })
    })
  });
}

export {addTestApi, addAdministerApi, addPluginApi}
