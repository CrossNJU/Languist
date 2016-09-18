/**
 * Created by ChenDanni on 2016/8/15.
 */

import {get_rec_users_by_language} from './RecommendLogic_users'
import {getStarRepoByUser, getRepoInfo,getPublicRepoByUser,getJoinRepoByUser,getTopRepos} from '../dao/RepoDAO'
import {getUserAndLevelByLanguage, getFollowingByUser, getStarUserByRepo, getContributorsByRepo} from '../dao/UserDAO'
import {calTime} from '../util/timeUtil'
import {connect} from '../config'
var async = require("async");

function getSortFun(order, sortBy) {
  var ordAlpah = (order == 'asc') ? '>' : '<';
  var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
  return sortFun;
}

async function handle_repos_tags(repos){
  let repos_tag_count = [];

  return repos_tag_count;
}

async function handle_init_repos(repos){
  let handle_repos = [];
  let handle_tags = handle_repos_tags(repos);//得到每个repo的tag统计


  return handle_repos;
}

//根据create time和update time 筛除废仓库
async function handle_repos(repos){

  let re_repos = [];

  for (let i = 0;i < repos.length;i++){

    let repo_info = await getRepoInfo(repos[i]);

    let days = await calTime(repo_info.created_at,repo_info.updated_at);

    if (days >= 10){
      re_repos.push(repos[i]);
    }
  }

  return re_repos;

}

//最相似用户的repo推荐(使user可能会加入)
async function get_rec_repos_by_user(login,rec_num){
  let repo_count = [];
  let repo_info = [];
  let rec_repos = [];
  let count_max = -1;
  let star_max = -1;
  let sim_user_num = 5;
  let user_stars = await getStarRepoByUser(login);
  let user_join = await getJoinRepoByUser(login);
  let handle_repeat = [];

  handle_repeat = user_stars;
  for (let i = 0;i < user_join.length;i++){
    if (handle_repeat.indexOf(user_join[i].full_name))
      handle_repeat.push(user_join[i]);
  }

  //得到最相似的前sim_user_num个用户
  let sim_users = await get_rec_users_by_language(login,sim_user_num);

  //统计count/star
  for (let i = 0;i < sim_users.length;i++){
    let temp_repos = await getStarRepoByUser(sim_users[i]);

    for (let j = 0;j < temp_repos.length;j++){
      let repo_name = temp_repos[j];
      if (repo_count.hasOwnProperty(repo_name)){
        repo_count[repo_name].count += 1;
      }else {
        let repo = await getRepoInfo(temp_repos[j]);
        let repo_info = {
          stars: repo.stars_count,
          count:1
        };
        repo_count[repo_name] = repo_info;
      }
    }
  }
  //去除重复
  for (let i = 0;i < handle_repeat.length;i++){
    if (repo_count.hasOwnProperty(handle_repeat[i])){
      delete repo_count[handle_repeat[i]];
    }
  }

  for (let repo in repo_count){
    let temp_stars = repo_count[repo].stars;
    let temp_count = repo_count[repo].count;

    if (temp_stars > star_max) star_max = temp_stars;
    if (temp_count > count_max) count_max = temp_count;

    let temp_repo = {
      fullname: repo,
      stars: temp_stars,
      count: temp_count,
      score: 0
    };
    repo_info.push(temp_repo);
  }

  //计算推荐度
  for (let i = 0;i < repo_info.length;i++){
    let stars = repo_info[i].stars;
    let count = repo_info[i].count;
    repo_info[i].score = (0.8*count)/count_max + (0.2*stars)/star_max;
  }
  //先按推荐度排序
  repo_info.sort(getSortFun('desc','score'));

  for (let i = 0;i < rec_num;i++){
    if (i >= repo_info.length){
      break;
    }
    rec_repos.push(repo_info[i].fullname);
  }

  // console.log(rec_repos);
  return rec_repos;

}

