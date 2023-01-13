const transitions = {
    moveToParentElement: (element)=>{
        return element.parentElement;
    },
    moveToNextSibling: (element)=>{
        return element.nextElementSibling;
    },
    moveToPreviousSibling: (element)=>{
        return element.previousElementSibling;
    },
    moveToFirstChild: (element)=>{
        return element.firstElementChild;
    },
    moveToLastChild: (element)=>{ 
        return element.lastElementChild;
    }

}