import React from 'react';
import PropTypes from 'prop-types';

import MessageForm from '../components/MessageForm';

import { viewersUpdated } from '../signalingClient';

class NewMessage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            viewersCount: 0,
        };
    }

    componentDidMount() {
        viewersUpdated((event) => {
            this.setState({ viewersCount: event.numberOfBroadcastViewers });
        });
    }

    onChangeHandler = ({ target: { value } }) => {
        this.setState({ text: value });
    }

    onSubmitHandler = () => {
        // eslint-disable-next-line
        const { broadcastId } = this.props;
        this.setState({ text: '' });
    }

    render() {
        const { isDisable = false } = this.props;
        return (
            <MessageForm
                {...this.state}
                isDisable={isDisable}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

NewMessage.propTypes = {
    broadcastId: PropTypes.string,
    isDisable: PropTypes.bool.isRequired,
};

export default NewMessage;