//user->star repos->owners->repos
async function get_rec_repos_by_star_repos_owner(login,rec_num) {
  let user_stars = await getStarRepoByUser(login);
  let init_repos = [];
  let rec_repos = [];

//init_repos: 用户star仓库的owner的所有其他repo的fullname
  for (let i = 0;i < user_stars.length;i++){
    let fullname = user_stars[i];
    let repo = await getRepoInfo(fullname);
    // console.log(repo.owner);
    let repo_list = await getPublicRepoByUser(repo.owner);
    if (repo_list == null)          //这里如果owner是机构,无法得到机构的仓库
      continue;

    for (let j = 0;j < repo_list.length;j++){

      if (repo_list[j] != fullname){

        // console.log(repo_list[j]);

        let temp = await getRepoInfo(repo_list[j]);

        // console.log('temp ;;;;;;');
        // console.log(temp);          //这里不能拿到仓库,仓库为null

        let temp_repo = {
          fullname: temp.full_name,
          stars: temp.stars_count
        };
        init_repos.push(temp_repo);
      }
    }
  }

  // console.log('init_repos  ');
  // console.log(init_repos);

//init_repo按star排序
  init_repos.sort(getSortFun('desc','stars'));
  for (let i = 0;i < rec_num;i++){
    if (i >= init_repos.length) break;
    rec_repos.push(init_repos[i].fullname);
  }
  // console.log(rec_repos);
  return rec_repos;
}

//user->star->repos->users also star it->repos
async function get_rec_repos_by_also_star(login,rec_num){
  let stars_handle = await getStarRepoByUser(login);
  let user_stars = [];
  let user_repos = await getPublicRepoByUser(login); //name_list
  let init_starers = [];
  let init_repos_name = [];
  let init_repos = [];
  let rec_repos = [];

  // console.log("in");
  for (let i = 0;i < stars_handle.length;i++)
    user_stars.push(stars_handle[i]);


  let t = await new Promise((resolve, reject)=>{
    let met0 = [];
    for (let i = 0;i < user_stars.length;i++){
      met0.push(async (call0)=>{
        let temp_starers = await getStarUserByRepo(user_stars[i]);
        for (let j = 0;j < temp_starers.length;j++){
          if (!(init_starers.indexOf(temp_starers[j]) > -1)){
            init_starers.push(temp_starers[j]);
          }
        }
        call0(null,'done met0');
      });
    }
    async.parallel(met0,(err,res)=>{
      console.log('done met0');
      let met1 = [];
      for (let i = 0;i < init_starers.length;i++){
        met1.push(async (call1)=>{
          let temp_repos = await getStarRepoByUser(init_starers[i]);
          for (let j = 0;j < temp_repos.length;j++){
            let fullname = temp_repos[j];
            if ((!(init_repos_name.indexOf(fullname) > -1))
              &&(!(user_stars.indexOf(fullname) > -1))&&(!(user_repos.indexOf(fullname) > -1))){
              init_repos_name.push(fullname);
            }
          }
          call1(null,'done met1');
        });
      }
      async.parallel(met1,(err,res)=>{
        console.log('done met1');
        let met2 = [];
        for (let i = 0;i < init_repos_name.length;i++){
          met2.push(async (call2)=>{
            let repo_single = await getRepoInfo(init_repos_name[i]);
            let repo_stars = repo_single.stars_count;
            let repo = {
              fullname: init_repos_name[i],
              stars: repo_stars
            };
            init_repos.push(repo);
            call2(null,'done met2');
          });
        }
        async.parallel(met2,(err,res)=>{
          console.log('done met2');
          init_repos.sort(getSortFun('desc','stars'));
          for (let i = 0;i < rec_num;i++){
            if (i >= init_repos.length) break;
            rec_repos.push(init_repos[i].fullname);
          }
          // console.log(rec_repos);
          resolve(rec_repos);
        });
      });
    });
  });
  return t;
}

//user->following->repos
async function get_rec_repos_by_following(login,rec_num){
  let user_following = await getFollowingByUser(login); // name_list
  let stars_handle = await getStarRepoByUser(login);   // 去除重复
  let user_stars = [];
  let user_repos = await getPublicRepoByUser(login); // 去除重复
  let init_repos_name = [];
  let init_repos = [];
  let rec_repos = [];

  for (let i = 0;i < stars_handle.length;i++){
    user_stars.push(stars_handle[i].fullname);
  }

  for (let i = 0;i < user_following.length;i++){
    let temp_repos = await getPublicRepoByUser(user_following[i]); //name_list
    temp_repos = await handle_repos(temp_repos);
    // console.log(temp_repos);
    for (let j = 0;j < temp_repos.length;j++){
      if ((!(user_stars.indexOf(temp_repos[j]) > -1))&&(!(user_repos.indexOf(temp_repos[j]) > -1))){ //去除已经star和参加的repo
        init_repos_name.push(temp_repos[j]);
      }
    }
  }

  for (let i = 0;i < init_repos_name.length;i++){
    let temp_repo = {
      fullname: init_repos_name[i],
      stars: await getRepoInfo(init_repos_name[i]).stars_count
    };
    init_repos.push(temp_repo);
  }
  init_repos.sort(getSortFun('desc','stars'));

  for (let i = 0;i < rec_num;i++){
    if (i >= init_repos.length) break;
    rec_repos.push(init_repos[i].fullname);
  }
  // console.log(rec_repos);
  return rec_repos;

}

