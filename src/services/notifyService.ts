import { setTimeout } from "timers";

export const  nofityService ={
    initNotifyProcess: ( type:string )=>{
        //get notify type, pull config 
        const config = nofityService.typeConfig(type);
        nofityService.setNotify(config);
        setTimeout(()=>{
            nofityService.destroyNotify();
        },3000)
    },
    typeConfig: (type:string)=>{

    },
    setNotify: (conf:any)=>{

    },
    destroyNotify:()=>{
        
    }
}