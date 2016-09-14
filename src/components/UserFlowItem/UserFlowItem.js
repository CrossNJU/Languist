/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './UserFlowItem.scss';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import Person from 'material-ui/svg-icons/social/person';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import PersonOutline from 'material-ui/svg-icons/social/person-outline';
import Star from 'material-ui/svg-icons/toggle/star';
import Undo from 'material-ui/svg-icons/content/undo';

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
  },
  tooltip: {
    top: '16px'
  },
  circularProgress: {
    position: 'relative',
    top: '-6px'
  },
  tableAction: {
    color: '#888'
  },
};

class UserFlowItem extends Component {
  constructor(props) {
    super(props);
    this.state = {hovering: false, loading: false, open: false};
  }
  renderTable() {
    let repos = [
      {
        name: 'sindresorhus/awesome',
        star: 42349
      },
      {
        name: 'sindresorhus/awesome-nodejs',
        star: 13378
      },
      {
        name: 'avajs/ava',
        star: 6403
      }
    ]
    let repoTable = repos.map(repo => {
      return (
        <div className={s.row} target="_blank" href={`https://github.com/${repo.name}`} title="View this repository on GitHub">
          <a className={s.rowTitle}>{repo.name.replace(`${this.props.user.login}/`, '')}</a>
          <div className={s.rowAction}>{repo.star} ★</div>
        </div>
      )
    })
    return (
      <div className={s.table}>
        {repoTable}
      </div>
    )
  }
  handleFollow() {
    this.props.handleFollow(this.props.user.login);
    this.setState({loading: true});
  }
  handleUnfollow() {
    this.props.handleUnfollow(this.props.user.login);
    this.setState({loading: true});
  }
  handleUnlike() {
    let param = {
      type: 0,
      name: this.props.user.login
    };
    console.log('UNLIKE', param);
    this.props.handleUnlike(param);
  }
  handleMouseOver() {
    this.setState({hovering: true});
  }
  handleMouseOut() {
    this.setState({hovering: false});
  }
  handlePopover(event) {
    event.preventDefault();   // This prevents ghost click.
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }
  handleRequestClose() {
    this.setState({
      open: false,
    });
  };
  renderFollowButton() {
    if (!this.props.user.isFollowing) {
      return (
        <RaisedButton
          className={s.mainButton}
          icon={!this.state.loading ? <PersonAdd /> : <CircularProgress size={0.4} innerStyle={styles.circularProgress} />}
          label={!this.state.loading ? 'Follow (' + this.props.user.followers + ')' : ''}
          secondary={true}
          disabled={this.state.loading}
          disabledBackgroundColor="#F2DF83"
          disabledLabelColor="#FFF"
          onTouchTap={this.handleFollow.bind(this)} />
      )
    } else {
      return (
        <div>
          <RaisedButton
            className={s.mainButton}
            icon={<Person />}
            label={'Following'}
            labelColor="#F2DF83"
            onTouchTap={this.handlePopover.bind(this)} />
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}
          >
            <Menu>
              <MenuItem primaryText="Unfollow" leftIcon={<Undo />} onTouchTap={this.handleUnfollow.bind(this)} />
            </Menu>
          </Popover>
        </div>
      )
    }
  }
  renderInviteButton() {
    // let shouldInvite = !this.props.user.isLanguist;
    let shouldInvite = false;
    if (shouldInvite) {
      return (
        <RaisedButton
          className={s.mainButton}
          icon={<PersonAdd />}
          label={'Invite'}
          labelColor="#666"
          onTouchTap={this.handleExpand} />
      )
    }
  }
  renderNotInterestedButton() {
    if (this.props.optional && this.state.hovering) {
      return (
        <FlatButton
          style={styles.optionalAction}
          label='Not interested'
          onTouchTap={this.handleUnlike.bind(this)}
        />
      );
    }
  }
  renderViewButton() {
    return (
      <RaisedButton
        className={s.mainButton}
        icon={<Star />}
        label="View Starred"
        labelColor="#666"
        href={`/starred?login=${this.props.user.login}`}
      />
    )
  }
  render() {
    const title = this.props.user.name ? this.props.user.name + ' (' + this.props.user.login + ')' : this.props.user.login;
    let subtitle = 'Joined on ' + this.props.user.join.split('T')[0];
    if (this.props.user.location) {
      subtitle += ' / ' + this.props.user.location;
    }
    const link = 'https://github.com/' + this.props.user.login;
    return (
      <Card className={s.item} onMouseEnter={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseOut.bind(this)}>
        <CardHeader
          title={<a href={link} target="_blank" title="View this user on GitHub">{title}</a>}
          titleStyle={styles.title}
          subtitle={subtitle}
          subtitleStyle={styles.subtitle}
          avatar={this.props.user.avatarUrl || require('./avatar-default-s.png')}
        />
        <CardText style={styles.cardText}>
          {this.props.user.bio}
          {this.renderTable()}
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
          <div style={styles.mainActions}>
            {this.renderFollowButton()}
            {this.renderViewButton()}
            {this.renderInviteButton()}
          </div>
          <div style={styles.optionalActions}>
            {this.renderNotInterestedButton()}
          </div>
        </CardActions>
        <div className={s.iconButtonWrap}>
          <IconButton
            iconClassName="muidocs-icon-custom-github"
            iconStyle={styles.iconButton}
            href={link}
            target="_blank"
            tooltip="View this user on GitHub"
            touch={true}
            tooltipPosition="bottom-left"
            tooltipStyles={styles.tooltip}
          />
        </div>
      </Card>
    );
  }
}

export default withStyles(UserFlowItem, s);
