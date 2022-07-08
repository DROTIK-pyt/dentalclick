const baseSettings = require('./config/serverSetting.json')
const {} = require('./db/index')

const express = require("express")
 
const app = express()
app.get("/", (req, res) => { 
    res.send("Главная страница")
})
app.get("/about", (req, res) => {
    res.send("О сайте")
})
app.get("/contact", (req, res) => { 
    res.send("Контакты")
})

app.listen(baseSettings.port, () => {
    console.log(`Server start on ${baseSettings.baseUrl}:${baseSettings.port}/`)
})