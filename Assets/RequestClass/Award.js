//c'est la qu'on va faire nos requetes en base de données
let Award = class {
//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
    }
//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllAwards(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM award  ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
    getAwardById(id){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM award WHERE id = ?',[id])
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
    addAward(awardName){
        return new Promise((next)=>{
            if(awardName != undefined && awardName.trim() != ''){
                awardName = awardName.trim()
                this.db.query('SELECT name FROM award WHERE name =?',[awardName])
                    .then((result)=>{
                        if(result[0] !== undefined){
                            next(new Error('Ce media existe déjà'))
                        }else{
                            this.db.query('INSERT INTO award (name)VALUES (?)',[awardName])
                                .then((res)=>{
                                    next('Le prix: '+ awardName+' a bien été ajoutée' )
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
    updateAward(name,newName){
        return new Promise((next)=>{
            if (name != undefined && name.trim() != '') {

                name = name.trim()
                this.db.query('SELECT * FROM award WHERE name = ?', [name])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            this.db.query('UPDATE award SET name = ? WHERE name = ?', [newName,name])
                                .then((res)=> next(res))
                                .catch((err)=>next(err))
                        }else{
                            next(new Error('ce prix n\'existe pas'))
                        }
                    })
            }else{
                next(new Error('pas de valeur'))
            }
        })
    }
    deleteAward(idAward){
        return new Promise((next)=> {
            this.db.query('SELECT * FROM award WHERE id = ?',[idAward])
                .then((result) => {
                    if (result[0] !== undefined) {
                        this.db.query('DELETE FROM award WHERE id =?',[idAward])
                            .then((result2) => {
                                next('le prix'+result.name+'a bien été supprimée')
                            }).catch((err) => {
                            next(err)
                        })
                    }else{
                        next(new Error('Ce prix n\'existe pas'))
                    }
                }).catch(() => {
                new Error('ce media n\'existe pas')
            })
        })
    }
}

module.exports = Award
