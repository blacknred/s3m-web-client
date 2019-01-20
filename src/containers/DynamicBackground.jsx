import React from 'react';
import PropTypes from 'prop-types';
import FastAverageColor from 'fast-average-color/dist/index.es6';

const RGB_DEVIATION = 70;
const STYLE = {
    backgroundColor: 'rgb(250, 250, 250)',
    transition: 'background-color 0.1s linear',
};
const fac = new FastAverageColor();

function isNeedToUpdate(firstArr = [], secondArr = [], epsilon = 70) {
    const diff = firstArr.reduce((a, c, i) => a + Math.abs(c - (secondArr[i] || 0)), 0);
    return diff > (RGB_DEVIATION || epsilon);
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
        const { interval } = this.props;
        this.interval = interval
            ? setInterval(this.updateColor, interval)
            : window.requestAnimationFrame(this.updateColor);
    }

    componentWillReceiveProps({ isDisable = false }) {
        const { isDisable: prevIsDisable, interval } = this.props;
        if (isDisable === prevIsDisable) return;
        if (isDisable) {
            if (interval) {
                clearInterval(this.interval);
            } else {
                window.cancelAnimationFrame(this.interval);
            }
            this.setState({ rgb: STYLE.backgroundColor });
        } else {
            this.interval = interval
                ? setInterval(this.updateColor, interval)
                : window.requestAnimationFrame(this.updateColor);
        }
    }

    componentWillUnmount() {
        const { interval } = this.props;
        fac.destroy();
        if (interval) {
            clearInterval(this.interval);
        } else {
            window.cancelAnimationFrame(this.interval);
        }
    }

    updateColor = () => {
        const {
            src: { current: video }, onDark, reduceUpdates = false,
            interval, algorithm = 'sqrt',
        } = this.props;
        const { prevRgbArr, isDark: oldIsDark } = this.state;

        if (video && !(video.paused || video.ended)) {
            const { rgb, value, isDark } = fac.getColor(video, {
                mode: 'speed', // precise, speed
                algorithm, // simple, sqrt, dominant
            });
            // console.log('calc');

            if (!reduceUpdates || isNeedToUpdate(value, prevRgbArr)) {
                this.setState({ rgb, prevRgbArr: value, isDark });
                if (onDark && oldIsDark !== isDark) {
                    onDark(isDark);
                }
                // console.log('upd');
            }
        }

        if (!interval) {
            this.interval = window.requestAnimationFrame(this.updateColor);
        }
    }

    render() {
        const { rgb } = this.state;
        const { children, interval } = this.props;
        return (
            <div style={{ ...(interval && STYLE), backgroundColor: rgb }}>
                {children}
            </div>
        );
    }
}

DynamicBackground.propTypes = {
    src: PropTypes.shape().isRequired,
    children: PropTypes.node.isRequired,
    isDisable: PropTypes.bool,
    reduceUpdates: PropTypes.bool,
    interval: PropTypes.number,
    algorithm: PropTypes.oneOf(['simple', 'sqrt', 'dominant']),
    onDark: PropTypes.func,
};

export default DynamicBackground;
