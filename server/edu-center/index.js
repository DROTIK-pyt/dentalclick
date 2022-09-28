module.exports = function(app, upload) {
    const { educationalCenter, moderation, articles, rubrics, curse, category, status, Op } = require('../db/scheme')
    const fs = require('fs')
    const md5 = require('md5')
    const signature = "FJWr"
    const { v4: uuidv4 } = require('uuid')
    const jwt = require('jsonwebtoken')
    const base64 = require('base-64')
    const { sendEmail } = require('../sendMail') // Отправка сообщений на почту

    app.post('/edu-center/blog', async (req, res) => {
        const educational_center_id = req.body.educational_center_id

        const ec = await educationalCenter.findOne({where: {
            educational_center_id: educational_center_id
        }})
        

        const blogArticles = await ec.getArticles()
        const blogRubrics = await ec.getRubrics()

        res.json({blogArticles, blogRubrics})
    })

    app.post('/edu-center/blog/rubrics/add', async (req, res) => {
        const title = req.body.title
        const educational_center_id = req.body.educational_center_id

        const rubric = await rubrics.create({
            title: title
        })
        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: educational_center_id
            }
        })
        await ec.addRubric(rubric)

        res.json({rubric})
    })

    app.get('/edu-center/blog/rubrics', async (req, res) => {
        const result = await rubrics.findAll()

        res.json({result})
    })

    app.put('/edu-center/blog/rubrics/edit', async (req, res) => {
        const title = req.body.title
        const rubrics_id = req.body.rubrics_id

        await rubrics.update({
            title: title
        }, {where: {
            rubrics_id: rubrics_id
        }})

        const rubric = await rubrics.findAll()
        res.json({rubric})
    })

    app.delete('/edu-center/blog/rubrics', async (req, res) => {
        const rubrics_id = req.body.rubrics_id

        await rubrics.destroy({
            where: {
                rubrics_id: rubrics_id
            }
        })

        res.json({ok: true})
    })

    app.put('/edu-center/blog/rubrics', async (req, res) => {
        const title = req.body.title
        const rubrics_id = req.body.rubrics_id

        await rubrics.update({
            title: title
        }, {
            where: {
                rubrics_id: rubrics_id
            }
        })

        res.json({ok: true})
    })

    app.post('/edu-center/blog/rubrics', async (req, res) => {
        const articles_id = req.body.articles_id

        const article = await articles.findOne({
            where: {
                articles_id: articles_id
            }
        })

        const rubrics = await article.getRubrics()
        res.json({rubrics})
    })

    app.post('/edu-center/blog/add', async (req, res) => {
        const educational_center_id = req.body.educational_center_id

        const article = await articles.create({
            title: req.body.title,
            description: req.body.description,
        })
        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: educational_center_id
            }
        })
        if (req.body.rubrics.length) {
            req.body.rubrics.forEach(async rubric => {
                let t = await rubrics.findOne({where: {
                    title: rubric
                }})
                await article.addRubric(t)
            })
        }

        await ec.addArticle(article)

        res.json({article})
    })

    app.delete('/edu-center/blog', async (req, res) => {
        const articles_id = req.body.articles_id

        await articles.destroy({
            where: {
                articles_id: articles_id 
            }
        })

        res.json({ok: true})
    })

    app.put('/edu-center/blog/edit', async (req, res) => {
        await articles.update({
            title: req.body.title,
            description: req.body.description,
        }, {
            where: {
                articles_id: req.body.articles_id
            }
        })
        const article = await articles.findOne({
            where: {
                articles_id: req.body.articles_id
            }
        })
        if (req.body.rubrics.length) {
            article.setRubrics(null)

            req.body.rubrics.forEach(async rubric => {
                let t = await rubrics.findOne({where: {
                    title: rubric
                }})
                await article.addRubric(t)
            })
        }
        res.json({ok: true})
    })

    app.post('/edu-center/curses/add', upload.single('image'), async (req, res) => {
        const educational_center_id = req.body.educational_center_id

        let arr = req.file.originalname.split('.')
        const extension = arr.slice(-1)[0]

        const imageSrc = `/uploads/${req.body.uniqueSuffix}.${extension}`

        const aCurse = await curse.create({
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
        })

        const publicStatus = await status.findOne({
            where: {
                title: "public"
            }
        })
        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: educational_center_id
            }
        })

        const cats = JSON.parse(req.body.categories)
        if(cats) {
            for(const cat of cats) {
                const c = await category.findOne({where: {
                    title: cat
                }})
                await aCurse.addCategory(c)
            }
        }

        await aCurse.addStatus(publicStatus)
        await ec.addCurse(aCurse)

        res.json({aCurse})
    })

    app.post('/edu-center/category', async (req, res) => {
        const curse_id = req.body.curse_id

        const aCurse = await curse.findOne({
            where: {
                curse_id: curse_id
            }
        })

        const categories = await aCurse.getCategories()

        res.json({categories})
    })

    app.put('/edu-center/curses/edit', upload.single('image'), async (req, res) => {
        let aCurse = null

        if(req.file) {
            let arr = req.file.originalname.split('.')
            const extension = arr.slice(-1)[0]

            const imageSrc = `/uploads/${req.body.uniqueSuffix}.${extension}`

            const image = await curse.findOne({where: {curse_id: req.body.curse_id}})

            fs.unlink(`../static${image.image}`, (err) => {console.log(err)})

            aCurse = await curse.update({
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
        } else {
            aCurse = await curse.update({
                title: req.body.title,
                program: req.body.program,
                town: req.body.town,
                address: req.body.address,
                lector: req.body.lector,
                date_start: req.body.date_start,
                date_end: req.body.date_end,
                price: req.body.price,
                score: req.body.score,
            }, {
                where: {
                    curse_id: req.body.curse_id
                }
            })
        }
        const cats = JSON.parse(req.body.categories)
        aCurse = await curse.findOne({
            where: {
                curse_id: req.body.curse_id
            }
        })

        if(cats) {
            aCurse.setCategories(null)

            for(const cat of cats) {
                const c = await category.findOne({where: {
                    title: cat
                }})
                await aCurse.addCategory(c)
            }
        }

        res.json({aCurse})
    })

    app.delete('/edu-center/curses/trash', async (req, res) => {
        const aCurse = await curse.findOne({
            where: {
                curse_id: req.body.curse_id
            }
        })
        const trash = await status.findOne({
            where: {
                title: "trashed"
            }
        })
        await aCurse.setStatuses(null)

        await aCurse.addStatus(trash)

        res.json({ok: true})
    })

    app.delete('/edu-center/curses', async (req, res) => {
        const image = await curse.findOne({where: {curse_id: req.body.curse_id}})

        fs.unlink(`../static${image.image}`, (err) => {console.log(err)})

        await curse.destroy({
            where: {
                curse_id: req.body.curse_id
            }
        })

        res.json({ok: true})
    })
    
    app.post('/edu-center/curses/reestablish', async (req, res) => {
        const publicStatus = await status.findOne({
            where: {
                title: "public"
            }
        })
        const aCurse = await curse.findOne({
            where: {
                curse_id: req.body.curse_id
            }
        })
        await aCurse.setStatuses(null)
        
        await aCurse.addStatus(publicStatus)

        res.json({ok: true})
    })

    app.post('/edu-center/curses', async (req, res) => {
        const educational_center_id = req.body.educational_center_id
        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id
            }
        })

        const categories = await ec.getCategories()
        const curses = await ec.getCurses()
        let trashedCurses = []
        let publicCurses = []

        for(const cur of curses) {
            const stat = await cur.getStatuses()
            if(stat[0].title === "public") {
                publicCurses.push(cur)
            } else if(stat[0].title === "trashed") {
                trashedCurses.push(cur)
            }
        }

        res.json({trashedCurses, categories, curses: publicCurses})
    })

    app.post('/edu-center/curses/category/add', upload.single('image'), async (req, res) => {
        const educational_center_id = req.body.educational_center_id
        let imageSrc

        if (req.file) {
            let arr = req.file.originalname.split('.')
            const extension = arr.slice(-1)[0]

            imageSrc = `/uploads/${req.body.uniqueSuffix}.${extension}`
        } else {
            imageSrc = ``
        }
        
        const aCategory = await category.create({
            title: req.body.title,
            image: imageSrc
        })

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: educational_center_id
            }
        })

        ec.addCategory(aCategory)

        res.json({aCategory})
    })

    app.put('/edu-center/curses/category/edit', upload.single('image'), async (req, res) => {
        if(req.file) {
            let arr = req.file.originalname.split('.')
            const extension = arr.slice(-1)[0]

            const imageSrc = `/uploads/${req.body.uniqueSuffix}.${extension}`

            const image = await category.findOne({where: {category_id: req.body.category_id}})

            fs.unlink(`../static${image.image}`, (err) => {console.log(err)})
            
            await category.update({
                title: req.body.title,
                image: imageSrc
            }, {
                where: {
                    category_id: req.body.category_id
                }
            })
        } else {
            await category.update({
                title: req.body.title,
            }, {
                where: {
                    category_id: req.body.category_id
                }
            })
        }
        
        res.json({ok: true})
    })

    app.delete('/edu-center/curses/category', async (req, res) => {
        const image = await category.findOne({where: {category_id: req.body.category_id}})

        fs.unlink(`../static${image.image}`, (err) => {console.log(err)})

        await category.destroy({
            where: {
                category_id: req.body.category_id
            }
        })

        res.json({ok: true})
    })

    app.post('/edu-center/reports/maxmin', async (req, res) => {
        const educational_center_id = req.body.educational_center_id

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: educational_center_id
            }
        })

        const curses = await ec.getCurses()
        let maxAllowed = new Date().toISOString().split('T')[0]
        let minAllowed = new Date().toISOString().split('T')[0]

        for(const cur of curses) {
            if(cur.date_start <= minAllowed)
                minAllowed = cur.date_start
            if(cur.date_end >= maxAllowed)
                maxAllowed = cur.date_end
        }

        res.json({minAllowed, maxAllowed})
    })

    app.post('/edu-center/excel', async (req, res) => {
        const range = req.body.dates
        const educational_center_id = req.body.educational_center_id

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: {[Op.eq]: educational_center_id}
            },
        })

        const curses = await ec.getCurses({
            where: {
                [Op.and]: [
                    {date_start: {[Op.gte]: range[0]}},
                    {date_end: {[Op.lte]: range[1]}},
                ]
            }
        })

        let doctors = []
        for(const cur of curses) {
            const d = await cur.getDoctors()
            if (d)
                doctors.push(d)
        }
        
        let excel = []

        for(let i = 0; i < curses.length; i++) {
            for(let j = 0; j < doctors[i].length; j++) {
                excel.push({
                    "ФИО": doctors[i][j].name,
                    "Телефон": doctors[i][j].phone,
                    "E-mail": doctors[i][j].email,
                    "Регион": doctors[i][j].region,
                    "Образовательный центр": ec.title,
                    "Название курса": curses[i].title,
                    "Дата начала": curses[i].date_start,
                    "Дата завершения": curses[i].date_end,
                    "Цена": curses[i].price,
                    "Город проведения": curses[i].town,
                })
            }
        }

        res.xls('data.xlsx', excel)
    })

    app.post('/edu/moderate', async (req, res) => {
        const data = req.body
        const center = await educationalCenter.findOne({where: {educational_center_id: data.id}})
        const newModerate = await moderation.create({
            new_information: JSON.stringify({
                type: "eduCenter",
                id: data.id,
                newInfo: data
            })
        })
        await center.addModeration(newModerate)

        const text = `
            <h4>Администраторы уже получили информацию и проверяют ее, ожидайте.</h4>
            <p>Номер вашей заявки: <b>#${newModerate.moderation_id}</b></p>
        `

        sendEmail(
            center.email,
            "Изменение профиля (в работе)",
            text
        )

        res.json({ok: true})
    })

    app.post('/edu/info', async (req, res) => {
        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: req.body.educational_center_id
            }
        })
        const status = await ec.getStatuses()

        res.json({info: ec, status: status[0]?.title})
    })

    app.post('/edu/status', async (req, res) => {
        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: req.body.educational_center_id
            }
        })
        const status = await ec.getStatuses()

        res.json({status: status[0]?.title})
    })

    app.post('/edu-center/accesses', async (req, res) => {
        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: req.body.educational_center_id
            }
        })

        const ecAccessRights = await ec.getAccess_rights()

        res.json({ecAccessRights})
    })

    app.post('/edu-center/login', async (req, res) => {

        const ec = await educationalCenter.findOne({
            where: {
                email: req.body.login,
                password: md5(req.body.password)
            }
        })

        if (ec) {
            const refresh = uuidv4()
            const access = jwt.sign({id: ec.educational_center_id, title: ec.title, wasSigned: Date.now() - 100}, signature, {expiresIn: "10m"})

            await educationalCenter.update({
                refresh_token: refresh
            }, {
                where: {
                    educational_center_id: ec.educational_center_id
                }
            })

            const text = `
                <h4>Кто-то авторизовался в вашем аккаунте.</h4>
                <p>Если это были не вы, то как можно скорее свяжитесь с нами.</p>
            `

            sendEmail(
                ec.email,
                "Авторизация в аккаунте",
                text
            )

            res.json({ok: true, educational_center_id: ec.educational_center_id, tokens: {refresh, access}})

        } else {
            res.json({ok: false})
        }
    })

    app.post('/edu-center/refresh', async (req, res) => {

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: req.body.educational_center_id,
                refresh_token: req.body.refresh
            }
        })
        if(ec) {
            const refresh = uuidv4()
            const access = jwt.sign({id: ec.educational_center_id, title: ec.title}, signature, {expiresIn: "10m"})

            await educationalCenter.update({
                refresh_token: refresh
            }, {
                where: {
                    educational_center_id: ec.educational_center_id
                }
            })

            res.json({ok: true, eduCenter: ec, tokens: {refresh, access}})
        } else {
            res.json({ok: false})
        }
    })

    app.post('/edu-center/change-accesses', async (req, res) => {

        const ec = await educationalCenter.findOne({
            where: {
                educational_center_id: req.body.educational_center_id,
            }
        })
        const moderate = await moderation.create({
            new_information: JSON.stringify({
                type: "edu-center-change-accesses",
                id: req.body.educational_center_id,
                newInfo: { text: "Запрос смены доступов" }
            })
        })
        if(ec) {
            await ec.addModeration(moderate)

            const text = `
                <h4>Администраторы уже получили информацию и проверяют ее, ожидайте.</h4>
                <p>Номер вашей заявки: <b>#${moderate.moderation_id}</b></p>
            `

            sendEmail(
                ec.email,
                "Смена доступов (в работе)",
                text
            )

            res.json({ok: true})
        } else {
            res.json({ok: false})
        }
    })
}