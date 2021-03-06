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
const EventClass = require('./Assets/RequestClass/Event')
const bcrypt = require('bcrypt')
const morgan = require('morgan')('dev');
const upload = require('express-fileupload')

app.listen(process.env[`${process.env.MODE}_PORT`]);

mysql.createConnection({
    host: process.env[`${process.env.MODE}_HOST`],
    database: process.env[`${process.env.MODE}_DATABASE`],
    user: process.env[`${process.env.MODE}_USER`],
    password: ''
}).then((db) => {

    console.log("ca passe")

    //configuration de notre type de requètes express(ici du http)
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
        next();
    });
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(morgan);
    app.use(upload());

    let RoutesRole = express.Router()
    let RoutesAward = express.Router()
    let RoutesCategory = express.Router()
    let RoutesUser = express.Router()
    let RoutesMedia = express.Router()
    let RoutesInvitation = express.Router()
    let RoutesEvent = express.Router()

    //on instantie la class Role en lui passant notre base de données qu on vient de configurer et qui est representé par db
    let role = new RoleClass(db)
    let award = new AwardClass(db)
    let category = new CategoryClass(db)
    let invitation = new InvitationClass(db)
    let media = new MediaClass(db)
    let user = new  UserClass(db)
    let event = new EventClass(db)

    //on declare notre route son type(get) une fonction async(pour specifier a node que le resultat de cette fonction ne sera pas immediat car elle fait appel à une promesse et on rajoute await devant
    // l'appel de la fonction pour dire : attend la reponse de getAllRoles avant de continuer (si on fait pas ça le code va continuer a s'executer et le retour de cette route rique de renvoyer: undefined
    // lorsqu'on l'appelera. la fonction checkAndChange sert a mettre en forme la reponse et elle est déclaré dans le fichier de fonction))

// routes concernant les roles
    RoutesRole.route('/getAllRoles')
        .get(async (req, res) => {
            let getRoles = await role.getAllRoles()
            res.json(checkAndChange(getRoles))
        })
    RoutesRole.route('/getRoleByID/:id')
        .get(async (req, res) => {
            let getRole = await role.getRoleById(req.params.id)
            res.json(checkAndChange(getRole))
        })
    RoutesRole.route('/addRole')
        .post(async(req,res)=>{
            let addRole = await role.addRole(req.body.roleName)
            res.json(checkAndChange(addRole))
        })
    RoutesRole.route('/deleteRole/:id')
        .delete(async(req,res)=>{
            let deleteRole = await role.deleteRole(req.params.id)
            res.json(checkAndChange(deleteRole))
        })
    RoutesRole.route('/updateRole')
        .put(async(req,res)=>{
            let updateRole = await role.updateRole(req.body.name,req.body.newName)
            res.json(checkAndChange(updateRole))
        })

// routes concernant les categories
    RoutesCategory.route('/getAllCategories')
        .get(async (req, res) => {
            let getAllCategories = await category.getAllCategories()
            res.json(checkAndChange(getAllCategories))
        })
    RoutesCategory.route('/getCategoryByID/:id')
        .get(async (req, res) => {
            let getCategoryByID = await category.getCategoryById(req.params.id)
            res.json(checkAndChange(getCategoryByID))
        })

        RoutesCategory.route('/getIdCategoryByName')
        .get(async (req, res) => {
            let getIdCategoryByName = await category.getIdCategoryByName(req.body.name)
            res.json(checkAndChange( getIdCategoryByName))
        })

       
    RoutesCategory.route('/addCategory')
        .post(async(req,res)=>{

            let addCategory = await category.addCategory(req.body.categoryName)
            res.json(checkAndChange(addCategory))
        })
    RoutesCategory.route('/deleteCategory/:id')
        .delete(async(req,res)=>{
            let deleteCategory = await category.deleteCategory(req.params.id)
            res.json(checkAndChange(deleteCategory))
        })
    RoutesCategory.route('/updateCategory')
        .put(async(req,res)=>{
            let updateCategory = await category.updateCategory(req.body.name,req.body.newName)
            res.json(checkAndChange(updateCategory))
        })

 // routes concernant l'utilisateur
        RoutesUser.route('/getAllUser')
        .get(async(req,res)=> {
            let getAllUser = await user.getAllUser()
            res.json(checkAndChange(getAllUser))
        })

        RoutesUser.route('/getUserMedia')
        .get(async (req, res) => {
            let getUserMedia = await user.getUserMedia(req.params.id)
            res.json(checkAndChange(getUserMedia))
        })

        RoutesUser.route('/getNumberParticipants')
        .get(async(req,res)=> {
            let getNumberParticipants = await user.getNumberParticipants()
            res.json(checkAndChange(getNumberParticipants))
        })

        RoutesUser.route('/getNumberPublic')
        .get(async(req,res)=> {
            let getNumberPublic = await user.getNumberPublic()
            res.json(checkAndChange(getNumberPublic))
        })

        RoutesUser.route('/getNumberVotes')
        .get(async(req,res)=> {
            let getNumberVotes = await user.getNumberVotes()
            res.json(checkAndChange(getNumberVotes))
        })

        RoutesUser.route('/getUserByID/:id')
        .get(async (req, res) => {
            let getUserByID = await user.getUserById(req.params.id)
            res.json(checkAndChange(getUserByID))
        })

        RoutesUser.route('/addUserMedia')
        .post(async(req,res)=>{
            console.log(req.body)
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            let addUserMedia = await user.addUserMedia(req.body ,hashedPassword )
            res.json(checkAndChange(addUserMedia))
        })
        
        RoutesUser.route('/addUser')
        .post(async(req,res)=>{

            const hashedPassword = await bcrypt.hash(req.body.password, 10)
        
            let addUser = await user.addUser( req.body.first_name, req.body.last_name, req.body.email, hashedPassword, req.body.phone_number)
            res.json(checkAndChange(addUser))
        })

        RoutesUser.route('/deleteUser/:email')
        .delete(async(req,res)=>{
            let deleteUser = await user.deleteUser(req.params.email)
            res.json(checkAndChange(deleteUser))
        })

        RoutesUser.route('/updateUser')
        .put(async(req,res)=>{
            let updateUser = await user.updateUser(req.body.first_name, req.body.last_name, req.body.email, req.body.password, req.body.phone_number ,req.body.created_at, req.body.last_connection, req.body.asVoted)
            res.json(checkAndChange(updateUser))
        })

        RoutesUser.route('/checkAuth')
        .post(async (req, res) => {
            let checkAuth = await user.checkAuth(req.body.email, req.body.password)
            res.json(checkAndChange(checkAuth))  
        })

        RoutesUser.route('/getUserNumberByRole')
        .get(async(req,res)=> {
            let getUserNumberByRole = await user.getUserNumberByRole()
            res.json(checkAndChange(getUserNumberByRole))
        })

