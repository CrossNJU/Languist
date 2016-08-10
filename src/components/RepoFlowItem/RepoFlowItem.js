/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RepoFlowItem.scss';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';

import Code from 'material-ui/svg-icons/action/code';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Star from 'material-ui/svg-icons/toggle/star';

const styles = {
  chip: {
    fontSize: '12px',
    fontWeight: 300,
    color: '#666'
  },
  actions: {
    marginLeft: 10,
  }
};

class RepoFlowItem extends Component {
  render() {
    return (
      <Card className={s.item}>
        <CardHeader
          title={this.props.repo.owner + '/' + this.props.repo.name}
          titleStyle={{color: '#74C2CE', fontSize: '16px'}}
          subtitle={'Updated on ' + this.props.repo.update}
          subtitleStyle={{fontSize: '12px', fontWeight: 300, color: '#666'}}
          avatar={require('./avatar-default-s.png')}
        />
        <CardText style={{paddingTop: 6, paddingBottom: 6}}>
          {this.props.repo.description}
        </CardText>
        <CardText style={{paddingTop: 6, paddingBottom: 6}}>
          <div className={s.tags}>
            {
              this.props.repo.tags.map((tag, i) => {
                return (
                  <Chip
                    key={i}
                    labelStyle={styles.chip}
                    style={{marginRight: 6, marginBottom: 6}}
                    onTouchTap={this.handleTouchTap}
                  >
                    {tag}
                  </Chip>
                );
              })
            }
          </div>
        </CardText>
        <CardActions style={{marginLeft: 10, paddingTop: 16, paddingBottom: 6}}>
          <RaisedButton
            icon={<Star />}
            label={'Star (' + this.props.repo.star + ')'}
            primary={true}
            onTouchTap={this.handleExpand} />
          <RaisedButton
            icon={<Code />}
            label="View"
            labelColor="#666"
            onTouchTap={this.handleReduce} />
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(RepoFlowItem, s);
