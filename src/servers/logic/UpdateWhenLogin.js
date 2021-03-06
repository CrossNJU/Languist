/**
 * Created by raychen on 16/9/5.
 */

import {
  userSchema
} from '../../models/userSchema'
import {
  github_repoSchema
} from '../../models/github_repoSchema'
import {
  github_userSchema
} from '../../models/github_userSchema'
import {
  getUserInfo,
  getUserStarred,
  getPublicRepos,
  addAnewUser,
  getFollowings,
  addAnewGitHubUser,
  getJoinRepos,
  getFollowers
} from '../api/github_user'
import {
  getRepoInfo,
  getRepoLanguages,
  getContributors,
  getStarredUsers,
  addNewRepo
} from '../api/github_repo'
import {
  setSignal,
  setSignal_init,
  connect,
  setSignal_login_wait,
  logger
} from '../config'
import {
  record_log
} from '../service/LogService'

var async = require("async");
var get_size = 8;
var run1 = true,
  run2 = true,
  run3 = false,
  run4 = true,
  run5 = true,
  run6 = false,
  run7 = true;

/*-------------------- update part -------------------------- */

function getLoginFromContributors(array) {
  let ret = [];
  for (let i = 0; i < array.length; i++) {
    ret.push(array[i].login);
  }
  return ret;
}

function updateRepoCons(fullname, callback) {
  github_repoSchema.findOne({
    full_name: fullname
  }, (err, repo) => {
    if (repo.contributors.length == 0) {
      getContributors(fullname, 1, [], get_size, (ret2) => {
        var conditions2 = {
          full_name: fullname
        };
        var update2 = {
          $set: {
            contributors_count: ret2.length,
            contributors: ret2
          }
        };
        github_repoSchema.update(conditions2, update2, (err, res2) => {
          //console.log("update repo: " + fullname + " cons!");
          //console.log(res2);
          callback(getLoginFromContributors(ret2));
        });
      })
    } else callback(getLoginFromContributors(repo.contributors));
  });
}

function updateRepoStar(fullname, callback) {
  github_repoSchema.findOne({
    full_name: fullname
  }, (err, repo) => {
    if (repo.starers.length == 0) {
      getStarredUsers(fullname, 1, [], get_size, (ret2) => {
        var conditions2 = {
          full_name: fullname
        };
        var update2 = {
          $set: {
            starers: ret2
          }
        };
        github_repoSchema.update(conditions2, update2, (err, res2) => {
          //console.log("update repo: " + fullname + " starers!");
          //console.log(res2);
          callback(ret2);
        });
      });
    } else callback(repo.starers);
  });
}

function updateUserStars(login, is_insert, callback) {
  github_userSchema.findOne({
    login: login
  }, (err, user) => {
    //console.log(login);
    if (user.star_repos.length == 0) {
      getUserStarred(login, 1, [], is_insert, get_size, (ret) => {
        var conditions = {
          login: login
        };
        var update = {
          $set: {
            star_num: ret.length,
            star_repos: ret
          }
        };
        github_userSchema.update(conditions, update, (err, res2) => {
          //console.log("update user: " + login + " star repos!");
          //console.log(res2);
          callback(ret);
        });
      });
    } else callback(user.star_repos);
  });
}

function updateUserRepos(login, is_insert, callback) {
  github_userSchema.findOne({
    login: login
  }, (err, user) => {
    if (user.repos.length == 0) {
      getPublicRepos(login, 1, [], is_insert, get_size, (ret) => {
        var conditions = {
          login: login
        };
        var update = {
          $set: {
            repos: ret
          }
        };
        github_userSchema.update(conditions, update, (err, res2) => {
          //console.log("update user: " + login + " repos!");
          //console.log(res2);
          callback(ret);
        });
      });
    } else callback(user.repos);
  });
}

function updateUserFollowing(login, callback) {
  github_userSchema.findOne({
    login: login
  }, (err, user) => {
    if (user.followings_login.length == 0) {
      getFollowings(login, 1, [], get_size, (ret) => {
        var conditions = {
          login: login
        };
        var update = {
          $set: {
            followings_login: ret
          }
        };
        github_userSchema.update(conditions, update, (err, res2) => {
          //console.log("update user: " + login + " repos!");
          //console.log(res2);
          callback(ret);
        });
      });
    } else callback(user.followings_login);
  });
}

