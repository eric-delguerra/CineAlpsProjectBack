
const bcrypt = require('bcrypt');
const RoleClass = require('./Role')

//c'est la qu'on va faire nos requetes en base de données

let User = class {

//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
        this.role = new RoleClass(this.db)
    }
//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllUser(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM user  ')
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
                                  next('User '+ email +' a bien été ajouté' )
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
