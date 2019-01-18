import React from 'react';
import PropTypes from 'prop-types';

import {
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    stats: {
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: theme.spacing.unit * 2,
        width: 200,
        zIndex: theme.zIndex.tooltip,
    },
});

const PeerStats = ({
    classes, videoCodec, onChange, stats,
}) => (
    <div className={classes.stats}>
        <RadioGroup
            aria-label="position"
            name="videoCodec"
            value={videoCodec}
            onChange={onChange}
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
        <div>
            {Object.keys(stats).map(k => <p>{`${k.toUpperCase()}: ${stats[k]}`}</p>)}
        </div>
        {/* // const stats = Object.keys(peerStats).reduce((prev, cur) =>
        //     `${prev} <p>${cur.toUpperCase()}: ${peerStats[cur]}</p>`, '');
        // this.statsRef.current.innerHTML = stats; */}
    </div>
);

PeerStats.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    videoCodec: PropTypes.string.isRequired,
    stats: PropTypes.shape().isRequired,
};

export default withStyles(styles)(PeerStats);
