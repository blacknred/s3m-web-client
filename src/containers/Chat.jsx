import React from 'react';
import PropTypes from 'prop-types';

import ChatList from '../components/ChatList';
import { viewersUpdated } from '../signalingClient';

const LIMIT = 3;

const fakeMessages = [
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
        message: ', maxime alias temporibus aspernatur numquam',
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
        this.viewersCount = 0; // fake counter
        this.state = {
            messages: [],
        };
    }

    componentDidMount() {
        // this.chatFetchingHandler();

        // fake fetching
        this.interval = setInterval(() => {
            this.setState(({ messages }) => ({
                messages: [
                    ...(messages.length === LIMIT ? messages.splice(1) : messages),
                    {
                        ...fakeMessages[Math.floor(Math.random() * fakeMessages.length)],
                        id: Date.now(),
                    },
                ],
            }));
        }, 3000);

        viewersUpdated((event) => {
            const less = event.numberOfBroadcastViewers < this.viewersCount;
            this.setState(({ messages }) => ({
                messages: [
                    {
                        id: messages.length + 1,
                        avatar: null,
                        author: null,
                        message: less ? 'Viewer went' : 'New viewer came',
                        event: true,
                    },
                    ...messages,
                ],
            }));
            this.viewersCount = event.numberOfBroadcastViewers;
        });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    chatFetchingHandler = () => {
        const { broadcastId } = this.props;
        if (broadcastId) {
            this.setState({ messages: fakeMessages });
        }
    }

    render() {
        const { messages } = this.state;
        return <ChatList messages={messages} />;
    }
}

Chat.propTypes = {
    broadcastId: PropTypes.string.isRequired,
};

export default Chat;
