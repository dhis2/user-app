import React, { Component } from 'react';

class Test extends Component {
  render() {
    console.log(this.context);
    return (
      <div>TEST COMPONENT</div>
    )
  }
}

export default Test;