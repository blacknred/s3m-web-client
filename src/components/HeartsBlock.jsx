import React from 'react';
import PropTypes from 'prop-types';

import {
    Fab,
    Grid,
} from '@material-ui/core';
import {
    red,
    teal,
    blue,
    indigo,
    yellow,
    purple,
} from '@material-ui/core/colors';
import { Favorite } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const COLORS = {
    0: yellow[500],
    1: red[500],
    2: blue[500],
    3: indigo[500],
    4: teal[500],
    5: purple[500],
};

const styles = theme => ({
    root: {
        maxWidth: 300,
        position: 'relative',
        [theme.breakpoints.up('sm')]: {
            flexGrow: 1,
        },
    },
    hearts: {
        position: 'relative',
        flex: '1',
        '& svg': {
            opacity: 1,
            position: 'absolute',
            bottom: 0,
        },
    },
    '@keyframes flow-1': {
        '0%': {
            opacity: 0,
            bottom: 0,
            left: '14%',
        },
        '40%': {
            opacity: 0.8,
        },
        '50%': {
            opacity: 1,
            left: 0,
        },
        '60%': {
            opacity: 0.2,
        },
        '80%': {
            bottom: '80%',
        },
        '100%': {
            opacity: 0,
            bottom: '100%',
            left: '18%',
        },
    },
    '@keyframes flow-2': {
        '0%': {
            opacity: 0,
            bottom: 0,
            left: 0,
        },
        '40%': {
            opacity: 0.8,
        },
        '50%': {
            opacity: 1,
            left: '11%',
        },
        '60%': {
            opacity: 0.2,
        },
        '80%': {
            bottom: '60%',
        },
        '100%': {
            opacity: 0,
            bottom: '80%',
            left: 0,
        },
    },
    '@keyframes flow-3': {
        '0%': {
            opacity: 0,
            bottom: 0,
            left: 0,
        },
        '40%': {
            opacity: 0.8,
        },
        '50%': {
            opacity: 1,
            left: '30%',
        },
        '60%': {
            opacity: 0.2,
        },
        '80%': {
            bottom: '70%',
        },
        '100%': {
            opacity: 0,
            bottom: '90%',
            left: 0,
        },
    },
    flow0: {
        animation: 'flow-1 1s linear',
    },
    flow1: {
        animation: 'flow-2 1s linear',
    },
    flow2: {
        animation: 'flow-3 1s linear',
    },
});

const Heart = withStyles(styles)(({
    classes, c, s, f,
}) => (
    <Favorite
        className={classes[`flow${f}`]}
        style={{
            fontSize: s,
            color: COLORS[c],
        }}
    />
));

const HeartsBlock = ({ classes, likes, onClick }) => (
    <Grid
        container
        justify="space-between"
        direction="column"
        className={classes.root}
    >
        <div className={classes.hearts}>
            {likes.map(({ id, ...rest }) => (
                <Heart key={id} {...rest} />
            ))}
        </div>
        <Fab
            color="primary"
            size="medium"
            onClick={onClick}
            onDoubleClick={() => {
                onClick();
                onClick();
                onClick();
            }}
        >
            <Favorite />
        </Fab>
    </Grid>
);

HeartsBlock.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    likes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(HeartsBlock);
