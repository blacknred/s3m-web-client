import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    circular: {
        position: 'absolute',
        left: '50%',
        top: '50%',
    },
};

const Loader = ({ classes, size = 50 }) => (
    <CircularProgress
        className={classes.circular}
        size={size}
        style={{
            marginTop: size * -1,
            // marginLeft: size * -1,
        }}
        color="secondary"
        thickness={7}
    />
);

Loader.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    size: PropTypes.number,
};

export default withStyles(styles)(Loader);
