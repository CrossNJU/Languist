/**
 * Created by PolarisChen on 16/7/11.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RepoList.scss';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import Toggle from 'material-ui/Toggle';
import FontIcon from 'material-ui/FontIcon';

import Code from 'material-ui/svg-icons/action/code';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Star from 'material-ui/svg-icons/toggle/star';


let repoData = [
  {
    avatarUrl: '',
    owner: 'facebook',
    name: 'react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces. https://facebook.github.io/react/',
    tags: [
      'JavaScript',
      'Framework'
    ],
    update: 'July 11, 2016',
    star: 2731
  },
  {
    avatarUrl: '',
    owner: 'callemall',
    name: 'material-ui',
    description: 'React Components that Implement Google\'s Material Design. http://www.material-ui.com',
    tags: [
      'JavaScript',
      'Framework',
      'React',
      'UI'
    ],
    update: 'July 11, 2016',
    star: 1523
  },
  {
    avatarUrl: '',
    owner: 'kriasoft',
    name: 'react-starter-kit',
    description: 'React Starter Kit — isomorphic web app boilerplate (Node.js, Express, GraphQL, React.js, Babel 6, PostCSS, Webpack, Browsersync) https://www.reactstarterkit.com',
    tags: [
      'JavaScript',
      'Framework',
      'React',
      'Starter Kit'
    ],
    update: 'July 11, 2016',
    star: 9298
  }
];

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

class RepoItem extends Component {
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
        <CardActions style={{marginLeft: 12, paddingTop: 16, paddingBottom: 6}}>
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

class RepoList extends Component {
  constructor(props) {
    super(props);
  }
  renderRepos() {
    console.log(JSON.parse(JSON.stringify(this.props.data)));
    repoData = this.props.data;
    if (repoData.length > 0) {
      let repos = repoData.map(repo => {
        return (<RepoItem key={repo.owner + repo.name} repo={repo} />);
      });
      return repos;
    } else {
      return (<div>Loading...</div>);
    }
  };

  render() {
    return (
      <div className={s.container}>
        {this.renderRepos()}
      </div>
    );
  }
}

export default withStyles(RepoList, s);
