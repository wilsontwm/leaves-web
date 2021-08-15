import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';
import { Spin } from 'antd';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  opacity: 0.8;
  z-index: 9000;
`;
const Spinner = styled(Spin)`
  position: absolute;
  text-align: center;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  height: 32px;
  z-index: 9500;
`;

class Loader extends Component {
  render() {
    const {
      rootStore: {
        uiStore: { loader },
      },
    } = this.props;
    return loader.isLoading
      ? ReactDOM.createPortal(
        <div>
          <Overlay />
          <Spinner size="large" />
        </div>,
        document.body,
      )
      : null;
  }
}

export default inject('rootStore')(observer(Loader));
