
//c'est la qu'on va faire nos requetes en base de données
let Role = class {
//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
    }
//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllRoles(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM role  ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
    getRoleById(id){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM role WHERE id = ? ',[id])
                .then((result)=> next(result[0]))
                .catch((err)=>next(err))
        })
    }
    addRole(roleName){
        return new Promise((next)=>{
            if(roleName != undefined && roleName.trim() != ''){
                roleName = roleName.trim()
                this.db.query('SELECT name FROM role WHERE name =?',[roleName])
                    .then((result)=>{
                        console.log(result[0])
                        if(result[0] !== undefined){
                            next(new Error('Ce role existe déjà'))
                        }else{
                            this.db.query('INSERT INTO role (name)VALUES (?)',[roleName])
                                .then((res)=>{
                                    next('Le role: '+ roleName +' a bien été ajoutée' )
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
    updateRole(name,newName){
        return new Promise((next)=>{
            if (name != undefined && name.trim() != '') {

                name = name.trim()
                this.db.query('SELECT * FROM role WHERE name = ?', [name])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            this.db.query('UPDATE role SET name = ? WHERE name = ?', [newName,name])
                                .then((res)=> next(res))
                                .catch((err)=>next(err))
                        }else{
                            next(new Error('ce role n\'existe pas'))
                        }
                    })
            }else{
                next(new Error('pas de valeur'))
            }
        })
    }
    deleteRole(idRole){
        return new Promise((next)=> {
            this.db.query('SELECT * FROM role WHERE id = ?',[idRole])
                .then((result) => {
                    if (result[0] !== undefined) {
                        this.db.query('DELETE FROM role WHERE id =?',[idRole])
                            .then((result2) => {
                                next('le role'+result.name+'a bien été supprimé')
                            }).catch((err) => {
                            next(err)
                        })
                    }else{
                        next(new Error('ce role n\'existe pas'))
                    }
                }).catch((err) => {
                next(err)
            })
        })
    }
    getRoleWithUserID(id){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM role LEFT JOIN user_role ON role.id = user_role.id_role WHERE user_role.id_user = ?',[id])
                .then((res)=>{
                    next({idRole:res[0].id,roleName:res[0].name})
                }).catch((err)=>{
                    next(err)
            })
        })
    }
}

module.exports = Role
