import React from 'react'
import './main.css'

export const Main = () => {
  return (
    <div className="container">
    <div className="header">
      <h2>Selector Builder</h2>
    </div>
    <div className="action-Panel">
      <div className="global-options">
        <h4>Global Options:</h4>
        <div className="option">
          <label>1.add include</label>
          <input type="checkbox" id="include" />
        </div>
      </div>
      <div className="traverse">
         <h4>change Element</h4>
      <input type="button" className="btn btn-secondary" value="Parent Element"/>
      <input type="button" className="btn btn-secondary" value="Child Element"/>
      <input type="button" className="btn btn-secondary" value="Sibling Element"/>
      <input type="button" className="btn btn-secondary" value="Next Element"/>
      <input type="button" className="btn btn-secondary" value="Previous Element"/>
      </div>
     
    </div>
    <div className="element-description">
      <h4>Element Chosen:</h4>
    </div>
    <div className="attributes-container">
      <table>
        <thead>
          <td>Attribute Name</td>
          <td>Attribute Value</td>
          <td>Select Value</td>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <div className="bot-container">
      <div className="element-selector">
        <input
          type="button"
          className="btn btn-main"
          value="Start Selecting"
          id="select-element-button"
        />
      </div>
      
      <div className="finalize-Action">
        <input
          type="button"
          className="btn btn-success"
          value="Copy to ClipBoard"
          id="copyBtn"
        />
        <input
          type="button"
          className="btn btn-secondary"
          value="Clear"
          id="clearBtn"
        />
      </div>
    </div>
  </div>

  )
}
