/**
 * Created by ChenDanni on 2016/8/15.
 */

import {getUserAndLevelByLanguage} from '../dao/UserDAO'
import {getLanguageByUser} from '../dao/languageDAO'
import {connect} from '../config'

let modulate = 2;
//let rec_num = 3;
let rec_user_login = [];

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

async function get_user_sim(login){

  //初步确定相似user范围 并按语言相似度排序
  let user_lan_sims = await get_lan_sims(login);

  //得到用户tag的相似度
  //????????????????????
  //

  return user_lan_sims;
}

//返回推荐用户的login列表
async function get_rec_users(login,rec_num){
  //得到 用户相似度
  let user_sims = await get_user_sim(login);

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

  //console.log(rec_user_login);


  return rec_user_login;
}

export {get_rec_users}

//connect();
//get_rec_users('RickChem',20);
