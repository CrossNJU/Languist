/**
 * Created by PolarisChen on 16/7/11.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangItem.scss';

import ListItem from "material-ui/List/ListItem";
import Toggle from "material-ui/Toggle";
import LangQuestion from '../LangQuestion';

let questionData1 = {
  question: "How are you good at JavaScript",
  type: "radio",
  options: [
    {
      option: "I've just started",
      value: 0
    },
    {
      option: "I've developed 1~2 JavaScript projects",
      value: 1
    },
    {
      option: "I've developed 3~5 JavaScript projects",
      value: 2
    },
    {
      option: "I am quite experienced in JavaScript",
      value: 3
    }
  ]
};

let questionData2 = {
  question: "What do you do with JavaScript",
  type: "checkbox",
  options: [
    {
      option: "Web applications",
      value: 0
    },
    {
      option: "Desktop applications",
      value: 1
    },
    {
      option: "Data process",
      value: 2
    },
    {
      option: "Algorithm",
      value: 3
    }
  ]
};

class LangItem extends Component {
  constructor(props) {
    super(props);
    this.state = {isSelected: this.props.lang.isSelected};
  }

  handClick() {
    if (!this.refs.toggle.state.switched) {
      this.setState({isSelected: true});
    } else {
      this.setState({isSelected: false});
    }
  };

  render() {
    return (
      <div className={s.root}>
        <ListItem>
          <div className={s['lang__list__item']}>
            <div className={s['lang__list__item__left']}>
              <Toggle style={{width: 'auto'}}
                      ref="toggle"
                      label={this.props.lang.name}
                      labelPosition="right"
                      defaultToggled={this.state.isSelected}
                      onToggle={this.handClick.bind(this)}/>
            </div>
            <div className={s['lang__list__item__right']}>
              <img src={require('./logo-s@2x.png')}/>
              <p>{this.props.lang.repoNum}</p>
            </div>
          </div>
        </ListItem>
        <div className={s.lang__questions} ref="question" style={{display: this.state.isSelected?"block":"none"}}>
          <LangQuestion question={questionData1}/>
          <LangQuestion question={questionData2}/>
        </div>
      </div>
    )
  }
}

export default withStyles(LangItem, s);
