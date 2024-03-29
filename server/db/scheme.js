const dbBaseSetting = require('../config/dbBaseSetting.json')

const { Sequelize, DataTypes, Op } = require("sequelize")
const sequelize = new Sequelize(dbBaseSetting.dataBase, dbBaseSetting.user, dbBaseSetting.password, {
  dialect: "mysql",
  host: dbBaseSetting.host,
})


const accessRight = sequelize.define('access_right', {
    access_rights_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {timestamps: false})

const educationalCenter = sequelize.define('educational_center', {
    educational_center_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    contact_person: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    site_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    requisites: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    add_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
    }
})
educationalCenter.belongsToMany(accessRight, {through: "accessRightsEC"})
accessRight.belongsToMany(educationalCenter, {through: "accessRightsEC"})

const articles = sequelize.define('article', {
    articles_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
})
educationalCenter.belongsToMany(articles, {through: "articlesEC"})
articles.belongsToMany(educationalCenter, {through: "articlesEC"})

const rubrics = sequelize.define('rubric', {
    rubrics_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {timestamps: false})

articles.belongsToMany(rubrics, {through: "articlesRubrics"})
rubrics.belongsToMany(articles, {through: "articlesRubrics"})

const curse = sequelize.define('curse', {
    curse_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    program: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    town: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lector: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date_start: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date_end: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})
educationalCenter.belongsToMany(curse, {through: "ECCurse"})
curse.belongsToMany(educationalCenter, {through: "ECCurse"})

educationalCenter.belongsToMany(rubrics, {through: "ECRubrics"})
rubrics.belongsToMany(educationalCenter, {through: "ECRubrics"})

const doctor = sequelize.define('doctor', {
    doctor_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})
doctor.belongsToMany(curse, {through: "doctorCurse"})
curse.belongsToMany(doctor, {through: "doctorCurse"})

doctor.belongsToMany(accessRight, {through: "doctorAR"})
accessRight.belongsToMany(doctor, {through: "doctorAR"})

const category = sequelize.define('category', {
    category_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})
curse.belongsToMany(category, {through: "curseCategory"})
category.belongsToMany(curse, {through: "curseCategory"})

educationalCenter.belongsToMany(category, {through: "ECCategory"})
category.belongsToMany(educationalCenter, {through: "ECCategory"})

const status = sequelize.define('status', {
    status_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {timestamps: false})
curse.belongsToMany(status, {through: "curseStatus"})
status.belongsToMany(curse, {through: "curseStatus"})

educationalCenter.belongsToMany(status, {through: "ecStatus"})
status.belongsToMany(educationalCenter, {through: "ecStatus"})

doctor.belongsToMany(status, {through: "docStatus"})
status.belongsToMany(doctor, {through: "docStatus"})

const moderation = sequelize.define('moderation', {
    moderation_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    new_information: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})

const admin = sequelize.define('admin', {
    admin_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

admin.belongsToMany(accessRight, {through: "adminRights"})
accessRight.belongsToMany(admin, {through: "adminRights"})

module.exports = {
    dbBaseSetting,
    DataTypes,
    sequelize,
    Op,
    status,
    category,
    doctor,
    curse,
    rubrics,
    articles,
    accessRight,
    educationalCenter,
    moderation,
    admin,
}