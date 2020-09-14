import React from 'react';
import Scard from '../../components/CardActions/Scard';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <Scard style={{ overflow: 'scroll' }} />
      </div>
    )
  }
}
