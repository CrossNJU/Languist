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

  handleSubmit() {
    let lang = this.lang;
    if(lang.isSelected) {
      $.ajax('api/lang/choose', {async: false, data: {lang:lang.name, level: lang.level, login: this.props.user}})
        .done((function (message) {
          console.log('choose ' + lang.name + " " + message);
        }));
    }
    this.props.handleClose();
  }

  handleChange(languages) {
    this.lang = languages[0];
  }

  render() {
    return (
      <Dialog
        title="Add New Language"
        modal={true}
        open={this.props.isOpen}>
        <LangList langData={[this.props.language]} user={this.props.user}/>
        <div className={s.btn__group}>
          <RaisedButton label="DONE" primary={true} onClick={this.handleSubmit.bind(this)}/>
          <RaisedButton label="CANCEL" onClick={this.props.handleClose}/>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(AddLanguageDialog, s);
