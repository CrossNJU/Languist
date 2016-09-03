/**
 * Created by ChenDanni on 2016/8/15.
 */

import {get_rec_users} from './RecommendLogic_users'
import {getStarRepoByUser, getRepoInfo,getPublicRepoByUser} from '../dao/RepoDAO'
import {getUserAndLevelByLanguage, getFollowingByUser, getStarUserByRepo, getContributorsByRepo} from '../dao/UserDAO'
import {connect} from '../config'

let rec_repos = [];
let sim_user_num = 5;

function getSortFun(order, sortBy) {
  var ordAlpah = (order == 'asc') ? '>' : '<';
  var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
  return sortFun;
}

//function getStarRepoByUser(login){
//  if (login == 'u1'){
//    return [{fullname:'r1',stars:10},{fullname:'r2',stars:102},{fullname:'r3',stars:1041}];
//  }
//  if (login == 'u2'){
//    return [{fullname:'r2',stars:10},{fullname:'r22',stars:102},{fullname:'r23',stars:1011}];
//  }
//  if (login == 'u3'){
//    return [{fullname:'r2',stars:10},{fullname:'r12',stars:102},{fullname:'r33',stars:2101}];
//  }
//  if (login == 'u4'){
//    return [{fullname:'r3',stars:10},{fullname:'r22',stars:102},{fullname:'r39',stars:1301}];
//  }
//  if (login == 'u5'){
//    return [{fullname:'r14',stars:310},{fullname:'r12',stars:102},{fullname:'r30',stars:1}];
//  }
//  if (login == 'u11'){
//    return [{fullname:'r13',stars:10},{fullname:'r42',stars:4102},{fullname:'r37',stars:1301}];
//  }
//  if (login == 'u13'){
//    return [{fullname:'r15',stars:410},{fullname:'r22',stars:1102},{fullname:'r73',stars:101}];
//  }
//  if (login == 'u14'){
//    return [{fullname:'r16',stars:310},{fullname:'r12',stars:102},{fullname:'r38',stars:2101}];
//  }
//  if (login == 'u15'){
//    return [{fullname:'r12',stars:810},{fullname:'r22',stars:102},{fullname:'r35',stars:101}];
//  }
//  if (login == 'u21'){
//    return [{fullname:'r18',stars:10},{fullname:'r52',stars:102},{fullname:'r35',stars:101}];
//  }
//  return [];
//}

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

  // console.log(rec_repos);
  return rec_repos;

}

//star repositories同一作者的不同项目(user可能会follow学习)
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
async function get_rec_repos_by_also_star(login,re_num){
  let user_stars = await getStarRepoByUser(login);
  let user_repos = await getPublicRepoByUser(login);

  for (let i = 0;i < user_stars.length;i++){
    let temp_starers = await getStarUserByRepo(user_stars[i]);
    console.log(temp_starers);
  }

}

//user->following->repos
async function get_rec_repos_by_following(login,rec_num){
  let user_following = await getFollowingByUser(login); // name_list
  let user_stars = await getStarRepoByUser(login);   // 去除重复
  let user_repos = await getPublicRepoByUser(login); // 去除重复
  let init_repos_name = [];
  let init_repos = [];
  let rec_repos = [];

  for (let i = 0;i < user_following.length;i++){
    let temp_repos = await getPublicRepoByUser(user_following[i]); //name_list
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




export {get_rec_repos_by_user,get_rec_repos_by_star_repos_owner,get_rec_repos_by_also_star,get_rec_repos_by_following}

connect();
// get_rec_repos_by_user('ChenDanni',10);
// get_rec_repos_by_star_repos('ChenDanni',10);
// get_rec_repos_by_following('ChenDanni',5);
get_rec_repos_by_also_star('ChenDanni',5);
