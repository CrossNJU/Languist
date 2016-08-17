/**
 * Created by chenm on 2016/7/14.
 */
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import LangList from '../LangList';

import s from './LanguagePage.scss';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import $ from 'jquery';
import SearchField from '../SearchField';

const title = 'Add Language';

// let langData = [
//   {
//     name: "JavaScript",
//     isSelected: false,
//     level: 0,
//     repoNum: 4000000
//   },
//   {
//     name: "C++",
//     isSelected: true,
//     level: 1,
//     repoNum: 2131200
//   },
//   {
//     name: "Java",
//     isSelected: false,
//     level: 0,
//     repoNum: 2100000
//   }
// ];
//
// let allLanguage = [
//   {
//     name: 'Java',
//     repoNum: 210000,
//   },
//   {
//     name: "JavaScript",
//     repoNum: 4000000
//   },
//   {
//     name: "C++",
//     repoNum: 2131200
//   },
//   {
//     name: "Ruby",
//     repoNum: 2012400
//   }
// ];
//
// let userLanguage = [
//   {
//     name: 'Java',
//     level: 1
//   }
// ];

class LanguagePage extends Component {
  langData;

  constructor(props) {
    super(props);
    this.state = {
      user: "RickChem",
      langData: []
    }
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  componentDidMount() {
    let user = this.state.user;
    let allLang = [];
    let userLang = [];

    // Get all language
    $.ajax('/api/language/all', {async: false})
      .done(((allLanguages) => {
        // console.log(allLanguages);
        allLang = allLanguages;
      }).bind(this));

    // Get user language
    $.ajax('/api/home/langList', {async: false, data:{user: user}})
      .done(((userLanguages) => {
        userLang = userLanguages;
      }).bind(this));

    // Delete selected language
    let langData = allLang.filter((lang) => {
      let result = true;
      userLang.forEach((l) => {
        if(l.name == lang.name) {
          result = false;
          // console.log(lang.name);
        }
      });
      return result;
    });
    this.langData = langData.concat();
    this.setState({langData: langData});
  }

  handleSearch(keywords) {
    let langData = this.langData.filter((lang) => {
      return lang.name.toLowerCase().search(keywords.toLowerCase()) != -1;
    });
    console.log('search');
    this.setState({langData: langData});
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Paper>
            <SearchField handleSearch={this.handleSearch.bind(this)}/>
            <LangList langData={this.state.langData} user={this.state.user} ref="list"/>
          </Paper>
        </div>
      </div>
    )
  }
}

export default withStyles(LanguagePage, s);
