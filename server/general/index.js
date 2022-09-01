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
}