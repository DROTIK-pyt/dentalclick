module.exports = function(app, upload) {
    app.get('/dumb-db', async (req, res) => {
        var mysqldump = require('mysqldump');
        var fs = require('fs');
         
        mysqldump({
            connection: {
                host: 'localhost',
                user: 'root',
                password: 'root',
                database: 'dentalclick',
            },
            dumpToFile: './dump.sql',
        })
        res.json({ok: true})
    })

    app.get('/import-db', async (req, res) => {
        const Importer = require('mysql-import')

        const connection = {
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'dentalclick',
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
}