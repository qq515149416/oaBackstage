import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import axios from  "axios";
// const { Provider, Consumer } = React.createContext('defaultValue');

// const socket = io(location.protocol+"//sk.tzidc.com:8120");

// class Parent extends React.Component {
//     state = {
//         socket: ""
//     }

//     componentDidMount() {
//         axios.get("/socketurl").then(resp => {
//             if(resp.data.state==1) {
//                this.setState({
//                     socket: resp.data.data
//                });
//             }
//         });
//     }

//     render () {
//       return (
//         <Provider value={this.state.socket}>
//           {this.props.children}
//         </Provider>
//       )
//     }
// }


class Socket extends React.Component {
    // 声明Context对象属性
  static childContextTypes = {
    socket: PropTypes.object,
  }
  // 返回Context对象，方法名是约定好的
  getChildContext () {
    return {
        socket: io(this.props.socket),
    }
  }

  render () {
      return this.props.children;
  }
}

class SocketWarper extends React.Component {
    constructor(...arg) {
        super(arg);
        this.state = {
            socket: ""
        }
    }
    componentDidMount() {
        axios.get("/socketurl").then(resp => {
            if(resp.data.code==1) {
               this.setState({
                    socket: resp.data.data
               });
            }
        });
    }
    render () {
        const { socket } = this.state;
        console.log(socket);
        return <div>
            {socket ? (<Socket socket={socket}>
            {this.props.children}
        </Socket>) : null}
        </div>;
    }
}

export default SocketWarper;
