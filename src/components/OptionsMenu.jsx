import React from 'react';
import PropTypes from 'prop-types';

import {
    Fab,
    Menu,
    withWidth,
} from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';

const ANCHOR_ORIGIN = {
    vertical: 'top',
    horizontal: 'right',
};

const OptionsMenu = ({
    width, isOpen, children, onClose,
}) => (
    <React.Fragment>
        <Fab
            id="menu-anchor"
            color="inherit"
            size={width === 'xs' ? 'small' : 'medium'}
            onClick={onClose}
        >
            <MoreHoriz />
        </Fab>
        <Menu
            id="opts-menu"
            anchorEl={document.getElementById('menu-anchor')}
            open={isOpen}
            onClose={onClose}
            onClick={e => onClose(e, false)}
            anchorOrigin={ANCHOR_ORIGIN}
            transformOrigin={ANCHOR_ORIGIN}
        >
            {children}
        </Menu>
    </React.Fragment>
);

OptionsMenu.propTypes = {
    width: PropTypes.string.isRequired,
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
};

export default withWidth()(OptionsMenu);
