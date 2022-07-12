module.exports = function(app) {
    const { educationalCenter, moderation, articles, rubrics } = require('../db/scheme')
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
        center.addModerate(newModerate, {through: {
            moderationModerationId: newModerate.moderation_id,
            educationalCenterEducationalCenterId: data.id
        }})
    })
}