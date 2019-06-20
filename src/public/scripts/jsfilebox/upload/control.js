import {view} from "./view.js"
import {model} from "./model.js"
"use strict"

export const control = {
  dragOver:{
    bodyexecute:function(e){
      e.preventDefault() 
    },
    execute:function(e){
      e.preventDefault() 
      e.stopPropagation()
      model.dragOver.execute()
    },
    add:function(){
      view.elements.body.ondragover = this.bodyexecute
      view.elements.fileReadArea.ondragover=this.execute
    },
  },
  dragLeave:{
    bodyexecute:function(e){
      e.preventDefault() 
      e.stopPropagation()
    },
    execute:function(e){
      e.preventDefault() 
      e.stopPropagation()
      model.dragLeave.execute()
    },
    add:function(){
      view.elements.body.ondragleave = this.bodyexecute
      view.elements.fileReadArea.ondragleave=this.execute
    },
  },
  drop:{
    bodyexecute:function(e){
      e.preventDefault() 
      e.stopPropagation()
    },
    execute:function(e){
      e.preventDefault() 
      e.stopPropagation()
      model.drop.execute(e)
    },
    add:function(){
      view.elements.body.ondrop = this.bodyexecute
      view.elements.fileReadArea.ondrop = this.execute
    },
  },
  initialize: function(){
    //add method
    const controls = [
      this.dragOver,
      this.dragLeave,
      this.drop,
    ] 
    controls.forEach(control =>control.add())
    
  },
}
