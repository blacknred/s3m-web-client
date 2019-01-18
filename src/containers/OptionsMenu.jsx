import React from 'react';
import PropTypes from 'prop-types';

import Menu from '../components/OptionsMenu';

class OptionsMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
        };
    }

    componentDidMount() {
        const { children } = this.props;
        [...children].forEach((o) => {
            o.props.onClick.prototype.onClose = this.onCloseHandler;
        });
    }

    onCloseHandler = () => {
        this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
    }

    render() {
        return (
            <Menu
                {...this.state}
                {...this.props}
                onClose={this.onCloseHandler}
            />
        );
    }
}

OptionsMenu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default OptionsMenu;
