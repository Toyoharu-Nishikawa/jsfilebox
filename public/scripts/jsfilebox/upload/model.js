import {view} from "./view.js"
"use strict"

export const model ={
  dragOver:{
    execute:function(){
      view.elements.fileReadArea.className = "dragOver" 
      view.elements.dragAndDropText.textContent = "Drop Your File" 
    },
  },
  dragLeave:{
    execute:function(){
      view.elements.fileReadArea.className = "notYet" 
      view.elements.dragAndDropText.textContent = "Drag & Drop Your File" 
    },
  },
  drop:{
    execute:function(e){
      view.elements.fileReadArea.className = "drop" 
      view.elements.dragAndDropText.textContent = "Finish Registering Your File"
      const files = e.dataTransfer.files
      const f = files[0]
      const reader = new FileReader()
      const readFile = this.makeReadFile(f)
      reader.onload = readFile
      reader.readAsBinaryString(f)

    },
    makeReadFile:function(f){
      return (e)=>{
        console.log("filename",f.name)
        const string = e.target.result
      }
    },
  },

}
