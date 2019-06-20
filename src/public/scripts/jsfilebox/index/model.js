import {view} from "./view.js"
import {parseParam,setParam} from "../..//parseParam/parseParam.js"

"use strict"


export const model ={
  findURL: "/jsfilebox/node/find",
  numberOfPagination: 5,
  initialize:function(){
    const url = model.findURL
    const userEmail = localStorage.getItem("userEmail")
    const paramMap = parseParam() 
    const page = paramMap.has("page")?parseInt(paramMap.get("page")):1
    const param = {
      userEmail:userEmail,
      page:page,
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
        if(!json.flag){
          throw new Error("server is not working now")
        }
        model.makePagination(page,json.count,json.imagesInPage)
        model.draw(json.result)
      }
      catch(e){
        console.log(e.message)
      }
    } 
    main()
    
  },
  makePagination: function(page, count,imagesInPage){
    const paginationElem = view.elements.pagination
    const numberOfPagination = this.numberOfPagination
    const half = (numberOfPagination/2)|0 
    const totalPages = (count/imagesInPage|0)+1
    const previousFlag = page>1
    const nextFlag = page < totalPages
    const pagePreList = [...Array(numberOfPagination)].map((v,i)=>page+i-half)
    const pageList = pagePreList.filter(v=>v>0&&v<=totalPages)
    console.log(count,totalPages,imagesInPage)
    const index = pageList.indexOf(page)
    if(index<0){
      paginationElem.innerHTML="page is not found" 
      paginationElem.className = "pageNotFound"
      return 
    }
    const fragment = document.createDocumentFragment() 
    const elements = pageList.map((v,i)=>{
      const elem = document.createElement("a") 
      elem.textContent = v
      elem.href=`?page=${v}`
      if(i===index){
        elem.className = "active"
      }
      return elem
    })  
    if(previousFlag){
      const elem = document.createElement("a") 
      elem.innerHTML = "&laquo;"
      elem.href=`?page=${page-1}`
      elements.unshift(elem)
    }
    if(nextFlag){
      const elem = document.createElement("a") 
      elem.innerHTML = "&raquo;"
      elem.href=`?page=${page+1}`
      elements.push(elem)
    }
    elements.forEach(v=>{
      fragment.appendChild(v) 
    })
    pagination.appendChild(fragment)
  },
  draw:function(result){
    const listElem = view.elements.list
    console.log(result)
    const fragment = document.createDocumentFragment()
    const elemList = result.map(v=>{
      const a = document.createElement("a")
      a.href = v.url
      const li = document.createElement("li")
      a.appendChild(li)
      const filetypeIsImage = v.filetype.indexOf("image")===0?true:false
      if(filetypeIsImage){
        const img = document.createElement("img")
        img.src= v.url 
        img.style.maxWidth = "200px"
        img.style.maxHeight = "160px"
        li.appendChild(img)
      }
      else{
        const div = document.createElement("object")
        div.data= v.url 
        div.style.width = "200px"
        div.style.height = "160px"
        div.style.background="white"
        li.appendChild(div)
      }
      return a 
    })
    elemList.forEach(v=>{
      fragment.appendChild(v)
    })
    listElem.appendChild(fragment)
  }
}
