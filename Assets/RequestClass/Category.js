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
    getCategoryById(id){
        return new Promise((next)=>{
            this.db.query('SELECT * FROM category WHERE id = ?',[id])
                .then((result)=> next(result))
                .catch((err)=>next(err))
        })
    }
    addCategory(categoryName){
        return new Promise((next)=>{
          if(categoryName != undefined && categoryName.trim() != ''){
              categoryName = categoryName.trim()
              this.db.query('SELECT name FROM category WHERE name =?',[categoryName])
                  .then((result)=>{
                      console.log(result[0])
                      if(result[0] !== undefined){
                          next(new Error('Cette categorie existe déjà'))
                      }else{
                          this.db.query('INSERT INTO category (name)VALUES (?)',[categoryName])
                              .then((res)=>{
                                  next('La categorie: '+ categoryName +' a bien été ajoutée' )
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
    updateCategory(name,newName){
        return new Promise((next)=>{
            if (name != undefined && name.trim() != '') {

                name = name.trim()
                this.db.query('SELECT * FROM category WHERE name = ?', [name])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            this.db.query('UPDATE category SET name = ? WHERE name = ?', [newName,name])
                                .then((res)=> next(res))
                                .catch((err)=>next(err))
                        }else{
                            next(new Error('cette categorie n\'existe pas'))
                        }
                    })
            }else{
                next(new Error('pas de valeur'))
            }
        })
    }
    deleteCategory(idCategory){
        return new Promise((next)=> {
            console.log(idCategory)
            this.db.query('SELECT * FROM category WHERE id = ?',[idCategory])
                .then((result) => {
                    console.log('1er then')
                    if (result[0] !== undefined) {
                        this.db.query('DELETE FROM category WHERE id =?',[idCategory])
                            .then((result2) => {
                               next('la categorie'+result.name+'a bien été supprimée')
                            }).catch((err) => {
                            next(err)
                        })
                    }else{
                        next(new Error('Cette categorie n\'existe pas'))
                    }
                }).catch(() => {
                new Error('cette category n\'existe pas')
            })
        })
    }
}

module.exports = Category
