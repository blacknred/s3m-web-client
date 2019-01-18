import React from 'react';
import PropTypes from 'prop-types';
import FastAverageColor from 'fast-average-color/dist/index.es6';

const UPDATE_TIMEOUT = 700;
const RGB_DEVIATION = 70;
const STYLE = {
    backgroundColor: 'rgb(250, 250, 250)',
    transition: 'background-color 0.1s linear',
};
const fac = new FastAverageColor();

function reduceRgbUpdatesByDiff(firstArr = [], secondArr = [], epsilon) {
    const diff = firstArr.reduce((a, c, i) => a + Math.abs(c - (secondArr[i] || 0)), 0);
    return diff > (RGB_DEVIATION || epsilon || 70);
}

class DynamicBackground extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            rgb: null,
            prevRgbArr: [],
            isDark: false,
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.updateColor, UPDATE_TIMEOUT);
    }

    componentWillReceiveProps({ disable = false }) {
        const { disable: prevDisable } = this.props;
        if (disable === prevDisable) return;
        if (disable) {
            clearInterval(this.interval);
            this.setState({ rgb: STYLE.backgroundColor });
        } else {
            this.interval = setInterval(this.updateColor, UPDATE_TIMEOUT);
        }
    }

    componentWillUnmount() {
        fac.destroy();
        clearInterval(this.interval);
    }

    updateColor = () => {
        const { src: { current: video }, onDarkCallback } = this.props;
        const { prevRgbArr, isDark: oldIsDark } = this.state;
        if (!video) return;
        const { rgb, value, isDark } = fac.getColor(video, {
            mode: 'speed', // precise, speed
            algorithm: 'sqrt', // simple, sqrt, dominant
        });
        // console.log('calc');
        // v1
        // if (!rgb.match(new RegExp(this.rgbRegExp))) {
        //     this.setState({ color: rgb });
        //     value.pop();
        //     const rgbRE = value.map(v => `(${Math.floor(v / 10)}.)`).join(',');
        //     this.rgbRegExp = `rgb\\(${rgbRE}\\)`;
        //     console.log('upd');
        // }

        // v2
        if (reduceRgbUpdatesByDiff(value, prevRgbArr)) {
            if (onDarkCallback && oldIsDark !== isDark) {
                onDarkCallback(isDark);
            }
            this.setState({ rgb, prevRgbArr: value, isDark });
            // console.log('upd');
        }
    }

    render() {
        const { children } = this.props;
        const { rgb } = this.state;
        return (
            <div style={{ ...STYLE, backgroundColor: rgb }}>
                {children}
            </div>
        );
    }
}

DynamicBackground.propTypes = {
    src: PropTypes.shape().isRequired,
    children: PropTypes.node.isRequired,
    disable: PropTypes.bool,
    onDarkCallback: PropTypes.func,
};

export default DynamicBackground;
