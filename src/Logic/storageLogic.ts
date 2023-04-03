import { historyObject, SelectorObject } from "../models/interfaces";

export const pushToHistory = (selector:SelectorObject) => {
    chrome.storage.session.get('history', (data:any) => {
        if (data.history) {
            data.history.push(selector);
            chrome.storage.session.set({ history: data.history });
        } else {
            chrome.storage.session.set({ history: [selector] });
        }
    });
}
export const getFromHistoryAndParse = ():historyObject[] =>{
    let historyArr:historyObject[] = []
    chrome.storage.session.get('history', (data:any)=>{

        return data.history;
    })
    return historyArr;
}
export const clearHistory = ()=>{
    chrome.storage.session.set({history:[]})
}