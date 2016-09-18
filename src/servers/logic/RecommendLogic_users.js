/**
 * Created by ChenDanni on 2016/8/15.
 */

import {getGithubUserInfo, getUserAndLevelByLanguage,
  getFollowingByUser, getStarUserByRepo, getContributorsByRepo, getUserLanguage,getTopUsersInSystem,getTopUsersInGithub} from '../dao/UserDAO'
import {getStarRepoByUser, getPublicRepoByUser, getRepoInfo, getJoinRepoByUser} from '../dao/RepoDAO'
import {handle_repos} from './RecommendLogic_repos'
import {getLanguageByUser} from '../dao/languageDAO'
import {connect} from '../config'
var async = require("async");

let modulate = 2;
//let rec_num = 3;

function getSortFun(order, sortBy) {
  var ordAlpah = (order == 'asc') ? '>' : '<';
  var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
  return sortFun;
}

//两个用户之间的语言相似度
async function get_lan_sim(user1,user2){
  // console.log('in');
  let user1_lan = await getLanguageByUser(user1);
  let user2_lan = await getLanguageByUser(user2);

  let sim = 0;

  if (user1_lan == null || user1_lan == []) return 0;
  if (user2_lan == null || user2_lan == []) return 0;

  for (let i = 0;i < user1_lan.length;i++){
    for (let j = 0;j < user2_lan.length;j++){
      if (user1_lan[i].name == user2_lan[j].name){
        sim++;
        sim += (5 - Math.abs(user1_lan[i].level - user2_lan[j].lan_level))/modulate;
        break;
      }
    }
  }
  sim /= (1 + 5/modulate)*Math.sqrt(user1_lan.length*user2_lan.length);
  return sim;
}

//得到两个用户之间的相似度
async function get_user_sim(user1,user2){
  return get_lan_sim(user1,user2);
}

//确定有相同lan的user的初步范围 并按语言相似度排序
async function get_lan_sims(login){
  let lan_sim_info = [];
  let user_lan_sim = [];
  let user_langs = await getLanguageByUser(login);
  let lan_num = user_langs.length;

  for (let i = 0;i < user_langs.length;i++){
    let temp_lang = user_langs[i].name;
    let temp_user = await getUserAndLevelByLanguage(temp_lang);
    for (let j = 0;j < temp_user.length;j++){
      let user_login = temp_user[j].login;
      if (user_lan_sim.hasOwnProperty(user_login)){
        user_lan_sim[user_login] += 1;
      }else {
        user_lan_sim[user_login] = 1;
      }
      user_lan_sim[user_login] += (5 - Math.abs(user_langs[i].level - temp_user[j].lan_level))/modulate;
    }
  }

  for (let login in user_lan_sim){
    user_lan_sim[login] /= (1 + 5/modulate)*lan_num;
    let temp_info = {
      login: login,
      lan_sim: user_lan_sim[login]
    };
    lan_sim_info.push(temp_info);
  }

  lan_sim_info.sort(getSortFun('desc','lan_sim'));

  //console.log(lan_sim_info);

  return lan_sim_info;
}

//get_lan_sims('test');

//得到含有相同tag的user列表
function get_tag_sims(login){

}

async function get_user_sims(login){

  //初步确定相似user范围 并按语言相似度排序
  let user_lan_sims = await get_lan_sims(login);

  //得到用户tag的相似度
  //????????????????????
  //

  return user_lan_sims;
}

//返回推荐用户的login列表
async function get_rec_users_by_language(login, rec_num){
  let rec_user_login = [];
  //得到 用户相似度
  let user_sims = await get_user_sims(login);

  //console.log(user_sims);

  //得到 高手用户
  //???

  let re_count = 0;
  for (let i = 0;i < user_sims.length;i++){
    if (i < re_count) {break;}
    let temp_login = user_sims[i].login;
    rec_user_login.push(temp_login);
    re_count++;
    if (re_count >= rec_num){
      re_count = 0;
      break;
    }
  }

  //去除重复
  let index = -1;
  for (let i = 0;i < rec_user_login.length;i++){
    if (rec_user_login[i] == login){
      index = i;
      break;
    }
  }
  if (index != -1){
    rec_user_login.splice(index,1);
  }

  //console.log("here2");
  // console.log(rec_user_login);


  return rec_user_login;
}

//user->star_repos->contributors
async function get_rec_users_by_star_contributor(login,rec_num){
  let rec_user_login = [];
  let init_rec = [];
  let star_repos = await getStarRepoByUser(login);
  let contributors_count = [];
  let follower_para = 0.3;
  let contributor_para = 1.5;
  let sim_para = 200;

    //统计contributor
  for (let i = 0;i < star_repos.length;i++){
    let temp_contr = await getContributorsByRepo(star_repos[i]);
    // console.log(temp_contr);

    for (let j = 0;j < temp_contr.length;j++){
      let contr_name = temp_contr[j].login;
      if (contributors_count.hasOwnProperty[contr_name]){
        contributors_count[contr_name] += contributor_para * temp_contr[j].contributions;
      }else{
        let user_info = await getGithubUserInfo(contr_name);
        contributors_count[contr_name] = follower_para * user_info.followers +
                                          temp_contr[j].contributions;
      }
    }
  }

  //如果有，删除自己
  if(contributors_count.hasOwnProperty(login)){
     delete contributors_count[login];
  }

    //考虑相似度并转换成json数组
  for (let contr in contributors_count){
    let similarity = await get_user_sim(login,contr);
    contributors_count[contr] += sim_para * similarity;
    let temp_init = {
      login: contr,
      sim: contributors_count[contr]
    };
    init_rec.push(temp_init);
  }
  init_rec.sort(getSortFun('desc','sim'));

  let re_count = 0;
  for (let i = 0;i < init_rec.length;i++){
    if (i < re_count) {break;}
    let temp_login = init_rec[i].login;
    rec_user_login.push(temp_login);
    re_count++;
    if (re_count >= rec_num){
      re_count = 0;
      break;
    }
  }

  // console.log(rec_user_login);
  return rec_user_login;
}

