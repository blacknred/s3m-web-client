import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Chat from './Chat';
import NewMessage from './NewMessage';
import BroadcastComponent from '../components/Broadcast';

import {
    getOrSetBroadcast,
    viewersUpdated,
    handleStream,
    enableStats,
    changeVideoCodec,
} from '../signalingClient';

class Broadcast extends PureComponent {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
        this.statsRef = React.createRef();
        this.rootRef = React.createRef();
        this.canvas = document.createElement('canvas').getContext('2d');
        this.colorRegExp = null;
        this.state = {
            isBroken: false,
            isMyStream: true,
            isStatsOn: false,
            videoCodec: 'VP9',
            viewersCount: 0,
            broadcastId: null,
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
            this.setState(({ viewersCount, messages }) => ({
                viewersCount: event.numberOfBroadcastViewers,
                ...((event.numberOfBroadcastViewers > viewersCount) && {
                    messages: [
                        {
                            id: messages.length + 1,
                            avatar: null,
                            author: null,
                            message: 'New viewer came',
                            event: true,
                        },
                        ...messages,
                    ],
                }),
            }));
        });

        // background based on video main color
        setInterval(this.updateColor, 1000);
    }

    componentDidUpdate() {
        setTimeout(handleStream(this.videoRef.current), 7000);
    }

    onSwitchHandler = name => (event) => {
        this.setState({ [name]: event.target.checked });
        if (name === 'isStatsOn') {
            this.statsHandler(event.target.checked);
        }
    };

    statsHandler = (status) => {
        enableStats(status, (statsData) => {
            if (!this.statsRef.current) {
                return;
            }
            const stats = Object.keys(statsData).reduce((prev, cur) =>
                `${prev} <p>${cur.toUpperCase()}: ${statsData[cur]}</p>`, '');
            this.statsRef.current.innerHTML = stats;
        });
    }

    updateColor = () => {
        function getPixelXY(imgData, x, y) {
            const index = y * imgData.width + x;
            const i = index * 4;
            const d = imgData.data;
            return [d[i], d[i + 1], d[i + 2], d[i + 3]]; // [R,G,B,A]
        }

        this.canvas.clearRect(0, 0, 50, 50);
        this.canvas.drawImage(this.videoRef.current, 0, 0, 50, 50);
        const data = this.canvas.getImageData(0, 0, 50, 50);
        const rgbaArr = getPixelXY(data, 1, 1); // returns [red, green, blue, alpha]
        const rgba = `rgba(${rgbaArr.join(',')})`;
        console.log('t');
        if (!rgba.match(new RegExp(this.colorRegExp))) {
            (this.rootRef.current).style.backgroundColor = rgba;
            const rgbaRE = rgbaArr.map(n => `(${Math.floor(n / 10)}.)`).join(',');
            this.colorRegExp = `rgba\\(${rgbaRE}\\)`;
            console.log('updated');
        }
    }

    onStopHandler = () => { }

    onLikeHandler = () => { }

    onChangeHandler = ({ target: { name, value } }) => {
        this.setState({ [name]: value });
        if (name === 'videoCodec') {
            changeVideoCodec(value);
        }
    }

    render() {
        const {
            isBroken, broadcastId, viewersCount, isMyStream, ...rest
        } = this.state;
        if (isBroken) throw new Error('Broadcast not found!');
        return (
            <BroadcastComponent
                {...rest}
                videoTarget={this.videoRef}
                statsTarget={this.statsRef}
                rootTarget={this.rootRef}
                isMyStream={isMyStream}
                onChange={this.onChangeHandler}
                onSwitch={this.onSwitchHandler}
                onLike={this.onLikeHandler}
                onStop={this.onStopHandler}
                Chat={
                    broadcastId && <Chat broadcastId={broadcastId} />
                }
                NewMessage={(
                    <NewMessage
                        broadcastId={broadcastId}
                        viewersCount={viewersCount}
                        isMyStream={isMyStream}
                    />
                )}
            />
        );
    }
}

Broadcast.propTypes = {
    match: PropTypes.shape({
        broadcastId: PropTypes.string,
    }).isRequired,
};

export default Broadcast;