function updateUserJoinRepo(login, is_insert, callback) {
  github_userSchema.findOne({
    login: login
  }, (err, user) => {
    if (user.joinRepos.length == 0) {
      getJoinRepos(login, 1, [], is_insert, get_size, (ret) => {
        var conditions = {
          login: login
        };
        var update = {
          $set: {
            joinRepos: ret,
            joinRepo_count: ret.length
          }
        };
        github_userSchema.update(conditions, update, (err, res2) => {
          //console.log("update user: " + login + " join repos!");
          //console.log(res2);
          callback(ret);
        });
      });
    } else callback(user.joinRepos);
  });
}

/*-------------------- insert part -------------------------- */

function upsertRepo(ret, callback) {
  github_repoSchema.findOne({
    full_name: ret
  }, (err, check) => {
    if (check == null) {
      getRepoInfo(ret, info => {
        //console.log('from api to add repo:' + ret);
        if (!info) upsertRepo(ret, callback);
        else if (info.full_name) addNewRepo(info, () => {
          callback();
        });
        else callback();
      });
    } else {
      callback();
    }
  });
}

function upsertUser(ret, callback) {
  github_userSchema.findOne({
    login: ret
  }, (err, check) => {
    if (check == null) {
      getUserInfo(ret, info => {
        //console.log('from api to add user:' + ret);
        if (info) addAnewGitHubUser(info, () => {
          callback();
        });
        else upsertUser(ret, callback);
      });
    } else callback();
  });
}

/*-------------------- main part -------------------------- */

