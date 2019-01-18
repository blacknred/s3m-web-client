import React from 'react';
import PropTypes from 'prop-types';
import { withWidth } from '@material-ui/core';

import ChatList from '../components/ChatList';
import { viewersUpdated } from '../signalingClient';

const LIMITS = {
    xs: 3,
    sm: 6,
    md: 12,
    lg: 12,
    xl: 15,
};

const FAKE_MESSAGES = [
    {
        id: 1,
        avatar: null,
        author: 'Queen',
        message: 'harum mollitia consectetur perspiciatis. Recusandae!',
        event: true,
    },
    {
        id: 2,
        avatar: null,
        author: 'Van',
        message: 'maxime alias temporibus aspernatur numquam',
        event: false,
    },
    {
        id: 3,
        avatar: null,
        author: 'Mike',
        message: 'Itaque dolor aut dolorem eligendi nobis totam earum iste',
        event: true,
    },
    {
        id: 4,
        avatar: null,
        author: 'Leo',
        message: 'Ipsam corrupti doloremque',
        event: false,
    },
    {
        id: 5,
        avatar: null,
        author: 'Kate',
        message: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
        event: false,
    },
];

class Chat extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            limit: 0,
            viewersCount: 0, // fake counter
        };
    }

    componentDidMount() {
        const { width } = this.props;

        this.setState({ limit: LIMITS[width] });

        viewersUpdated((event) => {
            const { viewersCount } = this.state;
            this.setState({ viewersCount: event.numberOfBroadcastViewers });
            const less = event.numberOfBroadcastViewers < viewersCount;
            this.chatFetchingHandler({
                avatar: null,
                author: null,
                event: true,
                message: less ? 'The viewer is gone.' : 'New viewer has come.',
            });
        });

        // fake fetching
        this.interval = setInterval(this.chatFetchingHandler, 3000);
    }

    // shouldComponentUpdate({ width }) {
    //     if (width) {
    //         this.setState(({ messages }) => ({
    //             limit: LIMITS[width],
    //             messages: messages.splice(0, messages.length - LIMITS[width]),
    //         }));
    //     }
    //     return false;
    // }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    chatFetchingHandler = (message) => {
        this.setState(({ messages, limit }) => ({
            messages: [
                ...(messages.length === limit ? messages.splice(1) : messages),
                {
                    ...FAKE_MESSAGES[Math.floor(Math.random() * FAKE_MESSAGES.length)],
                    ...(message && message),
                    id: Date.now(),
                },
            ],
        }));
    }

    render() {
        return <ChatList {...this.state} />;
    }
}

Chat.propTypes = {
    broadcastId: PropTypes.string,
    width: PropTypes.string.isRequired,
};

export default withWidth()(Chat);
