const User = require('../models/User');
const Events = require('../utils/events');

const activeSockets = {};

const ioEmit = (channel, data) => Events.trigger('emit', { channel, data });
const ioAttachEmitListener = (io) => Events.listen('emit', 'socket-io', ({ channel, data }) => io.emit(channel, data));

const removeSocket = (socket, widthData) => {
  const socketId = socket.data.socketId;
  if (!socketId) return;

  const index = activeSockets[socketId].sockets.findIndex(({ id }) => id === socket.id);
  if (index !== -1) {
    activeSockets[socketId].sockets.splice(index, 1);
  }

  if (!activeSockets[socketId].sockets.length) {
    delete activeSockets[socketId];
  }

  if (widthData) {
    socket.data = {};
  }
};

const identifySocket = (socketId, socket) => {
  if (!socketId) return;
  if (socket.data.identifying || socket.data.socketId === socketId) return;
  socket.data.identifying = true;

  removeSocket(socket);

  if (activeSockets[socketId]) {
    socket.data.socketId = socketId;
    activeSockets[socketId].sockets.push(socket);
    socket.data.identifying = false;
    socket.data.parent = activeSockets[socketId];
    return;
  }

  (async (socketId, socket) => {
    const user = await User.findOne({ socketId });
    if (!user) {
      socket.removeAllListeners(); // passed false data -> socket remains active but can't do any action
      socket.data = {};
      return;
    }

    if (socket.disconnected) {
      return;
    }

    user._id = user._id.toString();
    activeSockets[socketId] = { user, sockets: [...(activeSockets[socketId]?.sockets || []), socket] }; // in case of logins in the same time
    socket.data.socketId = socketId;
    socket.data.identifying = false;
    socket.data.parent = activeSockets[socketId];
  })(socketId, socket);
};

const unidentifySocket = (socket) => removeSocket(socket, true);

module.exports = { activeSockets, identifySocket, unidentifySocket, ioEmit, ioAttachEmitListener };
