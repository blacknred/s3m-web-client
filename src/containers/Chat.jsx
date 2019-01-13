import React from 'react';
import PropTypes from 'prop-types';

import ChatList from '../components/ChatList';

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

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        };
    }

    componentDidMount() {
        this.chatFetchingHandler();

        // fake fetching
        setInterval(() => {
            this.setState(({ messages }) => ({
                messages: [
                    {
                        ...messages[Math.floor(Math.random() * messages.length)],
                        id: messages.length + 1,
                    },
                    ...messages,
                ],
            }));
        }, 100000);
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
