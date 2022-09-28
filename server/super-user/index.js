module.exports = function(app, upload) {
    const { educationalCenter, moderation, articles, rubrics, curse, category, status, Op } = require('../db/scheme')
    const signature = "FJWr"
    const { v4: uuidv4 } = require('uuid')
    const jwt = require('jsonwebtoken')
    const base64 = require('base-64')
    const fs = require('fs')
    const md5 = require('md5')
    const { sendEmail } = require('../sendMail') // Отправка сообщений на почту
    let dataUser = require('./dataUser')

    app.get('/super-user/all-curse', async (req, res) => {
        const curses = await curse.findAll()
        const result = []

        for(let i = 0; i < curses.length; i++) {
            const center = await curses[i].getEducational_centers({attributes: [ 'title' ]})
            const item = curses[i]

            result.push({
                curse_id: item.curse_id,
                title: item.title,
                lector: item.lector,
                date_start: item.date_start,
                date_end: item.date_end,
                program: item.program,
                town: item.town,
                price: item.price,
                address: item.address,
                score: item.score,
                image: item.image,
                eduCenter: center[0].title
            })
        }

        res.json({ok: true, curses: result})
    })

    app.post('/super-user/curse-categories', async (req, res) => {
        const { curse_id } = req.body
        const aCurse = await curse.findOne({
            where: {
                curse_id
            }
        })

        const cats = await aCurse.getCategories()

        const nameCats = []
        const catIds = []
        const cats2id = {}
        let t = []
        let allCats = []

        const item = cats[0]

        const center = await item.getEducational_centers()
        t = await center[0].getCategories()

        t.forEach(categ => {
            allCats.push(categ.title)
            cats2id[`${categ.title}`] = categ.category_id
        })

        cats.forEach(categ => {
            nameCats.push(categ.title)
            catIds.push(categ.category_id)
        })

        res.json({ok: true, nameCats, cats2id, catIds, allCats})
    })

    app.get('/super-user/centers', async (req, res) => {
        const ec = await educationalCenter.findAll({
            attributes: [ 'educational_center_id', 'title', 'phone', 'contact_person' ]
        })

        res.json({ok: true, centers: ec})
    })

    app.delete('/super-user/center', async (req, res) => {
        const { educational_center_id } = req.body
 
        await educationalCenter.destroy({
            where: {
                educational_center_id
            }
        })

        res.json({ok: true})
    })

    app.post('/super-user/stop-center', async (req, res) => {
        const { educational_center_id } = req.body

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id,
            }
        })
        const ecStatus = await ec.getStatuses()
        let s

        if(ecStatus[0]?.title === "public") {
            ec.setStatuses(null)
            s = await status.findOne({
                where: {
                    title: "blocked"
                }
            })
            await ec.addStatus(s)
        }
        if(ecStatus[0]?.title === "blocked") {
            ec.setStatuses(null)
            s = await status.findOne({
                where: {
                    title: "public"
                }
            })
            await ec.addStatus(s)
        } else {
            ec.setStatuses(null)
            s = await status.findOne({
                where: {
                    title: "blocked"
                }
            })
            await ec.addStatus(s)
        }

        res.json({ok: true, status: s[0]?.title || "public"})
    })

    app.post('/super-user/get-center', async (req, res) => {
        const { educational_center_id } = req.body

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id
            }
        })
        const status = await ec.getStatuses()

        res.json({ok: true, center: ec, status: status[0]?.title || 'public'})
    })

    app.post('/super-user/add-center', async (req, res) => {
        const { center } = req.body

        if(center.title &&
           center.contact_person &&
           center.phone &&
           center.email &&
           center.password) {
            const ec = await educationalCenter.create({
                title: center.title,
                contact_person: center.contact_person,
                phone: center.phone,
                email: center.email,
                password: md5(center.password),
                site_url: center.site_url || "",
                requisites: center.requisites || "",
                add_notes: center.add_notes || "",
                refresh_token: uuidv4(),
            })
            const s = await status.findOne({
                where: {
                    title: "public"
                }
            })
            await ec.addStatus(s)

            res.json({ok: true})
        } else {
            res.json({ok: false})
        }
    })

    app.post('/super-user/save-center', async (req, res) => {
        const { center } = req.body

        if(center.password) {
            await educationalCenter.update({
                title: center.title,
                contact_person: center.contact_person,
                phone: center.phone,
                email: center.email,
                password: md5(center.password),
                site_url: center.site_url,
                requisites: center.requisites,
                add_notes: center.add_notes,
            }, {
                where: {
                    educational_center_id: center.educational_center_id
                }
            })

            const text = `
                <p>Информация была изменена.</p>
                <p>Данные о вашем центре изменены.</p>
                <p>Ваш новый пароль: ${center.password}</p>
                <p>Ваш логин: ${center.email}</p>
            `
            sendEmail(
                center.email,
                "Изменение данных",
                text
            )
        } else {
            await educationalCenter.update({
                title: center.title,
                contact_person: center.contact_person,
                phone: center.phone,
                email: center.email,
                site_url: center.site_url,
                requisites: center.requisites,
                add_notes: center.add_notes,
            }, {
                where: {
                    educational_center_id: center.educational_center_id
                }
            })

            const text = `
                <p>Информация была изменена.</p>
                <p>Данные о вашем центре изменены.</p>
            `
            sendEmail(
                center.email,
                "Изменение данных",
                text
            )
        }

        res.json({ok: true})
    })

    app.post('/super-user/login', async (req, res) => {
        // login: CNSUEE
        // pass: ZbPZP*>6
        const md5 = require('md5')
        const dataUser = require('./dataUser')
        const { login, password } = req.body
        if (md5(login) === dataUser.login) {
            if (md5(password) === dataUser.password) {
                const refresh = uuidv4()

                dataUser.refresh = refresh
                fs.writeFileSync('./super-user/dataUser.json', JSON.stringify({...dataUser}))
                
                const access = jwt.sign({login: login, wasSigned: Date.now() - 100}, signature, {expiresIn: "10m"})

                lastRefresh = refresh
                res.json({ok: true, error: null, tokens: {access, refresh}})
            } else {
                res.json({ok: false, error: {msg: "Неверный пароль"}})
            }
        } else {
            res.json({ok: false, error: {msg: "Неверный логин"}})
        }
    })

    app.get('/super-user/logout', async (req, res) => {
        const dataUser = require('./dataUser')
        dataUser.refresh = null
        fs.writeFileSync('./super-user/dataUser.json', JSON.stringify({...dataUser}))

        res.json({ok: true})
    })

    app.post('/super-user/refresh', async (req, res) => {
        const { refresh } = req.body
        dataUser = require('./dataUser')
       
        if(refresh === dataUser.refresh) {
            const refresh = uuidv4()

            dataUser.refresh = refresh
            fs.writeFileSync('./super-user/dataUser.json', JSON.stringify({...dataUser}))

            const access = jwt.sign({login: dataUser.login}, signature, {expiresIn: "10m"})

            res.json({ok: true, tokens: {refresh, access}})
        } else {
            res.json({ok: false})
        }
    })
}