function updateWhenLogin(login) {
  let met0 = [];
  setSignal(0);
  logger.info('start update when login for: '+ login);

  met0.push((call0) => {
    //get star repos
    //star repo -> owner -> repo
    //star repo -> starer -> star repo
    //star repo -> contributors
    updateUserStars(login, true, (ret) => {
      let met1 = [];
      for (let i = 0; i < ret.length; i++) {
        met1.push((call1) => {
          upsertRepo(ret[i], () => {
            let met2 = [];
            if (run1) {
              met2.push((call2 => {
                github_repoSchema.findOne({
                  full_name: ret[i]
                }, (err, single) => {
                  upsertUser(single.owner, () => {
                    updateUserRepos(single.owner, true, (ret3) => {
                      let met3 = [];
                      for (let k = 0; k < ret3.length; k++) {
                        met3.push((call3) => {
                          upsertRepo(ret3[k], () => {
                            //console.log('done from USER star repo: ' + ret[i] + ' to its owner: ' + single.owner + ' to its repo: ' + ret3[k] + '!');
                            call3(null, 'done 3!');
                          })
                        });
                      }
                      async.parallel(met3, (err, res) => {
                        //console.log(res);
                        call2(null, 'done 2!');
                      })
                    });
                  });
                });
              }));
            }
            if (run2) {
              met2.push((call2) => {
                updateRepoStar(ret[i], (ret2) => {
                  let met3 = [];
                  for (let j = 0; j < ret2.length; j++) {
                    met3.push((call3) => {
                      upsertUser(ret2[j], () => {
                        updateUserStars(ret2[j], true, (ret3) => {
                          let met4 = [];
                          for (let k = 0; k < ret3.length; k++) {
                            met4.push((call4) => {
                              upsertRepo(ret3[k], () => {
                                //console.log('done from USER star repo: ' + ret[i] + ' to its starer: ' + ret2[j] + ' to its star repo: ' + ret3[k] + '!');
                                call4(null, 'done 4!');
                              });
                            });
                          }
                          async.parallel(met4, (err, res) => {
                            //console.log(res);
                            call3(null, 'done 3!');
                          });
                        });
                      });
                    });
                  }
                  async.parallel(met3, (err, res) => {
                    //console.log(res);
                    call2(null, 'done 2!');
                  });
                })
              });
            }
            if (run7) {
              met2.push((call2) => {
                updateRepoCons(ret[i], (ret2) => {
                  let met3 = [];
                  for (let j = 0; j < ret2.length; j++) {
                    met3.push((call3) => {
                      upsertUser(ret2[j], () => {
                        //console.log('done from USER star repo: ' + ret[i] + ' to its contributor: ' + ret2[j]+ '!');
                        call3(null, 'done 3!');
                      });
                    });
                  }
                  async.parallel(met3, (err, res) => {
                    //console.log(res);
                    call2(null, 'done 2!');
                  });
                })
              });
            }
            async.parallel(met2, (err, res) => {
              //console.log(res);
              call1(null, 'done 1!');
            });
          });
        });
      }
      async.parallel(met1, (err, res) => {
        logger.info("finish star repo for: "+ login);
        setSignal_login_wait(5);
        call0(null, 'done 0!');
      })
    });
  });

  met0.push((call0) => {
    //get repos
    //repo -> contributor //-> repo
    updateUserRepos(login, true, (ret) => {
      let met1 = [];
      for (let i = 0; i < ret.length; i++) {
        met1.push((call1) => {
          upsertRepo(ret[i], () => {
            updateRepoCons(ret[i], (ret2) => {
              let met2 = [];
              for (let j = 0; j < ret2.length; j++) {
                met2.push((call2) => {
                  upsertUser(ret2[j], () => {
                    //console.log('done from USER repo: ' + ret[i] + ' to its contributor: ' + ret2[j] + '!');
                    call2(null, 'done 2!');
                    if (run3) {
                      updateUserRepos(ret2[j], true, (ret3) => {
                        for (let k = 0; k < ret3.length; k++) {
                          upsertRepo(ret3[k], () => {
                            //console.log('done from USER repo: ' + ret[i] + ' to its contributor: ' + ret2[j] + ' to its repo: ' + ret3[k] + '!');
                          });
                        }
                      });
                    }
                  });
                });
              }
              async.parallel(met2, (err, res) => {
                //console.log(res);
                call1(null, 'done 1!');
              })
            });
          });
        });
      }
      async.parallel(met1, (err, res) => {
        logger.info("finish repo for: "+ login);
        setSignal_login_wait(6);
        call0(null, 'done 0!');
      })
    });
  });

  met0.push((call0) => {
    //join repo -> contributor -> star repo
    updateUserJoinRepo(login, true, (ret) => {
      let met1 = [];
      for (let i = 0; i < ret.length; i++) {
        met1.push((call1) => {
          upsertRepo(ret[i], () => {
            updateRepoCons(ret[i], (ret2) => {
              let met2 = [];
              for (let j = 0; j < ret2.length; j++) {
                met2.push((call2) => {
                  upsertUser(ret2[j], () => {
                    if (run4) {
                      updateUserStars(ret2[j], true, (ret3) => {
                        let met3 = [];
                        for (let k = 0; k < ret3.length; k++) {
                          met3.push((call3) => {
                            upsertRepo(ret3[k], () => {
                              //console.log('done from USER repo: ' + ret[i] + ' to its contributor: ' + ret2[j] + ' to its star repo: ' + ret3[k] + '!');
                              call3(null, 'done 3!');
                            });
                          });
                        }
                        async.parallel(met3, (err, res) => {
                          //console.log(res);
                          call2(null, 'done 2!');
                        })
                      });
                    }
                  });
                });
              }
              async.parallel(met2, (err, res) => {
                //console.log(res);
                call1(null, 'done 1!');
              })
            });
          });
        });
      }
      async.parallel(met1, (err, res) => {
        logger.info("finish join repo for: "+ login);
        setSignal_login_wait(7);
        call0(null, 'done 0!');
      })
    });
  });

  met0.push((call0) => {
    ////get followings
    //following -> repo -> contributor
    //following -> star repo -> contributor
    updateUserFollowing(login, (ret) => {
      let met1 = [];
      for (let i = 0; i < ret.length; i++) {
        met1.push((call1) => {
          upsertUser(ret[i], () => {
            if (run5) {
              updateUserRepos(ret[i], true, (ret2) => {
                let met2 = [];
                for (let j = 0; j < ret2.length; j++) {
                  met2.push((call2) => {
                    upsertRepo(ret2[j], () => {
                      updateRepoCons(ret2[j], (ret3) => {
                        let met3 = [];
                        for (let k = 0; k < ret3.length; k++) {
                          met3.push((call3) => {
                            upsertUser(ret3[k], () => {
                              //console.log('done from USER following: ' + ret[i] + ' to its repo: ' + ret2[j] + ' to its contributor: ' + ret3[k] + '!');
                              call3(null, 'done 3!');
                            })
                          });
                        }
                        async.parallel(met3, (err, res) => {
                          //console.log(res);
                          call2(null, 'done 2!');
                        })
                      });
                    });
                  });
                }
                async.parallel(met2, (err, res) => {
                  //console.log(res);
                  call1(null, 'done 1!');
                })
              });
            }
            //if (run6) {
            //  updateUserStars(ret[i], true, (ret2) => {
            //    for (let j = 0; j < ret2.length; j++) {
            //      upsertRepo(ret2[j], () => {
            //        updateRepoCons(ret2[j], (ret3) => {
            //          for (let k = 0; k < ret3.length; k++) {
            //            upsertUser(ret3[k], ()=> {
            //              console.log('done from USER following: ' + ret[i] + ' to its star repo: ' + ret2[j] + ' to its contributor: ' + ret3[k] + '!');
            //            })
            //          }
            //        });
            //      });
            //    }
            //  });
            //}
          });
        });
      }
      async.parallel(met1, (err, res) => {
        logger.info("finish following for: "+ login);
        setSignal_login_wait(8);
        call0(null, 'done 0!');
      })
    });
  });

  async.parallel(met0, (err, res) => {
    logger.info('update done for: '+ login);
    setSignal_login_wait(1);
    record_log('system', 'update user: ' + login + ' when login done!', 'done');
    setSignal(1);
  })
}

