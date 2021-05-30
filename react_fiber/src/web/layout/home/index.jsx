import React, { Component } from 'react'
import PropTypes from 'prop-types'
import HelloWorld from '../../page/HelloWorld'

class HomePage extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div style = {{backgroundColor: '#ccc', display: 'flex', flex: 1, }}>
        <HelloWorld data = {1111} name = "默认名"/>
      </div>
    )
  }
}

export default HomePage