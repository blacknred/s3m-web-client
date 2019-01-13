import React from 'react';
import PropTypes from 'prop-types';

import {
    Grid,
    Avatar,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    chatList: {
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.up('sm')]: {
            alignItems: 'flex-end',
        },
        '&>li': {
            width: 'auto',
            maxWidth: '100%',
            marginBottom: theme.spacing.unit,
            backgroundColor: theme.palette.background.paper,
        },
    },
});


const ChatMessage = ({
    avatar, author, message, event,
}) => (
    <ListItem
        dense
        disabled={event}
        alignItems="flex-start"
    >
        {!event && (
            <ListItemAvatar>
                {
                    avatar
                        ? <Avatar src={avatar} />
                        : (
                            <Avatar>
                                {author.charAt(0).toUpperCase()}
                            </Avatar>
                        )
                }
            </ListItemAvatar>
        )}
        <ListItemText
            primary={message}
            secondary={author}
        />
    </ListItem>
);

ChatMessage.propTypes = {
    avatar: PropTypes.string,
    author: PropTypes.string,
    message: PropTypes.string.isRequired,
    event: PropTypes.bool.isRequired,
};

const ChatList = ({ messages, classes }) => (
    <Grid
        container
        direction="column"
        // wrap="nowrap"
        className={classes.chatList}
    >
        {messages.map(message => (
            <ChatMessage
                {...message}
                key={`message-${message.id}`}
            />
        ))}
    </Grid>
);

ChatList.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(ChatList);
