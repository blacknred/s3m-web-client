import React from 'react';
import PropTypes from 'prop-types';
import FastAverageColor from 'fast-average-color/dist/index.es6';

const UPDATE_TIMEOUT = 700;
const RGB_DEVIATION = 70;
const DEFAULT_RGB = 'rgb(250, 250, 250)';
const fac = new FastAverageColor();

function reduceRgbUpdatesByDiff(firstArr = [], secondArr = [], epsilon) {
    const diff = firstArr.reduce((a, c, i) => a + Math.abs(c - (secondArr[i] || 0)), 0);
    return diff > (RGB_DEVIATION || epsilon || 70);
}

class DynamicBackground extends React.PureComponent {
    constructor(props) {
        super(props);
        this.rgbArr = [];
        this.state = {
            rgb: DEFAULT_RGB,
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.updateColor, UPDATE_TIMEOUT);
    }

    componentWillReceiveProps({ on = true }) {
        const { on: oldOn } = this.props;
        if (on === oldOn) return;
        if (!on) {
            clearInterval(this.interval);
            this.setState({ rgb: DEFAULT_RGB });
        } else {
            this.interval = setInterval(this.updateColor, UPDATE_TIMEOUT);
        }
    }

    componentWillUnmount() {
        fac.destroy();
        clearInterval(this.interval);
    }

    updateColor = () => {
        const { src: { current: video } } = this.props;
        if (!video) return;
        const { rgb, value } = fac.getColor(video, {
            mode: 'speed', // precise, speed
            algorithm: 'sqrt', // simple, sqrt, dominant
        });
        console.log('calc');
        // v1
        // if (!rgb.match(new RegExp(this.rgbRegExp))) {
        //     this.setState({ color: rgb });
        //     value.pop();
        //     const rgbRE = value.map(v => `(${Math.floor(v / 10)}.)`).join(',');
        //     this.rgbRegExp = `rgb\\(${rgbRE}\\)`;
        //     console.log('upd');
        // }

        // v2
        if (reduceRgbUpdatesByDiff(value, this.rgbArr)) {
            this.setState({ rgb });
            this.rgbArr = value;
            console.log('upd');
        }
    }

    render() {
        const { children } = this.props;
        const { rgb } = this.state;
        const style = {
            backgroundColor: rgb,
            transition: 'background-color 0.1s linear',
        };
        return (
            <div style={style}>
                {children}
            </div>
        );
    }
}

DynamicBackground.propTypes = {
    src: PropTypes.shape().isRequired,
    children: PropTypes.node.isRequired,
    on: PropTypes.bool,
};

export default DynamicBackground;
