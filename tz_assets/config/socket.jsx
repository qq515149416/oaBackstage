import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
const socket = io(location.protocol+"//sk.tzidc.com:8120");

class Socket extends React.Component {
    // 声明Context对象属性
  static childContextTypes = {
    socket: PropTypes.object,
  }
  // 返回Context对象，方法名是约定好的
  getChildContext () {
    return {
        socket,
    }
  }

  render () {
      return this.props.children;
  }
}

export default Socket;
