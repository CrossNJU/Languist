/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './IndexPage.scss';
import Card from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import CodeIcon from 'material-ui/svg-icons/action/code';
import PersonIcon from 'material-ui/svg-icons/social/person-add';
import StarIcon from 'material-ui/svg-icons/toggle/star';
import ArrowIcon from 'material-ui/svg-icons/av/play-arrow';
import FaceIcon from 'material-ui/svg-icons/action/face'

const title = 'Languist'

let brandColor = '#F2DF83';

let memberIconStyle = {
  width: '36px',
  height: '36px',
  marginRight: '10px',
  color: brandColor
};

let memberIconStyleLast = {
  width: '36px',
  height: '36px',
  color: brandColor
};

let arrowIconStyle = {
  width: '70px',
  height: '70px',
  margin: '0 28px 0 34px',
  color: brandColor
};

class HomePage extends Component {
  constructor(props) {
    super(props);
  };

  static contextTypes = {
    onSetTitle: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.context.onSetTitle(title);
  }

  render() {
    return (
      <div className="IndexPage">
        <div className={s.root} style={{backgroundColor: 'lightGrey'}}>
          <div className={`${s.content} ${s.content_1}`}>
            <h1 className={s.title}>Languist</h1>
            <div className={s.article}>
              <p>A open-source project that recommends GitHub repositories </p>
              <p>and users you might interest in based on your languages,</p>
              <p>starred repositories and following developers</p>
            </div>
            <RaisedButton label={"SIGN UP WITH GITHUB"}
                          secondary = {true}
                          style={{width: '283px', height: '46px', marginTop: '96px'}}
                          labelStyle={{fontSize: '22px', lineHeight: '46px'}}
                          href="https://github.com/login/oauth/authorize?client_id=d310933db63d64f563a0"/>
          </div>

          <div className={`${s.content} ${s.content_2}`}>
            <h2 className={s.title}>What we do</h2>
            <div className={s.content_2__main}>
              <div className={s.TagList}>
                <TagListItem text="Programing Languages" Icon={CodeIcon}/>
                <TagListItem text="Following Developers" Icon={StarIcon}/>
                <TagListItem text="Starred Repositories" Icon={PersonIcon}/>
              </div>
              <ArrowIcon style={arrowIconStyle}/>
              <SumTag/>
            </div>
          </div>

          <div className={`${s.content} ${s.content_3}`}>
            <h2 className={s.title}>Who we are</h2>
            <div className={s.memberIconList}>
              <FaceIcon style={memberIconStyle}/>
              <FaceIcon style={memberIconStyle}/>
              <FaceIcon style={memberIconStyle}/>
              <FaceIcon style={memberIconStyleLast}/>
            </div>
            <p>Cross is a team from Nanjing University. We currently have 4 members and we all love coding.</p>
            <h3>Write us a letter :-)</h3>
          </div>

          <div className={`${s.content} ${s.content_4}`}>
            <p>Explore Languist and Help us improve it :-)</p>
            <RaisedButton label={"SIGN UP WITH GITHUB"}
                          secondary = {true}
                          style={{width: '283px', height: '46px'}}
                          labelStyle={{fontSize: '22px', lineHeight: '46px'}}
                          href="https://github.com/login/oauth/authorize?client_id=d310933db63d64f563a0"/>
          </div>
        </div>
      </div>
    );
  }
}

class TagListItem extends Component {
  render() {
    let Icon = this.props.Icon;
    return (
      <Card containerStyle={{display: 'flex', flexDirection: 'row', alignItems: 'center', height: '68px', marginBottom  : '28px'}}>
        <Icon style={{width: '36px', height: '36px', margin: '16px 12px 16px 14px'}} color={brandColor}/>
        <p>{this.props.text}</p>
      </Card>
    )
  }
}

let sumTagStyle = {
  borderRadius: "308px",
  height: "308px",
  width: "308px"
};

let sumTagContainerStyle = {
  height: '100%',
  width: '100%'
};

let sumIconStyle = {
  height: '48px',
  width: '48px',
  marginRight: '10px',
  color: brandColor
};

let sumIconStyleLast = {
  height: '48px',
  width: '48px',
  color: brandColor
};

class SumTag extends Component {

  render() {
    return (
      <Card style={sumTagStyle} containerStyle={sumTagContainerStyle}>
        <div className={s.sumTag__main}>
          <div className={s.IconList}>
            <CodeIcon style={sumIconStyle}/>
            <StarIcon style={sumIconStyle}/>
            <PersonIcon style={sumIconStyleLast}/>
          </div>
          <p>More languages, repos and developers you might interest in</p>
        </div>
      </Card>
    )
  }
}

export default withStyles(HomePage, s);
