/**
 * 手势密码
 */
import React, {Component} from "react";
import  PropTypes from 'prop-types';
import {Dimensions, Image, PanResponder, Platform, StatusBar, StyleSheet, Text, View, ImageBackground,BackHandler} from "react-native";
import Line from "./Line";
import Circle from "./Circle";
import * as helper from "./Helper";

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;
const Top = (Height - Width) / 2.0 * 1.0;
const Radius = Width / 10;
export default class GesturePassword extends Component {
    constructor(props) {
        super(props);
        this.lastIndex = -1;
        this.sequence = '';   // 手势结果
        // this.props.isMoving = false;  //
        this.flag = true;  //解决手势绘制完成时，定时器引起的bug

        // getInitialState
        let circles = [];
        let circles_x = [];
        let Margin = Radius;
        for (let i = 0; i < 9; i++) {
            let p = i % 3;
            let q = parseInt(i / 3);
            circles.push({
                isActive: false,
                x: p * (Radius * 2 + Margin) + Margin + Radius,
                y: q * (Radius * 2 + Margin) + Margin + Radius
            });
        }

        for (let i = 0; i < 9; i++) {
            let p = i % 3;
            let q = parseInt(i / 3);
            circles_x.push({
                isActive: false,
                x: (p - 1) * (Radius * 2 / 5 + Margin / 5 ) + Width / 2,
                y: (q - 1) * (Radius * 2 / 5 + Margin / 5) - Radius
            });
        }

        this.state = {
            circles: circles,
            circles_x: circles_x,
            lines: [],
            lines_x: [],
        }
    }

