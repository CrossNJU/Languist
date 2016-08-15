/**
 * Created by ChenDanni on 2016/8/15.
 */

let rec_langs = [];
let user_langs = [];
let user_tags = [];
let tag_num = 3;
let lang_count = [];
let rec_num = 3;

//得到user的tag情况
function get_user_tag(login){
  let user_langs = getLanguageByUser(login);
  let user_tags = [];
  //遍历list，统计tag各自的数量
  for (let i = 0;i < user_langs.length;i++){
    for (let j = 0;j < user_langs.tag.length;j++){
      let key = user_langs.tag[j];
      if (user_tags.hasOwnProperty(key)){
        user_tags[key] += 1;
      }else {
        user_tags[key] = 1;
      }
    }
  }
  //tag排序->用户哪方面的语言用的比较多
  user_tags.sort(function(a,b){
    return a<b?1:-1;
  });
  return user_tags;
}


function get_rec_languages(login){
  user_langs = getLanguageByUser(login);

  user_tags = get_user_tag(login);

  //取tag排名中的前tag_num的语言,统计语言出现的次数
  let count = 0;
  for (let tag in user_tags){
    let temp_langs = getLanguageByTag(tag);
    for (let j = 0;j < temp_langs.length;j++){
      let key = temp_langs[j];
      if (lang_count.hasOwnProperty(key)){
        lang_count[key] += 1;
      }else {
        lang_count[key] = 1;
      }
    }
    count++;
    if (count >= tag_num){
      count = 0;
      break;
    }
  }
  //去除重复（用户已经有的语言）
  for (let lang in lang_count){
    if (user_langs.hasOwnProperty(lang)){
      delete lang_count[lang];
    }
  }
  //将所得语言按流行度排序（暂时是size）
  lang_count.sort(function(a,b){
    return a<b?1:-1
  });
  //取前rec_num返回作为推荐语言
  let re = 0;
  for (let lang in lang_count){
    let temp_lan = {
      type: 'lang',
      name: lang,
      description: findLanguageByName(lang).description
    }
    rec_langs[re] = temp_lan;
    re++;
    if (re == rec_num){
      re = 0;
      break;
    }
  }

  return rec_langs;
}
