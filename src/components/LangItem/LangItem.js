/**
 * Created by PolarisChen on 16/7/11.
 */

import React, {Component, PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LangItem.scss';

import ListItem from "material-ui/List/ListItem";
import Toggle from "material-ui/Toggle";
import LangQuestion from '../LangQuestion';

class LangItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      level: 0,
      questionData1: {},
      questionData2: {},
    };
  }

  componentWillMount() {
    let data = this.getQuestionData(this.props.lang.name);
    this.setState({
      isSelected: this.props.lang.isSelected,
      level: this.props.lang.level,
      questionData1: data[0],
      questionData2: data[1]
    })
  }

  componentWillReceiveProps(nextProps) {
    let data = this.getQuestionData(nextProps.lang.name);
    this.setState({questionData1: data[0], questionData2: data[1]});
  }

  getQuestionData(lang) {
    return [
      {
        question: "How are you good at " + lang,
        type: "radio",
        options: [
          {
            option: "I've just started",
            value: "0"
          },
          {
            option: "I've developed 1~2 " + lang + " projects",
            value: "1"
          },
          {
            option: "I've developed 3~5 " + lang + " projects",
            value: "2"
          },
          {
            option: "I am quite experienced in " + lang,
            value: "3"
          }
        ]
      },

      {
        question: "What do you do with " + lang,
        type: "checkbox",
        options: [
          {
            option: "Web applications",
            value: '0'
          },
          {
            option: "Desktop applications",
            value: '1'
          },
          {
            option: "Data process",
            value: '2'
          },
          {
            option: "Algorithm",
            value: '3'
          }
        ]
      },
    ]
  }

  handleClick() {
    let isSelected = !this.refs.toggle.state.switched;
    this.setState({isSelected: isSelected});
    this.props.lang.isSelected = isSelected;
    this.props.handleChange(this.props.lang);
  };

  handleQuestion(level) {
    this.setState({level: level});
    this.props.lang.level = level;
    this.props.handleChange(this.props.lang);
  }

  renderRepos() {
    if (this.props.lang.repos) {
      return (
        <div className={s['lang__list__item__right']}>
          <img src={require('./logo-s@2x.png')}/>
          <p>{this.props.lang.repos}</p>
        </div>
      )
    }
  }

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
                      onToggle={this.handleClick.bind(this)}/>
            </div>
            {this.renderRepos()}
          </div>
        </ListItem>
        <div className={s.lang__questions} ref="question" style={{display: this.state.isSelected ? "block" : "none"}}>
          <LangQuestion question={this.state.questionData1} defaultLevel={this.state.level.toString()} onChoose={this.handleQuestion.bind(this)}/>
          <LangQuestion question={this.state.questionData2}/>
        </div>
      </div>
    )
  }
}

export default withStyles(LangItem, s);
