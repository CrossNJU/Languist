/**
 * Created by raychen on 16/9/14.
 */

//config and test
import {SUCCESS, FAIL, getUser, setUser} from './servers/config'
//services
import {saveUser, login, register} from './servers/service/LoginService';
import {getFlowListData, getCountData, getLangListData, getCoverData} from './servers/service/HomeService'
import {addLang, getAllLanguage, deleteLanguage} from './servers/service/LanguageService'
import {evaluateRecommend, getUserFollowings, getUserFollowers, getUserFollowingsAndFollowersNum, addFeedback, getUserStarRepo, getBestSubRepo, isLanguist} from './servers/service/UserService'
import {addAReopSet, addARepoToSet, getRepoSet, getRepoSetList, getRelatedRecommend, getRepoInfos, addMore, addInfoToList, getRepoLanguage} from './servers/service/RepoService'
import {record_log, getLog} from './servers/service/LogService'
//others
import {starRepo, followUser,unfollowUser, unstarRepo} from './servers/api/github_user'
import {searchRepo} from './servers/api/github_search'

function addRepoAPI(server) {
  //star repo
  server.get('/api/repo/star', (req, res)=> {
    starRepo(req.query.user, req.query.repo, resa => {
      if (resa == SUCCESS) {
        record_log(getUser(), getUser() + ' star repo: ' + req.query.repo + ' SUCCESS!', 'add');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' star repo: ' + req.query.repo + ' FAIL!', 'error');
        res.send({res: FAIL});
      }
    });
  });
  //unstar repo
  server.get('/api/repo/unstar', (req, res)=> {
    unstarRepo(req.query.user, req.query.repo, resa => {
      if (resa == SUCCESS) {
        record_log(getUser(), getUser() + ' unstar repo: ' + req.query.repo + ' SUCCESS!', 'del');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' unstar repo: ' + req.query.repo + ' FAIL!', 'error');
        res.send({res: FAIL});
      }
    });
  });
  //add a repo to a repo set
  server.get('/api/repo/addToSet', (req, res) => {
    addARepoToSet(req.query.login, req.query.fullname, req.query.setname, (resa) => {
      if (resa == SUCCESS) {
        record_log(getUser(), getUser() + ' add: ' + req.query.fullname + ' to the set: ' + req.query.setname + ' SUCCESS!', 'add');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' add: ' + req.query.fullname + ' to the set: ' + req.query.setname + ' FAIL!', 'error');
        res.send({res: resa});
      }
    })
  });
  //add a repo set
  server.get('/api/repo/addSet', (req, res) => {
    addAReopSet(req.query.login, req.query.setname, (resa) => {
      if (resa == SUCCESS) {
        record_log(getUser(), getUser() + ' add set: ' + req.query.setname + ' SUCCESS!', 'add');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' add set: ' + req.query.setname + ' SUCCESS!', 'error');
        res.send({res: resa});
      }
    });
  });
  //search repo
  server.get('/api/search/repo', (req, res) => {
    searchRepo(req.query.keyword, req.query.language, req.query.page, (resa) => {
      record_log(getUser(), getUser() + ' search repo: ' + req.query.q + ' and return: ' + resa.length + ' RECORDS', 'query');
      res.send(resa);
    })
  });
  //get set list
  server.get('/api/repo/setList', (req, res) => {
    getRepoSetList(req.query.user, (resa) => {
      record_log(getUser(), getUser() + ' get set list and return: ' + resa.length + ' RECORDS', 'query');
      res.send(resa);
    })
  });
  //get set
  server.get('/api/repo/set', (req, res) => {
    getRepoSet(req.query.user, req.query.setName, (resa) => {
      addInfoToList(req.query.user, resa, true, () => {
        record_log(getUser(), getUser() + ' get set: ' + req.query.setName + ' repos and return: ' + resa.length + ' RECORDS', 'query');
        res.send(resa);
      });
    })
  });
  //get recommend repo
  server.get('/api/repo/related', (req, res) => {
    getRelatedRecommend(req.query.fullName, (resa) => {
      addInfoToList(req.query.user, resa, true, () => {
        record_log(getUser(), getUser() + ' get repo: ' + req.query.fullName + ' related repo and return: ' + resa.length + ' RECORDS', 'query');
        res.send(resa);
      });
    })
  });
  //get repo infos
  server.get('/api/repo/info', (req, res) => {
    getRepoInfos(req.query.fullName, (resa) => {
      record_log(getUser(), getUser() + ' get repo: ' + req.query.fullName + ' info', 'query');
      res.send(resa);
    })
  });
  //get repo languages/tags
  server.get('/api/repo/languages', (req, res) => {
    getRepoLanguage(req.query.fullName, (resa) => {
      record_log(getUser(), getUser() + ' get repo: ' + req.query.fullName + ' languages and return: ' + resa.length + ' RECORDS', 'query');
      res.send(resa);
    })
  });
}

