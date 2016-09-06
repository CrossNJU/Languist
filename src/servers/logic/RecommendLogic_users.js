/**
 * Created by ChenDanni on 2016/8/15.
 */

import {getUserAndLevelByLanguage} from '../dao/UserDAO'
import {getLanguageByUser} from '../dao/languageDAO'
import {connect} from '../config'

let modulate = 2;
//let rec_num = 3;


//function getLanguageByUser(login){
//  return [{
//    name: "lan1",
//    level: 1,
//    tag:["tag1","tag2","tag3"],
//    size:100
//  },{
//    name: "lan2",
//    level: 2,
//    tag:["tag2","tag3","tag4"],
//    size:100
//  },{
//    name: "lan3",
//    level: 1,
//    tag:["tag1","tag4","tag3"],
//    size:100
//  }];
//}

//function getUserAndLevelByLanguage(language){
//  if (language == 'lan1'){
//    return [{
//      login: 'u1',
//      lan_level: 4
//    },{
//      login: 'u2',
//      lan_level: 2
//    },{
//      login: 'u3',
//      lan_level: 3
//    },{
//      login: 'u4',
//      lan_level: 4
//    },{
//      login: 'u5',
//      lan_level: 5
//    }]
//  }
//  if (language == 'lan2'){
//    return [{
//      login: 'u11',
//      lan_level: 1
//    },{
//      login: 'u2',
//      lan_level: 2
//    },{
//      login: 'u13',
//      lan_level: 3
//    },{
//      login: 'u14',
//      lan_level: 4
//    },{
//      login: 'u15',
//      lan_level: 5
//    }]
//  }
//  if (language == 'lan3'){
//    return [{
//      login: 'u1',
//      lan_level: 1
//    },{
//      login: 'u21',
//      lan_level: 2
//    },{
//      login: 'u3',
//      lan_level: 3
//    },{
//      login: 'u14',
//      lan_level: 4
//    },{
//      login: 'u5',
//      lan_level: 5
//    }]
//  }
//  return []
//}

function getSortFun(order, sortBy) {
  var ordAlpah = (order == 'asc') ? '>' : '<';
  var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
  return sortFun;
}

//两个用户之间的语言相似度
async function get_lan_sim(user1,user2){
  let user1_lan = await getLanguageByUser(user1);
  let user2_lan = await getLanguageByUser(user2);
  let sim = 0;

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
//两个用户之间的tag相似度

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
async function get_rec_users(login,rec_num){
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
  console.log(rec_user_login);


  return rec_user_login;
}

//推荐用户star仓库的contributor
//user->star_repos->contributors
async function get_rec_users_by_star_contributor(login,rec_num){
  let rec_user_login = [];
  let init_rec = [];
  let star_repos = getStarRepoByUser(login);
  let contributors_count = [];
    //统计contributor
  for (let i = 0;i < star_repos.length;i++){
    let repo_fullname = star_repos[i].fullname;
    let temp_contr = getContributorByRepo(repo_fullname);
    for (let j = 0;j < temp_contr.length;j++){
      let contr_name = temp_contr[j];
      if (contributors_count.hasOwnProperty[contr_name]){
        contributors_count[contr_name]++;
      }else{
        contributors_count[contr_name] = 1;
      }
    }
  }
  //如果有，删除自己
  if(contributors_count.hasOwnProperty(login)){
     delete contributors_count[login];
  }

    //考虑相似度并转换成json数组
  for (let contr in contributors_count){
    contributors_count[contr] += get_user_sim(login,contr);
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

  return rec_user_login;

}

//user->followings->repos->contributors
async function get_rec_users_by_follwing_repo(login,rec_num){
  let followings = getFollowingByUser(login);
  let init_contr = [];//{name,count}
  let contr_array = [];
  let rec_contr = [];

  for (let i = 0;i < followings.length;i++){
    let temp_f_repos = getRepoByUser(login);
    for (let j = 0;j < temp_f_repos.length;j++){
      let repo_contr = getContributorByRepo(temp_f_repos[j].fullname);
      for (let k = 0;k < repo_contr.length;k++){
        if (repo_contr[k].login != login){
          //contributor加入初始化contributor列表，统计出现次数
          if (init_contr.hasOwnProperty(repo_contr[k])){
            init_contr[repo_contr[k]] ++;
          }else{
            init_contr[repo_contr[k]] = 1;
          }
        }
      }
    }
  }
  //考虑user相似度
  for (let contributor in init_contr){
    init_contr[contributor] += get_user_sim(login,contributor);
  }

  for (let contributor in init_contr){
    let temp_contr = {
      login: contributor,
      count: init_contr[contributor]
    };
    contr_array.push(temp_contr);
  }
  contr_array.sort(getSortFun('desc','count'));

  for (let i = 0;i < rec_num;i++){
    if (i > contr_array.length){
      break;
    }
    rec_contr.push(contr_array[i].login);
  }
  console.log(rec_contr);
  return rec_contr;
}

export {get_rec_users}

//connect();
//get_rec_users_by_follwing_repo('RickChem',20);
