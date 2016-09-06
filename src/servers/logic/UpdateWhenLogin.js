/**
 * Created by raychen on 16/9/5.
 */

import {github_repoSchema} from '../../models/github_repoSchema'
import {github_userSchema} from '../../models/github_userSchema'
import {getUserInfo, getUserStarred, getPublicRepos, addAnewUser, getFollowings, addAnewGitHubUser} from '../api/github_user'
import {getRepoInfo, getRepoLanguages, getContributors, getStarredUsers, addNewRepo} from '../api/github_repo'

var get_size = 20;
var run1 = true, run2 = true, run3 = true, run4 = true, run5 = true, run6 = true;

/*-------------------- update part -------------------------- */

function getLoginFromContributors(array) {
  let ret = [];
  for (let i = 0; i < array.length; i++) {
    ret.push(array[i].login);
  }
  return ret;
}
function updateRepoCons(fullname, callback) {
  github_repoSchema.findOne({full_name: fullname}, (err, repo) => {
    if (repo.contributors.length == 0) {
      getContributors(fullname, 1, [], get_size, (ret2) => {
        var conditions2 = {full_name: fullname};
        var update2 = {
          $set: {
            contributors_count: ret2.length,
            contributors: ret2
          }
        };
        github_repoSchema.update(conditions2, update2, (err, res2) => {
          console.log("update repo: " + fullname + " cons!");
          //console.log(res2);
          callback(getLoginFromContributors(ret2));
        });
      })
    } else callback(getLoginFromContributors(repo.contributors));
  });
}

function updateRepoStar(fullname, callback) {
  github_repoSchema.findOne({full_name: fullname}, (err, repo) => {
    if (repo.starers.length == 0) {
      getStarredUsers(fullname, 1, [], get_size, (ret2) => {
        var conditions2 = {full_name: fullname};
        var update2 = {
          $set: {
            starers: ret2
          }
        };
        github_repoSchema.update(conditions2, update2, (err, res2) => {
          console.log("update repo: " + fullname + " starers!");
          //console.log(res2);
          callback(ret2);
        });
      });
    } else callback(repo.starers);
  });
}

function updateUserStars(login, is_insert, callback) {
  github_userSchema.findOne({login: login}, (err, user) => {
    if (user.star_repos.length == 0) {
      getUserStarred(login, 1, [], is_insert, get_size, (ret) => {
        var conditions = {login: login};
        var update = {
          $set: {
            star_num: ret.length,
            star_repos: ret
          }
        };
        github_userSchema.update(conditions, update, (err, res2) => {
          console.log("update user: " + login + " star repos!");
          //console.log(res2);
          callback(ret);
        });
      });
    } else callback(user.star_repos);
  });
}

function updateUserRepos(login, is_insert, callback) {
  github_userSchema.findOne({login: login}, (err, user) => {
    if (user.repos.length == 0) {
      getPublicRepos(login, 1, [], is_insert, get_size, (ret) => {
        var conditions = {login: login};
        var update = {
          $set: {
            repos: ret
          }
        };
        github_userSchema.update(conditions, update, (err, res2) => {
          console.log("update user: " + login + " repos!");
          //console.log(res2);
          callback(ret);
        });
      });
    } else callback(user.repos);
  });
}

function updateUserFollowing(login, callback) {
  github_userSchema.findOne({login: login}, (err, user) => {
    if (user.followings_login.length == 0) {
      getFollowings(login, 1, [], get_size, (ret) => {
        var conditions = {login: login};
        var update = {
          $set: {
            followings_login: ret
          }
        };
        github_userSchema.update(conditions, update, (err, res2) => {
          console.log("update user: " + login + " repos!");
          //console.log(res2);
          callback(ret);
        });
      });
    } else callback(user.followings_login);
  });
}

/*-------------------- insert part -------------------------- */

