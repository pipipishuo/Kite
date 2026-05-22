import { _decorator, Component, Graphics, Color,Node, UITransform } from 'cc';
import { getCatenaryCurve, Point } from 'catenary-curve';
import {Physics} from './Simulate'
const { ccclass, property } = _decorator;

@ccclass('Graphic')
export class Graphic extends Component {
     @property({type:Node})
    kite:Node=null;
    private phy:Physics=Physics.getInstance();
    private graphics:Graphics;
    drawLine(){
        const myTransform = this.node.getComponent(UITransform);
        const targetTransform = this.kite.getComponent(UITransform);
        
        if (!myTransform || !targetTransform) return;
        
        // 获取目标节点的世界坐标
        const targetWorldPos = this.kite.worldPosition;
        
        // 将目标节点的世界坐标转换到本节点的本地坐标系（以锚点为原点）
        const relativePos = myTransform.convertToNodeSpaceAR(targetWorldPos);
        const len=Math.sqrt(Math.pow(relativePos.x,2)+Math.pow(relativePos.y,2));
        const reallen=this.phy.lineLen;
        const unreallen=this.phy.height*1.4142;
        const rate=len/unreallen;
        // console.log("height",this.phy.height);
        let max=relativePos.y;
        const p1: Point = { x: 0, y: max };
        const p2: Point = { x: relativePos.x, y: 0 };
        
        const chainLength = reallen*rate;
        
        //const p2: Point = { x: 200, y: 0 };
        //const chainLength = 400;
 // 计算悬链线数据
        const curve = getCatenaryCurve(p1, p2, chainLength);

        // 使用 Graphics 绘制
        this.graphics.clear();
        this.graphics.lineWidth = 3;
        this.graphics.strokeColor = new Color(139, 69, 19, 255); // 棕色
        
       // console.log("curve.type",curve.type);
        if (curve.type === 'quadraticCurve') {
            this.graphics.moveTo(curve.start[0], max-curve.start[1]);
            for (const seg of curve.curves) {
                // seg: [控制点X, 控制点Y, 终点X, 终点Y]
                
                
                this.graphics.quadraticCurveTo(seg[0],Math.max(0,max-seg[1]), seg[2], Math.max(0,max-seg[3]));
                //console.log("y",y);
                
            }
        } else if (curve.type === 'line') {
            this.graphics.moveTo(curve.start[0], max-curve.start[1]);
            this.graphics.lineTo(curve.lines[0][0], max-curve.lines[0][1]);
        }
        //this.graphics.moveTo(p1.x,p1.y);
        //this.graphics.lineTo(p2.x,p2.y);
        this.graphics.stroke();
    }
    start() {
        this.graphics = this.getComponent(Graphics);
        if (!this.graphics) return;
        console.log("get Graphic")
        // 设置样式（可选）
        this.graphics.lineWidth = 5;                    // 线条粗细 5px
        this.graphics.strokeColor = new Color(255,0,0); // 红色
        this.graphics.lineCap = Graphics.LineCap.ROUND; // 圆头端点

        
        
        
    }

    update(deltaTime: number) {
        this.drawLine();
    }
}


