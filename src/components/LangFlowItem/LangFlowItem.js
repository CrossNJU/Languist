/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangFlowItem.scss';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';

import Paper from 'material-ui/Paper';

import Add from 'material-ui/svg-icons/content/add';

const styles = {
  chip: {
    fontSize: '12px',
    fontWeight: 300,
    color: '#666'
  },
  actions: {
    marginLeft: 12,
  }
};

class LangFlowItem extends Component {
  render() {
    return (
      <Paper className={s.item}>
        <div className={s.text}>
          <div className={s.title}>{this.props.lang.name}</div>
          <div className={s.subtitle}>{this.props.lang.description}</div>
        </div>
        <div className={s.action}>
          <RaisedButton
            icon={<Add />}
            label={'Add'}
            primary={true}
            onTouchTap={this.handleExpand} />
        </div>
        
      </Paper>
    );
  }
}

export default withStyles(LangFlowItem, s);
