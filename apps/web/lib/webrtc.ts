import Peer, { Instance, SignalData } from 'simple-peer';

export function createPeer(
  initiator: boolean,
  stream: MediaStream | undefined,
  onSignal: (data: SignalData) => void,
  onStream: (stream: MediaStream) => void,
  onClose: () => void
): Instance {
  const peer = new Peer({
    initiator,
    stream,
    trickle: false,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
      ]
    }
  });

  peer.on('signal', onSignal);
  peer.on('stream', onStream);
  peer.on('close', onClose);
  peer.on('error', (err) => {
    console.error('Peer error:', err);
    onClose();
  });

  return peer;
}

export function destroyPeer(peer: Instance | null) {
  if (peer) {
    peer.destroy();
  }
}
