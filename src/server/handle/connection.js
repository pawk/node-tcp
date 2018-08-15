const { Transform } = require('stream');

const data = require('./data');
const close = require('./close');
const line = require('./line');
const terminal = require('../../terminal');
const {
  connectionsCount,
  logConnections
} = require('../util');

module.exports = server => socket => {
  const connections = connectionsCount(server);

  handle(socket, connections);
  sayHello(socket, connections);
}

function handle(socket, connections) {
  socket.on('data', data(socket));
  socket.on('close', close(socket, connections))
  socket.on('error', console.error);
  terminal.on('line', line(socket));
}

function sayHello(socket, connections) {
  const { localAddress, localPort, remoteAddress, remotePort } = socket;

  socket.write(`Welcome to ${localAddress}:${localPort}`);

  console.log(`\n> ${remoteAddress}:${remotePort} connected`);
  logConnections(connections);
}