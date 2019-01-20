import React from 'react';
import PropTypes from 'prop-types';

import {
    Zoom,
    Avatar,
    ListItem,
    ListItemText,
    ListItemAvatar,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        width: 'auto',
        maxWidth: '100%',
        marginBottom: theme.spacing.unit,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
});

const ChatItem = ({
    classes, avatar, author, message, event,
}) => (
    <Zoom in>
        <ListItem
            dense
            disabled={event}
            alignItems="flex-start"
            className={classes.root}
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

ChatItem.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    avatar: PropTypes.string,
    author: PropTypes.string,
    message: PropTypes.string.isRequired,
    event: PropTypes.bool.isRequired,
};

export default withStyles(styles)(ChatItem);
