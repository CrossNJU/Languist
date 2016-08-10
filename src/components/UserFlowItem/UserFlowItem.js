/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UserFlowItem.scss';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';

import PersonAdd from 'material-ui/svg-icons/social/person-add';
import PersonOutline from 'material-ui/svg-icons/social/person-outline';
import LinkIcon from 'material-ui/svg-icons/content/link';

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

class UserFlowItem extends Component {
  render() {
    let subtitle = 'Joined on ' + this.props.user.join;
    if (this.props.user.location) {
      subtitle += ' / ' + this.props.user.location;
    }
    return (
      <Card className={s.item}>
        <CardHeader
          title={this.props.user.name + ' (' + this.props.user.login + ')'}
          titleStyle={{color: '#74C2CE', fontSize: '16px'}}
          subtitle={subtitle}
          subtitleStyle={{fontSize: '12px', fontWeight: 300, color: '#666'}}
          avatar={require('./avatar-default-s.png')}
        />
        <CardText style={{paddingTop: 6, paddingBottom: 6}}>
          {this.props.user.bio}
        </CardText>
        <CardText style={{paddingTop: 6, paddingBottom: 6}}>
          <div className={s.tags}>
            {
              this.props.user.langs.map((lang, i) => {
                return (
                  <Chip
                    key={i}
                    labelStyle={styles.chip}
                    style={{marginRight: 6, marginBottom: 6}}
                    onTouchTap={this.handleTouchTap}
                  >
                    {lang}
                  </Chip>
                );
              })
            }
          </div>
        </CardText>
        <CardActions style={{marginLeft: 10, paddingTop: 16, paddingBottom: 6}}>
          <RaisedButton
            icon={<PersonAdd />}
            label={'Follow (' + this.props.user.followers + ')'}
            primary={true}
            onTouchTap={this.handleExpand} />
          <RaisedButton
            icon={<PersonOutline />}
            label="View"
            labelColor="#666"
            onTouchTap={this.handleReduce} />
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(UserFlowItem, s);
