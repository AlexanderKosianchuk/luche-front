import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';
import { bindActionCreators } from 'redux';

import requestAction from 'actions/request';

export default function bindSocket(payload) {
  return function(dispatch) {
    let request = bindActionCreators(requestAction, dispatch);

    dispatch({
      type: 'WEBSOCKET_BINDING'
    });

    let io = sailsIOClient(socketIOClient);

    io.sails.url = INTERACTION_URL;
    io.sails.reconnection = true;

    io.socket.on('connect', () => {
      dispatch({
        type: 'WEBSOCKET_CONNECTED',
        payload: {
          io: io
        }
      });
    });

    //TODO: io.socket.on('error', () => {});
  }
};