function addUserAPI(server) {
  //follow user
  server.get('/api/user/follow', (req, res)=> {
    followUser(req.query.user, req.query.follow, resa => {
      if (resa == SUCCESS) {
        record_log(getUser(), getUser() + ' follow user: ' + req.query.follow + ' SUCCESS!', 'add');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' follow user: ' + req.query.follow + ' SUCCESS!', 'error');
        res.send({res: FAIL});
      }
    });
  });
  //unfollow user
  server.get('/api/user/unfollow', (req, res)=> {
    unfollowUser(req.query.user, req.query.follow, resa => {
      if (resa == SUCCESS) {
        record_log(getUser(), getUser() + ' unfollow user: ' + req.query.follow + ' SUCCESS!', 'del');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' unfollow user: ' + req.query.follow + ' SUCCESS!', 'error');
        res.send({res: FAIL});
      }
    });
  });
  //get current user
  server.get('/api/current_user', (req, res) => {
    res.send(req.session.username);
  });
  //get temp user
  server.get('/api/temp_user', (req, res) => {
    res.send(req.session.tempname);
  });
  //get followings
  server.get('/api/user/following', (req, res) => {
    getUserFollowings(req.query.user, (resa) => {
      addInfoToList(req.query.user, resa, true, () => {
        record_log(getUser(), getUser() + ' get followings and return: ' + resa.length + ' RECORDS', 'query');
        res.send(resa);
      });
    })
  });
  //get followers
  server.get('/api/user/follower', (req, res) => {
    getUserFollowers(req.query.user, (resa) => {
      addInfoToList(req.query.user, resa, true, () => {
        record_log(getUser(), getUser() + ' get followers and return: ' + resa.length + ' RECORDS', 'query');
        res.send(resa);
      });
    })
  });
  //get followersNum and followingsNum (eg.{followings:1, followers:1})
  server.get('/api/user/folInfo', (req, res) => {
    getUserFollowingsAndFollowersNum(req.query.user, (resa) => {
      record_log(getUser(), getUser() + ' get followings and followers info', 'query');
      res.send(resa);
    })
  });
  //get anyone star repo
  server.get('/api/user/starRepo', (req, res)=> {
    getUserStarRepo(req.query.login, (resa) => {
      record_log(getUser(), getUser() + ' get star repos and return: ' + resa.length + ' RECORDS', 'query');
      res.send(resa);
    });
  });
  //get user most stared subscript repos
  server.get('/api/user/subRepo', (req, res)=> {
    getBestSubRepo(req.query.login, (resa) => {
      record_log(getUser(), getUser() + ' get subscribe repos and return: ' + resa.length + ' RECORDS', 'query');
      res.send(resa);
    });
  });
  //judge a person if he is languist
  server.get('/api/user/isLanguist', (req, res)=> {
    isLanguist(req.query.login, (resa) => {
      res.send({res: resa});
    });
  });
}

