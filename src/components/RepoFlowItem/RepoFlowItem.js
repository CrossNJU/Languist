/**
 * Created by PolarisChen on 16/8/10.
 */

import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RepoFlowItem.scss';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';

import Code from 'material-ui/svg-icons/action/code';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
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

class RepoFlowItem extends Component {
  constructor(props) {
    super(props);
    this.state = {hovering: false};
  }
  handleStar() {
    let user = this.props.currentUser;
    let repo = this.props.repo.owner+'/'+this.props.repo.name;
    let url = `/api/repo/star?user=${user}&repo=${repo}`;
    console.log('###',url);
    $.ajax(url)
      .done(((data) => {
        console.log("$$$",data);
      }).bind(this))
      .fail(((xhr, status, err) => {
        console.error(url, status, err.toString());
      }).bind(this));
  }
  handleUnlike() {
    let param = {
      type: 1,
      name: this.props.repo.owner+'/'+this.props.repo.name
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
  renderStarButton() {
    if (this.props.repo.set) {
      return (
        <RaisedButton
          className={s.mainButton}
          icon={<Star />}
          label={this.props.repo.set || 'UNGROUPED'}
          labelColor="#F2DF83"
          onTouchTap={this.handleStar.bind(this)} />
      )
    }
    return (
      <RaisedButton
        className={s.mainButton}
        icon={<Star />}
        label={'Star (' + this.props.repo.star + ')'}
        secondary={true}
        onTouchTap={this.handleStar.bind(this)} />
    )
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
  render() {
    return (
      <Card className={s.item} onMouseEnter={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseOut.bind(this)}>
        <CardHeader
          title={this.props.repo.owner + '/' + this.props.repo.name}
          titleStyle={styles.title}
          subtitle={'Updated on ' + this.props.repo.update}
          subtitleStyle={styles.subtitle}
          avatar={this.props.repo.avatarUrl || require('./avatar-default-s.png')}
        />
        <CardText style={styles.cardText}>
          {this.props.repo.description}
        </CardText>
        <CardText style={styles.cardText}>
          <div className={s.tags}>
            {
              this.props.repo.tags.map((tag, i) => {
                return (
                  <Chip
                    key={i}
                    labelStyle={styles.chipLabel}
                    style={styles.chip}
                    onTouchTap={this.handleTouchTap}
                  >
                    {tag}
                  </Chip>
                );
              })
            }
          </div>
        </CardText>
        <CardActions style={styles.cardActions}>
          <div style={styles.mainActions}>
            {this.renderStarButton()}
            <RaisedButton
              className={s.mainButton}
              icon={<Code />}
              label="View Related"
              labelColor="#666"
              href={`/related?fullName=${this.props.repo.owner}/${this.props.repo.name}`}
            />
          </div>
          <div style={styles.optionalActions}>
            {this.renderNotInterestedButton()}
          </div>
        </CardActions>
        <div className={s.iconButtonWrap}>
          <IconButton
            iconClassName="muidocs-icon-custom-github"
            iconStyle={styles.iconButton}
            href={'https://github.com/'+this.props.repo.owner+'/'+this.props.repo.name}
          />
        </div>
      </Card>
    );
  }
}

export default withStyles(RepoFlowItem, s);
