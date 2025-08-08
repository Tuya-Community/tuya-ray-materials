import React from 'react';
import './app.less';
import { getSystemInfoSync } from '@ray-js/ray';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.info('app onLaunch', Promise);
  }

  componentDidMount() {
    console.info('app did mount');
  }

  render() {
    return this.props.children;
  }
}
