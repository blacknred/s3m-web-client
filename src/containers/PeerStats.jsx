import React from 'react';

import Stats from '../components/PeerStats';

import {
    enableStats,
    changeVideoCodec,
} from '../signalingClient';

class PeerStats extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            videoCodec: 'VP9',
            stats: {},
        };
    }

    componentDidMount() {
        enableStats(true, (stats) => {
            this.setState({ stats });
        });
    }

    componentDidUpdate(_, { videoCodec: prevVideoCodec }) {
        const { videoCodec } = this.state;
        if (prevVideoCodec !== videoCodec) {
            changeVideoCodec(videoCodec);
        }
    }

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
    }

    render() {
        return (
            <Stats
                {...this.state}
                onChange={this.onChangeHandler}
            />
        );
    }
}

export default PeerStats;
