
const bcrypt = require('bcrypt');
const RoleClass = require('./Role')
const MediaClass = require('./Media');
const CategoryClass = require('./Category')
const { promises } = require('fs');
//c'est la qu'on va faire nos requetes en base de données

let User = class {

//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
        this.role = new RoleClass(this.db)
        this.media = new MediaClass(this.db)
        this.category = new CategoryClass(this.db)
    }
//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllUser(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM user  ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }

    getUserMedia(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM user_media')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
    
    getNumberParticipants(){
        return new Promise((next)=>{
            this.db.query('SELECT COUNT (*) FROM user_role WHERE id_role = 3 ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }

    getNumberPublic(){
        return new Promise((next)=>{
            this.db.query('SELECT COUNT (*) FROM user_role WHERE id_role = 2 ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }

    getNumberVotes(){
        return new Promise((next)=>{
            this.db.query('SELECT COUNT (*) FROM user WHERE asVoted = 1 ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }

    getUserById(id){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM user WHERE id = ?',[id])
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }

    addUserMedia(data, hashedPassword){
        return new Promise((next)=>{

            if(data.mediaName != undefined && data.mediaName.trim() != ''){
                data.mediaName = data.mediaName.trim()
                this.db.query('SELECT name FROM media WHERE name =?',[data.mediaName])
                    .then((result)=>{
                        if(result[0] !== undefined){
                            next(new Error('Ce media existe déjà'))
                        }else{
                           /* var myCategoryId =  this.category.getIdCategoryByName(data.category)
                            console.log(myCategoryId)*/

                            this.db.query('INSERT INTO media (name,description,link,poster,isVisible, score, technique, creation_date, realisationCondition)VALUES (?,?,?,?,?,?,?,?,?)',[data.mediaName, data.description, data.link, data.poster, data.isVisible, data.score, data.technique, data.creation_date, data.realisationCondition])
                                .then((media)=>{
                                    
                                const myIdUser =  Promise.resolve(this.addUser(data.first_name, data.last_name, data.email, hashedPassword, data.phone_number))
                                myIdUser.then((idUser)=>{

                                    this.db.query('INSERT INTO user_media (id_media, id_user) VALUES (?,?) ',[media.insertId, idUser.insertId])
                                    .then((param)=> {
                                        
                                        this.db.query('INSERT INTO user_role (id_role, id_user) VALUES (?,?) ',[data.role, idUser.insertId])
                                        .then(()=> {
                                            console.log("insertion User_role reussi")
                                        
                                            this.db.query('INSERT INTO category_media (id_category, id_media) VALUES (?,?)',[data.category,media.insertId])
                                            .then(()=> {

                                            })
                                            .catch((err)=>console.log(err))
                                        
                                        })
                                        .catch((err)=>{console.log(err)})
                                        
                                        console.log("insertion user_media reussi")})
                                    .catch((err)=>{console.log(err)})

                            
                                 }).catch((err)=> {
                                     console.log(err)
                                 })  
                                 
                                  next('Le media: '+ data.mediaName+' a bien été ajoutée' )
                                }).catch((err)=>{
                                next(err)
                            })
                        }
                    }).catch((err)=>{
                    next(err)
                })
            }else{
                next(new Error('pas de valeur nom'))
            }
        })
    }

    addUser( first_name, last_name, email, hashedPassword, phone_number, created_at, last_connection, asVoted){
        return new Promise((next)=>{
          if(email != undefined && email.trim() != ''){
              email = email.trim()
              this.db.query('SELECT email FROM user WHERE email =?',[email])
                  .then((result)=>{
                      console.log(result[0])
                      if(result[0] !== undefined){
                          next(new Error('Cette email existe déjà'))
                      }else{
                          let createUserAt = new Date()

                          this.db.query('INSERT INTO user (first_name, last_name, email, password, phone_number, created_at, last_connection)VALUES (?,?,?,?,?,?,?)',[first_name, last_name, email, hashedPassword, phone_number, createUserAt, createUserAt])
                              .then((res)=>{
                                  next(res)
                              }).catch((err)=>{
                                  next(err)
                          })                       
                      }
                  }).catch((err)=>{
                      next(err)
              })
          }else{
              next(new Error('pas de valeur nom'))
          }
        })
    }

    deleteUser(email){
        return new Promise((next)=> {
            console.log(email)
            this.db.query('SELECT * FROM User WHERE email = ?',[email])
                .then((result) => {
                    console.log('1er then')
                    if (result[0] !== undefined) {
                        this.db.query('DELETE FROM User WHERE email =?',[email])
                            .then((result2) => {
                               next('user'+result.name+'a bien été supprimée')
                            }).catch((err) => {
                            next(err)
                        })
                    }else{
                        next(new Error('Ce user n\'existe pas'))
                    }
                }).catch(() => {
                new Error('Ce User n\'existe pas')
            })
        })
    }

    updateUser(first_name,last_name,email,password,phone_number, created_at, last_connection, asVoted){
        return new Promise((next)=>{
            if(email != undefined && email.trim() != '' && password != undefined && password.trim() != '') {
                email = email.trim()
                this.db.query('SELECT * FROM user WHERE email = ?', [email])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            this.db.query('UPDATE user SET first_name=?, last_name=?, email=?, password=?, phone_number=?, created_at=?, last_connection=?, asVoted=? WHERE email = ?',
                                [first_name,last_name,email,password,phone_number, created_at, last_connection, asVoted, email])
                                .then((res)=> next(res))
                                .catch((err)=>next(err))
                        }else{
                            next(new Error('ce user n\'existe pas'))
                        }
                    })
            }else{
                next(new Error('manque des valeurs'))
            }
        })
    }

   checkAuth(email, password) {
        return new Promise((next) => {
            this.db.query('SELECT * FROM user WHERE email = ? ', [email])
                .then((result) => {
                    if (result[0] !== undefined) {
                        const user = Promise.all([this.getUserById(result[0].id),this.role.getRoleWithUserID(result[0].id)])
                            user.then((values)=>{
                            bcrypt.compare(password,result[0].password, function(err, result) {
                                if(result === true){
                                    console.log(values )
                                    next({
                                        id:values[0][0].id,
                                        first_name: values[0][0].first_name,
                                        last_name: values[0][0].last_name,
                                        email: values[0][0].email,
                                        password: values[0][0].password,
                                        phone_number: values[0][0].phone_number,
                                        created_at: values[0][0].created_at,
                                        last_connection: values[0][0].last_connection,
                                        asVoted:values[0][0].asVoted,
                                        idRole:values[1].idRole,
                                        roleName:values[1].roleName
                                    })
                                }else{
                                    next(new Error('mot de passe incorect'))
                                }
                            });
                        })

                    } else {
                        next(new Error('cet utilisateur n\'existe pas'))
                    }
                })
                .catch((err) => next(err))
        })
    }

    getUserNumberByRole(){
        let UserByRole = []
        return new Promise((next)=>{
            this.db.query('SELECT * FROM role WHERE name =?  OR name=?',['public','participant'])
                .then((result)=>{
                    console.log(result)
                        this.db.query('SELECT COUNT(*) FROM user_role WHERE id_role=?  ',[result[0].id])
                            .then((res)=>{
                                UserByRole.push({role:result[0].name,nombre:res[0]})
                                this.db.query('SELECT COUNT(*) FROM user_role WHERE id_role=?  ',[result[1].id])
                                    .then((res2)=>{
                                        console.log(res2)
                                        UserByRole.push({role:result[1].name,nombre:res2[0]})
                                        next(UserByRole)
                                    })
                            }).catch((err)=>{
                            next(err)
                        })
                    console.log('UserByRole')
                }).catch((err)=>next(err))
        })
    }
}

module.exports = User