function upsertRepo(ret, callback) {
  github_repoSchema.findOne({full_name: ret}, (err, check)=> {
    if (check == null) {
      getRepoInfo(ret, info => {
        console.log('from api to add repo:' + ret);
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
  github_userSchema.findOne({login: ret}, (err, check) => {
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
  //get star repos
  //star repo -> owner -> repo
  //star repo -> starer -> star repo
  updateUserStars(login, true, (ret) => {
    for (let i = 0; i < ret.length; i++) {
      upsertRepo(ret[i], () => {
        if (run1) {
          github_repoSchema.findOne({full_name: ret[i]}, (err, single) => {
            upsertUser(single.owner, () => {
              updateUserRepos(single.owner, true, (ret3) => {
                for (let k = 0; k < ret3.length; k++) {
                  upsertRepo(ret3[k], () => {
                    console.log('done from USER star repo: ' + ret[i] + ' to its owner: ' + single.owner + ' to its repo: ' + ret3[k] + '!');
                  })
                }
              });
            });
          });
        }
        if (run2) {
          updateRepoStar(ret[i], (ret2) => {
            for (let j = 0; j < ret2.length; j++) {
              upsertUser(ret2[j], () => {
                updateUserStars(ret2[j], true, (ret3) => {
                  for (let k = 0; k < ret3.length; k++) {
                    upsertRepo(ret3[k], () => {
                      console.log('done from USER star repo: ' + ret[i] + ' to its starer: ' + ret2[j] + ' to its star repo: ' + ret3[k] + '!');
                    });
                  }
                });
              });
            }
          })
        }
      });
    }
  });
  //get repos
  //repo -> contributor -> repo
  //repo -> contributor -> star repo
  updateUserRepos(login, true, (ret) => {
    for (let i = 0; i < ret.length; i++) {
      upsertRepo(ret[i], () => {
        if (run3 || run4) {
          updateRepoCons(ret[i], (ret2) => {
            for (let j = 0; j < ret2.length; j++) {
              upsertUser(ret2[j], () => {
                if (run3) {
                  updateUserRepos(ret2[j], true, (ret3) => {
                    for (let k = 0; k < ret3.length; k++) {
                      upsertRepo(ret3[k], () => {
                        console.log('done from USER repo: ' + ret[i] + ' to its contributor: ' + ret2[j] + ' to its repo: ' + ret3[k] + '!');
                      });
                    }
                  });
                }
                if (run4) {
                  updateUserStars(ret2[j], true, (ret3) => {
                    for (let k = 0; k < ret3.length; k++) {
                      upsertRepo(ret3[k], () => {
                        console.log('done from USER repo: ' + ret[i] + ' to its contributor: ' + ret2[j] + ' to its star repo: ' + ret3[k] + '!');
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
  ////get followings
  //following -> repo -> contributor
  //following -> star repo -> contributor
  updateUserFollowing(login, (ret) => {
    for (let i = 0; i < ret.length; i++) {
      upsertUser(ret[i], () => {
        if (run5) {
          updateUserRepos(ret[i], true, (ret2) => {
            for (let j = 0; j < ret2.length; j++) {
              upsertRepo(ret2[j], () => {
                updateRepoCons(ret2[j], (ret3) => {
                  for (let k = 0; k < ret3.length; k++) {
                    upsertUser(ret3[k], ()=> {
                      console.log('done from USER following: ' + ret[i] + ' to its repo: ' + ret2[j] + ' to its contributor: ' + ret3[k] + '!');
                    })
                  }
                });
              });
            }
          });
        }
        if (run6) {
          updateUserStars(ret[i], true, (ret2) => {
            for (let j = 0; j < ret2.length; j++) {
              upsertRepo(ret2[j], () => {
                updateRepoCons(ret2[j], (ret3) => {
                  for (let k = 0; k < ret3.length; k++) {
                    upsertUser(ret3[k], ()=> {
                      console.log('done from USER following: ' + ret[i] + ' to its star repo: ' + ret2[j] + ' to its contributor: ' + ret3[k] + '!');
                    })
                  }
                });
              });
            }
          });
        }
      });
    }
  });
}

export {updateWhenLogin, upsertRepo, upsertUser}

let test_login = 'RickChem';
upsertUser(test_login, () => {
  updateWhenLogin('RickChem');
});
