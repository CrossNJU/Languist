/**
 * Created by ChenDanni on 2016/8/15.
 */

let rec_repos = [];
let sim_user_num = 20;
let repo_count = [];//star的仓库中是否有重复的



function get_rec_repos(login){
  //得到最相似的前sim_user_num个用户
  let sim_users = get_rec_users(login,sim_user_num);

  for (let i = 0;i < sim_users.length;i++){
    let temp_login = sim_users[i];
    let temp_repos = getStarRepoByUser(temp_login);

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



}


