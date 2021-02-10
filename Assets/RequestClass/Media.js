//c'est la qu'on va faire nos requetes en base de données
let Media = class {
//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes){
        this.db = _dbCineAlpes
    }
//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllMedias(){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM media  ')
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
    getMediaById(id){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM media WHERE id = ?',[id])
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
    addMedia(MediaName,description,link,poster){
        return new Promise((next)=>{
            if(MediaName != undefined && MediaName.trim() != ''){
                MediaName = MediaName.trim()
                this.db.query('SELECT name FROM media WHERE name =?',[MediaName])
                    .then((result)=>{
                        if(result[0] !== undefined){
                            next(new Error('Ce media existe déjà'))
                        }else{
                            this.db.query('INSERT INTO media (name,description,link,poster)VALUES (?,?,?,?)',[MediaName,description,link,poster])
                                .then((res)=>{
                                    next('Le media: '+ MediaName+' a bien été ajoutée' )
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

    getMediaWithUserID(id){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM user LEFT JOIN user_media ON role.id = user_media.id_media WHERE user_media.id_user = ?',[id])
                .then((res)=>{
                    next({idRole:res[0].id,roleName:res[0].name})
                }).catch((err)=>{
                    next(err)
            })
        })
    }
    
    updateMedia(name,newName,description,link,poster,isVisible,score){
        return new Promise((next)=>{
            if (name != undefined && name.trim() != '') {

                name = name.trim()
                this.db.query('SELECT * FROM media WHERE name = ?', [name])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            this.db.query('UPDATE media SET name = ? ,description = ?, link = ?,poster=?, isVisible=?, score=?  WHERE name = ?',
                                [newName,description,link,poster,isVisible,score,name])
                                .then((res)=> next(res))
                                .catch((err)=>next(err))
                        }else{
                            next(new Error('ce media n\'existe pas'))
                        }
                    })
            }else{
                next(new Error('pas de valeur'))
            }
        })
    }
    deleteMedia(idMedia){
        return new Promise((next)=> {
            this.db.query('SELECT * FROM media WHERE id = ?',[idMedia])
                .then((result) => {
                    if (result[0] !== undefined) {
                        this.db.query('DELETE FROM media WHERE id =?',[idMedia])
                            .then((result2) => {
                                next('le media'+result.name+'a bien été supprimée')
                            }).catch((err) => {
                            next(err)
                        })
                    }else{
                        next(new Error('Ce media n\'existe pas'))
                    }
                }).catch(() => {
                new Error('ce media n\'existe pas')
            })
        })
    }   
}


module.exports = Media
