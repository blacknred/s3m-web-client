/* eslint-disable no-param-reassign */

const Connection = new window.RTCMultiConnection();
window.enableAdapter = true; // enable adapter.js
const enableRecordings = false;
const allRecordedBlobs = [];


/* helpers */
function repeatedlyRecordStream(stream) {
    if (!enableRecordings) {
        return;
    }
    Connection.currentRecorder = window.RecordRTC(stream, {
        type: 'video',
    });
    console.log('kkkk', Connection.currentRecorder);
    Connection.currentRecorder.startRecording();
    setTimeout(() => {
        if (Connection.isUpperUserLeft || !Connection.currentRecorder) {
            return;
        }
        Connection.currentRecorder.stopRecording(() => {
            allRecordedBlobs.push(Connection.currentRecorder.getBlob());
            if (Connection.isUpperUserLeft) return;
            Connection.currentRecorder = null;
            repeatedlyRecordStream(stream);
        });
    }, 30 * 1000); // 30-seconds
}

function bytesToSize(bytes) {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1000;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return `${(bytes / (k ** i)).toPrecision(3)} ${sizes[i]}`;
}

function onGettingWebRTCStats(stats, remoteUserId, cb) {
    if (!Connection.peers[remoteUserId]) {
        stats.nomore();
    }

    const statsData = {
        userId: remoteUserId,
        bandwidth: bytesToSize(stats.bandwidth.speed),
        encryption: stats.encryption,
        codecs: stats.audio.recv.codecs.concat(stats.video.recv.codecs).join(', '),
        data: bytesToSize(stats.audio.bytesReceived + stats.video.bytesReceived),
        ICE: stats.connectionType.remote.candidateType.join(', '),
        port: stats.connectionType.remote.transport.join(', '),
    };

    cb(statsData);
}


// user need to connect server, so that others can reach him.
const setConnection = async () => {
    Connection.socketOptions = {
        'force new connection': true, // For SocketIO version < 1.0
        forceNew: true, // For SocketIO version >= 1.0
        transport: 'websocket',
    };
    Connection.enableScalableBroadcast = true; // its mandatory in v3
    // each relaying-user should serve only 1 users
    // Connection.maxRelayLimitPerUser = 1;
    // we don't need to keep room-opened
    // scalable-broadcast.js will handle stuff itself.
    Connection.autoCloseEntireSession = true;
    Connection.socketMessageEvent = 'scalable-media-broadcast-demo';
    Connection.socketURL = process.env.REACT_APP_SIGNALING_HOST; // socket.io server
    
    /*
    recording is disabled because it is resulting for browser-crash
    if you enable below line, please also uncomment above "RecordRTC.js"
    */

    console.log(Connection.codecs.video);

    // custom event
    // Connection.socketCustomEvent = Connection.channel;
    // socket.on(Connection.socketCustomEvent, (message) => {
    //     alert(message.sender + ' shared custom message:\n\n' + message.customMessage);
    // });
    // document.getElementById('send-custom-message').onclick = () => {
    // const customMessage = window.prompt('Enter test message.');
    // socket.emit(Connection.socketCustomEvent, {
    //     sender: Connection.userid,
    //     customMessage,
    // });
    // };

    // canvas.toDataURL('image/webp');

    Connection.connectSocket((socket) => {
        // log status
        socket.on('logs', (log) => {
            console.log('io logs: ', log);
        });
    });
};



const getOrSetBroadcast = (broadcastId, cb) => {
    if (!broadcastId || broadcastId.replace(/^\s+|\s+$/g, '').length <= 0) {
        broadcastId = Connection.token();
    }
    Connection.extra.broadcastId = broadcastId;
    Connection.session = {
        audio: true,
        video: true,
        oneway: true,
        data: true,
    };
    // const codec = localStorage.getItem('videoCodec');
    // if (codec) {
    //     Connection.codecs.video = codec;
    //     console.log(Connection.codecs.video);
    // }
    Connection.getSocket((socket) => {
        socket.emit('check-broadcast-presence', broadcastId, (isBroadcastExists) => {
            console.log('check-broadcast-presence', broadcastId, isBroadcastExists);
            if (!isBroadcastExists) {
                // start broadcast by set broadcaster' userid
                // "start-broadcasting" event should be fired.
                Connection.userid = broadcastId;
            }
            // join broadcast
            setTimeout(() => {
                socket.emit('join-broadcast', {
                    broadcastId,
                    userid: Connection.userid,
                    typeOfStreams: Connection.session,
                });
                cb(broadcastId, isBroadcastExists);
            }, 500);
        });

        // when a broadcast is absent
        socket.on('start-broadcasting', (typeOfStreams) => {
            console.log('start-broadcasting', typeOfStreams);
            // host i.e. sender should always use this!
            Connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: false,
                OfferToReceiveAudio: false,
            };
            Connection.session = typeOfStreams;
            // "open" method here will capture media-stream
            // we can skip this function always; it is totally optional here.
            // we can use "Connection.getUserMediaHandler" instead
            Connection.open(Connection.userid);
        });
        // when broadcast is already created
        socket.on('join-broadcaster', (hintsToJoinBroadcast) => {
            console.log('join-broadcaster', hintsToJoinBroadcast);
            Connection.session = hintsToJoinBroadcast.typeOfStreams;
            Connection.sdpConstraints.mandatory = {
                OfferToReceiveVideo: !!Connection.session.video,
                OfferToReceiveAudio: !!Connection.session.audio,
            };
            Connection.broadcastId = hintsToJoinBroadcast.broadcastId;
            Connection.join(hintsToJoinBroadcast.userid);
        });
        socket.on('rejoin-broadcast', (broadcastId) => {
            console.log('rejoin-broadcast', broadcastId);
            Connection.attachStreams = [];
            socket.emit('check-broadcast-presence', broadcastId, (isBroadcastExists) => {
                if (!isBroadcastExists) {
                    // the first person (i.e. real-broadcaster) MUST set his user-id
                    Connection.userid = broadcastId;
                }
                socket.emit('join-broadcast', {
                    broadcastId,
                    userid: Connection.userid,
                    typeOfStreams: Connection.session,
                });
            });
        });
        socket.on('broadcast-stopped', (broadcastId) => {
            window.location.reload();
            console.error('broadcast-stopped', broadcastId);
            alert('This broadcast has been stopped.');
            window.location.href = '/';
        });
    });

};

