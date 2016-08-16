/**
 * Created by ChenDanni on 2016/8/15.
 */

let modulate = 2;
//let rec_num = 3;
let rec_user_login = [];


//确定有相同lan的user的初步范围 并按语言相似度排序
function get_lan_sims(login){
  let user_lan_sim = [];
  let user_langs = getLanguageByUser(login);
  let lan_num = user_langs.length;

  for (let i = 0;i < user_langs.length;i++){
    let temp_lang = user_langs[i].name;
    let temp_user = getUserAndLevelByLanguage(temp_lang);
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
  }

  user_lan_sim.sort(function(a,b){
    return a<b?1:-1;
  });

  return user_lan_sim;
}

//得到含有相同tag的user列表
function get_tag_sims(login){

}

/*
*返回
*users[{login,sim_count}]
* */
function get_user_sim(login){

  //初步确定相似user范围 并按语言相似度排序
  let user_lan_sims = get_lan_sims(login);

  //得到用户tag的相似度
  //????????????????????
  //

  return get_lan_sims(login);
}

//返回推荐用户的login列表
function get_rec_users(login,rec_num){
  //得到 用户相似度
  let user_sims = get_user_sim(login);

  //得到 高手用户
  //???

  let re_count = 0;
  for (let login in user_sims){
    rec_user_login[i] = login;
    re_count++;
    if (re_count == rec_num){
      re_count = 0;
      break;
    }
  }

  return rec_user_login;
}