    //响应事件
    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onStartShouldSetPanResponderCapture: (event, gestureState) => true,
            onMoveShouldSetPanResponder: (event, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (event, gestureState) => true,
            onPanResponderTerminationRequest: () => false,

            // 开始手势操作
            onPanResponderGrant: (event, gestureState) => {
                this.onStart(event, gestureState);
            },
            // 移动操作
            onPanResponderMove: (event, gestureState) => {
                this.onMove(event, gestureState);
            },
            // 释放手势
            onPanResponderRelease: (event, gestureState) => {
                this.onEnd(event, gestureState);
            }
        })

    }



    componentWillReceiveProps(nextProps) {
        let curPrompt = this.props.passwordPrompt;
        let nextPrompt = nextProps.passwordPrompt;

        if (curPrompt != nextPrompt && nextProps.layoutType == 2) {
            // 显示手势密码提示
            this.resetActive(2);
            for (let i = 0; i < nextPrompt.length; i++) {
                this.setActive(parseInt(nextPrompt[i] - 1), 2);

                if (i != nextPrompt.length - 1) {
                    this.state.lines_x.push({
                        start: {
                            x: this.state.circles_x[parseInt(nextPrompt[i] - 1)].x,
                            y: this.state.circles_x[parseInt(nextPrompt[i] - 1)].y
                        },
                        end: {
                            x: this.state.circles_x[parseInt(nextPrompt[i + 1] - 1)].x,
                            y: this.state.circles_x[parseInt(nextPrompt[i + 1] - 1)].y
                        }
                    });
                }
            }
        }
    }

	componentDidMount = () => {
		BackHandler.addEventListener('hardwareBackPress', this._handleBack);
    }
	_handleBack () {
		return true;
	}
    componentWillUnmount() {
        this._panResponder = [];
        this.timer && clearTimeout(this.timer);
		BackHandler.removeEventListener('hardwareBackPress', this._handleBack);
    }

    render() {
        let color = this.props.status === 'wrong' ? this.props.wrongColor : this.props.rightColor;
        const {layoutType, isCheck} = this.props;

        //手势密码验证
            return (
                <View style={{flex: 1}}>
                    <View 
                           style={{
                               width: Width,
                               height: Height,
                               backgroundColor:"#999999",
                           }}>
                        <View style={[styles.message,{top: Top / 1.62}]}>
                            <Text style={[styles.msgText, this.props.textStyle, {color: color}]}>
                                {this.state.message || this.props.message}
                            </Text>
                        </View>
                        <View style={styles.board} {...this._panResponder.panHandlers}>
                            {this.renderCircles()}
                            {this.renderLines()}
                            <Line ref='line' color={color}/>
                        </View>
                    </View>
                    {/*{this.props.children}*/}
                </View>
            )
    }


    //圆
    renderCircles(flag = 1) {
        let array = [], fill, color, inner, outer;
        let {status, normalColor, wrongColor, rightColor, innerCircle, outerCircle} = this.props;

        if (flag == 1) {
            this.state.circles.forEach(function (c, i) {
                fill = c.isActive;
                color = status === 'wrong' ? wrongColor : rightColor;
                inner = !!innerCircle;
                outer = !!outerCircle;
                array.push(
                    <Circle key={'c_' + i} fill={fill} normalColor={normalColor} color={color} x={c.x} y={c.y}
                            r={Radius} inner={inner} outer={outer}/>
                )
            });
        } else {
            this.state.circles_x.forEach(function (c, i) {
                fill = c.isActive;
                color = rightColor;
                inner = true;
                outer = false;
                array.push(
                    <Circle key={'c_' + i} fill={fill} normalColor={normalColor} color={color} x={c.x} y={c.y}
                            r={Radius / 5} inner={inner} outer={outer}/>
                )
            });
        }


        return array;
    }

    //线
    renderLines(flag = 1, linewid = 5) {
        let array = [], color;
        let {status, wrongColor, rightColor} = this.props;

        if (flag == 1) {
            this.state.lines.forEach(function (l, i) {
                color = status === 'wrong' ? wrongColor : rightColor;

                array.push(
                    <Line key={'l_' + i} color={color} start={l.start} end={l.end}/>
                )
            });
        } else {
            this.state.lines_x.forEach(function (l, i) {
                color = rightColor;

                if (linewid == 5) {
                    array.push(
                        <Line key={'l_' + i} color={color} start={l.start} end={l.end}/>
                    )
                }
            });
        }

        return array;
    }

    setActive(index, flag = 1) {
        if (flag == 1) {
            this.state.circles[index].isActive = true;
            let circles = this.state.circles;
            this.setState({circles});
        }
        else {
            this.state.circles_x[index].isActive = true;
            let circles_x = this.state.circles_x;
            this.setState({circles_x});
        }

    }

    resetActive(flag = 1) {
        if (flag == 1) {
            this.state.lines = [];
            for (let i = 0; i < 9; i++) {
                this.state.circles[i].isActive = false;
            }
            let circles = this.state.circles;
            this.setState({circles});
            this.props.onReset && this.props.onReset();
        } else {
            this.state.lines_x = [];
            for (let i = 0; i < 9; i++) {
                this.state.circles_x[i].isActive = false;
            }
            let circles_x = this.state.circles_x;
            this.setState({circles_x});
            this.props.onReset && this.props.onReset();

        }
    }

    //判断点touch是否在九个圆内
    getTouchChar(touch) {
        let x = touch.x;
        let y = touch.y;

        for (let i = 0; i < 9; i++) {
            if (helper.isPointInCircle({x, y}, this.state.circles[i], Radius)) {
                return String(i);
            }
        }

        return false;
    }


    //检查是否路过每一行每一列的中间点
    getCrossChar(char) {
        let middles = '13457', last = String(this.lastIndex);

        // if ( middles.indexOf(char) > -1 || middles.indexOf(last) > -1 ) return false;

        let point = helper.getMiddlePoint(this.state.circles[last], this.state.circles[char]);

        for (let i = 0; i < middles.length; i++) {
            let index = middles[i];
            if (helper.getDistance(point, this.state.circles[index]) < Radius) {
                return String(index);
            }

        }

        return false;
    }

    onStart(e, g) {
        // this.resetActive();
        if (this.props.isMoving && this.flag) {
            this.props.outerCircle = true;
            let x = e.nativeEvent.pageX;
            let y = e.nativeEvent.pageY - Top;

            let lastChar = this.getTouchChar({x, y});
            if (lastChar) {
                this.lastIndex = Number(lastChar);
                this.sequence = lastChar;
                this.setActive(this.lastIndex);
                let point = {
                    x: this.state.circles[this.lastIndex].x,
                    y: this.state.circles[this.lastIndex].y
                };

                this.refs.line.setNativeProps({start: point, end: point});

                this.props.onStart && this.props.onStart();
            }
        }

    }

    onMove(e, g) {
        if (this.props.isMoving && this.flag) {
            let x = e.nativeEvent.pageX;
            let y = e.nativeEvent.pageY - Top;
            if (this.checkFistDot()) {
                this.onStart(e, g);
                return;
            }
            this.refs.line.setNativeProps({end: {x, y}});

            let lastChar = null;


            if (this.state.circles[this.lastIndex] && !helper.isPointInCircle({x, y}, this.state.circles[this.lastIndex], Radius)) {
                lastChar = this.getTouchChar({x, y});
            }

            if (lastChar && this.sequence.indexOf(lastChar) === -1) {
                if (!this.props.allowCross) {
                    let crossChar = this.getCrossChar(lastChar);

                    if (crossChar && this.sequence.indexOf(crossChar) === -1) {
                        this.sequence += crossChar;
                        this.setActive(Number(crossChar));
                    }
                }

                let lastIndex = this.lastIndex;
                let thisIndex = Number(lastChar);

                this.state.lines.push({
                    start: {
                        x: this.state.circles[lastIndex].x,
                        y: this.state.circles[lastIndex].y
                    },
                    end: {
                        x: this.state.circles[thisIndex].x,
                        y: this.state.circles[thisIndex].y
                    }
                });

                this.lastIndex = Number(lastChar);
                this.sequence += lastChar;

                this.setActive(this.lastIndex);

                let point = {
                    x: this.state.circles[this.lastIndex].x,
                    y: this.state.circles[this.lastIndex].y
                };

                this.refs.line.setNativeProps({start: point});
            }
        }

        if (this.sequence.length === 9) this.onEnd();
    }

    onEnd(e, g) {
        if (this.props.isMoving && this.flag) {
            let password;
            password = helper.getRealPassword(this.sequence);
            this.sequence = '';
            this.lastIndex = -1;
            this.props.isMoving = false;

            let origin = {x: 0, y: 0};
            this.refs.line.setNativeProps({start: origin, end: origin});
            if (this.props.interval > 0) {
                this.flag = false;
                this.timer = setTimeout(() => this.startEnd(), this.props.interval);
            }
            this.props.onEnd && this.props.onEnd(password);

        }
    }


    startEnd() {
        this.resetActive();
        this.flag = true;
    }

    checkFistDot() {
        for (let i = 0; i < 9; i++) {
            if (this.state.circles[i].isActive == true) {
                return false;
            }
        }
        return true;
    }
}

