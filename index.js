require('babel-register');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
fs = require("fs");
const config = require('./Assets/config');
const mysql = require('promise-mysql');
const cors = require('cors');
const exjwt = require('express-jwt');
require('dotenv').config();
const {success, error, checkAndChange, isErr, compare, verifyToken} = require('./Assets/Functions/CheckFunctions');
const RoleClass = require('./Assets/RequestClass/Role')
const AwardClass = require('./Assets/RequestClass/Award')
const CategoryClass = require('./Assets/RequestClass/Category')
const InvitationClass = require('./Assets/RequestClass/Invitation')
const MediaClass = require('./Assets/RequestClass/Media')
const UserClass = require('./Assets/RequestClass/User')


app.listen(process.env[`${process.env.MODE}_PORT`]);

mysql.createConnection({
    host: process.env[`${process.env.MODE}_HOST`],
    database: process.env[`${process.env.MODE}_DATABASE`],
    user: process.env[`${process.env.MODE}_USER`],
    password: ''
}).then((db) => {

    //configuration de notre type de requètes express(ici du http)
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
        next();
    });
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    let RoutesRole = express.Router()
    let RoutesAward = express.Router()
    let RoutesCategory = express.Router()
    let RoutesUser = express.Router()
    let RoutesMedia = express.Router()
    let RoutesInvitation = express.Router()

    //on instantie la class Role en lui passant notre base de données qu on vient de configurer et qui est representé par db
    let role = new RoleClass(db)
    let award = new AwardClass(db)
    let category = new CategoryClass(db)
    let invitation = new InvitationClass(db)
    let media = new MediaClass(db)
    let user = new  UserClass(db)



    //on declare notre route son type(get) une fonction async(pour specifier a node que le resultat de cette fonction ne sera pas immediat car elle fait appel à une promesse et on rajoute await devant
    // l'appel de la fonction pour dire : attend la reponse de getAllRoles avant de continuer (si on fait pas ça le code va continuer a s'executer et le retour de cette route rique de renvoyer: undefined
    // lorsqu'on l'appelera. la fonction checkAndChange sert a mettre en forme la reponse et elle est déclaré dans le fichier de fonction))
    RoutesRole.route('/getAllRoles')
        .get(async (req, res) => {
            let getRoles = await role.getAllRoles()
            console.log('ca passe')
            res.json(checkAndChange(getRoles))
        })
    //ici on concataine nos differente string et on les stock dans la variable RoutesRole pour eviter dans le cas de plusieurs route qui commenceraient
    // par le même chemin d'avoir a tout retapper à chaques fois, il suffira ensuite de rajouter uniquement la sous-route désiré
    app.use(config.rootAPI + 'role', RoutesRole)
    app.use(config.rootAPI + 'award', RoutesAward)
    app.use(config.rootAPI + 'category', RoutesCategory)
    app.use(config.rootAPI + 'user', RoutesUser)
    app.use(config.rootAPI + 'media', RoutesMedia)
    app.use(config.rootAPI + 'invitation', RoutesInvitation)
    console.log('en ecoute sur le port' + process.env[`${process.env.MODE}_PORT`])
}).catch((err) => {
    console.log(err.message)
})