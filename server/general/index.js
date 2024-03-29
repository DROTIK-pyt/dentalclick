module.exports = function(app, upload) {
    const fs = require('fs')

    const dbBaseSetting = require('../config/dbBaseSetting')
    const { accessRight, Op } = require('../db/scheme')

    app.get('/dumb-db', async (req, res) => {
        var mysqldump = require('mysqldump')
         
        mysqldump({
            connection: {
                host: dbBaseSetting.host,
                user: dbBaseSetting.user,
                password: dbBaseSetting.password,
                database: dbBaseSetting.dataBase,
            },
            dumpToFile: './dump.sql',
        })
        res.json({ok: true})
    })

    app.get('/import-db', async (req, res) => {
        const Importer = require('mysql-import')

        const connection = {
            host: dbBaseSetting.host,
            user: dbBaseSetting.user,
            password: dbBaseSetting.password,
            database: dbBaseSetting.dataBase,
        }
        const importer = new Importer(connection)
         
        importer.onProgress(progress=>{
            var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100
            console.log(`${percent}% Completed`)
        })
        importer.import('./dump.sql').then(()=>{
            var files_imported = importer.getImported()
            console.log(`${files_imported.length} SQL file(s) imported.`)
            res.json({ok: true})
        }).catch(err=>{
            console.error(err)
        })
    })

    app.get('/write-access', async (req, res) => {
        const rights = await accessRight.findAll({ raw: true, attributes: [ 'type' ] })
        const result = {}
        rights.forEach(right => {
            result[`${right.type}`] = right.type
        })
        
        try {
            fs.writeFileSync("./config/userAccessRights.json", JSON.stringify(result))
            res.json({ok: true, error: null})
        } catch(e) {
            res.json({ok: false, error: e})
        }
    })
}