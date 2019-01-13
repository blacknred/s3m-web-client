import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
    Fab,
    Grid,
    Radio,
    Switch,
    withWidth,
    RadioGroup,
    Typography,
    FormControlLabel,
} from '@material-ui/core';
import {
    Cancel,
    Favorite,
    VideocamOff,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        height: '100vh',
        overflow: 'hidden',
        width: '100%',
        margin: 0,
        // transition: 'background-color 500ms ease-out',
        [theme.breakpoints.only('xs')]: {
            flexDirection: 'column',
        },
    },
    options: {
        '&>div': {
            height: '100%',
            padding: theme.spacing.unit * 2,
        },
        [theme.breakpoints.down('md')]: {
            zIndex: theme.zIndex.drawer,
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: '5%',
        },
    },
    title: {
        fontFamily: 'Dosis',
        [theme.breakpoints.down('md')]: {
            color: theme.palette.grey[400],
        },
    },
    actions: {
        width: 'auto',
        flexBasis: '25%',
        flexDirection: 'column',
        justifyContent: 'space-around',
        [theme.breakpoints.down('md')]: {
            flexDirection: 'row',
        },
    },
    preview: {
        backgroundColor: theme.palette.common.black,
    },
    chat: {
        // overflowY: 'auto',
        '&>div': {
            height: '100%',
            padding: theme.spacing.unit * 2,
        },
        [theme.breakpoints.only('xs')]: {
            zIndex: theme.zIndex.drawer,
            position: 'fixed',
            left: 0,
        },
    },
    stats: {
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: 'rgba(34, 67, 423, 0.5)',
        color: 'yellow',
        padding: theme.spacing.unit * 2,
        maxWidth: 300,
        zIndex: theme.zIndex.tooltip,
    },
});

const Broadcast = ({
    classes, width, isMyStream, isStatsOn, videoCodec, Chat, NewMessage,
    videoTarget, statsTarget, rootTarget, onChange, onLike, onStop, onSwitch,
}) => {
    const stats = (
        <div className={classes.stats}>
            <p>
                <small>
                    Using WebRTC getStats API to detect data sent/received,
                    packets lost/success, ports/network, encryption and more.
                </small>
            </p>
            <RadioGroup
                aria-label="position"
                name="videoCodec"
                value={videoCodec}
                onChange={onChange}
                row
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

    return (
        <div ref={rootTarget}>
            <Grid container className={classes.root}>
                {isStatsOn && stats}
                <Grid item xs className={classes.options}>
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
                            {isMyStream && (
                                <Fab
                                    color="primary"
                                    size={width === 'xs' ? 'medium' : 'large'}
                                    onClick={onLike}
                                >
                                    <Favorite />
                                </Fab>
                            )}
                            <Fab
                                to="/"
                                component={Link}
                                color="secondary"
                                size={width === 'xs' ? 'medium' : 'large'}
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
                            <FormControlLabel
                                label="Peer statistics"
                                control={(
                                    <Switch
                                        checked={isStatsOn}
                                        onChange={onSwitch('isStatsOn')}
                                    // value="checkedA"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} lg={4} sm={6} className={classes.preview}>
                    <video
                        controls
                        loop
                        ref={videoTarget}
                        width="100%"
                        height="100%"
                    >
                        <track default kind="captions" src="" />
                    </video>
                </Grid>
                <Grid item xs className={classes.chat}>
                    <Grid
                        container
                        justify="space-between"
                        alignItems="flex-end"
                        direction="column"
                    >
                        {Chat}
                        {NewMessage}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

Broadcast.propTypes = {
    width: PropTypes.string.isRequired,
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    videoCodec: PropTypes.string.isRequired,
    isMyStream: PropTypes.bool.isRequired,
    isStatsOn: PropTypes.bool.isRequired,
    videoTarget: PropTypes.shape().isRequired,
    statsTarget: PropTypes.shape().isRequired,
    rootTarget: PropTypes.shape().isRequired,
    onSwitch: PropTypes.func.isRequired,
    onLike: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    Chat: PropTypes.node,
    NewMessage: PropTypes.node.isRequired,
};

export default withWidth()(withStyles(styles)(Broadcast));
