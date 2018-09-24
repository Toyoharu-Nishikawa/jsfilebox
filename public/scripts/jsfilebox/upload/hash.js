"use strict"
export const parseParam = (hash)=>{
  if(hash){
    const param = hash.split("&")
      .reduce((pre,current)=>{
        const item = current.split("=");
        const key = item[0]
        const value = item[1]
        pre.set(item[0],isNaN(value)? value: parseFloat(value)); 
        return pre;
    },new Map());
    return param
  }
  else {
    return new Map();
  }
}

const convertMapToHashString = (map)=>{
  const paramArray = [];
  for(let [k,v] of map){
    paramArray.push(k+"="+v);
  }
  const paramString = paramArray.join("&");
  //console.log(paramString);
  return paramString 
}

export const addParamToHash = (key,value)=>{
  const param = parseParam(location.hash.slice(1));
  param.set(key,value); 
  location.hash = convertMapToHashString(param) 
};

export const removeParamFromHash = (key) =>{
  const param = parseParam(location.hash.slice(1));
  if(param.has(key)){
    param.delete(key)
    location.hash = convertMapToHashString(param) 
    return true;
  }
  else {
    return false;
  }
}

