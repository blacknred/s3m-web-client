import React from 'react';
import PropTypes from 'prop-types';
import { withWidth } from '@material-ui/core';

import { handleStream } from '../signalingClient';

class Preview extends React.PureComponent {
    componentDidMount() {
        const { videoRef } = this.props;
        handleStream(videoRef.current);
    }

    render() {
        const { width, videoRef } = this.props;
        return (
            <video
                loop
                controls={!['xs', 'sm'].includes(width)}
                ref={videoRef}
                width="100%"
                height="100%"
            >
                <track default kind="captions" src="" />
            </video>
        );
    }
}

Preview.propTypes = {
    width: PropTypes.string.isRequired,
    videoRef: PropTypes.shape().isRequired,
};

export default withWidth()(Preview);