//user->join repos->contributors->star repos
async function get_rec_repos_by_colleagues(login,rec_num){
  let percent = 0.5;
  let join_repos = await getJoinRepoByUser(login);
  let star_repos = await getStarRepoByUser(login);
  let colleagues = [];
  let colleagues_count = [];
  let init_repos = [];
  let handle_repos = [];
  let rec_repos = [];
  let handle_repeat = [];
  let contr_percent = 5;

  for (let i = 0;i < star_repos.length;i++)
    handle_repeat.push(star_repos[i]);
  for (let i = 0;i < join_repos.length;i++){
    if (!(handle_repeat.indexOf(join_repos[i]) > -1)){
      handle_repeat.push(join_repos[i]);
    }
  }

  for (let i = 0;i < join_repos.length;i++){
    let temp_contributors = await getContributorsByRepo(join_repos[i]);

    // console.log(temp_contributors);

    for (let j = 0;j < temp_contributors.length;j++){
      let user_name = temp_contributors[j].login;
      if (user_name == login){
        continue;
      }
      if (colleagues.hasOwnProperty(user_name)){
        colleagues[user_name] += temp_contributors[j].contributions * contr_percent;
      }else {
        colleagues[user_name] = temp_contributors[j].contributions * contr_percent;
      }
    }
  }
  for (let colleague in colleagues){
    if (colleague != login){
      let temp_con = {
        name : colleague,
        count : colleagues[colleague]
      };
      colleagues_count.push(temp_con);
    }
  }
  colleagues_count.sort(getSortFun('desc','count'));

  if (colleagues_count.length <= 10) percent = 1;

  for (let i = 0;i < colleagues_count.length*percent;i++){
    let star_repos = await getStarRepoByUser(colleagues_count[i].name);
    for (let j = 0;j < star_repos.length;j++){
      if ((!(init_repos.indexOf(star_repos[j]) > -1))&&(!(handle_repeat.indexOf(star_repos[j]) > -1))){
        init_repos.push(star_repos[j]);
      }
    }
  }

  for (let i = 0;i < init_repos.length;i++){
    let repo_info = await getRepoInfo(init_repos[i]);
    let repo = {
      name: init_repos[i],
      stars: repo_info.stars_count
    };
    handle_repos.push(repo);
  }

  handle_repos.sort(getSortFun('desc','stars'));

  for (let i = 0;i < rec_num;i++){
    if (i >= handle_repos.length) break;
    rec_repos.push(handle_repos[i].name);
  }

  return rec_repos;

}


//仓库详情->相关仓库推荐
//repo->contributors->repos
async function get_rec_repos_by_contributor(fullname,rec_num){
  let contributors = await getContributorsByRepo(fullname);
  let init_repos_names = [];
  let init_repos = [];
  let rec_repos = [];

  // console.log(contributors);

  for (let i = 0;i < contributors.length;i++){

    // console.log(contributors[i].login.length);

    let temp_repos = await getPublicRepoByUser(contributors[i].login);
    temp_repos = await handle_repos(temp_repos);
    for (let j = 0;j < temp_repos.length;j++){
      if (!(init_repos_names.indexOf(temp_repos[j]) > -1)){
        init_repos_names.push(temp_repos[j]);
      }
    }
  }

  // console.log(init_repos_names.length);

  for (let i = 0;i < init_repos_names.length;i++){
    let temp_repo = {
      fullname: init_repos_names[i],
      stars: await getRepoInfo(init_repos_names[i]).stars_count
    };
    init_repos.push(temp_repo);
  }
  init_repos.sort(getSortFun('desc','stars'));

  for (let i = 0;i < rec_num;i++){
    if (i >= init_repos.length) break;
    rec_repos.push(init_repos[i].fullname);
  }
  // console.log(rec_repos);
  return rec_repos;
}


//when 000
async function get_rec_repos_when_zero(rec_num){
  let rec_percent = 4;
  let top_repos = await getTopRepos(rec_num * rec_percent);
  let rec_repos = [];

  for (let i = 0;i < rec_num*rec_percent;i += rec_percent){
    if (i >= top_repos.length) break;
    rec_repos.push(top_repos[i]);
  }
  // console.log(rec_repos);
  return rec_repos;
}