// routes concernant les medias
    RoutesMedia.route('/getAllMedias')
        .get(async (req, res) => {
            let getAllMedias = await media.getAllMedias()
            res.json(checkAndChange(getAllMedias))
        })
    RoutesMedia.route('/getMediaByID/:id')
        .get(async (req, res) => {
            let getMediaByID = await media.getMediaById(req.params.id)
            res.json(checkAndChange(getMediaByID))
        })
    RoutesMedia.route('/addMedia')
        .post(async(req,res)=>{
            let addMedia = await media.addMedia(req.body.MediaName,req.body.description,req.body.link,req.body.poster, req.body.isVisible, req.body.score, req.body.technique, req.body.creation_date, req.body.realisationCondition)
            res.json(checkAndChange(addMedia))
        })
    RoutesMedia.route('/deleteMedia/:id')
        .delete(async(req,res)=>{
            let deleteMedia = await media.deleteMedia(req.params.id)
            res.json(checkAndChange(deleteMedia))
        })
    RoutesMedia.route('/updateMedia')
        .put(async(req,res)=>{
            let updateMedia = await media.updateMedia(req.body.name, req.body.newName, req.body.description, req.body.link, req.body.poster, req.body.isVisible, req.body.score, req.body.technique, req.body.creation_date, req.body.realisationCondition)
            res.json(checkAndChange(updateMedia))
        })

        RoutesMedia.route('/getMediaByID/:id')
        .get(async (req, res) => {
            let getMediaById = await media.getMediaById(req.params.id)
            res.json(checkAndChange(getMediaById))
        })
    RoutesMedia.route('/addVoteToMedia/:id')
        .post(async (req, res) => {
            let addVoteToMedia = await media.addVoteToMedia(req.params.id,req.body.idUser)
            res.json(checkAndChange(addVoteToMedia))
        })

        RoutesMedia.route('/posterUpload')
        .put(async (req,res) => {
           if (req.files) {
            var file = req.files.file
            var uploadedPoster = file.name

            file.mv('./ImagePoster/'+uploadedPoster, function (err) {
                if (err) {
                    res.send(err)
                } 
                else { res.send("File Uploaded")}
             })
           }
           else { res.send("Fail : no file Uploaded")}

           let posterUpload = await media.posterUpload(req.body.name, uploadedPoster)
            res.json(checkAndChange(posterUpload))
        })

