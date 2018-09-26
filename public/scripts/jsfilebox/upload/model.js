import {view} from "./view.js"
"use strict"

export const model ={
  url: "/jsfilebox/node/register",
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
      const url = model.url
      const files = e.dataTransfer.files
      const file = files[0]
      const formData = new FormData()
      formData.append("myFile", file)
      const data = {
        body: formData,
        method: "POST",
      }
      const send = async()=>{
        const response = await fetch(url, data)
        const json = await response.json()
        if(json.results){
          view.elements.url.value = json.url 
          view.elements.dragAndDropText.textContent = "Finished Registering Your File"
        }
        else {
          view.elements.url.value = "" 
          view.elements.dragAndDropText.textContent = "Failed Registering"
        }
        console.log(json)
      }       
      send()
    },
    makeReadFile:function(f){
      return (e)=>{
        console.log("filename",f.name)
        const string = e.target.result
      }
    },
  },

}
