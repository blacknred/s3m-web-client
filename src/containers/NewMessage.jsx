import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import MessageForm from '../components/MessageForm';

class NewMessage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
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
        const { text } = this.state;
        const { broadcastId, ...rest } = this.props;
        return (
            <MessageForm
                {...rest}
                text={text}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

NewMessage.propTypes = {
    broadcastId: PropTypes.string,
    viewersCount: PropTypes.number.isRequired,
    isMyStream: PropTypes.bool.isRequired,
};

export default NewMessage;
