const { ExpressPeerServer } = require("peer");

function setupPeerServer(server) {
  const peerServer = ExpressPeerServer(server, {
    debug: true,
  });

  return peerServer;
}

module.exports = setupPeerServer;