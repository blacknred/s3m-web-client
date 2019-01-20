import React from 'react';
import PropTypes from 'prop-types';

import {
    Grid,
    withWidth,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import Message from './ChatItem';

const styles = theme => ({
    root: {
        flex: 1,
        overflow: 'hidden',
        marginBottom: theme.spacing.unit * 3,
        [theme.breakpoints.up('md')]: {
            alignItems: 'flex-end',
            maxWidth: '90%',
        },
        [theme.breakpoints.only('xs')]: {
            alignItems: 'flex-start',
        },
    },
});

const ChatList = ({
    messages, classes, width, setLimit,
}) => {
    setLimit(width);
    return (
        <Grid
            container
            direction="column"
            justify="flex-end"
            wrap="nowrap"
            className={classes.root}
        >
            {messages.map(message => (
                <Message
                    {...message}
                    key={`message-${message.id}`}
                />
            ))}
        </Grid>
    );
};

ChatList.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    width: PropTypes.string.isRequired,
    setLimit: PropTypes.func.isRequired,
};

export default withStyles(styles)(withWidth()(ChatList));
