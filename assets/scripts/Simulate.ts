export class Physics{
    G:number=30;//重力
    a:number=0;
    s:number=0;
    v0:number=0;
    acLen:number=6;     //实际绳子长度  必须大于等于 风筝高度
    lineLen:number=6*1.41421;
    m:number=3;
    height:number=6;              //风筝高度
    wind:number[]=[];           //最多1W米  不能很高  半米一个数字  这样精度比较可以
    startTime:Date=new Date();

    handa:number=0;
    lastPressTime:Date=new Date();
    // 静态实例，在类加载时创建
    private static instance: Physics = new Physics();
    
    
    
    // 获取实例的静态方法
    public static getInstance(): Physics {
        return Physics.instance;
    }
    generateWind(){
        for(let i=0;i<5;i++){
            this.wind[i]=this.G+(Math.random())*2;
        }
        for(let i=5;i<2e+4;i++){
            this.wind[i]=this.G+(Math.random()-0.49)*2;
        }
    }
   private constructor(){
        this.generateWind();

        // setInterval (() => {
        //     this.compute(0.03);
        //     let cur=new Date();
        //     console.log(this.a,this.v0,this.acLen,this.height,(cur.getTime()-this.startTime.getTime())/1000.0);
   
        //     if(this.height<0){
        //         //process.exit(0);
        //     }
        // }, 30);

        setInterval (() => {
            this.generateWind();
        }, 10000);
        setInterval (() => {
           let cur=new Date();
            let diff=cur.getTime()-this.lastPressTime.getTime();
            
            //console.log("diff",diff);
            if(diff>1e+3){      //超出1秒就为0
                this.handa=0;
            }
        }, 1000);
    }
    updateWind(){
        
        for(let i=5;i<2e+4;i++){
            this.wind[i]=this.wind[i]+(Math.random()-0.5)*2;
        }
    }
    get F0(){           //风力
        let idx=Math.floor(this.height/0.5);
        let temp=this.wind[idx];
        //console.log(idx,temp)
        return temp;
    }
    get F(){
        let F=this.F0-this.G-this.F1
        return F;
    }
    get F1(){   
        if((this.F0-this.G)<0){     //如果风力不足以支持重力  那么拉力为0
            return 0;
        }
        //拉力      
        if(this.acLen<=this.height){//此时保持平稳
            return this.F0-this.G;      
        }else{
            return 0;
        }
    }
    compute(t:number){
        this.a=this.F/this.m;       //算加速度
        this.a=this.handa+this.a;
        this.s=this.v0*t+0.5*this.a*t*t;//算出位移
        this.height=this.height+this.s;           //更新位置

        if(this.acLen<=this.height){//此时保持平稳
            this.v0=0;
            this.height=this.acLen     
        }else{
            this.v0=this.v0+this.a*t; 
        }
    }
    up(){
        this.lineLen+=0.3;

        this.acLen=this.lineLen*1.41421/2.0;
    }
    down(){
        
         this.lineLen-=0.3;

        this.acLen=this.lineLen*1.41421/2.0;
        if(this.acLen<=this.height){//此时保持平稳
            this.height=this.acLen     
        }
    }
    run(){
        let cur=new Date();
        let diff=cur.getTime()-this.lastPressTime.getTime();
        this.lastPressTime=cur;
        //console.log("diff",diff);
        if(diff>1e+3){      //超出1秒就为0
            this.handa=0;
        }else{
            this.handa=(1/diff)*200;
        }
    }
}
// let p = new Physics();
// import readline from 'readline';
// // 启用原始输入模式
// readline.emitKeypressEvents(process.stdin);
// process.stdin.setRawMode(true);

// process.stdin.on('keypress', (str: string, key: any) => {
//   if (key.ctrl && key.name === 'c') {
//     console.log('退出程序');
//     process.exit();
//   }
  

//   // 检测箭头键
//   if (key.name === 'up') {
//     console.log('↑ 上箭头');
//     p.up();
//   } else if (key.name === 'down') {
//     p.down();
//   } else if (key.name === 'left') {
//     console.log('← 左箭头');
//   } else if (key.name === 'right') {
//     console.log('→ 右箭头');
//   }
// });

