import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.info('app onLaunch');
  }

  componentDidMount() {
  }

  render() {
    return this.props.children;
  }
}
