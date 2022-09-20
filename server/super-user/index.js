module.exports = function(app, upload) {
    const signature = "FJWr"
    const { v4: uuidv4 } = require('uuid')
    const jwt = require('jsonwebtoken')
    const base64 = require('base-64')
    const fs = require('fs')
    let dataUser = require('./dataUser')

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

    app.post('/super-user/refresh', async (req, res) => {
        const { refresh } = req.body
        dataUser = require('./dataUser')
       
        if(refresh === dataUser?.refresh) {
            const refresh = uuidv4()

            dataUser.refresh = refresh
            fs.writeFileSync('./super-user/dataUser.json', JSON.stringify({...dataUser}))

            const access = jwt.sign({login}, signature, {expiresIn: "10m"})

            res.json({ok: true, tokens: {refresh, access}})
        } else {
            res.json({ok: false})
        }
    })
}