var moment = require('moment');
moment().format()
//c'est la qu'on va faire nos requetes en base de données
let Invitation = class {

//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
    }
//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllInvitation(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM invitation  ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }

    getInvitationId(id){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM invitation WHERE id = ?',[id])
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
    addInvitation(first_name,last_name,email,role){
        return new Promise((next)=>{
            if(email != undefined && email.trim() != '' && first_name != undefined && first_name.trim() != ''){
                email = email.trim()
                this.db.query('SELECT email FROM invitation WHERE email =?',[email])
                    .then((result)=>{
                        let dt = new Date()
                        dt.setMonth(6)

                        if(result[0] !== undefined){
                            next(new Error('Cette invitation existe déjà'))
                        }else{
                            this.db.query('INSERT INTO invitation (first_name,last_name,email,end_date,role)VALUES (?,?,?,?,?)',[first_name,last_name,email,dt,role])
                                .then((res)=>{
                                    next('L\'invitation cocernant : '+ email+' a bien été ajoutée' )
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
    addInvitationByMail(email,role){
        return new Promise((next)=>{
            if(email != undefined && email.trim() != ''){
                email = email.trim()
                this.db.query('SELECT email FROM invitation WHERE email =?',[email])
                    .then((result)=>{
                        let dt = new Date()
                        dt.setMonth(6)

                        if(result[0] !== undefined){
                            next(new Error('Cette invitation existe déjà'))
                        }else{
                            this.db.query('INSERT INTO invitation (email,end_date,role)VALUES (?,?,?)',[email,dt,role])
                                .then((res)=>{
                                    next('L\'invitation cocernant : '+ email+' a bien été ajoutée' )
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
    updateInvitation(first_name,last_name,email,role,isActive,invited){
        return new Promise((next)=>{
            if(email != undefined && email.trim() != '' && first_name != undefined && first_name.trim() != '') {

                email = email.trim()
                this.db.query('SELECT * FROM invitation WHERE email = ?', [email])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            let dt = new Date()
                            dt.setMonth(6)
                            this.db.query('UPDATE invitation SET first_name=?,last_name=?,email=?,end_date=?,role=?,isActive=?,invited=?  WHERE email = ?',
                                [first_name,last_name,email,dt,role,isActive,invited,email])
                                .then((res)=> next(res))
                                .catch((err)=>next(err))
                        }else{
                            next(new Error('ce media n\'existe pas'))
                        }
                    })
            }else{
                next(new Error('manque des valeurs'))
            }
        })
    }
    deleteInvitation(idMedia){
        return new Promise((next)=> {
            this.db.query('SELECT * FROM invitation WHERE id = ?',[idMedia])
                .then((result) => {
                    if (result[0] !== undefined) {
                        this.db.query('DELETE FROM invitation WHERE id =?',[idMedia])
                            .then((result2) => {
                                next('l\'invitation pour '+result[0].first_name+'a bien été supprimée')
                            }).catch((err) => {
                            next(err)
                        })
                    }else{
                        next(new Error('Cette invitation n\'existe pas'))
                    }
                }).catch(() => {
                new Error('Cette invitation n\'existe pas')
            })

        })
    }
}

module.exports = Invitation
