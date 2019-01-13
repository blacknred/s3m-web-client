import React from 'react';
import PropTypes from 'prop-types';

import {
    Chip,
    Input,
    Avatar,
    Toolbar,
    InputAdornment,
} from '@material-ui/core';
import { People } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const ENTER_KEY = 13;

const styles = theme => ({
    messageForm: {
        height: 50,
        borderRadius: 50,
        minWidth: '75%',
        backgroundColor: theme.palette.background.paper,
    },
    adornment: {
        height: '100%',
    },
    chip: {},
});

const MessageForm = ({
    classes, text, onChange, onSubmit, viewersCount, isMyStream,
}) => {
    const viewersCountWidget = (
        <Chip
            avatar={(
                <Avatar>
                    <People />
                </Avatar>
            )}
            label={viewersCount}
            className={classes.chip}
        />
    );
    return (
        <Toolbar disableGutters>
            {!isMyStream ? viewersCountWidget : (
                <Toolbar className={classes.messageForm}>
                    <Input
                        autoFocus
                        disableUnderline
                        fullWidth
                        id="new-message"
                        type="text"
                        name="text"
                        autoComplete="off"
                        value={text}
                        placeholder="new message"
                        onChange={onChange}
                        onKeyDown={e => e.keyCode === ENTER_KEY && onSubmit()}
                        startAdornment={(
                            <InputAdornment
                                position="start"
                                className={classes.adornment}
                            >
                                <Avatar>A</Avatar>
                            </InputAdornment>
                        )}
                        endAdornment={(
                            <InputAdornment
                                position="end"
                                className={classes.adornment}
                            >
                                {viewersCountWidget}
                            </InputAdornment>
                        )}
                    />
                </Toolbar>
            )}
        </Toolbar>
    );
};

MessageForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    viewersCount: PropTypes.number.isRequired,
    isMyStream: PropTypes.bool.isRequired,
};

export default withStyles(styles)(MessageForm);
