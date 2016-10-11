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
import {searchPopularRepo} from './servers/api/github_search'
import {getRepoLanguages} from './servers/api/github_repo'
import {logger} from './servers/config'
import {
  transTime
} from './servers/util/timeUtil'
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
      logger.error('in to get lang');
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
  server.get('/api/plugin/newtab', (req, res) => {
    logger.info('plugin request to get newtab data');
    let langs = ['Java', 'Ruby', 'Perl', 'Go', 'C++', 'C', 'Objective-C', 'Python', 'CSS', 'HTML', 'JavaScript', 'Shell', 'R', 'CoffeeScript', 'Scala', 'C#'];
    let index = parseInt(Math.random() * langs.length);
    searchPopularRepo("", langs[index], parseInt(Math.random() * 4), (ans) => {
      logger.debug('get newtab data');
      let met = [], rets = [];
      for (let i = 0; i < ans.length; i++) {
        met.push((call) => {
          getRepoLanguages(ans[i].full_name, (lang) => {
            logger.debug('finish get language for: ' + ans[i].full_name);
            rets.push({
              type: 'repo',
              avatarUrl: ans[i].owner.avatar_url,
              owner: ans[i].owner.login,
              description: ans[i].description,
              tags: lang,
              update: transTime(ans[i].updated_at),
              star: ans[i].stars_count,
              full_name: ans[i].full_name
            });
            call(null, 'done search!')
          });
        })
      }
      async.parallel(met, (err, ress) => {
        logger.debug(ress);
        res.send(rets);
      });
    })
  });
}

export {addTestApi, addAdministerApi, addPluginApi}