function updateInitialInfo(login) {
  let met = [];
  setSignal_init(0);
  logger.info('start init info for: '+ login);
  met.push((call0) => {
    getFollowers(login, 1, [], -1, (followers) => {
      //console.log(followers);
      userSchema.update({
        login: login
      }, {
        $set: {
          followers: followers
        }
      }, (err, res) => {
        logger.info('update system user followers: '+ login);
        call0(null, 'done for get followers!');
        //console.log(res);
        for (let i = 0; i < followers.length; i++) {
          upsertUser(followers[i], () => {
            //console.log('new user: ' + followers[i])
          });
        }
      })
    });
  });
  met.push((call0) => {
    getFollowings(login, 1, [], -1, (followings) => {
      //console.log(followings);
      userSchema.update({
        login: login
      }, {
        $set: {
          followings: followings
        }
      }, (err, res) => {
        logger.info('update system user followings: '+ login);
        call0(null, 'done for get followings!');
        //console.log(res);
        for (let i = 0; i < followings.length; i++) {
          upsertUser(followings[i], () => {
            //console.log('new user: ' + followings[i])
          });
        }
      })
    });
  });
  met.push((call0) => {
    getUserStarred(login, 1, [], true, -1, (stars) => {
      //console.log(stars);
      userSchema.findOne({
        login: login
      }, (err, user) => {
        let repo_set = user.repo_sets;
        let ungroup_set = [];
        for (let j = 0; j < repo_set.length; j++) {
          if (repo_set[j].set_name == 'Ungrouped') ungroup_set = repo_set[j].set_repos;
        }
        for (let i = 0; i < stars.length; i++) {
          let new_repo = stars[i];
          let is_find = false;
          for (let j = 0; j < repo_set.length; j++) {
            if (repo_set[j].set_repos.findIndex(k => k == new_repo) >= 0) is_find = true;
          }
          if (!is_find) ungroup_set.push(new_repo);
        }
        for (let j = 0; j < repo_set.length; j++) {
          if (repo_set[j].set_name == 'Ungrouped') repo_set[j].set_repos = ungroup_set;
        }
        userSchema.update({
          login: login
        }, {
          $set: {
            star_repos: stars,
            repo_sets: repo_set
          }
        }, (err, res) => {
          logger.info('update system user star repos: '+ login);
          call0(null, 'done for get stars!');
          //console.log(res);
          for (let i = 0; i < stars.length; i++) {
            upsertRepo(stars[i], () => {
              //console.log('new user: ' + stars[i])
            });
          }
        })
      });
    })
  });
  async.parallel(met, (err, res) => {
    logger.info('done init info for: '+login);
    record_log('system', 'init user data: ' + login, 'done');
    setSignal_init(1);
  })
}

function setGetSize(value){
  get_size = value;
}

export {
  updateWhenLogin,
  upsertRepo,
  upsertUser,
  updateRepoCons,
  updateRepoStar,
  updateUserFollowing,
  updateUserRepos,
  updateUserStars,
  updateUserJoinRepo,
  updateInitialInfo,

  setGetSize
}

//let test_login = 'ChenDanni';
//upsertUser(test_login, () => {
//  updateWhenLogin(test_login, () => {
//    console.log('okkkk');
//  });
//});
//connect();
//updateInitialInfo('RickChem');
