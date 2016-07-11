/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LanguageList.scss';

import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RaisedButton from 'material-ui/RaisedButton';

class LanguageItem extends Component {
  render() {
    return (
      <ListItem innerDivStyle={{paddingTop: '8px', paddingBottom: '8px'}}>
        <div className={s.item}>
          <Avatar src={require('./avatar-default.png')} size={36} className={s.avatar}/>
          <div className={s.text}>{this.props.lang.name}</div>
          <div className={s.level}>
            {[...Array(this.props.lang.level)].map((x, i) =>
              <img src={require('./logo-s@2x.png')} width="18" />
            )}
          </div>
        </div>
      </ListItem>
    );
  }
}

let langData = [
  {
    name: 'JavaScript',
    level: 3
  },
  {
    name: 'HTML',
    level: 4
  },
  {
    name: 'CSS',
    level: 4
  },
  {
    name: 'Objective-C',
    level: 3
  },
  {
    name: 'Swift',
    level: 1
  },
  {
    name: 'PHP',
    level: 2
  }
];

class LanguageList extends Component {
  renderLanguages() {
    let languages = langData.map(language => {
      return <LanguageItem key={language.name} lang={language} />;
    });
    return languages;
  }
  render() {

    return (
      <Paper className={s.container}>
        <List>
          {this.renderLanguages()}
        </List>
        <div className={s.action}>
          <RaisedButton
            fullWidth={true}
            primary={true}
            label="Add New Language"
          />
        </div>
      </Paper>
    );
  }
}

export default withStyles(LanguageList, s);
