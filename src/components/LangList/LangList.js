/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangList.scss';

import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import Toggle from "material-ui/Toggle";

class LangItem extends Component {
  render() {
    return (
      <ListItem>
        <Toggle/>
        <p>JavaScript</p>
        <img src={require('./logo-s@2x.png')}/>
        <p>1000000</p>
      </ListItem>
    )
  }
}


class LangList extends Component {
  render() {
    return (
      <List>
        <LangItem/>
        <LangItem/>
        <LangItem/>
      </List>
    )
  }
}

export default withStyles(LangList, s);
