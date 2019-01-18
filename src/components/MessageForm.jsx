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
        borderRadius: 50,
        minWidth: 300,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        padding: `0 ${theme.spacing.unit * 1}px`,
        [theme.breakpoints.up('sm')]: {
            minHeight: theme.spacing.unit * 7,
            padding: `0 ${theme.spacing.unit * 2}px`,
        },
    },
    adornment: {
        height: '100%',
    },
});

const MessageForm = ({
    classes, text, onChange, onSubmit, viewersCount, disable,
}) => {
    const viewersCountWidget = (
        <Chip
            avatar={(
                <Avatar>
                    <People />
                </Avatar>
            )}
            label={viewersCount}
        />
    );
    return (
        !disable ? viewersCountWidget : (
            <Toolbar
                variant="dense"
                disableGutters
                className={classes.messageForm}
            >
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
        ));
};

MessageForm.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    text: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    viewersCount: PropTypes.number.isRequired,
    disable: PropTypes.bool.isRequired,
};

export default withStyles(styles)(MessageForm);
