import React from 'react';
import PropTypes from 'prop-types';

import HeartsBlock from '../components/Hearts';

class Hearts extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            likes: [],
        };
    }

    onClickHandler = () => {
        // api part...
        const newLike = {
            id: Math.random(),
            c: Math.floor((Math.random() * 6)),
            f: Math.floor((Math.random() * 3)),
            s: Math.floor(Math.random() * (55 - 30 + 1) + 30),
        };
        this.setState(({ likes }) => ({
            likes: [...likes, newLike],
        }));
        setTimeout(() => {
            this.setState(({ likes }) => ({
                likes: likes.slice(1),
            }));
        }, 900);
    }


    render() {
        const { isDisable = false } = this.props;
        return (
            <HeartsBlock
                {...this.state}
                isDisable={isDisable}
                onClick={this.onClickHandler}
            />
        );
    }
}

Hearts.propTypes = {
    broadcastId: PropTypes.string.isRequired,
    isDisable: PropTypes.bool.isRequired,
};

export default Hearts;
