import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    Fab,
    Grid,
    Menu,
    Radio,
    MenuItem,
    withWidth,
    RadioGroup,
    Typography,
    FormControlLabel,
} from '@material-ui/core';
import {
    Cancel,
    VideocamOff,
    MoreHoriz,
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
        '&>div': {
            height: '100%',
            padding: theme.spacing.unit * 2,
            [theme.breakpoints.only('xs')]: {
                flexDirection: 'row',
            },
        },
        [theme.breakpoints.down('md')]: {
            zIndex: theme.zIndex.drawer,
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
        },
    },
    title: {
        fontFamily: 'Dosis',
        color: theme.palette.text.secondary,
        [theme.breakpoints.down('md')]: {
            color: theme.palette.primary.contrastText,
        },
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
        // overflowY: 'auto',
        '&>div': {
            height: '100%',
            padding: theme.spacing.unit * 2,
            [theme.breakpoints.only('xs')]: {
                width: 'auto',
                flexWrap: 'nowrap',
                alignItems: 'normal',
            },
        },
        [theme.breakpoints.only('xs')]: {
            zIndex: theme.zIndex.drawer,
            position: 'fixed',
            width: '100%',
            left: 0,
            top: '65%',
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
        },
    },
    stats: {
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        color: 'yellow',
        padding: theme.spacing.unit * 2,
        width: 200,
        zIndex: theme.zIndex.tooltip,
    },
});

const Broadcast = ({
    classes, width, isMyStream, isPeerStatsOn, videoCodec, Chat, NewMessage,
    Hearts, videoTarget, statsTarget, onChange, onStop, onSwitch,
    isDynamicBackgroundOn, isChatOn, isMenuOpen,
}) => {
    const preview = (
        <video
            loop
            controls={!['xs', 'sm'].includes(width)}
            ref={videoTarget}
            width="100%"
            height="100%"
        >
            <track default kind="captions" src="" />
        </video>
    );

    const stats = (
        <div className={classes.stats}>
            <RadioGroup
                aria-label="position"
                name="videoCodec"
                value={videoCodec}
                onChange={onChange}
                // row
            >
                <FormControlLabel
                    value="VP8"
                    control={<Radio color="primary" />}
                    label="VP8"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="VP9"
                    control={<Radio color="primary" />}
                    label="VP9"
                    labelPlacement="end"
                />
                <FormControlLabel
                    value="H264"
                    control={<Radio color="primary" />}
                    label="H264"
                    labelPlacement="end"
                />
            </RadioGroup>
            <div ref={statsTarget} />
        </div>
    );

    const optionsMenu = (
        <Menu
            id="opts-menu"
            anchorEl={document.getElementById('menu-anchor')}
            open={isMenuOpen}
            onClose={onSwitch('isMenuOpen')}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem onClick={onSwitch('isChatOn')}>
                {`Chat ${isChatOn ? 'off' : 'on'}`}
            </MenuItem>
            <MenuItem onClick={onSwitch('isDynamicBackgroundOn')}>
                {`Dynamic background ${isDynamicBackgroundOn ? 'off' : 'on'}`}
            </MenuItem>
            <MenuItem onClick={onSwitch('isPeerStatsOn')}>
                {`Peer statistic ${isPeerStatsOn ? 'off' : 'on'}`}
            </MenuItem>
        </Menu>
    );

    return (
        <Grid container className={classes.root}>
            {isPeerStatsOn && stats}
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
                        children={process.env.REACT_APP_WEBSITE_NAME.split('-')[0]}
                    />
                    <Grid
                        container
                        direction="column"
                        className={classes.actions}
                    >
                        {isMyStream && width !== 'xs' && Hearts}
                        <Fab
                            id="menu-anchor"
                            color="inherit"
                            size={width === 'xs' ? 'small' : 'medium'}
                            onClick={onSwitch('isMenuOpen')}
                        >
                            <MoreHoriz />
                        </Fab>
                        {optionsMenu}
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
                {preview}
            </Grid>
            <Grid item xs className={classes.right}>
                <Grid
                    container
                    justify="space-between"
                    alignItems="flex-end"
                    direction="column"
                >
                    {isChatOn && (
                        <React.Fragment>
                            {Chat}
                            {NewMessage}
                        </React.Fragment>
                    )}
                </Grid>
                {isMyStream && width === 'xs' && Hearts}
            </Grid>
        </Grid>
    );
};

Broadcast.propTypes = {
    width: PropTypes.string.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    videoCodec: PropTypes.string.isRequired,
    isMyStream: PropTypes.bool.isRequired,
    isPeerStatsOn: PropTypes.bool.isRequired,
    isChatOn: PropTypes.bool.isRequired,
    isMenuOpen: PropTypes.bool.isRequired,
    isDynamicBackgroundOn: PropTypes.bool.isRequired,
    videoTarget: PropTypes.shape().isRequired,
    statsTarget: PropTypes.shape().isRequired,
    onSwitch: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    Chat: PropTypes.node,
    Hearts: PropTypes.node.isRequired,
    NewMessage: PropTypes.node.isRequired,
};

export default withWidth()(withStyles(styles)(Broadcast));