//--------------------------
//  Home Repos推荐列表
//--------------------------
async function get_rec_repos(login,user_percent,star_owner_percent,also_star_percent,following_percent,colleague_percent){
  let big_base = 150;
  let base = 100;
  let user_num = base * user_percent;
  let star_owner_num = big_base * star_owner_percent;
  let also_star_num = big_base * also_star_percent;
  let following_num = base * following_percent;
  let colleague_num = base * colleague_percent;

  let t = await new Promise((resolve, reject) => {
    let met = [];

    met.push(async (call0) => {
      let user_rec = await get_rec_repos_by_user(login,user_num);
      console.log('done1!');
      call0(null, user_rec);
    });
    met.push(async (call0) => {
      let star_owner_rec = await get_rec_repos_by_star_repos_owner(login,star_owner_num);
      console.log('done2!');
      call0(null, star_owner_rec);
    });
    met.push(async (call0) => {
      let also_star_rec = await get_rec_repos_by_also_star(login,also_star_num);
      console.log('done3!');
      call0(null, also_star_rec);
    });
    met.push(async (call0) => {
      let following_rec = await get_rec_repos_by_following(login,following_num);
      console.log('done4!');
      call0(null, following_rec);
    });
    met.push(async (call0) => {
      let colleague_rec = await get_rec_repos_by_colleagues(login,colleague_num);
      console.log('done5!');
      call0(null, colleague_rec);
    });
    met.push(async (call0) => {
      let base_rec = await get_rec_repos_when_zero(base);
      console.log('done6!');
      call0(null, base_rec);
    });

    async.parallel(met,(err,res)=>{
      let user_rec = res[0];
      let star_owner_rec = res[1];
      let also_star_rec = res[2];
      let following_rec = res[3];
      let colleague_rec = res[4];

      let base_rec = res[5];
      if (((user_rec.length == 0)&&(star_owner_rec.length == 0)&&(also_star_rec.length == 0)&&
        (following_rec.length == 0)&&(colleague_rec.length == 0))){
        // console.log(base_rec);
        // console.log('base');
        return base_rec;
      }
      let init_repos = [];
      let rec_repos = [];

      init_repos.push(user_rec);
      init_repos.push(star_owner_rec);
      init_repos.push(also_star_rec);
      init_repos.push(following_rec);
      init_repos.push(colleague_rec);

      for (let i = 0 ;i < init_repos.length;i++){
        for (let j = 0;j < init_repos[i].length;j++){
          if (rec_repos.indexOf(init_repos[i][j]) <= -1){
            rec_repos.push(init_repos[i][j]);
          }
        }
      }
      resolve(rec_repos);
    });
  });
  return t;
}
//--------------------------
//  Related Repos推荐列表
//--------------------------
async function get_related_rec_repos(fullname,contributor_percent){
  let base = 100;
  let contributor_num = base * contributor_percent;
  let contributor_rec = await get_rec_repos_by_contributor(fullname,contributor_num);

  let rec_repos = [];

  rec_repos = contributor_rec;

  // console.log(rec_repos);
  return rec_repos;
}


export {get_rec_repos,get_related_rec_repos,get_rec_repos_by_user,get_rec_repos_by_star_repos_owner,
        get_rec_repos_by_also_star,get_rec_repos_by_following,get_rec_repos_by_contributor,get_rec_repos_when_zero,handle_repos}

// get_rec_repos_by_user('ChenDanni',10);
// get_rec_repos_by_also_star('RickChem',100);
// get_rec_repos_by_following('ChenDanni',100);
// get_rec_repos_by_star_repos_owner('ChenDanni',5);
// get_rec_repos_by_contributor('d3/d3',5);
// get_rec_repos_by_also_star('RickChem', 10);
// get_rec_repos_by_colleagues('ChenDanni',10);
async function test() {
  connect();
  let t = await get_rec_repos('ChenDanni',1,1,1,1,1);
  // let t = await get_rec_repos_by_also_star('ChenDanni',100);
  console.log(t.length);
}
// test();
// get_related_rec_repos('d3/d3',1);
// get_rec_repos_when_zero(10);
// async function s1(call0) {
//   // let t = await get_rec_repos_by_also_star('RickChem',100);
//   // console.log(t);
//   setTimeout(() => {call0(null, 'yes1')}, 2000);
//   // console.log(x);
//   // call0(null, t);
// }
// async function s2(call0) {
//   setTimeout(() => {call0(null, 'yes2')}, 1000);
// }
// async.parallel([s1,s2], (err, res) => {
//   console.log(res);
//   console.log('a');
// });


