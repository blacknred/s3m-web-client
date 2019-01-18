import React from 'react';
import PropTypes from 'prop-types';

import Chat from './Chat';
import Hearts from './Hearts';
import PeerStats from './PeerStats';
import NewMessage from './NewMessage';
import OptionsMenu from './OptionsMenu';
import Preview from '../components/Preview';
import DynamicBackground from './DynamicBackground';
import BroadcastComponent from '../components/Broadcast';

import { getOrSetBroadcast } from '../signalingClient';

class Broadcast extends React.PureComponent {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.state = {
            isBroken: false,
            isMyStream: false,
            broadcastId: null,
            isMenuOpen: false,
            isDark: false,
            isChatOn: true,
            isPeerStatsOn: false,
            isDynamicBackgroundOn: true,
        };
    }

    componentDidMount() {
        const { match: { params: { broadcastId } } } = this.props;

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

    onStopHandler = () => {}

    render() {
        const {
            isBroken, broadcastId, ...rest
        } = this.state;
        if (isBroken) throw new Error('Broadcast not found!');
        return (
            <DynamicBackground
                src={this.videoRef}
                disable={!rest.isDynamicBackgroundOn}
            >
                <BroadcastComponent
                    {...rest}
                    onSwitch={this.onSwitchHandler}
                    onStop={this.onStopHandler}
                    PeerStats={<PeerStats />}
                    Hearts={<Hearts broadcastId={broadcastId} />}
                    Preview={<Preview videoRef={this.videoRef} />}
                    Chat={<Chat broadcastId={broadcastId} />}
                    OptionsMenu={OptionsMenu}
                    NewMessage={(
                        <NewMessage
                            broadcastId={broadcastId}
                            disable={rest.isMyStream}
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
