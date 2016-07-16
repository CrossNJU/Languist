/**
 * Created by chenm on 2016/7/14.
 */
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import LangList from '../LangList';

import s from './LanguagePage.scss';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

let LangData = [
  {
    name: "JavaScript",
    isChosen: false,
    repoNum: 1000000
  }
];

class LanguagePage extends Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Paper>
            <TextField hintText="Choose languages you are good at or learning" fullWidth={true} underlineShow={false}/>
            <LangList/>
            <RaisedButton label="DONE" primary={true}/>
            <RaisedButton label="CANCEL"/>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(LanguagePage, s);
