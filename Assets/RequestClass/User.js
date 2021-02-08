//c'est la qu'on va faire nos requetes en base de données
let User = class {
//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
    }
//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllUser(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM user  ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
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
