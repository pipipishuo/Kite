import { _decorator, Component, instantiate, Node, Prefab, Size, Vec3, view } from 'cc';
import {Physics} from './Simulate'
const { ccclass, property } = _decorator;
interface Block{
    node:Node|null
    speed:number
}
@ccclass('GameController')
export class GameController extends Component {
    @property({type: Prefab})
    public boxPrefab: Prefab|null = null;
    @property({type: Node})
    public player:Node;
    private blocks: Block[] = [];
    private designSize: Size;
    private phy:Physics=new Physics;
    start() {
        this.designSize = view.getDesignResolutionSize();
        this.schedule(() => {
           this.generatBlock();
        }, 1.0);
    }
    generatBlock(){
        let node: Node | null = instantiate(this.boxPrefab);
        this.node.addChild(node);
        node.setPosition(this.designSize.width/2,(Math.random()-0.5)*2*this.designSize.height/2);
        let block={node:node,speed:200};
        this.blocks.push(block);
    }
    update(deltaTime: number) {
        let temp=[];
        for(let i=0;i<this.blocks.length;i++){
            let block=this.blocks[i];
            let lastPos=block.node.position;
            Vec3.subtract(lastPos,lastPos,new Vec3(deltaTime*block.speed,0,0));
            
            block.node.setPosition(lastPos)
            
            if(lastPos.x<0){
                console.log(lastPos.x)
                block.node.destroy();
            }else{
                temp.push(block)
            }
        }
        this.blocks=temp;
        this.phy.compute(deltaTime);
        console.log(this.phy.a,this.phy.v0,this.phy.acLen,this.phy.height);    
        
        this.updateResize();
        
    }
    updateResize(){
        let scale=(2/this.phy.height)*2
        console.log("scale",scale);
        let vec3=new Vec3(scale,scale,scale);
        this.player.scale=vec3;
    }
    up(){
        this.phy.up()
    }
    down(){
        this.phy.down()
    }
    run(){
        this.phy.run();
       
    }
}


