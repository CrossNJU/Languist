/**
 * Created by PolarisChen on 16/9/9.
 */

import React, { Component, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchBar.scss';

import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui/svg-icons/action/search';

const styles = {
  underlineFocus: {
    borderColor: '#FFF',
    borderWidth: 2
  },
  hint: {
    color: '#EEE'
  },
  text: {
    color: '#FFF'
  },
  button: {
    color: '#FFF'
  }
}


class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  handleSearch() {
    let value = this.refs.search.input.value;

    this.props.handleSearch(value);
  }

  handleEnter(event) {
    if(event.key == 'Enter') {
      this.handleSearch();
    }
  }

  render() {
    const data = this.props.data;
    return (
      <div className={s.root}>
        <div className={s.container}>
          <TextField
            ref="search"
            fullWidth={true}
            hintStyle={styles.hint}
            hintText="Search repo here..."
            inputStyle={styles.text}
            underlineFocusStyle={styles.underlineFocus}
            onKeyDown={this.handleEnter.bind(this)}
          />
          <IconButton iconStyle={styles.button} onTouchTap={this.handleSearch.bind(this)}><Search /></IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(SearchBar, s);
