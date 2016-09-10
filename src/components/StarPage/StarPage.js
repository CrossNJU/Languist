/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './StarPage.scss';
import Cover from '../Cover';
import RepoSetFilter from '../RepoSetFilter';
import RepoList from '../RepoList';

const title = 'Star';

let currentRepoSetFilter = 'Ungrouped';
let repoSetFilterData = [
  {
    name: 'All',
    count: 34
  },
  {
    name: 'Ungrouped',
    count: 18
  },
  {
    name: 'React',
    count: 3
  },
  {
    name: 'UI',
    count: 4
  },
  {
    name: 'CSS Framework',
    count: 4
  },
  {
    name: 'iOS',
    count: 3
  }
];

class StarPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      cover: {
        avatar_rul: '',
        name: 'PolarisChen\'s Starred',
        langs: 0
      },
      setList: [],
      currentSet: 'All',
      repoList: []
    };
    console.log('constructor');
  }
  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    console.log('componentWillMount');
    this.context.onSetTitle(title);
  }

  async componentDidMount() {
    console.log('componentDidMount');
    try {
      // const user = await $.ajax('/api/current_user');

      const user = 'chenmuen';

      this.getSetList(user);
      // this.getRepoList(user, 'All');
      this.setState({user: user});
    } catch(err) {
      console.error(err);
    }
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

        console.log(data.res)
      }).bind(this));
  }

  getRepoList(user, set) {
    let url = '/api/repo/set';
    $.ajax(url, {data:{user: user, setName:set}})
      .done(((repoList) => {
        this.setState({repoList: repoList, currentSet: set});
      }).bind(this));
  }

  render() {
    console.log('render StarPage');
    return (
      <div className="BasePage">
        <Cover data={this.state.cover}/>
        <div className={s.root}>
          <div className={s.container}>
            <div className={s.sidebar}>
              <RepoSetFilter data={this.state.setList} current={this.state.currentSet}/>
            </div>
            <div className={s.main}>
              <RepoList data={this.state.repoList}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(StarPage, s);
