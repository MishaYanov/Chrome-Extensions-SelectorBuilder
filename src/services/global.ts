export async function sendMessageToContentScript( content:any, expectedResponse:any){
  const activeTab = await getActiveTabURL();
  if(activeTab)
  chrome.tabs.sendMessage(activeTab.id!, {action: content})
}
async function getActiveTabURL(): Promise<chrome.tabs.Tab | void> {
  const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true
  });
  if(tabs)
  return tabs[0];
}

export function ListenToMessagesFromContentJs(messageType:string, func:any=null):any{
  chrome.runtime.onMessage.addListener(
    function(request, sender, response){
      console.log(request.ContentData);
      if(func !== null){
        return func()
      }else{
        return request.ContentData;
      }
    }
  )
}