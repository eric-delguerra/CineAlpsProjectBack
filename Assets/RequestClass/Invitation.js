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

    addInvitation( first_name, last_name, email, end_date, role, isActive, invited){
        return new Promise((next)=>{
          if(email != undefined && email.trim() != ''){
              email = email.trim()
              this.db.query('SELECT email FROM invitation WHERE email =?',[email])
                  .then((result)=>{
                      console.log(result[0])
                      if(result[0] !== undefined){
                          next(new Error('Cet email existe déjà'))
                      }else{
                          this.db.query('INSERT INTO invitation ( first_name, last_name, email, end_date, role, isActive, invited)VALUES (?)',[ first_name, last_name, email, end_date, role, isActive, invited])
                              .then((res)=>{
                                  next('Invitation '+ email +' a bien été ajouté' )
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
}

module.exports = Invitation