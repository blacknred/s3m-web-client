import React from 'react';
import PropTypes from 'prop-types';

import Chat from './Chat';
import Hearts from './Hearts';
import Preview from './Preview';
import PeerStats from './PeerStats';
import NewMessage from './NewMessage';
import OptionsMenu from './OptionsMenu';
import Loader from '../components/Loader';
import DynamicBackground from './DynamicBackground';
import BroadcastComponent from '../components/Broadcast';

import { getOrSetBroadcast } from '../signalingClient';

class Broadcast extends React.PureComponent {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.state = {
            isMyStream: false,
            broadcastId: null,
            isChatOn: true,
            isFakeChatModeOn: true,
            isPeerStatsOn: false,
            isDynamicBackgroundOn: true,
        };
    }

    componentDidMount() {
        const { match: { params: { broadcastId } } } = this.props;
        // throw new Error('Broadcast not found!');
        getOrSetBroadcast(broadcastId, (realId, isBroadcastExists) => {
            this.setState({
                broadcastId: realId,
                isMyStream: !isBroadcastExists,
            });
        });
    }

    onSwitchHandler = name => () => {
        this.setState(({ [name]: status }) => ({
            [name]: !status,
        }));
    };

    onStopHandler = () => { }

    render() {
        const { broadcastId, ...rest } = this.state;
        return !broadcastId ? <Loader /> : (
            <DynamicBackground
                src={this.videoRef}
                isDisable={!rest.isDynamicBackgroundOn}
                reduceUpdates
                interval={700}
            >
                <BroadcastComponent
                    {...rest}
                    onSwitch={this.onSwitchHandler}
                    onStop={this.onStopHandler}
                    PeerStats={<PeerStats />}
                    OptionsMenu={OptionsMenu}
                    Chat={rest.isChatOn && (
                        <Chat
                            broadcastId={broadcastId}
                            isFake={rest.isFakeChatModeOn}
                        />
                    )}
                    NewMessage={rest.isChatOn && (
                        <NewMessage
                            broadcastId={broadcastId}
                            isDisable={rest.isMyStream}
                        />
                    )}
                    Hearts={(
                        <Hearts
                            broadcastId={broadcastId}
                            isDisable={rest.isMyStream}
                        />
                    )}
                    Preview={<Preview videoRef={this.videoRef} />}
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
