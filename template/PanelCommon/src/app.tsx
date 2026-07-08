import React from 'react'

export default class App extends React.Component {
  componentDidMount() {
    console.info('App launch')
  }

  onShow(options) {
    console.info('onShow', options)
  }

  render() {
    return this.props.children
  }
}
