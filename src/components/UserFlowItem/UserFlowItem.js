/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UserFlowItem.scss';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';

import Person from 'material-ui/svg-icons/social/person';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import PersonOutline from 'material-ui/svg-icons/social/person-outline';
import Star from 'material-ui/svg-icons/toggle/star';

const styles = {
  title: {
    fontSize: '16px',
    color: '#74C2CE'
  },
  subtitle: {
    fontSize: '12px',
    fontWeight: 300,
    color: '#666'
  },
  chipLabel: {
    fontSize: '12px',
    fontWeight: 300,
    color: '#666'
  },
  chip: {
    marginRight: 6,
    marginBottom: 6
  },
  cardText: {
    paddingTop: 6,
    paddingBottom: 6
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
    paddingTop: 16,
    paddingBottom: 6
  },
  mainActions: {
    display: 'flex',
    flexDirection: 'row',
    flexBasis: 0,
    flexGrow: 1
  },
  optionalAction: {
    flexBasis: 1,
    flexGrow: 'auto',
    color: '#CCC'
  },
  iconButton: {
    color: '#BBB'
  }
};

class UserFlowItem extends Component {
  renderFollowButton() {
    if (!this.props.user.isFollowing) {
      return (
        <RaisedButton
          className={s.mainButton}
          icon={<PersonAdd />}
          label={'Follow (' + this.props.user.followers + ')'}
          secondary={true}
          onTouchTap={this.handleExpand} />
      )
    } else {
      return (
        <RaisedButton
          className={s.mainButton}
          icon={<Person />}
          label={'Following'}
          labelColor="#F2DF83"
          onTouchTap={this.handleExpand} />
      )
    }
  }
  renderInviteButton() {
    if (!this.props.user.isLanguist) {
      return (
        <RaisedButton
          className={s.mainButton}
          icon={<PersonAdd />}
          label={'Invite to Languist'}
          labelColor="#666"
          onTouchTap={this.handleExpand} />
      )
    }
  }
  render() {
    let title = this.props.user.name ? this.props.user.name + ' (' + this.props.user.login + ')' : this.props.user.login;
    let subtitle = 'Joined on ' + this.props.user.join.split('T')[0];
    if (this.props.user.location) {
      subtitle += ' / ' + this.props.user.location;
    }
    return (
      <Card className={s.item}>
        <CardHeader
          title={title}
          titleStyle={styles.title}
          subtitle={subtitle}
          subtitleStyle={styles.subtitle}
          avatar={this.props.user.avatarUrl || require('./avatar-default-s.png')}
        />
        <CardText style={styles.cardText}>
          {this.props.user.bio}
        </CardText>
        <CardText style={styles.cardText}>
          <div className={s.tags}>
            {
              this.props.user.langs.map((lang, i) => {
                return (
                  <Chip
                    key={i}
                    labelStyle={styles.chipLabel}
                    style={styles.chip}
                    onTouchTap={this.handleTouchTap}
                  >
                    {lang}
                  </Chip>
                );
              })
            }
          </div>
        </CardText>
        <CardActions style={styles.cardActions}>
          {this.renderFollowButton()}
          <RaisedButton
            className={s.mainButton}
            icon={<Star />}
            label="View Starred"
            labelColor="#666"
          />
          {this.renderInviteButton()}
        </CardActions>
        <div className={s.iconButtonWrap}>
          <IconButton
            iconClassName="muidocs-icon-custom-github"
            iconStyle={styles.iconButton}
            href={'https://github.com/'+this.props.user.login}
          />
        </div>
      </Card>
    );
  }
}

export default withStyles(UserFlowItem, s);
