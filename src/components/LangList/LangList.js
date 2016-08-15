/**
 * Created by PolarisChen on 16/7/11.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangList.scss';

import List from "material-ui/List/List";
import LangItem from '../LangItem';

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

class LangList extends Component {
  renderLanguage() {
    return langData.map(lang => {
      return (
        <LangItem lang={lang}/>
      )
    })
  }

  render() {
    return (
      <List className={s.root}
            style={{padding:'0px'}}>
        {this.renderLanguage()}
      </List>
    )
  }
}

export default withStyles(LangList, s);
