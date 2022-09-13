module.exports = function(app, upload) {
    const { educationalCenter, doctor, curse, category, moderation, Op } = require('../db/scheme')
    const fs = require('fs')
    const md5 = require('md5')
    const signature = "FJWr"
    const { v4: uuidv4 } = require('uuid')
    const jwt = require('jsonwebtoken')
    const base64 = require('base-64')

    app.post('/doctor/info', async (req, res) => {
        const doc = await doctor.findOne({
            where: {
                doctor_id: req.body.doctor_id
            }
        })
        res.json({info: doc})
    })

    app.post('/doctor/login', async (req, res) => {
        const doc = await doctor.findOne({
            where: {
                email: req.body.login,
                password: md5(req.body.password)
            }
        })

        if (doc) {
            const refresh = uuidv4()
            const access = jwt.sign({id: doc.doctor_id, name: doc.name, wasSigned: Date.now() - 100}, signature, {expiresIn: "10m"})

            await doctor.update({
                refresh_token: refresh
            }, {
                where: {
                    doctor_id: doc.doctor_id
                }
            })

            res.json({ok: true, doctor_id: doc.doctor_id, tokens: {refresh, access}})

        } else {
            res.json({ok: false})
        }
    })

    app.post('/doctor/register', async (req, res) => {
        const data = {
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            region: req.body.region,
            specialization: req.body.specialization,
            refresh_token: null
        }
        
        const doc = await doctor.create(data)

        const newModerate = await moderation.create({
            new_information: JSON.stringify(doc)
        })

        await doc.addModeration(newModerate)

        res.json({ok: true})
    })

    app.post('/doctor/refresh', async (req, res) => {

        const doc = await doctor.findOne({
            where: {
                doctor_id: req.body.doctor_id,
                refresh_token: req.body.refresh
            }
        })
        if(doc) {
            const refresh = uuidv4()
            const access = jwt.sign({id: doc.doctor_id, name: doc.name}, signature, {expiresIn: "10m"})

            await doctor.update({
                refresh_token: refresh
            }, {
                where: {
                    doctor_id: doc.doctor_id
                }
            })

            res.json({ok: true, doc: doc, tokens: {refresh, access}})
        } else {
            res.json({ok: false})
        }
    })

    app.post('/doctor/subscribe', async (req, res) => {

        const { curse_id, doctor_id } = req.body

        const doc = await doctor.findOne({
            where: {
                doctor_id: doctor_id,
            }
        })
        const aCurse = await curse.findOne({
            where: {
                curse_id: curse_id
            }
        })

        if(doc) {
            await doc.addCurse(aCurse)
            res.json({ok: true})
        } else {
            res.json({ok: false})
        }
    })

    app.post('/doctor/unsubscribe', async (req, res) => {

        const { curse_id, doctor_id } = req.body

        const doc = await doctor.findOne({
            where: {
                doctor_id: doctor_id,
            }
        })
        
        if(doc) {
            const subsCurses = await doc.getCurses({
                where: {
                    curse_id: {[Op.ne]: curse_id}
                }
            })
            await doc.setCurses([])
            await doc.setCurses(subsCurses)

            res.json({ok: true})
        } else {
            res.json({ok: false})
        }
    })

    app.post('/doctor/curse', async (req, res) => {

        const { curse_id } = req.body

        const aCurse = await curse.findOne({
            where: {
                curse_id: curse_id,
            }
        })
        
        if(aCurse) {
            res.json({ok: true, curse: aCurse})
        } else {
            res.json({ok: false, curse: null})
        }
    })
}