import React from 'react';
import PropTypes from 'prop-types';

import {
    Grid,
    Zoom,
    Avatar,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    chatList: {
        flex: 1,
        overflow: 'hidden',
        flexWrap: 'nowrap',
        maxHeight: '90%',
        [theme.breakpoints.up('sm')]: {
            alignItems: 'flex-end',
        },
        '&>li': {
            width: 'auto',
            maxWidth: '100%',
            marginBottom: theme.spacing.unit,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
    },
});


const ChatMessage = ({
    avatar, author, message, event,
}) => (
    <Zoom in unmountOnExit>
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
                secondary={!event ? author : null}
            />
        </ListItem>
    </Zoom>
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
