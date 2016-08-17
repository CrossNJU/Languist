/**
 * Created by PolarisChen on 16/7/11.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangList.scss';

import List from "material-ui/List/List";
import LangItem from '../LangItem';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';


class LangList extends Component {
  langData;

  constructor(props) {
    super(props);
    this.langData = this.props.langData;
  }

  componentWillReceiveProps(nextProps) {
    let langData = nextProps.langData.map((lang) => {
      return {
        name: lang.name,
        isSelected: false,
        level: 0
      }
    });
    this.langData = langData;
  }

  handleSubmit() {
    let langs = this.langData;
    console.log(langs);
    langs = langs.filter((lang) => {
      return lang.isSelected;
    });
    langs.forEach((lang) => {
      $.ajax('api/lang/choose', {async: false, data: {lang:lang.name, level: lang.level, login: this.props.user}})
        .done((function (message) {
          console.log('choose ' + lang.name + " " + message);
        }));
    });
  }

  handleChange(lang) {
    let langData = this.langData;
    langData.forEach((l, index) => {
      if(l.name == lang.name) {
        langData[index] = lang;
      }
    });
  }

  renderLanguage() {
    return this.props.langData.map(lang => {
      return (
        <LangItem key={lang.name + "Item"} lang={lang} ref={lang.name} handleChange={this.handleChange.bind(this)}/>
      )
    });
  }

  render() {
    return (
      <div className={s.root}>
        <List style={{padding:'0px'}}>
          {this.renderLanguage()}
        </List>
        <div className={s.btn__group}>
          <RaisedButton label="DONE" primary={true} onClick={this.handleSubmit.bind(this)}/>
          <RaisedButton label="CANCEL"/>
        </div>
      </div>
    )
  }

}

export default withStyles(LangList, s);
