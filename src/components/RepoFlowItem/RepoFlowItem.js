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
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import Code from 'material-ui/svg-icons/action/code';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Star from 'material-ui/svg-icons/toggle/star';
import Stars from 'material-ui/svg-icons/action/stars';
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
  }
};

class RepoFlowItem extends Component {
  constructor(props) {
    super(props);
    this.state = {hovering: false, loading: false, open: false, tags: []};
  }
  async componentDidMount() {
    let url = '/api/repo/languages';
    const tags = await $.ajax(url, {data: {fullName: this.props.repo.owner+'/'+this.props.repo.name}});
    this.setState({tags: tags});
  }
  handleChangeStarSet() {
    this.handleStar();
  }
  handleStar() {
    this.handleRequestClose();
    this.props.handleStar(this.props.repo.owner+'/'+this.props.repo.name);
  }
  async handleUnstar() {
    this.handleRequestClose();
    this.setState({loading: true});
    const isSuccess = await this.props.handleUnstar(this.props.repo.owner+'/'+this.props.repo.name);
    if (isSuccess) {
      this.setState({loading: false});
    }
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
  renderTags() {
    let tagsData = this.state.tags;
    if (tagsData.length > 0) {
      let tags = tagsData.map((tag, i) => {
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
      return tags;
    }
  }
  renderStarButton() {
    if (this.state.loading) {
      return (
        <RaisedButton
          className={s.mainButton}
          icon={<CircularProgress size={0.4} innerStyle={styles.circularProgress} />}
          label=''
          disabled={true}
          disabledBackgroundColor="#F2DF83"
          disabledLabelColor="#FFF"
        />
      )
    } else if (this.props.repo.set && this.props.repo.set.length > 0) {
      return (
        <div>
          <RaisedButton
            className={s.mainButton}
            icon={<Star />}
            label={this.props.repo.set}
            labelColor="#F2DF83"
            onTouchTap={this.handlePopover.bind(this)}
            disabled={this.state.loading}
          />
          <Popover
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose.bind(this)}
          >
            <Menu>
              <MenuItem primaryText="Change star set" leftIcon={<Stars />} onTouchTap={this.handleChangeStarSet.bind(this)} />
              <MenuItem primaryText="Unstar" leftIcon={<StarBorder />} onTouchTap={this.handleUnstar.bind(this)} />
            </Menu>
          </Popover>
        </div>
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
  renderRelatedButton() {
    if (!this.props.single) {
      return (
        <RaisedButton
          className={s.mainButton}
          icon={<Code />}
          label="View Related"
          labelColor="#666"
          href={`/related?repo=${this.props.repo.owner}/${this.props.repo.name}`}
        />
      )
    }
  }
  render() {
    const link = 'https://github.com/' + this.props.repo.full_name;
    return (
      <Card className={s.item} onMouseEnter={this.handleMouseOver.bind(this)} onMouseLeave={this.handleMouseOut.bind(this)}>
        <CardHeader
          title={<a href={link} target="_blank" title="View this repository on GitHub">{this.props.repo.full_name}</a>}
          titleStyle={styles.title}
          subtitle={'Updated on ' + this.props.repo.update}
          subtitleStyle={styles.subtitle}
          avatar={this.props.repo.avatarUrl || require('./avatar-default-s.png')}
        >
        </CardHeader>
        <CardText style={styles.cardText}>
          {this.props.repo.description}
        </CardText>
        <CardText style={styles.cardText}>
          <div className={s.tags}>
            {this.renderTags()}
          </div>
        </CardText>
        <CardActions style={styles.cardActions}>
          <div style={styles.mainActions}>
            {this.renderStarButton()}
            {this.renderRelatedButton()}
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
            tooltip="View this repository on GitHub"
            touch={true}
            tooltipPosition="bottom-left"
            tooltipStyles={styles.tooltip}
          />
        </div>
      </Card>
    );
  }
}

export default withStyles(RepoFlowItem, s);
