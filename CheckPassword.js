import React, {Component} from "react";
import {StatusBar, View} from "react-native";
import Tips from "./Tip";
import GesturePassword from "./GesturePassword";
export default class CheckPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: Tips.SHOUSHI_DRAW_PW ,
            status: Tips.SHOUSHI_NORMAL ,
            password: "12345",
            isMoving:true,
        }
    }

    componentWillMount() {

    }
    /*
    *  解决通知跳转到方法，暂时先先写在这里
    *
    * */
    componentDidMount() {
    }

    componentWillUnmount() {
        this.timerer && clearTimeout(this.timerer);
    }

    onEnd = (password) => {
        if (password == this.state.password){
            this.setState({
                status: Tips.SHOUSHI_RIGHT ,
                message: Tips.SHOUSHI_PW_CORRECT ,
            });
        } else if(password !=""){
                this.setState({
                    status: Tips.SHOUSHI_WRONG ,
                    message: `密码错误`
                });
        }
    }

    onStart = () => {
        this.setState({
            status: Tips.SHOUSHI_NORMAL ,
            message: Tips.SHOUSHI_DRAW_PW
        });
    }

    render() {
        const {isCheck} = this.props;
        return (
            <View>
                <GesturePassword
                    ref='pg'
                    status={this.state.status}
                    message={this.state.message}
                    onStart={this.onStart}
                    onEnd={(password) => this.onEnd(password)}
                    isCheck={isCheck}
                    innerCircle={true}
                    outerCircle={true}
                    isMoving={this.state.isMoving}
                />
            </View>
        );
    }
}
