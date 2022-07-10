const baseSettings = require('./config/serverSetting.json')

const express = require("express")
const cors = require('cors')
const { educationalCenter, moderation } = require('./db/scheme')
 
const app = express()
app.use(cors())

app.get('/edu', async (req, res) => {

})

app.post('/edu/login', async (req, res) => {
    console.log('logged')
    res.json({
        id: "71624571",
        ok: true,
        tokens: {
            access: null,
            refresh: null,
            expires: 0
        }
    })
})

app.post('edu/moderate', async (req, res) => {
    const data = req.body
    const center = await educationalCenter.findOne({where: {educational_center_id: data.id}})
    const newModerate = await moderation.create({
        educational_center_id: data.id,
        new_information: JSON.stringify(data)
    })
    center.addModerate(newModerate, {through: {
        moderationModerationId: newModerate.moderation_id,
        educationalCenterEducationalCenterId: data.id
    }})
})

app.listen(baseSettings.port, () => {
    console.log(`Server start on ${baseSettings.baseUrl}:${baseSettings.port}/`)
})