//user->followings->repos->contributors
async function get_rec_users_by_following_repo(login, rec_num){
  let followings = await getFollowingByUser(login);
  let init_contr = [];//{name,count}
  let contr_array = [];
  let rec_contr = [];
  let appear_percent = 5;
  let contr_percent = 0.5;
  let similarity_percent = 100;
  let handle_repeat = followings;
  handle_repeat.push(login);

  let t = await new Promise((resolve,reject)=>{
    let met0 = [];
    for (let i = 0;i < followings.length;i++){
      met0.push(async (call0)=>{
        let temp_f_repos = await getJoinRepoByUser(followings[i]);
        temp_f_repos = await handle_repos(temp_f_repos);
        let met1 = [];
        for (let j = 0;j < temp_f_repos.length;j++){
          met1.push(async (call1)=>{
            let repo_contr = await getContributorsByRepo(temp_f_repos[j]);
            for (let k = 0;k < repo_contr.length;k++){
              let user_login = repo_contr[k].login;
              let user_contributions = repo_contr[k].contributions;
              if (!(handle_repeat.indexOf(user_login) > -1)){
                //contributor加入初始化contributor列表，统计
                if (init_contr.hasOwnProperty(user_login)){
                  init_contr[user_login] += appear_percent + contr_percent * user_contributions;
                }else{
                  init_contr[user_login] = appear_percent  + contr_percent * user_contributions;
                }
              }
            }
            call1(null,'done met1');
          });
        }
        async.parallel(met1,(err,res)=>{
          // console.log(res);
          call0(null, 'done met0');
        });
      });
    }
    async.parallel(met0,async (err,res)=>{
      // console.log(res);
      //考虑user相似度
      for (let contributor in init_contr){
        let similarity = await get_user_sim(login,contributor);
        init_contr[contributor] += similarity_percent * similarity;
      }

      for (let contributor in init_contr){
        let temp_contr = {
          login: contributor,
          count: init_contr[contributor]
        };
        contr_array.push(temp_contr);
      }
      contr_array.sort(getSortFun('desc','count'));

      // console.log(contr_array.length);

      for (let i = 0;i < rec_num;i++){
        if (i >= contr_array.length){
          break;
        }
        rec_contr.push(contr_array[i].login);
      }
      // console.log(rec_contr);
      resolve(rec_contr);
    });
  });

  return t;
}

//when 000
async function get_rec_users_when_zero(rec_num){
  let user_num = 10;
  let github_user_num = rec_num = rec_num - user_num;
  let rec_users = await getTopUsersInSystem(user_num);
  let rec_github_users = await getTopUsersInGithub(github_user_num);
  let ret = rec_users;

  for (let i = 0;i < rec_github_users.length;i++){
    if (ret.indexOf(rec_github_users[i]) <= -1)
      ret.push(rec_github_users[i]);
  }

  return ret;

}

async function get_rec_users(login,language_percent,star_contributor_percent,following_repo_percent){
  let base = 100;
  let language_num = base * language_percent;
  let star_contributor_num = base * star_contributor_percent;
  let following_repo_num = base * following_repo_percent;

  let t = await new Promise((resolve, reject)=>{
    let met = [];
    met.push(async (call0) => {
      let language_rec = await get_rec_users_by_language(login,language_num);
      // console.log('done1');
      call0(null,language_rec);
    });
    met.push(async (call0) => {
      let star_contributor_rec = await get_rec_users_by_star_contributor(login,star_contributor_num);
      // console.log('done2');
      call0(null,star_contributor_rec);
    });
    met.push(async (call0) => {
      let following_repo_rec = await get_rec_users_by_following_repo(login,following_repo_num);
      // console.log('done3');
      call0(null,following_repo_rec);
    });
    met.push(async (call0) => {
      let base_rec = await get_rec_users_when_zero(base);
      // console.log('done4');
      call0(null,base_rec);
    });

    async.parallel(met,(err,res)=>{
      let language_rec = res[0];
      let star_contributor_rec = res[1];
      let following_repo_rec = res[2];
      let base_rec = res[3];

      let init_users = [];
      let rec_users = [];

      if (((language_rec.length == 0)&&(star_contributor_rec.length == 0)&&(following_repo_rec.length == 0))){
        let index = base_rec.indexOf(login);
        if (index >= -1){
          base_rec.splice(index, 1);
        }
        // console.log(base_rec);
        // console.log(base_rec.length);
        return base_rec;
      }

      init_users.push(language_rec);
      init_users.push(star_contributor_rec);
      init_users.push(following_repo_rec);

      for (let i = 0;i < init_users.length;i++){
        for (let j = 0;j < init_users[i].length;j++){
          if (rec_users.indexOf(init_users[i][j]) <= -1)
            rec_users.push(init_users[i][j]);
        }
      }
      resolve(rec_users);
    });
  });
  return t;
}

export {get_rec_users,get_user_sim,get_user_sims,get_rec_users_by_language,get_rec_users_by_star_contributor,
        get_rec_users_by_following_repo,get_rec_users_when_zero}

// connect();
//get_rec_users_by_following_repo('RickChem',20);
// get_rec_users_by_star_contributor('ChenDanni',10);
// get_rec_users_by_following_repo('ChenDanni',10);
// get_rec_users('ChenDanni',1,1,1);
// get_rec_users_when_zero(100);

async function test() {
  connect();
  let t = await get_rec_users('ChenDanni',1,1,1);
  console.log(t.length);
}
// test();