function addLoginAPI(server) {
  //login success
  server.get('/api/login/success', (req, res)=> {
    saveUser(req.query.code, (ress) => {
      if (ress != null) {
        req.session.tempname = ress;
        setUser(ress);
        record_log(getUser(), ress + ' sign up with github SUCCESS!', 'login');
        res.redirect('/register');
      }
      else {
        record_log(getUser(), ress + ' sign up with github FAIL!', 'error');
        res.redirect('/login');
      }
    });
  });
  //login
  server.get('/api/login', (req, res) => {
    login(req.query.username, req.query.password, (res2) => {
      if (res2 == SUCCESS) {
        setUser(req.query.username);
        req.session.username = req.query.username;
        record_log(getUser(), getUser() + ' login SUCCESS!', 'login');
        //console.log('session');
        //console.log(req.session.cookie.maxAge / 1000);
        res.send({res: SUCCESS});
      } else {
        record_log(getUser(), getUser() + ' login FAIL!', 'error');
        res.send({res: res2});
      }
    })
  });
  //register
  server.get('/api/register', (req, res) => {
    register(req.query.username, req.query.password, (res2) => {
      if (res2 == SUCCESS) {
        req.session.username = req.query.username;
        record_log(getUser(), getUser() + ' register SUCCESS!', 'login');
        res.send({res: SUCCESS});
      } else {
        res.send({res: res2});
        record_log(getUser(), getUser() + ' register FAIL!', 'error');
      }
    })
  });
  //logout
  server.get('/api/logout', (req, res) => {
    record_log(getUser(), getUser() + ' logout!', 'login');
    req.session.username = null;
    req.session.tempname = null;
    setUser(null);
    res.redirect('/login');
  });
}

function addOtherAPI(server) {
  //get recommend data
  server.get('/api/home/flowList', (req, res) => {
    getFlowListData(req.query.user, ret => {
      addInfoToList(req.query.user, ret, true, () => {
        record_log(getUser(), getUser() + ' get flowlist data and return: ' + ret.length + ' RECORDS', 'query');
        res.send(ret);
      });
    });
  });
  //home-count
  server.get('/api/home/count', (req, res) => {
    getCountData(req.query.user, call => {
      record_log(getUser(), getUser() + ' get home count info', 'query');
      res.send(call);
    });
  });
  //home-language list
  server.get('/api/home/langList', (req, res) => {
    getLangListData(req.query.user, call => {
      record_log(getUser(), getUser() + ' get home languages and return: ' + call.length + ' RECORDS', 'query');
      res.send(call);
    });
  });
  //home-cover
  server.get('/api/home/cover', (req, res)=> {
    getCoverData(req.query.user, call => {
      record_log(getUser(), getUser() + ' get home cover info', 'query');
      res.send(call);
    });
  });

  //evaluate the recommend
  server.get('/api/rec/evaluate', (req, res) => {
    evaluateRecommend(req.query.login, req.query.name, req.query.type, (resa) => {
      if (resa == SUCCESS) {
        record_log(getUser(), getUser() + ' dislike: ' + req.query.name + ' SUCCESS!', 'add');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' dislike: ' + req.query.name + ' FAIL!', 'error');
        res.send({res: FAIL});
      }
    })
  });
  //add more
  server.get('/api/recommend/more', (req, res) => {
    addMore(req.query.login, req.query.times, (resa) => {
      record_log(getUser(), getUser() + ' get more: ' + req.query.times + ' times recommend data and return: ' + resa.length + ' RECORDS', 'query');
      res.send(resa);
    })
  });
  //add feedback
  server.get('/api/feedback/add', (req, res)=> {
    addFeedback(req.query.login, req.query.feedback, (resa) => {
      if (resa == SUCCESS) {
        record_log(getUser(), getUser() + ' add feedback SUCCESS!', 'add');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' add feedback FAIL!', 'error');
        res.send({res: resa});
      }
    });
  });
}

function addLanguageAPI(server) {
  //choose/modify language
  server.get('/api/lang/choose', (req, res) => {
    addLang(req.query.login, req.query.lang, req.query.level, ret => {
      if (ret == SUCCESS) {
        record_log(getUser(), getUser() + ' choose language: ' + req.query.lang + ' SUCCESS!', 'add');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' choose language: ' + req.query.lang + ' FAIL!', 'error');
        res.send({res: FAIL});
      }
    });
  });
  //get all language
  server.get('/api/language/all', (req, res) => {
    getAllLanguage((langs) => {
      res.send(langs);
    })
  });
  //delete language
  server.get('/api/lang/delete', (req, res) => {
    deleteLanguage(req.query.login, req.query.lang, ret => {
      if (ret == SUCCESS) {
        record_log(getUser(), getUser() + ' delete language: ' + req.query.lang + ' SUCCESS!', 'del');
        res.send({res: SUCCESS});
      }
      else {
        record_log(getUser(), getUser() + ' delete language: ' + req.query.lang + ' FAIL!', 'error');
        res.send({res: FAIL});
      }
    });
  });
}

export {addLanguageAPI, addLoginAPI, addOtherAPI, addUserAPI, addRepoAPI}
