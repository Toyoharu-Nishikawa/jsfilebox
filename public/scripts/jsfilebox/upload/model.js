import {view} from "./view.js"
"use strict"

export const model ={
  url: "/jsfilebox/node/register",
  dragOver:{
    execute:function(){
      view.elements.fileReadArea.className = "dragOver" 
    },
  },
  dragLeave:{
    execute:function(){
      view.elements.fileReadArea.className = "notYet" 
    },
  },
  drop:{
    execute:function(e){
      const fileReadAreaElem = view.elements.fileReadArea 
      fileReadAreaElem.className = "drop" 
      const url = model.url
      const files = e.dataTransfer.files
      const file = files[0]
      const filename = file.name
      const size = file.size
      const filetype = file.type
      const userEmail = localStorage.getItem("userEmail")
      console.log(filetype)
      const filetypeIsImage = filetype.indexOf("image/")===0?true:false

      const reader = new FileReader()
      reader.onload = (event)=>{
        fileReadAreaElem.textContent = null 
        if(filetypeIsImage){
          const img = document.createElement("img")
          img.src= event.target.result
          img.style.maxWidth = "500px"
          img.style.maxHeight = "400px"
          fileReadAreaElem.appendChild(img)
        }
        else{
          const div = document.createElement("embed")
          div.src= event.target.result
          div.style.width = "500px"
          div.style.height = "400px"
          div.style.background="white"
          fileReadAreaElem.appendChild(div)
          
          div.ondrop = (e)=>{
            e.preventDefault()
            e.stopPropagation()
            model.drop.execute(e)
            return false
          }
        }
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append("myFile", file)
      formData.append("userEmail", userEmail)
      formData.append("filetype", filetype)
      const data = {
        body: formData,
        method: "POST",
      }
      const send = async()=>{
        try{
          const response = await fetch(url, data)
          const json = await response.json()
          if(json.results){
            view.elements.url.value = json.url 
            view.elements.message.textContent = `Succeed in registering ${filename} `
            view.elements.message.style.color ="#3e5358"
          }
          else {
            throw new Error("Failed Registering")
          }
        }
        catch(e){
          view.elements.url.value = "" 
          view.elements.message.textContent = `Failed in registering ${filename}`
          view.elements.message.style.color ="red"
        }
      }       
      send()
    },
  },
}
