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

let langData = [
  {
    name: "JavaScript",
    isSelected: false,
    repoNum: 4000000
  },
  {
    name: "C++",
    isSelected: true,
    repoNum: 2131200
  },
  {
    name: "Java",
    isSelected: false,
    repoNum: 2100000
  }
];

class LanguagePage extends Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Paper>
            <TextField hintText="Choose languages you are good at or learning"
                       fullWidth={true}
                       underlineShow={false}
                       inputStyle={{padding: '0 16px', boxSizing: 'border-box'}}
                       hintStyle={{padding: '0 16px'}}
            />
            <LangList langData={langData}/>
            <div className={s.btn__group}>
              <RaisedButton label="DONE" primary={true}/>
              <RaisedButton label="CANCEL"/>
            </div>
          </Paper>
        </div>
      </div>
    )
  }
}

export default withStyles(LanguagePage, s);
