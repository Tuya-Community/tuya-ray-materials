import React from 'react';

class App extends React.Component {
  componentDidMount() {
    console.info('app did mount');
  }

  onLaunch(object: any) {
    console.log('app onLaunch', object);
  }

  onShow(object: any) {
    console.log('app onShow', object);
  }

  onHide(object: any) {
    console.log('app onHide', object);
  }

  onError(object: any) {
    console.log('app onError', object);
  }

  onPageNotFound(object: any) {
    console.log('app onPageNotFound', object);
  }

  onUnhandledRejection(object: any) {
    console.log('app onUnhandledRejection', object);
  }

  onThemeChange(object: any) {
    console.log('app onThemeChange', object);
  }

  render() {
    return this.props.children;
  }
}

export default App;
