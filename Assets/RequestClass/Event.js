//c'est la qu'on va faire nos requetes en base de données
let Event = class {
    //on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
        constructor(_dbCineAlpes){
            this.db = _dbCineAlpes
        }
    //le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
        getAllEvents(){
            return new Promise((next)=>{
                this.db.query('SELECT * FROM event  ')
                    .then((result)=> next(result))
                    .catch((err)=>next(err))
            })
        }
       
        addEvent(name, startDate, endDate, availableViewDate, theme){
            return new Promise((next)=>{
                if(name != undefined && name.trim() != ''){
                    name = name.trim()
                    this.db.query('SELECT name FROM event WHERE name =?',[name])
                        .then((result)=>{
                            if(result[0] !== undefined){
                                next(new Error('Cet evenement existe déjà'))
                            }else{
                                this.db.query('INSERT INTO event (name, startDate, endDate, availableViewDate, theme)VALUES (?,?,?,?,?)',[name, startDate, endDate, availableViewDate, theme])
                                    .then((res)=>{
                                        next('Evenement: '+ name+' a bien été ajoutée' )
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

        updateEvent(name,startDate,endDate,availableViewDate,theme){
            return new Promise((next)=>{
                if(name != undefined && name.trim() != '' && startDate != undefined && startDate.trim() != '') {
                    name = name.trim()
                    this.db.query('SELECT * FROM event WHERE name = ?', [name])
                        .then((result) => {
                            if (result[0] !== undefined) {
                                this.db.query('UPDATE event SET name=?, startDate=?, endDate=?, availableViewDate=?, theme=?  WHERE name = ?',
                                    [name,startDate,endDate,availableViewDate,theme,name])
                                    .then((res)=> next(res))
                                    .catch((err)=>next(err))
                            }else{
                                next(new Error('cet event n\'existe pas'))
                            }
                        })
                }else{
                    next(new Error('manque des valeurs'))
                }
            })
        }
        
        deleteEvent(idEvent){
            return new Promise((next)=> {
               
                this.db.query('SELECT * FROM event WHERE id = ?',[idEvent])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            this.db.query('DELETE FROM event WHERE id =?',[idEvent])
                                .then((result2) => {
                                   next('Evenement' +result.name+'a bien été supprimée')
                                }).catch((err) => {
                                next(err)
                            })
                        }else{
                            next(new Error('Cet Evenement n\'existe pas'))
                        }
                    }).catch(() => {
                    new Error('Cet Evenement n\'existe pas')
                })
            })
        }
    }
    
    module.exports = Event
    