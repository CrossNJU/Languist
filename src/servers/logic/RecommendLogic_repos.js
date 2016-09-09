/**
 * Created by ChenDanni on 2016/8/15.
 */

import {get_rec_users} from './RecommendLogic_users'
import {getStarRepoByUser, getRepoInfo,getPublicRepoByUser,getJoinRepoByUser} from '../dao/RepoDAO'
import {getUserAndLevelByLanguage, getFollowingByUser, getStarUserByRepo, getContributorsByRepo} from '../dao/UserDAO'
import {calTime} from '../util/timeUtil'
import {connect} from '../config'

let rec_repos = [];
let sim_user_num = 5;

function getSortFun(order, sortBy) {
  var ordAlpah = (order == 'asc') ? '>' : '<';
  var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
  return sortFun;
}

/*
 *统计repo的tag
 * [{
 * fullname: str,
 * tags:{
 *   tag1: num,
 *   tag2: num
 * }
 * }]
 * */
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
  let user_stars = await getStarRepoByUser(login);
  //得到最相似的前sim_user_num个用户
  let sim_users = await get_rec_users(login,sim_user_num);

  //统计count/star
  for (let i = 0;i < sim_users.length;i++){
    let temp_login = sim_users[i];
    let temp_repos = await getStarRepoByUser(temp_login);

    for (let j = 0;j < temp_repos.length;j++){
      let repo_name = temp_repos[j].fullname;
      if (repo_count.hasOwnProperty(repo_name)){
        repo_count[repo_name].count += 1;
      }else {
        let repo_info = {
          stars: temp_repos[j].stars,
          count:1
        };
        repo_count[repo_name] = repo_info;
      }
    }
  }
  //去除重复
  for (let i = 0;i < user_stars.length;i++){
    if (repo_count.hasOwnProperty(user_stars[i].fullname)){
      delete repo_count[user_stars[i].fullname];
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
    repo_info[i].score = (0.7*count)/count_max + (0.3*stars)/star_max;
  }

  //先按推荐度排序
  repo_info.sort(getSortFun('desc','score'));

  let rec = 0;
  for (let i = 0;i < repo_info.length;i++){
    if (i < rec) break;

    rec_repos.push(repo_info[i].fullname);

    rec++;
    if (rec >= rec_num){
      rec = 0;
      break;
    }
  }

  console.log(rec_repos);
  return rec_repos;

}

//user->star repos->owners->repos
async function get_rec_repos_by_star_repos_owner(login,rec_num) {
  let user_stars = await getStarRepoByUser(login);
  let init_repos = [];
  let rec_repos = [];

  console.log('user_stars: ');
  console.log(user_stars);

//init_repos: 用户star仓库的owner的所有其他repo的fullname
  for (let i = 0;i < user_stars.length;i++){
    let fullname = user_stars[i].fullname;
    let repo = await getRepoInfo(fullname);
    // console.log(repo.owner);
    let repo_list = await getPublicRepoByUser(repo.owner);
    if (repo_list == null)          //这里如果owner是机构,无法得到机构的仓库
      continue;

    for (let j = 0;j < repo_list.length;j++){

      if (repo_list[j] != fullname){

        console.log(repo_list[j]);

        let temp = await getRepoInfo(repo_list[j]);

        console.log('temp ;;;;;;');
        console.log(temp);          //这里不能拿到仓库,仓库为null

        let temp_repo = {
          fullname: temp.fullname,
          stars: temp.stars_count
        };
        init_repos.push(temp_repo);
      }
    }
    console.log('out');
  }

  console.log('init_repos  ');
  console.log(init_repos);

//init_repo按star排序
  init_repos.sort(getSortFun('desc','stars'));
  for (let i = 0;i < rec_num;i++){
    if (i > init_repos.length) break;
    rec_repos.push(init_repos[i].fullname);
  }
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

  //console.log("in");
  for (let i = 0;i < stars_handle.length;i++)
    user_stars.push(stars_handle[i]);

  for (let i = 0;i < user_stars.length;i++){
    let temp_starers = await getStarUserByRepo(user_stars[i]);
    for (let j = 0;j < temp_starers.length;j++){
      if (!(init_starers.indexOf(temp_starers[j]) > -1)){
        init_starers.push(temp_starers[j]);
      }
    }
  }

  //console.log(init_starers.length);
  for (let i = 0;i < init_starers.length;i++){
    //console.log(init_starers[i]);
    let temp_repos = await getStarRepoByUser(init_starers[i]);
    for (let j = 0;j < temp_repos.length;j++){
      let fullname = temp_repos[j];
      if ((!(init_repos_name.indexOf(fullname) > -1))
        &&(!(user_stars.indexOf(fullname) > -1))&&(!(user_repos.indexOf(fullname) > -1))){
        init_repos_name.push(fullname);
      }
    }
    // console.log(init_repos_name);
    // console.log(i);
  }

  //console.log("in");

  for (let i = 0;i < init_repos_name.length;i++){
    //console.log('ininin');
    let repo_single = await getRepoInfo(init_repos_name[i]);
    let repo_stars = repo_single.stars_count;
    let repo = {
      fullname: init_repos_name[i],
      stars: repo_stars
    };
    init_repos.push(repo);
    //console.log(init_repos);
  }

  init_repos.sort(getSortFun('desc','stars'));

  //console.log(init_repos);

  for (let i = 0;i < rec_num;i++){
    if (i > init_repos.length) break;
    rec_repos.push(init_repos[i].fullname);
  }
  // console.log(rec_repos);
  return rec_repos;

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
    if (i > init_repos.length) break;
    rec_repos.push(init_repos[i].fullname);
  }
  console.log(rec_repos);
  return rec_repos;

}

