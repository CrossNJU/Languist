/**
 * Created by chenm on 2016/7/14.
 */
import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';
import LangList from '../LangList';

import s from './AddLanguageDialog.scss';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

class AddLanguageDialog extends Component {
  lang;

  componentWillReceiveProps(nextProps) {
    this.lang = nextProps.language;
  }

  handleSubmit() {
    let lang = this.lang;
    if(lang.isSelected) {
      $.ajax('api/lang/choose', {type: 'post', async: false, data: {lang:lang.name, level: lang.level, login: this.props.user}})
        .done((function (message) {
          console.log('choose ' + lang.name + " " + message);
        }));
    }else {
      $.ajax('api/lang/delete', {type: 'post', async: false, data: {lang:lang.name, login: this.props.user}})
        .done((function (message) {
          console.log('delete ' + lang.name + " " + message);
        }));
    }
    this.handleClose(true);
  }

  handleClose(isSuccess) {
    this.props.handleClose(isSuccess);
  }

  handleChange(languages) {
    this.lang = languages[0];
  }

  render() {
    return (
      <Dialog
        title={this.props.isEdit?"Edit the language":"Add a new language"}
        modal={true}
        open={this.props.isOpen}>
        <LangList langData={[this.props.language]} user={this.props.user} handleChange={this.handleChange.bind(this)}/>
        <div className={s.btn__group}>
          <RaisedButton label="DONE" primary={true} onClick={this.handleSubmit.bind(this)}/>
          <RaisedButton label="CANCEL" onTouchTap={this.handleClose.bind(this, false)}/>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(AddLanguageDialog, s);
