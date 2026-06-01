import {  _decorator, Component, Node, Vec3,SystemEventType, EventTouch, random } from 'cc';
import { instance } from '../ThirdParty/joystick/scripts/Joystick';

import  { JoystickDataType, SpeedType } from "../ThirdParty/joystick/scripts/Joystick";
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property(Node)
    private joyStick:Node=null
    private moveDir: Vec3 = new Vec3();
    private speed: number = 5;
    private _speedType: SpeedType = SpeedType.STOP;
    private _moveSpeed = 0;
    private stopSpeed = 0;
    private normalSpeed = 100;
    private fastSpeed = 200;
    onLoad() {
    if (this.joyStick) {
        this.joyStick.active = false;
    }
    }
    start() {
  // 监听摇杆事件
  
        instance.on(SystemEventType.TOUCH_MOVE, this.onJoystickMove, this);
        instance.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        instance.on(SystemEventType.TOUCH_END, this.onTouchEnd, this);
        
        
    }
    onTouchStart() {}
    onTouchEnd(event: EventTouch, data: JoystickDataType) {
        this._speedType = data.speedType;

        this.onSetMoveSpeed(this._speedType);
    }
    onJoystickMove(event: EventTouch, data:JoystickDataType) {
        // 现在 customData 已经定义了
        this._speedType = data.speedType;
        this.moveDir = data.moveVec;
        console.log("this._speedType",this._speedType)
        this.onSetMoveSpeed(this._speedType);
        // 移动角色
        //this.movePlayer(customData.moveVec);
    }
    onSetMoveSpeed(speedType: SpeedType) {
        switch (speedType) {
        case SpeedType.STOP:
            this._moveSpeed = this.stopSpeed;
            break;
        case SpeedType.NORMAL:
            this._moveSpeed = this.normalSpeed;
            break;
        case SpeedType.FAST:
            this._moveSpeed = this.normalSpeed;
            break;
        default:
            break;
        }
     } 
     move() {
        

        
        // const oldPos = this.node.getPosition();
        // const newPos = oldPos.add(
        //     // fps: 60
        //     this.moveDir.clone().multiplyScalar(this._moveSpeed / 60)
        // );
        // console.log(this._moveSpeed / 60);
        // this.node.setPosition(newPos);

        // console.log(newPos);
        
    }
    update(deltaTime: number) {
         if (this._speedType !== SpeedType.STOP) {
            this.move();
        }
    }
}


