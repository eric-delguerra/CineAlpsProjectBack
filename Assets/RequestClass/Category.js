//c'est la qu'on va faire nos requetes en base de données
let Category = class {
//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
    }
//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllCategories(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM category  ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
}

module.exports = Category