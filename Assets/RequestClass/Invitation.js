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
}

module.exports = Invitation