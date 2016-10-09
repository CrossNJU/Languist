/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HomePage.scss';
import Cover from '../Cover';
import Count from '../Count';
import LanguageList from '../LanguageList';
import RepoList from '../RepoList';
import FlowList from '../FlowList';
import AddLanguageDialog from '../AddLanguageDialog';
import StarDialog from '../StarDialog';
import InitLoadingDialog from '../InitLoadingDialog';

const title = 'Languist';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      count: {
        followingCount: 0,
        followersCount: 0,
        starredCount: 0
      },
      cover: {
        avatar_rul: '',
        name: 'Languist',
        langs: 0
      },
      repoList: [],
      flowList: [],
      langList: [],
      currentRecommend: 0,
      hasMore: true,

      //Dialog
      isOpenDialog: false,
      addLang: {},

      // Star dialog
      isStarDialogOpen: false,
      currentStar: '',
      setList: [],
      isEdit: false,

      // Loading dialog
      hasRecommend: true
    };
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  async componentDidMount() {
    try {
      // Get username
      const user = await $.ajax('/api/current_user');
      console.log('Current user is', user);

      let hasRecommend = await $.ajax('/api/home/hasRecommend?user='+user);
      console.log('hasRecommend '+ hasRecommend.res);

      this.setState({user: user, hasRecommend: hasRecommend.res==1});

      if(user) {
        // Get other data
        await this.loadData(user);
      } else {
        window.location.href = '/login';
      }
    } catch(err) {
      console.error(err);
    }
  }

  async loadData(user) {
    let isHaveLanguage = true;

    this.getLangList(user);

    const count = await $.ajax('/api/home/count?user=' + user)
    const cover = await $.ajax('/api/home/cover?user=' + user);
    this.setState({
      count: count,
      cover: cover
    });

    const data = await $.ajax('/api/home/flowList?user=' + user);
    const unit = {
      title: 'Today',
      data: data
    };
    let list = this.state.flowList.slice();
    list.push(unit);
    this.setState({
      flowList: list,
      hasRecommend: true,
    });

    this.getSetList(user);
  }

  // Get langList
  getLangList(user) {
    let url = '/api/home/langList?user=' + user;
    $.ajax(url)
      .done(((data) => {
        if(data && data.length != 0) {
          this.setState({langList: data});
        }else {
          window.location.href = '/language';
        }
      }).bind(this))
      .fail(((xhr, status, err) => {
        console.error(url, status, err.toString());
      }).bind(this));
  }

  getSetList(user) {
    let url = '/api/repo/setList';
    $.ajax(url, {data: {user: user}})
      .done(((data) => {
        let setList = [];
        let all = {name: 'All', count: 0};
        setList.push(all);
        data.forEach((set) => {
          all.count += set.repoNum;
          setList.push({name: set.setName, count: set.repoNum});
        });

        this.setState({setList: setList});
      }).bind(this));
  }

  // Add langauge dialog
  handleAddLanguage(language, level, isEdit) {
    this.setState({addLang: {name: language, isSelected: true, level: level || 0}, isOpenDialog: true, isEdit: isEdit});
  }

  handleDialogClose(isSuccess) {
    if(isSuccess) {
      console.log('success');
      this.getLangList(this.state.user);
    }
    this.setState({addLang: '', isOpenDialog: false});
  }

  handleUnlike(param) {
    let url = '/api/rec/evaluate';
    let data = {
      login: this.state.user,
      name: param.name,
      type: param.type
    }
    // console.log('UNLIKE', data);
    $.ajax({url, data, type:'POST'})
    .done(((data) => {
      // console.log('UNLIKE', data);
      if (data.res === 1) {
        this.hideFlowItem(param);
        this.props.handleSnackbarOpen('Marked ' + param.name + ' as NOT INTERESTED');
      }
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));
  }

  hideFlowItem(param) {
    let types = ['user', 'repo', 'lang'];
    let type = types[param.type];
    let list = this.state.flowList.slice();
    list.forEach((unit) => {
      let data = unit.data;
      let index = -1;
      data.forEach((item) => {
        if (item.type === type) {
          switch (param.type) {
            case 0:
              if (item.login === param.name) {
                index = data.indexOf(item);
              }
              break;
            case 1:
              if (item.full_name === param.name) {
                index = data.indexOf(item);
              }
              break;
            case 2:
              if (item.name === param.name) {
                index = data.indexOf(item);
              }
              break;
            default:
          }
        }
      })
      data = data.splice(index, 1);
    });
    this.setState({flowList: list});
  }

  async handleFollow(follow) {
    let user = this.state.user;
    let url = '/api/user/follow';
    let data = {user, follow};
    let res = await $.ajax({url, data, type: 'POST'});
    if (res.res === 1) {
      this.setFollowing(follow, true);
      this.props.handleSnackbarOpen(`${follow} is added to your following list :-D`);
      return true;
    }
    return false;
  }

  async handleUnfollow(follow) {
    let user = this.state.user;
    let url = '/api/user/unfollow';
    let data = {user, follow};
    let res = await $.ajax({url, data, type: 'POST'});
    if (res.res === 1) {
      this.setFollowing(follow, false);
      this.props.handleSnackbarOpen(`${follow} is removed from your following list :-)`);
      return true;
    }
    return false;
  }

  async handleUnstar(repo) {
    let user = this.state.user;
    let data = {user, repo};
    let url = '/api/repo/unstar';
    let res = await $.ajax({url, data, type: 'POST'});
    if (res.res === 1) {
      this.setStarSet(repo);
      this.props.handleSnackbarOpen(`${repo} is removed from your stars :-)`);
      return true;
    }
    return false;
  }

  setFollowing(follow, isFollowing) {
    let list = this.state.flowList.slice();
    list.forEach((unit) => {
      let data = unit.data;
      data.forEach((item) => {
        if (item.type === 'user' && item.login === follow) {
          item.isFollowing = isFollowing;
        }
      })
    });
    this.setState({flowList: list});
  }

  handleLoad() {
    let recommendCount = this.state.currentRecommend;
    recommendCount--;
    let today = new Date();
    let day = new Date(today);
    day.setDate(today.getDate() + recommendCount);
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let title = day.toLocaleDateString('en-US', options);

    const url = `/api/recommend/more?login=${this.state.user}&times=${recommendCount}`;
    console.log(url);
    $.ajax(url)
    .done(((data) => {
      if (data.length > 0) {
        let unit = {
          title: recommendCount === -1 ? 'Yesterday' : title,
          data: data
        };
        let list = this.state.flowList.slice();
        list.push(unit);
        this.setState({flowList: list, currentRecommend: recommendCount});
      } else {
        this.setState({hasMore: false});
      }
    }).bind(this))
    .fail(((xhr, status, err) => {
      console.error(url, status, err.toString());
    }).bind(this));
  }

  // Handle StarDialog
  handleOpenStarDialog(repo) {
    console.log(repo);
    this.setState({isStarDialogOpen: true, currentStar: repo});
  }

  handleCloseStarDialog(isSuccess, set) {
    let newState = {};
    newState.isStarDialogOpen = false;
    newState.currentStar = '';

    if (isSuccess) {
      this.getSetList(this.state.user);
      this.state.flowList.forEach((data) => {
        data.data.forEach((repo)=> {
          if(repo.type == 'repo' && repo.full_name == this.state.currentStar) {
            repo.set = set;
          }
        });
      });
      newState.flowList = this.state.flowList;
      this.props.handleSnackbarOpen(`${this.state.currentStar} is added to your star set <${set}> :-D`);
    }
    this.setState(newState);
  }

  setStarSet(repo) {
    let list = this.state.flowList.slice();
    list.forEach((unit) => {
      let data = unit.data;
      data.forEach((item) => {
        if (item.type === 'repo' && item.full_name === repo) {
          item.set = '';
        }
      })
    });
    this.setState({flowList: list});
  }

  componentWillMount() {
    console.log('componentWillMount');
    this.context.onSetTitle(title);
  }

  render() {
    console.log('render HomePage');
    return (
      <div className="HomePage">
        <Cover data={this.state.cover} />
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <Count data={this.state.count} />
              <LanguageList data={this.state.langList} handleEdit={this.handleAddLanguage.bind(this)}/>
            </div>
            <div className={s.main}>
              <FlowList
                user={this.state.user}
                data={this.state.flowList}
                hasMore={this.state.hasMore}
                handleAddLanguage={this.handleAddLanguage.bind(this)}
                handleUnlike={this.handleUnlike.bind(this)}
                handleLoad={this.handleLoad.bind(this)}
                handleStar={this.handleOpenStarDialog.bind(this)}
                handleFollow={this.handleFollow.bind(this)}
                handleUnfollow={this.handleUnfollow.bind(this)}
                handleUnstar={this.handleUnstar.bind(this)}
              />
            </div>
          </div>
        </div>
        <AddLanguageDialog
          isOpen={this.state.isOpenDialog}
          language={this.state.addLang}
          user={this.state.user}
          handleClose={this.handleDialogClose.bind(this)}
          isEdit={this.state.isEdit}/>
        <StarDialog isOpen={this.state.isStarDialogOpen}
                    setList=
                      {this.state.setList.filter((set)=> {
                        return set.name != 'All'
                      })}
                    handleClose={this.handleCloseStarDialog.bind(this)}
                    repo = {this.state.currentStar}
                    user = {this.state.user}
                    isEdit={this.state.isEdit}/>
        <InitLoadingDialog
          isOpen={!this.state.hasRecommend}/>
      </div>
    );
  }
}

export default withStyles(HomePage, s);
