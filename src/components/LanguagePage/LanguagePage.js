/**
 * Created by chenm on 2016/7/14.
 */
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import LangList from '../LangList';

import s from './LanguagePage.scss';
import Paper from 'material-ui/Paper';
import $ from 'jquery';
import SearchField from '../SearchField';
import RaisedButton from 'material-ui/RaisedButton';

import AddLanguageDialog from '../AddLanguageDialog';

// let originalLang = [
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

const title = 'Add Language';

class LanguagePage extends Component {
  originalLang;
  langData;

  constructor(props) {
    super(props);
    this.state = {
      user: "",
      langData: [],
      isOpen: true
    }
  }

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  async componentDidMount() {
    let user = null;
    let allLang = [];
    let userLang = [];

    $.ajax('/api/current_user', {async: false})
      .done(((userData) => {
        if(userData) {
          user = userData;
        } else {
          window.location.href = "/login";
        }
      }).bind(this));

    // user = 'chenmuen';

    // Get all language
    if(user) {
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
      }).map((lang) => {
        return {
          name: lang.name,
          isSelected: false,
          repos: lang.repos,
          level: 0
        }
      });

      this.originalLang = langData.concat();
      this.langData = langData;

      this.setState({user:user, langData: langData});
    }
  }

  handleSearch(keywords) {
    let langData = this.originalLang.filter((lang) => {
      return lang.name.toLowerCase().search(keywords.toLowerCase()) != -1;
    });
    console.log('search');
    this.langData = langData;
    this.setState({langData: langData});
  }

  handleSubmit() {
    // console.log(this.langData);
    let langs = this.langData;
    langs = langs.filter((lang) => {
      return lang.isSelected;
    });
    langs.forEach((lang) => {
      $.ajax('api/lang/choose', {async: false, data: {lang:lang.name, level: lang.level, login: this.state.user}})
        .done((function (message) {
          console.log('choose ' + lang.name + " " + message);
          window.location.href = '/home';
        }));
    });
  }

  handleChange(languages) {
    this.langData = languages;
  }

  handleClose() {
    this.setState({isOpen: false});
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Paper>
            <SearchField handleSearch={this.handleSearch.bind(this)}/>
            <LangList langData={this.state.langData} user={this.state.user} handleChange={this.handleChange.bind(this)} ref="list"/>
            <div className={s.btn__group}>
              {/*<RaisedButton label="DONE" primary={true}/>*/}
              <RaisedButton label="DONE" primary={true} onClick={this.handleSubmit.bind(this)}/>
              <RaisedButton label="CANCEL" href='/home'/>
            </div>
          </Paper>
        </div>
      </div>
    )
  }
}

export default withStyles(LanguagePage, s);
