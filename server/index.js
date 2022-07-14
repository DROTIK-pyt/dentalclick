const baseSettings = require('./config/serverSetting.json')
const {} = require('./db/index')

const express = require("express")
const cors = require('cors')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let arr = file.originalname.split('.')
        const extension = arr.slice(-1)[0]

        cb(null, `${req.body.uniqueSuffix}.${extension}`)
    }
})
console.log(storage)
const upload = multer({ dest: 'uploads/', storage: storage  })

const app = express()
app.use(cors())
app.use(express.json({ limit: '500kb', parameterLimit: 10000 })) // for parsing application/json
app.use(express.urlencoded({ extended: true, limit: '500kb', parameterLimit: 10000 }))

require('./edu-center/index')(app, upload) // Образовательный центр

app.listen(baseSettings.port, () => {
    console.log(`Server start on ${baseSettings.baseUrl}:${baseSettings.port}/`)
})