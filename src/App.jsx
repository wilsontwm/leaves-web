import {inject} from 'mobx-react';
import React, {Component, Fragment} from 'react';
import './assets/css/overwrite.css';
import Loader from './components/custom/Loader';
//import IdleTimer from 'react-idle-timer';

class App extends Component {
  constructor(props) {
    super(props);
    //this.idleTimer = null;
    //this.handleOnIdle = this.handleOnIdle.bind(this);
  }

  // handleOnIdle(event) {
  //   sessionStorage.clear();
  //   location.replace('/#inactive');
  // }

  render() {
    return (
      <Fragment>
        <Loader />
        <div>{this.props.children}</div>
      </Fragment>
    )
  }
}

export default inject('rootStore')(App);
