import {login} from "/necoengine/scripts/necoengine/login/index.js"
import {jsfilebox} from "./jsfilebox/index/index.js"

login.setLoginButton()
login.visit()

jsfilebox.initialize()
