/**
 * Created by PolarisChen on 16/7/11.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangList.scss';

import List from "material-ui/List/List";
import LangItem from '../LangItem';



class LangList extends Component {
  // originalLang;

  constructor(props) {
    super(props);
  }

  handleChange(lang) {
    let langData = this.props.langData;
    langData.forEach((l, index) => {
      if(l.name == lang.name) {
        langData[index] = lang;
      }
    });
    this.props.handleChange(langData);
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
      </div>
    )
  }

}

export default withStyles(LangList, s);
