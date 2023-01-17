export const transitions = {
    moveToParentElement: (element:any)=>{
        return element.parentElement;
    },
    moveToNextSibling: (element:any)=>{
        return element.nextElementSibling;
    },
    moveToPreviousSibling: (element:any)=>{
        return element.previousElementSibling;
    },
    moveToFirstChild: (element:any)=>{
        return element.firstElementChild;
    },
    moveToLastChild: (element:any)=>{ 
        return element.lastElementChild;
    }

}