//user->join repos->contributors->star repos
async function get_rec_repos_by_colleagues(login,rec_num){
  let percent = 0.5;
  let join_repos = getJoinRepoByUser(login);
  let colleagues = [];
  let colleagues_count = [];
  let init_repos = [];
  let handle_repos = [];
  let rec_repos = [];

  for (let i = 0;i < join_repos.length;i++){
    let temp_contributors = await getContributorsByRepo(join_repos[i].full_name);
    for (let j = 0;j < temp_contributors.length;j++){
      let user_name = temp_contributors[j].name;
      if (colleagues.hasOwnProperty(user_name)){
        colleagues[user_name] += temp_contributors[j].contributions;
      }else {
        colleagues[name] = temp_contributors[j].contributions;
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

  for (let i = 0;i < colleagues_count.length*percent;i++){
    let star_repos = await getStarRepoByUser(colleagues_count[i].name);
    for (let j = 0;j < star_repos.length;j++){
      if (!(init_repos.indexOf(star_repos[j]) > -1)){
        init_repos.push(star_repos[j]);
      }
    }
  }

  for (let i = 0;i < init_repos.length;i++){
    let repo = {
      name: init_repos[i],
      stars: await getRepoInfo(init_repos[i]).stars_count
    };
    handle_repos.push(repo);
  }

  handle_repos.sort(getSortFun('desc','stars'));

  for (let i = 0;i < rec_num;i++){
    if (i > handle_repos.length) break;
    rec_repos.push(handle_repos.name);
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

  for (let i = 0;i < contributors.name;i++){
    let temp_repos = await getPublicRepoByUser(contributors[i]);
    temp_repos = await handle_repos(temp_repos);
    for (let j = 0;j < temp_repos.length;j++){
      if (!(init_repos_names.indexOf(temp_repos[j]) > -1)){
        init_repos_names.push(temp_repos[j]);
      }
    }
  }
  for (let i = 0;i < init_repos_names.length;i++){
    let temp_repo = {
      fullname: init_repos_names[i],
      stars: await getRepoInfo(init_repos_names[i]).stars_count
    };
    init_repos.push(temp_repo);
  }
  init_repos.sort(getSortFun('desc','stars'));

  for (let i = 0;i < rec_num;i++){
    if (i > init_repos.length) break;
    rec_repos.push(init_repos[i].fullname);
  }
  return rec_repos;
}

export {get_rec_repos_by_user,get_rec_repos_by_star_repos_owner,
  get_rec_repos_by_also_star,get_rec_repos_by_following,get_rec_repos_by_contributor,handle_repos}

//connect();
// get_rec_repos_by_user('ChenDanni',10);
//get_rec_repos_by_also_star('RickChem',100);
//get_rec_repos_by_following('ChenDanni',100);
// get_rec_repos_by_also_star('ChenDanni',5);
// get_rec_repos_by_contributor('jquery/jquery',5);
//get_rec_repos_by_also_star('RickChem', 10);
