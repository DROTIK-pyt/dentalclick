module.exports = function(app) {
    const { educationalCenter, moderation, articles, rubrics, articlesRubrics } = require('../db/scheme')

    app.get('/edu/blog', async (req, res) => {
        const blogArticles = await articles.findAll()
        const blogRubrics = await rubrics.findAll()

        res.json({blogArticles, blogRubrics})
    })

    app.post('/edu-center/blog/add', async (req, res) => {
        const article = await articles.create({
            title: req.body.title,
            description: req.body.description,
        })
        if (req.body.rubrics.length) {
            let r = null
            req.body.rubrics.forEach(async rubric => {
                r = await rubrics.findOne({
                    title: rubric
                })
                await article.addRubric(r, {through: {
                    articleArticlesId: article.articles_id,
                    rubricRubricsId: r.rubrics_id,
                }})
            })
        }
        res.json({ok: true})
    })

    app.post('/edu-center/blog/edit', async (req, res) => {
        const article = await articles.update({
            title: req.body.title,
            description: req.body.description,
        }, {
            where: {
                articles_id: req.body.articles_id
            }
        })
        if (req.body.rubrics.length) {
            articlesRubrics.destroy({where: { articleArticlesId: article.articles_id }})

            req.body.rubrics.forEach(async rubric => {
                const r = await rubrics.findOne({
                    title: rubric
                })
                article.addRubric(r, {through: {
                    articleArticlesId: article.articles_id,
                    rubricRubricsId: r.rubrics_id,
                }})
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