GesturePassword.propTypes = {
    message: PropTypes.string,
    normalColor: PropTypes.string,
    rightColor: PropTypes.string,
    wrongColor: PropTypes.string,
    status: PropTypes.oneOf(['right', 'wrong', 'normal']),
    onStart: PropTypes.func,
    onEnd: PropTypes.func,
    onReset: PropTypes.func,
    interval: PropTypes.number,
    allowCross: PropTypes.bool,
    innerCircle: PropTypes.bool,
    outerCircle: PropTypes.bool,
    isMoving: PropTypes.bool,
    layoutType: PropTypes.number,
    height: PropTypes.number
}

GesturePassword.defaultProps = {
    message: '',
    normalColor: '#80cef2',
    rightColor: '#FFFFFF',
    wrongColor: '#D93609',
    status: 'normal',
    interval: 500,
    allowCross: false,
    isMoving: true,
    innerCircle: true,
    outerCircle: true,
    layoutType: 1,
}

const styles = StyleSheet.create({

    leftNav: {
        marginTop: Platform.OS === 'android' ? 20 : 0,
        position: 'absolute',
        top: 0,
        bottom: 8,
        left: 16,
    },
    barView: {
        height: Platform.OS === 'android' ? 44 : 64,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingTop: Platform.OS == "ios" ? 20 : 10,

    },
    title: {
        marginTop: Platform.OS === 'android' ? 20 : 0,
        color: 'white',
        fontSize: 20,
    },

    board: {
        position: 'absolute',
        left: 0,
        top: Top / 1.4,
        width: Width,
        height: Height
    },
    message: {
        position: 'absolute',
        left: 0,
        top: Top / 1.5,
        width: Width,
        height: Top / 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    msgText: {
        fontSize: 14
    }
});

