import { _decorator, AudioSource, Component, instantiate, Node, Prefab, Size, Vec3, view } from 'cc';
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
    private phy:Physics=Physics.getInstance();
    @property(AudioSource)
    public bgmAudioSource: AudioSource = null!; // 从编辑器中拖入背景音乐的AudioSource组件

    start() {
        this.designSize = view.getDesignResolutionSize();
        this.schedule(() => {
           this.generatBlock();
        }, 10.0);
    }
    generatBlock(){
        let node: Node | null = instantiate(this.boxPrefab);
        this.node.addChild(node);
        node.setPosition(this.designSize.width/2,(Math.random()-0.5)*2*this.designSize.height/2);
        let block={node:node,speed:20};
        this.blocks.push(block);
        
    }
    update(deltaTime: number) {
        let temp=[];
        for(let i=0;i<this.blocks.length;i++){
            let block=this.blocks[i];
            let lastPos=block.node.position;
            Vec3.subtract(lastPos,lastPos,new Vec3(deltaTime*block.speed,0,0));
            
            block.node.setPosition(lastPos)
            
            if(lastPos.x<(-this.designSize.width)){
                //console.log("DESTORY",lastPos.x)
                block.node.destroy();
            }else{
                temp.push(block)
            }
        }
        this.blocks=temp;
        this.phy.compute(deltaTime);
       // console.log(this.phy.a,this.phy.v0,this.phy.acLen,this.phy.height);    
        
        this.updateResize();
        if (this.bgmAudioSource) {
            if(this.phy.a>0){
                // 确保音量值在 0-1 范围内
                this.bgmAudioSource.volume = Math.min(1, Math.max(0, this.bgmAudioSource.volume+0.1));
            }else{
                this.bgmAudioSource.volume = Math.min(1, Math.max(0, this.bgmAudioSource.volume-0.1));
            }
        }
    }
    updateResize(){
        let scale=(2/this.phy.height)*2
       // console.log("scale",scale);
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


