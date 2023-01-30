module.exports = function(app, upload) {
    const { educationalCenter, accessRight, moderation, articles, rubrics, curse, category, status, doctor, admin, Op } = require('../db/scheme')
    const signature = "FJWr"
    const { v4: uuidv4 } = require('uuid')
    const jwt = require('jsonwebtoken')
    const base64 = require('base-64')
    const fs = require('fs')
    const md5 = require('md5')
    const generator = require('generate-password')
    const { sendEmail } = require('../sendMail') // Отправка сообщений на почту
    let userAccessRights = require('../config/userAccessRights')

    app.post('/admin/accept-moderation', async (req, res) => {
        const { data } = req.body

        await moderation.destroy({
            where: {
                moderation_id: data.moderation_id
            }
        })

        if(data.type == "doctor") {
            await doctor.update({
                name: data.newInfo.name,
                email: data.newInfo.email,
                phone: data.newInfo.phone,
                region: data.newInfo.region,
                specialization: data.newInfo.specialization,
            }, {
                where: {
                    doctor_id: data.id
                }
            })
        }
        else if(data.type == "eduCenter") {
            await educationalCenter.update({
                title: data.newInfo.title,
                email: data.newInfo.email,
                phone: data.newInfo.phone,
                contact_person: data.newInfo.contact_person,
                site_url: data.newInfo.site_url,
                requisites: data.newInfo.requisites,
                add_notes: data.newInfo.add_notes,
            }, {
                where: {
                    educational_center_id: data.id
                }
            })
        }
        else if (data.type == "register-new-doctor") {
            await doctor.create({
                name: data.newInfo.name,
                email: data.newInfo.email,
                phone: data.newInfo.phone,
                region: data.newInfo.region,
                specialization: data.newInfo.specialization,
            })
        }

        res.json({ok: true})
    })

    app.post('/admin/accesses', async (req, res) => {
        const anAdmin = await admin.findOne({
            where: {
                admin_id: req.body.admin_id
            }
        })

        if(!anAdmin) {
            res.json({ok: false})
            return
        }

        const accessRights = await anAdmin.getAccess_rights()

        let rights = []
        for(const accessRight of accessRights) {
            rights.push(accessRight.type)
        }
        showCenters = false
        showCurses = false
        showDocs = false
        showModeration = false

        rights.forEach(right => {
            showCenters += right.includes('center')
            showCurses += right.includes('curse')
            showDocs += right.includes('doctor')
            showModeration += right.includes('moderate')
        })

        showCenters = !!showCenters
        showCurses = !!showCurses
        showDocs = !!showDocs
        showModeration = !!showModeration

        res.json({showCenters, showCurses, showDocs, showModeration, accessRights, rights})
    })

    app.get('/admin/all-moderations', async (req, res) => {
        const aModerations = await moderation.findAll()
        
        res.json({ok: true, aModerations})
    })

    app.put('/admin/doctor', async (req, res) => {
        const { aDoctor, aStatus } = req.body.data

        if (aDoctor?.newPassword) {
            await doctor.update({
                name: aDoctor.name,
                phone: aDoctor.phone,
                email: aDoctor.email,
                password: md5(aDoctor.newPassword),
                region: aDoctor.region,
                specialization: aDoctor.specialization,
            }, {
                where: {
                    doctor_id: aDoctor.doctor_id
                }
            })
        } else {
            await doctor.update({
                name: aDoctor.name,
                phone: aDoctor.phone,
                email: aDoctor.email,
                region: aDoctor.region,
                specialization: aDoctor.specialization,
            }, {
                where: {
                    doctor_id: aDoctor.doctor_id
                }
            })
        }

        const doc = await doctor.findOne({
            where: {
                doctor_id: aDoctor.doctor_id
            }
        })

        const docStatus = await status.findOne({
            where: {
                status_id: aStatus
            }
        })

        await doc.setStatuses(null)

        await doc.addStatus(docStatus)

        res.json({ok: true})
    })

    app.post('/admin/doctor-status', async (req, res) => {
        const { doctor_id } = req.body

        const doc = await doctor.findOne({
            where: {
                doctor_id
            }
        })

        const docStatus = await doc.getStatuses()

        if(docStatus.length === 0) {
            res.json({ok: true, status: "Доступен"})
        } else if(docStatus[0].title === "public") {
            res.json({ok: true, status: "Доступен"})
        } else if(docStatus[0].title === "blocked") {
            res.json({ok: true, status: "Заблокирован"})
        } else {
            res.json({ok: true, status: "Доступен"})
        }
    })

    app.get('/admin/doctors', async (req, res) => {
        const docs = await doctor.findAll({
            attributes: [ 'doctor_id', 'name', 'email', 'phone', 'region', 'specialization' ]
        })

        res.json({ok: true, docs})
    })

    app.post('/admin/put-curses', upload.single('image'), async (req, res) => {
        let imageSrc
        if (req.file) {
            let arr = req.file.originalname.split('.')
            const extension = arr.slice(-1)[0]

            imageSrc = `/uploads/${req.body.uniqueSuffix}.${extension}`

            const image = await curse.findOne({where: {curse_id: req.body.curse_id}})

            fs.unlink(`../static${image.image}`, (err) => {console.log(err)})
        } else {
            imageSrc = ``
        }

        await curse.update({
            title: req.body.title,
            program: req.body.program,
            town: req.body.town,
            address: req.body.address,
            lector: req.body.lector,
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            price: req.body.price,
            score: req.body.score,
            image: imageSrc,
        }, {
            where: {
                curse_id: req.body.curse_id
            }
        })

        const aCurse = await curse.findOne({
            where: {
                curse_id: req.body.curse_id
            }
        })
        aCurse.setCategories(null)
        aCurse.setStatuses(null)

        const statusCurse = await status.findOne({
            where: {
                status_id: req.body.status_id
            }
        })

        await aCurse.addStatus(statusCurse)

        const { categories } = req.body
        let category_id
        let cat

        for(let i = 0; i < categories.length; i++) {
            category_id = categories[i]

            cat = await category.findOne({
                where: {
                    category_id
                }
            })

            await aCurse.addCategory(cat)
        }

        res.json({ok: true})
    })

    app.get('/admin/all-curse', async (req, res) => {
        const curses = await curse.findAll()
        const result = []
        const resultTrashed = []
        const resultPublic = []

        const trashedStatus = await status.findOne({
            where: {
                title: "trashed"
            }
        })

        const publicStatus = await status.findOne({
            where: {
                title: "public"
            }
        })

        const trashedCurses = await trashedStatus.getCurses()
        const publicCurses = await publicStatus.getCurses()

        for(let i = 0; i < publicCurses.length; i++) {
            const center = await publicCurses[i].getEducational_centers({attributes: [ 'title' ]})
            const item = publicCurses[i]

            resultPublic.push({
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

        for(let i = 0; i < trashedCurses.length; i++) {
            const center = await trashedCurses[i].getEducational_centers({attributes: [ 'title' ]})
            const item = trashedCurses[i]

            resultTrashed.push({
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

        res.json({ok: true, curses: result, trashed: resultTrashed, public: resultPublic})
    })

    app.post('/admin/data-curse', async (req, res) => {
        const { curse_id } = req.body
        const aCurse = await curse.findOne({
            where: {
                curse_id
            }
        })

        let aStatus

        const cats = await aCurse.getCategories()
        const statusCurse = await aCurse.getStatuses()

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

        res.json({ok: true, nameCats, cats2id, catIds, allCats, statusCurse})
    })

    app.get('/admin/centers', async (req, res) => {
        const ec = await educationalCenter.findAll({
            attributes: [ 'educational_center_id', 'title', 'phone', 'contact_person' ]
        })

        res.json({ok: true, centers: ec})
    })

    app.delete('/admin/center', async (req, res) => {
        const { educational_center_id } = req.body
 
        await educationalCenter.destroy({
            where: {
                educational_center_id
            }
        })

        res.json({ok: true})
    })

    app.post('/admin/stop-center', async (req, res) => {
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

    app.post('/admin/get-center', async (req, res) => {
        const { educational_center_id } = req.body

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id
            }
        })
        const status = await ec.getStatuses()
        const rights = await ec.getAccess_rights()

        const allRights = await accessRight.findAll()

        res.json({ok: true, center: ec, status: status[0]?.title || 'public', rights, allRights})
    })

    app.post('/admin/add-center', async (req, res) => {
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

    app.post('/admin/save-center', async (req, res) => {
        const { center, rights } = req.body

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

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: center.educational_center_id
            }
        })

        await ec.setAccess_rights(null)

        for(let i = 0; i < rights.length; i++) {
            const right = rights[i]

            const aRight = await accessRight.findOne({
                where: {
                    access_rights_id: right
                }
            })

            await ec.addAccess_right(aRight)
        }

        res.json({ok: true})
    })

    app.post('/admin/login', async (req, res) => {
        const md5 = require('md5')

        const anAdmin = await admin.findOne({
            where: {
                login: req.body.login,
                password: md5(req.body.password)
            }
        })

        if (anAdmin) {
            const refresh = uuidv4()
            const access = jwt.sign({id: anAdmin.admin_id, wasSigned: Date.now() - 100}, signature, {expiresIn: "30s"})

            await admin.update({
                refresh_token: refresh
            }, {
                where: {
                    admin_id: anAdmin.admin_id
                }
            })

            const text = `
                <h4>Кто-то авторизовался в вашем аккаунте.</h4>
                <p>Если это были не вы, то как можно скорее свяжитесь с нами.</p>
            `

            sendEmail(
                anAdmin.login,
                "Авторизация в аккаунте",
                text
            )

            res.json({ok: true, admin_id: anAdmin.admin_id, tokens: {refresh, access}})

        } else {
            res.json({ok: false, error: {msg: "Неверный логин или пароль."}})
        }
    })

    app.post('/admin/refresh', async (req, res) => {
        const anAdmin = await admin.findOne({
            where: {
                admin_id: req.body.admin_id,
                refresh_token: req.body.refresh
            }
        })
        if(anAdmin) {
            const refresh = uuidv4()
            const access = jwt.sign({id: anAdmin.admin_id}, signature, {expiresIn: "30s"})

            await admin.update({
                refresh_token: refresh
            }, {
                where: {
                    admin_id: anAdmin.admin_id
                }
            })

            res.json({ok: true, anAdmin, admin_id: anAdmin.admin_id, tokens: {refresh, access}})
        } else {
            res.json({ok: false})
        }
    })
}