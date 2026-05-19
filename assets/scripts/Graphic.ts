import { _decorator, Component, Graphics, Color,Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Graphic')
export class Graphic extends Component {
     @property({type:Node})
    kite:Node=null;
    start() {
        const g = this.getComponent(Graphics);
        if (!g) return;
        console.log("get Graphic")
        // 设置样式（可选）
        g.lineWidth = 5;                    // 线条粗细 5px
        g.strokeColor = new Color(255,0,0); // 红色
        g.lineCap = Graphics.LineCap.ROUND; // 圆头端点

        
        
        const myTransform = this.node.getComponent(UITransform);
        const targetTransform = this.kite.getComponent(UITransform);
        
        if (!myTransform || !targetTransform) return;
        
        // 获取目标节点的世界坐标
        const targetWorldPos = this.kite.worldPosition;
        
        // 将目标节点的世界坐标转换到本节点的本地坐标系（以锚点为原点）
        const relativePos = myTransform.convertToNodeSpaceAR(targetWorldPos);
        const len=Math.sqrt(Math.pow(relativePos.x,2)+Math.pow(relativePos.y,2));
        // 绘制线段
        g.moveTo(0, 0);      // 起点 (0,0)
        g.lineTo(len, 0);  // 终点 (100,100)
        g.stroke();          // 执行绘制

        let angleRad = Math.atan2(relativePos.y, relativePos.x);
        let angleDeg = angleRad * 180 / Math.PI;
        this.node.setRotationFromEuler(0, 0, angleDeg);
    }

    update(deltaTime: number) {
        
    }
}


