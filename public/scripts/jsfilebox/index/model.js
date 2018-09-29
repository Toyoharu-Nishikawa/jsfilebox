import {view} from "./view.js"

"use strict"

export const model ={
  findURL: "/jsfilebox/node/find",
  initialize:function(){
    const url = model.findURL
    const userEmail = localStorage.getItem("userEmail")
    const param = {
      userEmail:userEmail,
      page:1,
    }

    const data = {
      body: JSON.stringify(param),
      cache: "no-cache",
      credentials: "same-origin",
      headers: {"content-type":"application/json"},
      method: "POST",
      mode: "cors",
      redirect: "follow",
      referror: "no-referror",
    }
    const main = async ()=>{
      try{
        const response = await fetch(url, data)
        const json = await response.json()
        console.log(json.result)
        model.draw(json.result)
      }
      catch(e){
        console.log(e.message)
      }
    } 
    main()
    
  },
  draw:function(result){
    const listElem = view.elements.list
    console.log(result)
    const fragment = document.createDocumentFragment()
    const elemList = result.map(v=>{
      const li = document.createElement("li")
      const filetypeIsImage = v.filetype.indexOf("image")===0?true:false
      if(filetypeIsImage){
        const img = document.createElement("img")
        img.src= v.url 
        img.style.maxWidth = "200px"
        img.style.maxHeight = "160px"
        li.appendChild(img)
      }
      else{
        const div = document.createElement("embed")
        div.src= v.url 
        div.style.width = "200px"
        div.style.height = "160px"
        div.style.background="white"
        li.appendChild(div)
      }
      return li
    })
    elemList.forEach(v=>{
      fragment.appendChild(v)
    })
    listElem.appendChild(fragment)
  }
}
