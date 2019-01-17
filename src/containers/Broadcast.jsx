import React from 'react';
import PropTypes from 'prop-types';

import Chat from './Chat';
import Hearts from './Hearts';
import NewMessage from './NewMessage';
import DynamicBackground from './DynamicBackground';
import BroadcastComponent from '../components/Broadcast';

import {
    getOrSetBroadcast,
    viewersUpdated,
    handleStream,
    enableStats,
    changeVideoCodec,
} from '../signalingClient';

class Broadcast extends React.Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.statsRef = React.createRef();
        this.state = {
            isBroken: false,
            isMyStream: false,
            videoCodec: 'VP9',
            viewersCount: 0,
            broadcastId: null,
            isMenuOpen: false,
            isChatOn: true,
            isPeerStatsOn: false,
            isDynamicBackgroundOn: true,
        };
    }

    componentDidMount() {
        const { match: { params: { broadcastId } } } = this.props;

        // handle broadcasting
        getOrSetBroadcast(broadcastId, (realId, isBroadcastExists) => {
            this.setState({
                broadcastId: realId,
                isMyStream: !isBroadcastExists,
            });
        });

        viewersUpdated((event) => {
            this.setState({ viewersCount: event.numberOfBroadcastViewers });
        });
    }

    componentDidUpdate(_, prevState) {
        const {
            isPeerStatsOn: prevIsPeerStatsOn,
            videoCodec: prevVideoCodec,
        } = prevState;
        const {
            isPeerStatsOn,
            videoCodec,
        } = this.state;
        if (prevIsPeerStatsOn !== isPeerStatsOn) {
            this.statsHandler(isPeerStatsOn);
        }
        if (prevVideoCodec !== videoCodec) {
            changeVideoCodec(videoCodec);
        }
        handleStream(this.videoRef.current);
    }

    onSwitchHandler = name => () => {
        this.setState(({ [name]: status, isMenuOpen }) => ({
            [name]: !status,
            ...(name !== 'isMenuOpen' && { isMenuOpen: !isMenuOpen }),
        }));
    };

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    statsHandler = (status) => {
        enableStats(status, (peerStats) => {
            if (!this.statsRef.current) {
                return;
            }
            // this.setState({ peerStats })
            const stats = Object.keys(peerStats).reduce((prev, cur) =>
                `${prev} <p>${cur.toUpperCase()}: ${peerStats[cur]}</p>`, '');
            this.statsRef.current.innerHTML = stats;
        });
    }

    onStopHandler = () => { }

    render() {
        const {
            isBroken, broadcastId, viewersCount, ...rest
        } = this.state;
        if (isBroken) throw new Error('Broadcast not found!');
        return (
            <DynamicBackground
                src={this.videoRef}
                on={rest.isDynamicBackgroundOn}
            >
                <BroadcastComponent
                    {...rest}
                    videoTarget={this.videoRef}
                    statsTarget={this.statsRef}
                    onChange={this.onChangeHandler}
                    onSwitch={this.onSwitchHandler}
                    onStop={this.onStopHandler}
                    Hearts={<Hearts broadcastId={broadcastId} />}
                    Chat={broadcastId && <Chat broadcastId={broadcastId} />}
                    NewMessage={(
                        <NewMessage
                            broadcastId={broadcastId}
                            viewersCount={viewersCount}
                            isMyStream={rest.isMyStream}
                        />
                    )}
                />
            </DynamicBackground>
        );
    }
}

Broadcast.propTypes = {
    match: PropTypes.shape({
        broadcastId: PropTypes.string,
    }).isRequired,
};

export default Broadcast;
