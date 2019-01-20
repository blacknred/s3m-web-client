import React from 'react';
import PropTypes from 'prop-types';

import { handleStream } from '../signalingClient';

class Preview extends React.PureComponent {
    componentDidMount() {
        const { videoRef } = this.props;
        handleStream(videoRef.current);
    }

    render() {
        const { videoRef } = this.props;
        return (
            <video
                autoPlay
                loop
                // controls={!['xs', 'sm'].includes(width)}
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
    videoRef: PropTypes.shape().isRequired,
};

export default Preview;
