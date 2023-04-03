import { useState } from "react"
import { historyObject } from "../../models/interfaces"
import HistoryItem from "./HistoryItem"
import * as SL from '../../Logic/storageLogic'

export function History() {
  const [Log, setLog] = useState<historyObject[]| any>([])

  useEffect(() => {
    setLog(SL.getFromHistoryAndParse())
  
    return () => {
      
    }
  }, [])
  

  return (
    <>
      <div className="history-container">
        <div className="history-header">
          <h2>History</h2>
          <span>Select previous chosen elements</span>
          </div>
        <div className="history-body">
        {Log ? Log.map((item:historyObject, index: number) => {
          <HistoryItem key={index} item={item} />
        }): <div>Empty(undeer construction)</div>}
        </div>
      </div>

    
    </>
  )
}
function useEffect(arg0: () => () => void, arg1: never[]) {
  throw new Error("Function not implemented.")
}

