const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const maxSize = 50*1000*1000
const upload = multer({dest:"./uploads/", limits:{fileSize:maxSize}});
const fs = require('fs')
const fsp = fs.promises

const db_addr = process.env.hasOwnProperty("DB_ADDR")? process.env.DB_ADDR :
  "mongo:27017"

const mongoURL = `mongodb://${db_addr}`

const assert = require('assert')

const log = require('log');

const imagesInPage = 30

try{
  fs.accessSync("/var/log/node");
}
catch(err){
    fs.mkdirSync("/var/log/node")
}
const logger = new log("info", fs.createWriteStream("/var/log/node/node.access.log",{flags:"a"}));

app.use(bodyParser.urlencoded({
        extended: true,
        limit: "50mb",
}));
app.use(bodyParser.json({
  limit: "50mb",
}));


const root = "/usr/share/nginx/html/files" 

app.set('port', 5000);
app.use(express.static(__dirname + '/public'));

app.get('/node', function(request, response) {
  response.send("now running")
});

const save = (root,dir,saveFilename,tmpPath) =>{
  console.log("save")
  return new Promise(async(resolve,reject)=>{
    try{
      await fsp.access(root + '/'+dir)
    }
    catch(e){
      await fsp.mkdir(root + '/'+dir)
    }
    finally{
      try{
        await fsp.copyFile(tmpPath, root + '/'+dir+"/"+saveFilename )
        await fsp.unlink(tmpPath)
        resolve(true) 
      }
      catch(e){
        console.log(e.message)
        console.log("failed to save "+saveFilename)
        reject(false)
      }
    }
  })
}

app.all('/node/find',(request,response)=>{
  const userEmail = request.body.userEmail
  const page = parseInt(request.body.page)
  //const page = request.body.page
  let client = null
  const main = async()=>{
    try{ 
      client = await MongoClient.connect(mongoURL,{useNewUrlParser:true})
      const db = client.db("files")
      const collection = db.collection("url");
      
      const count = await collection.estimatedDocumentCount()

      const result = await collection.find({
        //userEmail: userEmail,
        //url:url,
      },{projection:{url:1,filename:1,filetype:1,_id:0}})
      .sort({uploadTime:-1})
      .skip((page-1)*imagesInPage)
      .limit(imagesInPage)
      .toArray()
      
      const obj= {
        flag:true, 
        result:result,
        count:count,
        imagesInPage:imagesInPage
      }
      response.json(obj)
    }
    catch(e){
      response.json({flag:false})
    }
    finally{
      client.close()
    }
  }
  main()

})
 
app.all('/node/register',upload.fields([{name:"myFile"}]),(request,response)=>{
  const myFile = request.files.myFile[0]
  const userEmail = request.body.userEmail
  const filetype = request.body.filetype
  console.log(userEmail)
  const tmpPath = myFile.path
  const filename = myFile.originalname
  console.log("requested to save: " + filename)
  logger.info("requested to save: " + filename)

  const now =  new Date()
  const year = now.getFullYear()
  const month = now.getMonth()+1
  const date = now.getDate() 
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const milliseconds = now.getMilliseconds()
  const dir = year+"."+month+"."+date
  const saveFilename = year+"."+month+"."+date+"."
    +hours+"."+minutes+"."+seconds+"."+milliseconds+"."+
    filename

  let client = null
  const main = async()=>{
    try{ 
      const res = await save(root, dir, saveFilename, tmpPath)
      console.log(res)
      const url = "/jsfilebox/files/" + dir + "/" + saveFilename

      client = await MongoClient.connect(mongoURL)
      const db = client.db("files")
      const collection = db.collection("url");
      
      const result = await collection.insertOne({
        userEmail: userEmail,
        uploadTime: now.getTime(),
        url:url,
        filename:filename,
        filetype: filetype,
      })
     
      response.json({results:true, url:url})
    }
    catch(e){
      response.json({results:false})
    }
    finally{
      client.close()
    }
  }
  main()
})

app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + app.get('port'))
});
