import { _decorator, AudioSource, Component, instantiate, Label, Node, Prefab, Size, Sprite, Vec3, view ,random} from 'cc';
import {Physics} from './Simulate'
const { ccclass, property } = _decorator;
interface Block{
    node:Node|null
    speed:number
}
enum State{
    RUNNING,
    PAUSE
};
@ccclass('GameController')
export class GameController extends Component {
    @property({type: Prefab})
    public boxPrefab: Prefab|null = null;
    @property({type: Node})
    public player:Node;
    @property({type: Node})
    public line:Node;
    @property({type: Node})
    public runbtn:Node;
    @property({type: Node})
    public upbtn:Node;
    @property({type: Node})
    public downbtn:Node;
    @property({type: Node})
    public startbtn:Node;
    @property({type: Node})
    public pausebtn:Node;
    @property({type: Label})
    public score:Label;
    @property({type: Label})
    public height:Label;
    @property({type: Node})
    public hand:Node;
    public timer:number=0;
    private blocks: Block[] = [];
    private designSize: Size;
    private phy:Physics=Physics.getInstance();
    @property(AudioSource)
    public bgmAudioSource: AudioSource = null!; // 从编辑器中拖入背景音乐的AudioSource组件
    private state:State=State.PAUSE;
    start() {
        this.designSize = view.getDesignResolutionSize();
        this.schedule(() => {
           this.generatBlock();
        }, 10.0);
        this.setComponentVisible(false);
        // this.schedule(()=>{
        //     if (this.bgmAudioSource) {
        //         if(this.phy.a>0){
        //             // 确保音量值在 0-1 范围内
        //             this.bgmAudioSource.volume = Math.min(1, Math.max(0, this.bgmAudioSource.volume*2));
                    
        //         }else{
        //             this.bgmAudioSource.volume = Math.min(1, Math.max(0, this.bgmAudioSource.volume/2));
        //         }
        //         console.log("this.bgmAudioSource.volume",this.bgmAudioSource.volume);
        //     }
        // },1);

    }
    onPauseClick(){
        const labelNode=this.startbtn.getChildByName("Label");
        const label = labelNode?.getComponent(Label);
        if (label) {
            label.string = "继续游戏";
        }
        this.startbtn.active=true;
        this.setComponentVisible(false);
        this.state=State.PAUSE;
    }
     onStopClick(){
        const labelNode=this.startbtn.getChildByName("Label");
        const label = labelNode?.getComponent(Label);
        if (label) {
            label.string = "开始游戏";
        }
        this.startbtn.active=true;
        this.setComponentVisible(false);
        this.state=State.PAUSE;
        this.phy.height=6;
    }
    onStartClick(){
         this.startbtn.active=false;
         this.setComponentVisible(true);
         this.state=State.RUNNING;
    }
    setComponentVisible(flag){
        this.player.active = flag;
        this.line.active = flag;
        this.runbtn.active=flag;
        this.upbtn.active=flag;
        this.downbtn.active=flag;
        this.pausebtn.active=flag;
        this.hand.active=flag;
        for(let i=0;i<this.blocks.length;i++){
            let block=this.blocks[i];
            block.node.active=flag;
        }
        if(flag){
            this.bgmAudioSource.play();
        }else{
            this.bgmAudioSource.stop();
        }
        
    }
    generatBlock(){
        if(this.state!=State.RUNNING)return; 
        let node: Node | null = instantiate(this.boxPrefab);
        this.node.addChild(node);
        node.setPosition(this.designSize.width/2,(Math.random()-0.5)*2*this.designSize.height/2);
        let block={node:node,speed:20};
        this.blocks.push(block);
        
    }
    
    formatFull(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        const parts: string[] = [];
        if (hours > 0) parts.push(hours.toString().padStart(2, '0'));
        parts.push(mins.toString().padStart(2, '0'));
        parts.push(secs.toString().padStart(2, '0'));
        
        return parts.join(':');
    }
    update(deltaTime: number) {
        if(this.state!=State.RUNNING)return;        //不到运行时不更新
        this.timer+=deltaTime;
        this.score.string="时间:  "+this.formatFull(Math.floor(this.timer));
        this.height.string="高度:"+this.phy.height.toFixed(1)+"米";
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
        console.log("last",this.phy.a,this.phy.v0,this.phy.acLen,this.phy.height); 
        this.phy.compute(deltaTime);
        console.log("cur",this.phy.a,this.phy.v0,this.phy.acLen,this.phy.height);    
       if(this.phy.height<5){
        console.log("failed!");
        this.onStopClick();
       } 

        this.updateResize();
       
    }
    updateResize(){
        let scale=(2/this.phy.height)*6
       // console.log("scale",scale);
        let vec3=new Vec3(scale,scale,scale);
        this.player.scale=vec3;
        let lastPos=this.player.getPosition();
        
        lastPos.x=lastPos.x+(random()-0.5)*2;
        
        lastPos.y=this.phy.height/(100/960.0)-368;
                
        this.player.setPosition(lastPos);
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


