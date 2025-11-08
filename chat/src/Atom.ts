import { atom } from "recoil";

export const emailAtom=atom({
    key:"emailatom",
    default:""
})
export const passwordAtom=atom ({
    key:"passwordatom",
    default:""
})
export const registerAtom=atom({
    key:"registeratom",
    default:false
})
export interface User{
    
        username:string,
        profileImg:string,
        _id:string
    
}
export const openUser=atom<User>({
    key:"userOpen",
    default:{
    
            username:"",
            profileImg:"",
            _id:""
        
    }
})
