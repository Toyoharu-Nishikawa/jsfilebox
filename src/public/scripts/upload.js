import {login} from "/necoengine/scripts/necoengine/login/index.js"
import {upload} from "./jsfilebox/upload/index.js"

login.setLoginButton()
login.visit()

upload.initialize()

