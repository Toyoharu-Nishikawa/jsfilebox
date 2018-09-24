const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs')
const assert = require('assert')

const log = require('log');

try{
  fs.accessSync("/var/log/node");
}
catch(err){
    fs.mkdirSync("/var/log/node")
}
const logger = new log("info", fs.createWriteStream("/var/log/node/node.access.log",{flags:"a"}));

app.use(bodyParser.urlencoded({
        extended: true
}));
app.use(bodyParser.json());



const sampleDir = "/usr/share/nginx/html/sample" 

app.set('port', 5000);
app.use(express.static(__dirname + '/public'));

app.get('/node', function(request, response) {
  response.send("now running")
});

const save = (response, list, category,filename,code)=>{
  fs.writeFile(sampleDir + '/private/'+category+'/'+filename, code, (err)=>{
    if(err){
       console.log("error: disabl to make file of " + sampleDir +"/"+category+'/'+filename)
       logger.info("error: disabl to make file of " + sampleDir +"/"+category+'/'+filename)
       response.json({"state":"error: disabl to make file of "+sampleDir +"/" +category+'/'+filename});
    }
    else{
      fs.writeFile(sampleDir + '/private/sample.json',JSON.stringify(list,null,'  '),(err)=>{
        if(err){
          console.log("error: disabl to overwrite file of "+ sampleDir + "/private/sample.json")
          logger.info("error: disabl to overwrite file of "+ sampleDir + "/private/sample.json")
          response.json({"state":"error: disabl to overwrite the file as "+sampleDir + "/private/sample.json"});
        }
        else{
          console.log("successfully registered");
          logger.info("successfully registered");
          response.json({"state":"successfully registered"});
        }
      });
    }
  }); 
}

const makeAndSave = (response, list, category,filename,code) =>{
  fs.access(sampleDir + '/private/'+category, (err)=>{
    if(err){
      console.log("the dicretory of  "+ category + " is not foud.");
      fs.mkdir(sampleDir + '/private/'+category,(err)=>{
        if(err){
          console.log("error: disabl to make directory of " + sampleDir + " /private/"+category)
          logger.info("error: disabl to make directory of " + sampleDir + " /private/"+category)
          response.json({"state":"error: disabl to make directory of "+sampleDir + "/private/"+category});
        }
        else{
          console.log("the directory of "+ sampleDir + "/private/"+category + " successfully has been made.")
          save(response, list, category,filename,code);
        }
      });
    }
    else{
      save(response, list, category,filename,code);
    }
  })
}
const saveExe = (response, category,filename,code) =>{
  fs.readFile(sampleDir + '/private/sample.json', 'utf8',(err,data)=>{
    if(err){
      console.log(sampleDir + "/private/sample.json is not found");
      console.log("make sample.json, add new category of  "+ category+ " and add " + filename + "to it");
      logger.info(sampleDir + "/private/sample.json is not found");
      logger.info("make sample.json, add new category of  "+ category+ " and add " + filename + "to it");
      list = [{ 
        directory: category,
        list: [filename]
      }];
      makeAndSave(response,list,category,filename,code);
    }
    else{
      let list = JSON.parse(data);
      const keys = list.map(k=>k.directory) 
      const keyNum = keys.indexOf(category);
      if(keyNum>-1){
        const fileNum = list[keyNum].list.indexOf(filename);
        if(fileNum>-1){
            console.log("over write " + filename + " in the category of "+ category)
            logger.info("over write " + filename + " in the category of "+ category)
        }
        else{
          list[keyNum].list.push(filename);
          console.log("add " + filename + " to " + category)
          logger.info("add " + filename + " to " + category)
        }
      }
      else{
        console.log("add new category of  "+ category+ " and add " + filename +".");
        logger.info("add new category of  "+ category+ " and add " + filename +".");
        list.push({
          directory:category,
          list:[filename]
        })
      }
      makeAndSave(response,list,category,filename,code);
    }
  });
}

const checkPublicAndSave = (response, category ,filename, code)=>{
  fs.readFile(sampleDir + '/public/list.json', 'utf8',(err,data)=>{
    if(err){
      console.log("error: " + sampleDir + "/public/list.json is not found")
      logger.info("error: " + sampleDir + "/public/list.json is not found")
      response.json({"state":"error: " + sampleDir + "/public/list.json is not found"});
    }
    else{
      let list = JSON.parse(data);
      const keys = list.map(k=>k.directory) 
      const keyNum = keys.indexOf(category);
      if(keyNum>-1){
        const fileNum = list[keyNum].list.indexOf(filename);
        if(fileNum>-1){
            console.log("disable to overwrite " + filename + " in the category of "+ category);
            logger.info("disable to overwrite " + filename + " in the category of "+ category);
            response.json({"state":"error: disable to overwrite the public sample of " + filename + " in the category of "+ category + "."});
        }
        else{
          saveExe(response, category,filename,code);
        }
      }
      else{
        saveExe(response, category,filename,code);
      }
    }
  });
};

app.all('/node/jsnoteregister',(request,response)=>{
  //console.log(request.body); 
  const category = request.body.category; 
  const filename = request.body.filename; 
  const code = request.body.code; 
  console.log("category requested to merge: " + category)
  console.log("filename requested to merge: " + filename)
  logger.info("category requested to merge: " + category)
  logger.info("filename requested to merge: " + filename)
  checkPublicAndSave(response, category ,filename, code);
});

app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'))
});