const viewersUpdated = (cb) => {
    // Connection.onNumberOfBroadcastViewersUpdated = (event) => {
    //     // if (!Connection.isInitiator) return;
    //     cb(event);
    // };
    Connection.getSocket((socket) => {
        // if (!Connection.isInitiator) {
        //     return;
        // }
        socket.on('number-of-broadcast-viewers-updated', event => cb(event));
    });
};

function handleStream(videoPreview) {
    if (!videoPreview) return;

    Connection.onstream = (event) => {
        console.log('onstream');
        if (Connection.isInitiator && event.type !== 'local') {
            return;
        }
        Connection.isUpperUserLeft = false;
        videoPreview.srcObject = event.stream;
        videoPreview.play();
        videoPreview.userid = event.userid;
        if (event.type === 'local') {
            videoPreview.muted = true;
        }
        if (!Connection.isInitiator && event.type === 'remote') {
            // he is merely relaying the media
            Connection.dontCaptureUserMedia = true;
            Connection.attachStreams = [event.stream];
            Connection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: false,
                OfferToReceiveVideo: false,
            };
            Connection.getSocket((socket) => {
                socket.emit('can-relay-broadcast');
                if (Connection.DetectRTC.browser.name === 'Chrome') {
                    Connection.getAllParticipants().forEach((p) => {
                        if (`${p}` !== `${event.userid}`) {
                            const {
                                peer,
                            } = Connection.peers[p];
                            peer.getLocalStreams().forEach((localStream) => {
                                peer.removeStream(localStream);
                            });
                            event.stream.getTracks().forEach((track) => {
                                peer.addTrack(track, event.stream);
                            });
                            Connection.dontAttachStream = true;
                            Connection.renegotiate(p);
                            Connection.dontAttachStream = false;
                        }
                    });
                }
                if (Connection.DetectRTC.browser.name === 'Firefox') {
                    // Firefox is NOT supporting removeStream method
                    // that's why using alternative hack.
                    // NOTE: Firefox seems unable to replace-tracks of the remote-media-stream
                    // need to ask all deeper nodes to rejoin
                    Connection.getAllParticipants().forEach((p) => {
                        if (`${p}` !== `${event.userid}`) {
                            Connection.replaceTrack(event.stream, p);
                        }
                    });
                }
                // Firefox seems UN_ABLE to record remote MediaStream
                // WebAudio solution merely records audio
                // so recording is skipped for Firefox.
                if (Connection.DetectRTC.browser.name === 'Chrome') {
                    repeatedlyRecordStream(event.stream);
                }
            });
        }
        // to keep room-id in cache
        // localStorage.setItem(Connection.socketMessageEvent, Connection.sessionid);
    };

    Connection.onstreamended = () => {
        console.log('onstreamended');
    };

    window.onbeforeunload = () => {
        // Firefox is ugly.
        videoPreview.disabled = false;
    };

    Connection.onleave = (event) => {
        console.log('onleave');
        if (event.userid !== videoPreview.userid) return;
        Connection.getSocket((socket) => {
            socket.emit('can-not-relay-broadcast');
            Connection.isUpperUserLeft = true;
            if (allRecordedBlobs.length) {
                // playing lats recorded blob
                const lastBlob = allRecordedBlobs[allRecordedBlobs.length - 1];
                videoPreview.src = URL.createObjectURL(lastBlob);
                videoPreview.play();
                allRecordedBlobs.length = 0;
            } else if (Connection.currentRecorder) {
                const recorder = Connection.currentRecorder;
                Connection.currentRecorder = null;
                recorder.stopRecording(() => {
                    if (!Connection.isUpperUserLeft) return;
                    videoPreview.src = URL.createObjectURL(recorder.getBlob());
                    videoPreview.play();
                });
            }
            if (Connection.currentRecorder) {
                Connection.currentRecorder.stopRecording();
                Connection.currentRecorder = null;
            }
        });
    };
}

function enableStats(status, cb) {
    if (!status) {
        return;
    }

    Connection.onPeerStateChanged = (event) => {
        if (event.iceConnectionState === 'connected'
            && event.signalingState === 'stable') {
            if (Connection.peers[event.userid].gettingStats) {
                return;
            }
            Connection.peers[event.userid].gettingStats = true; // do not duplicate
            const {
                peer,
            } = Connection.peers[event.userid];
            const interval = 1000;

            if (Connection.DetectRTC.browser.name === 'Firefox') {
                window.getStats(peer, peer.getLocalStreams()[0].getTracks()[0], (stats) => {
                    onGettingWebRTCStats(stats, event.userid, cb);
                }, interval);
            } else {
                window.getStats(peer, (stats) => {
                    onGettingWebRTCStats(stats, event.userid, cb);
                }, interval);
            }
        }
    };
}

function changeVideoCodec(codec) {
    if (codec) {
        localStorage.setItem('videoCodec', codec);
        if (!Connection.attachStreams.length) {
            return;
        }
        window.location.reload();
    }
}

export {
    setConnection,
    getOrSetBroadcast,
    viewersUpdated,
    handleStream,
    enableStats,
    changeVideoCodec,
};
