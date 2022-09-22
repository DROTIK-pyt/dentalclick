module.exports = function(app, upload) {
    const { educationalCenter, doctor, curse, category, moderation, Op } = require('../db/scheme')
    const fs = require('fs')
    const md5 = require('md5')
    const signature = "FJWr"
    const { v4: uuidv4 } = require('uuid')
    const jwt = require('jsonwebtoken')
    const base64 = require('base-64')
    const { sendEmail } = require('../sendMail') // Отправка сообщений на почту

    app.post('/doctor/info', async (req, res) => {
        const doc = await doctor.findOne({
            where: {
                doctor_id: req.body.doctor_id
            }
        })

        const docStatus = await doc.getStatuses()
        res.json({info: doc, status: docStatus[0]?.title})
    })

    app.post('/doctor/status', async (req, res) => {
        const doc = await doctor.findOne({
            where: {
                doctor_id: req.body.doctor_id
            }
        })

        const docStatus = await doc.getStatuses()
        res.json({status: docStatus[0]?.title})
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

            const text = `
                <h4>Кто-то авторизовался в вашем аккаунте.</h4>
                <p>Если это были не вы, то как можно скорее свяжитесь с нами.</p>
            `

            sendEmail(
                doc.email,
                "Авторизация в аккаунте",
                text
            )

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
            specialization: req.body.specialization
        }

        if(!req.body.name ||
           !req.body.phone ||
           !req.body.email ||
           !req.body.password ||
           !req.body.region ||
           !req.body.specialization) {
            res.json({ok: false})
            return
        }

        const newModerate = await moderation.create({
            new_information: JSON.stringify({
                type: "register-new-doctor",
                id: -1,
                newInfo: data
            })
        })

        const text = `
            <h4>Спасибо за регистрацию, мы уже получили Вашу информацию и начали ее проверку. При необходимости, с Вами свяжутся.</h4>
        `

        sendEmail(
            req.body.email,
            "Спасибо за регистрацию!",
            text
        )

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

    app.get('/doctor/all-centers', async (req, res) => {
        const centers = await educationalCenter.findAll()
        const result = []
        centers.forEach(center => {
            result.push({
                educational_center_id: center.educational_center_id,
                title: center.title
            })
        })

        res.json({ok: true, centers: result})
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

        const { curse_id, doctor_id } = req.body

        const aCurse = await curse.findOne({
            where: {
                curse_id: curse_id,
            }
        })
        const doc = await doctor.findOne({
            where: {
                doctor_id
            }
        })
        const docSubscribedCurses = await doc.getCurses()
        
        if(aCurse) {
            res.json({
                ok: true,
                curse: aCurse,
                isSubscribed: !!docSubscribedCurses.find(c => c.curse_id === curse_id),
            })
        } else {
            res.json({ok: false, curse: null, isSubscribed: null})
        }
    })

    app.post('/doctor/all-curses', async (req, res) => {
        const { educational_center_ids, doctor_id } = req.body

        if(educational_center_ids) {
            const centersWithCurses = await educationalCenter.findAll({
                where: {
                    educational_center_id: { [Op.or]: educational_center_ids }
                },
                include: curse
            })
            const doc = await doctor.findOne({
                where: {
                    doctor_id
                }
            })
            const docSubscribedCurses = await doc.getCurses()

            const result = []
            centersWithCurses.forEach(centersWithCurse => {
                centersWithCurse.curses.forEach(curse => {
                    result.push({
                        curse_id: curse.curse_id,
                        title: curse.title,
                        eduCenter: centersWithCurse.title,
                        lector: curse.lector,
                        date_start: curse.date_start,
                        date_end: curse.date_end,
                        price: curse.price,
                        score: curse.score,
                        isSubscribed: !!docSubscribedCurses.find(c => c.curse_id === curse.curse_id)
                    })
                })
            })

            res.json({ok: true, curses: result})
        } else {
            res.json({ok: true, curses: []})
        }
    })

    app.put('/doctor/moderate', async (req, res) => {

        const { doctor_id, name, email, phone, region, specialization } = req.body

        const doc = await doctor.findOne({
            where: {
                doctor_id
            }
        })

        const moderate = await moderation.create({
            new_information: JSON.stringify({
                type: "doctor",
                id: doctor_id,
                newInfo: { name, email, phone, region, specialization }
            })
        })

        await doc.addModeration(moderate)

        const text = `
            <h4>Администраторы уже получили информацию и проверяют ее, ожидайте.</h4>
            <p>Номер вашей заявки: <b>#${moderate.moderation_id}</b></p>
        `

        sendEmail(
            doc.email,
            "Изменение профиля (в работе)",
            text
        )

        res.json({ok: true})
    })

    app.put('/doctor/change-accesses', async (req, res) => {

        const { doctor_id } = req.body

        const doc = await doctor.findOne({
            where: {
                doctor_id
            }
        })

        const moderate = await moderation.create({
            new_information: JSON.stringify({
                type: "doctor-change-accesses",
                id: doctor_id,
                newInfo: { text: "Запрос смены доступов" }
            })
        })

        await doc.addModeration(moderate)

        const text = `
            <h4>Администраторы уже получили информацию и проверяют ее, ожидайте.</h4>
            <p>Номер вашей заявки: <b>#${moderate.moderation_id}</b></p>
        `

        sendEmail(
            doc.email,
            "Смена доступов (в работе)",
            text
        )

        res.json({ok: true})
    })
}