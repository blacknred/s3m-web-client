import React from 'react';
import PropTypes from 'prop-types';

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
            limit: null,
            viewersCount: 0, // fake implementation
        };
    }

    componentDidMount() {
        const { isFake } = this.props;

        viewersUpdated((event) => {
            const { viewersCount } = this.state;
            this.setState({ viewersCount: event.numberOfBroadcastViewers });
            this.chatFakeFetchingHandler({
                avatar: null,
                author: null,
                event: true,
                message: event.numberOfBroadcastViewers < viewersCount
                    ? `The viewer ${event.targetUser} is gone`
                    : `New viewer ${event.targetUser} has come.`,
            });
        });

        if (isFake) {
            this.interval = setInterval(this.chatFakeFetchingHandler, 3000);
        }
    }

    // shouldComponentUpdate({ width: nextWidth }) {
    //     const { width } = this.props;
    //     if (width !== nextWidth) {
    //         this.setState(({ messages }) => ({
    //             messages: messages.splice(0, messages.length - LIMITS[nextWidth]),
    //         }));
    //     }
    //     return true;
    // }

    componentDidUpdate({ isFake: prevIsFake }) {
        const { isFake } = this.props;
        if (isFake !== prevIsFake) {
            if (isFake) {
                this.interval = setInterval(this.chatFakeFetchingHandler, 3000);
            } else {
                clearInterval(this.interval);
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    chatFakeFetchingHandler = (message) => {
        const { limit } = this.state;
        this.setState(({ messages }) => ({
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

    onSetLimitHandler = (width) => {
        const { limit, messages } = this.state;
        if (limit !== LIMITS[width]) {
            this.setState({
                limit: LIMITS[width],
                messages: messages.splice(0, messages.length - LIMITS[width]),
            });
        }
    }

    render() {
        return (
            <ChatList
                {...this.state}
                setLimit={this.onSetLimitHandler}
            />
        );
    }
}

Chat.propTypes = {
    broadcastId: PropTypes.string,
    isFake: PropTypes.bool,
};

export default Chat;
