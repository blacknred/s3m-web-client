import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    Fab,
    Grid,
    MenuItem,
    withWidth,
    Typography,
} from '@material-ui/core';
import {
    Cancel,
    VideocamOff,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        height: '100vh',
        overflow: 'hidden',
        width: '100%',
        margin: 0,
        // [theme.breakpoints.only('xs')]: {
        //     flexDirection: 'column',
        // },
    },
    left: {
        [theme.breakpoints.only('xs')]: {
            bottom: 'auto',
            width: '100%',
        },
        [theme.breakpoints.down('md')]: {
            zIndex: theme.zIndex.drawer,
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
        },
        '&>div': {
            height: '100%',
            padding: theme.spacing.unit * 2,
            [theme.breakpoints.only('xs')]: {
                flexDirection: 'row',
            },
        },
    },
    title: {
        fontFamily: 'Dosis',
    },
    actions: {
        width: 'auto',
        flex: 1,
        justifyContent: 'flex-end',
        [theme.breakpoints.only('xs')]: {
            flexDirection: 'row',
        },
        '&>*': {
            [theme.breakpoints.only('xs')]: {
                marginLeft: theme.spacing.unit,
            },
            [theme.breakpoints.up('sm')]: {
                marginTop: theme.spacing.unit * 3,
            },
        },
    },
    preview: {
        backgroundColor: theme.palette.common.black,
    },
    right: {
        '&>div': {
            height: '100%',
            padding: theme.spacing.unit * 2,
            [theme.breakpoints.only('xs')]: {
                width: 'auto',
                flexWrap: 'nowrap',
                alignItems: 'flex-start',
            },
        },
        [theme.breakpoints.only('xs')]: {
            zIndex: theme.zIndex.drawer,
            position: 'fixed',
            width: '100%',
            left: 0,
            top: '20%',
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
        },
    },
});

// let textInput = React.createRef();

const Broadcast = ({
    classes, width, isMyStream, onStop, onSwitch,
    isPeerStatsOn, isDynamicBackgroundOn, isChatOn, isFakeChatModeOn,
    Chat, NewMessage, Hearts, Preview, OptionsMenu, PeerStats,
}) => (
    <Grid container className={classes.root}>
        {isPeerStatsOn && PeerStats}
        <Grid item xs className={classes.left}>
            <Grid
                container
                justify="space-between"
                alignItems="flex-start"
                direction="column"
            >
                <Typography
                    variant="h4"
                    color="textSecondary"
                    className={classes.title}
                    style={{ ...(isDynamicBackgroundOn && { color: '#ffffff7a' }) }}
                    children={process.env.REACT_APP_WEBSITE_NAME.split('-')[0]}
                />
                <Grid
                    container
                    direction="column"
                    className={classes.actions}
                >
                    {width !== 'xs' && Hearts}
                    <OptionsMenu>
                        <MenuItem onClick={onSwitch('isChatOn')}>
                            {`Chat ${isChatOn ? 'off' : 'on'}`}
                        </MenuItem>
                        <MenuItem onClick={onSwitch('isFakeChatModeOn')}>
                            {`Fake chat mode ${isFakeChatModeOn ? 'off' : 'on'}`}
                        </MenuItem>
                        <MenuItem onClick={onSwitch('isDynamicBackgroundOn')}>
                            {`Dynamic background ${isDynamicBackgroundOn ? 'off' : 'on'}`}
                        </MenuItem>
                        <MenuItem onClick={onSwitch('isPeerStatsOn')}>
                            {`Peer statistic ${isPeerStatsOn ? 'off' : 'on'}`}
                        </MenuItem>
                    </OptionsMenu>
                    <Fab
                        to="/"
                        component={Link}
                        color="secondary"
                        size={width === 'xs' ? 'small' : 'large'}
                        variant={width === 'xs' ? 'round' : 'extended'}
                        onClick={onStop}
                    >
                        {isMyStream ? <VideocamOff /> : <Cancel />}
                        {width !== 'xs' && (
                            <span>
                                &nbsp;
                                {isMyStream ? 'Turn off' : 'Leave'}
                            </span>
                        )}
                    </Fab>
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12} lg={4} sm={6} className={classes.preview}>
            {Preview}
        </Grid>
        <Grid item xs className={classes.right}>
            <Grid
                container
                justify="space-between"
                alignItems="flex-end"
                direction="column"
            >
                {Chat}
                {NewMessage}
            </Grid>
            {width === 'xs' && Hearts}
        </Grid>
    </Grid>
);

Broadcast.propTypes = {
    width: PropTypes.string.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    isMyStream: PropTypes.bool.isRequired,
    isPeerStatsOn: PropTypes.bool.isRequired,
    isChatOn: PropTypes.bool.isRequired,
    isFakeChatModeOn: PropTypes.bool.isRequired,
    isDynamicBackgroundOn: PropTypes.bool.isRequired,
    onSwitch: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    Chat: PropTypes.node.isRequired,
    Hearts: PropTypes.node.isRequired,
    PeerStats: PropTypes.node.isRequired,
    Preview: PropTypes.node.isRequired,
    NewMessage: PropTypes.node.isRequired,
    OptionsMenu: PropTypes.func.isRequired,
};

export default withWidth()(withStyles(styles)(Broadcast));