// routes concernant les awards
    RoutesAward.route('/getAllAwards')
        .get(async (req, res) => {
            let getAllAwards = await award.getAllAwards()
            res.json(checkAndChange(getAllAwards))
        })
    RoutesAward.route('/getAwardsByID/:id')
        .get(async (req, res) => {
            let getAwardById = await award.getAwardById(req.params.id)
            res.json(checkAndChange(getAwardById))
        })
    RoutesAward.route('/addAwards')
        .post(async(req,res)=>{
            let addAward = await award.addAward(req.body.awardName)
            res.json(checkAndChange(addAward))
        })
    RoutesAward.route('/deleteAwards/:id')
        .delete(async(req,res)=>{
            let deleteAwards = await award.deleteAward(req.params.id)
            res.json(checkAndChange(deleteAwards))
        })
    RoutesAward.route('/updateAwards')
        .put(async(req,res)=>{
            let updateAwards = await award.updateAward(req.body.name,req.body.newName)
            res.json(checkAndChange(updateAwards))
        })
// routes concernant les invitations
    RoutesInvitation.route('/addInvitation')
        .post(async (req, res) => {
            let addInvitation = await invitation.addInvitation(req.body.first_name,req.body.last_name,req.body.email,req.body.role, req.body.invited)
            res.json(checkAndChange(addInvitation))
        })
    RoutesInvitation.route('/addInvitationByMail')
        .post(async (req, res) => {
            let addInvitation = await invitation.addInvitationByMail(req.body.email, 2)
            res.json(checkAndChange(addInvitation))
        })
    RoutesInvitation.route('/getAllInvitation')
        .get(async (req, res) => {
            let getAllInvitation = await invitation.getAllInvitation()
            res.json(checkAndChange(getAllInvitation))
        })

        RoutesInvitation.route('/getIdWithEmail')
        .get(async (req, res) => {
            let getIdWithEmail = await invitation.getIdWithEmail(req.body.email)
            res.json(checkAndChange(getIdWithEmail))
        })

    RoutesInvitation.route('/getAllInvitationsNotInvited')
        .get(async (req, res) => {
        let getAllInvitationsNotInvited = await invitation.getAllInvitationsNotInvited()
            res.json(checkAndChange(getAllInvitationsNotInvited))
        })

    RoutesInvitation.route('/sendValidInvitation')
        .post(async (req, res) => {
            let sendmail = await invitation.sendMail(req.body.email)
            res.json(checkAndChange(sendmail))
        })

    RoutesInvitation.route('/getInvitationId/:id')
        .get(async (req, res) => {
            let Invitation = await invitation.getInvitationId(req.params.id)
            res.json(checkAndChange(Invitation))
        })
    RoutesInvitation.route('/deleteInvitation/:id')
        .delete(async(req,res)=>{
            let deleteInvitation = await invitation.deleteInvitation(req.params.id)
            res.json(checkAndChange(deleteInvitation))
        })
    RoutesInvitation.route('/updateInvitation')
        .put(async(req,res)=>{
            let updateInvitation = await invitation.updateInvitation(req.body.first_name,req.body.last_name,req.body.email,req.body.role,req.body.isActive,req.body.invited)
            res.json(checkAndChange(updateInvitation))
        })

        // routes concernant l'event
        RoutesEvent.route('/getAllEvents')
        .get(async (req, res) => {
            let getAllEvents = await event.getAllEvents()
            res.json(checkAndChange(getAllEvents))
        })

        RoutesEvent.route('/getEventByID/:id')
        .get(async (req, res) => {
            let getEventById = await event.getEventById(req.params.id)
            res.json(checkAndChange(getEventById))
        })

        RoutesEvent.route('/addEvent')
        .post(async (req, res) => {
            let addEvent = await event.addEvent(req.body.name,req.body.startDate,req.body.endDate,req.body.availableViewDate, req.body.theme)
            res.json(checkAndChange(addEvent))
        })

        RoutesEvent.route('/deleteEvent/:id')
        .delete(async(req,res)=>{
            let deleteEvent = await event.deleteEvent(req.params.id)
            res.json(checkAndChange(deleteEvent))
        })

        RoutesEvent.route('/updateEvent')
        .put(async(req,res)=>{
            let updateEvent = await event.updateEvent(req.body.name,req.body.startDate,req.body.endDate,req.body.availableViewDate,req.body.theme)
            res.json(checkAndChange(updateEvent))
        })

    //ici on concataine nos differente string et on les stock dans la variable RoutesRole pour eviter dans le cas de plusieurs route qui commenceraient
    // par le même chemin d'avoir a tout retapper à chaques fois, il suffira ensuite de rajouter uniquement la sous-route désiré
    app.use(config.rootAPI + 'role', RoutesRole)//
    app.use(config.rootAPI + 'award', RoutesAward)//
    app.use(config.rootAPI + 'category', RoutesCategory)//
    app.use(config.rootAPI + 'user', RoutesUser)
    app.use(config.rootAPI + 'media', RoutesMedia)//
    app.use(config.rootAPI + 'invitation', RoutesInvitation)//
    app.use(config.rootAPI + 'event', RoutesEvent)//
    console.log('en ecoute sur le port' + process.env[`${process.env.MODE}_PORT`])
}).catch((err) => {
    console.log(err.message)
})
