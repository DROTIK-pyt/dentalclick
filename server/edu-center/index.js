module.exports = function(app, upload) {
    const { educationalCenter, moderation, articles, rubrics, curse, category, status } = require('../db/scheme')
    const fs = require('fs')
    const baseSettings = require('../config/serverSetting')
    // не articles.create({}), educationalCenter.addArticle()

    app.get('/edu-center/blog', async (req, res) => {
        const blogArticles = await articles.findAll()
        const blogRubrics = await rubrics.findAll()

        res.json({blogArticles, blogRubrics})
    })

    app.post('/edu-center/blog/rubrics', async (req, res) => {
        const articles_id = req.body.articles_id
        const article = await articles.findOne({where: {articles_id: articles_id}})
        const rubrics = await article.getRubrics()

        res.json({rubrics})
    })

    app.post('/edu-center/blog/rubrics/add', async (req, res) => {
        const title = req.body.title
        const rubric = await rubrics.create({
            title: title
        })

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
    })

    app.post('/edu-center/blog/add', async (req, res) => {
        const article = await articles.create({
            title: req.body.title,
            description: req.body.description,
        })
        if (req.body.rubrics.length) {
            req.body.rubrics.forEach(async rubric => {
                let t = await rubrics.findOne({where: {
                    title: rubric
                }})
                await article.addRubric(t)
            })
        }
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

        await aCurse.addStatus(publicStatus)

        res.json({aCurse})
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

    app.get('/edu-center/curses', async (req, res) => {
        const categories = await category.findAll()
        const trash = await status.findOne({
            where: {
                title: "trashed"
            }
        })
        const publicStatus = await status.findOne({
            where: {
                title: "public"
            }
        })
        
        const trashedCurses = await trash.getCurses()
        const publicCurses = await publicStatus.getCurses()

        res.json({trashedCurses, categories, curses: publicCurses})
    })

    app.post('/edu-center/curses/category/add', upload.single('image'), async (req, res) => {
        let arr = req.file.originalname.split('.')
        const extension = arr.slice(-1)[0]

        const imageSrc = `/uploads/${req.body.uniqueSuffix}.${extension}`
        
        const aCategory = await category.create({
            title: req.body.title,
            image: imageSrc
        })

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

    app.post('/edu/login', async (req, res) => {
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
        center.addModerate(newModerate)
    })
}