var moment = require('moment');
var nodemailer = require('nodemailer');
require('dotenv').config();
moment().format()
//c'est la qu'on va faire nos requetes en base de données
let Invitation = class {


//on appel notre class dans un autre fichier et on lui passe en parametres la base de données sur laquelle on travail
    constructor(_dbCineAlpes) {
        this.db = _dbCineAlpes

    }

//le declaration se fait sous forme de promesse avec le parametre next qui est une fonction qui renverra le resultat que ce soit dans le .then ou dans le .catch
    getAllInvitation() {
        return new Promise((next) => {
            this.db.query('SELECT * FROM invitation  ')
                .then((result) => next(result))
                .catch((err) => next(err))
        })
    }

    getAllInvitationsNotInvited() {
        return new Promise((next) => {
            this.db.query('SELECT * FROM invitation WHERE invited = 0 ')
                .then((result) => next(result))
                .catch((err) => next(err))
        })
    }

    getInvitationId(id) {
        return new Promise((next) => {
            this.db.query('SELECT * FROM invitation WHERE id = ?', [id])
                .then((result) => next(result))
                .catch((err) => next(err))
        })
    }

    getIdWithEmail(email) {
        return new Promise((next) => {
            this.db.query('SELECT id FROM invitation WHERE email = ?', [email])
                .then((result) => next(result))
                .catch((err) => next(err))
        })
    }

    getAllWithEmail(email) {
        return new Promise((next) => {
            this.db.query('SELECT * FROM invitation WHERE email = ?', [email])
                .then((result) => next(result))
                .catch((err) => next(err))
        })
    }

    addInvitationByMail(email, role) {
        return new Promise((next) => {
            let d = new Date();
            d.setMonth(d.getMonth() + 6);
            this.db.query('INSERT INTO invitation (email, role, end_date)VALUES (?,?, ?)', [email, role, d])
                .then((result) => next(result))
                .catch((err) => next(err))
        })
    }

    sendMail(mail) {
        return new Promise((next) => {
            var mailsend = false
            if (mail !== undefined) {
                const myIdInvitation = Promise.resolve(this.getAllWithEmail(mail))
                myIdInvitation.then((idInvitation) => {

                    let myURL

                    if (idInvitation[0].role !== 3) {
                        myURL = new URL('http://localhost:3000/newuser/' + idInvitation[0].id);
                    } else {
                        myURL = new URL('http://localhost:3000/newparticipant/' + idInvitation[0].id);
                    }

                    if (idInvitation[0].invited === 0) {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.email,
                                pass: process.env.password
                            }
                        });
                        var mailOptions = {
                            from: 'boitedetest38@gmail.com',
                            to: mail,
                            subject: 'CineAlpesFestival - Formulaire d/inscription',
                            text: 'validation',
                            html: `Bonjour ${idInvitation[0].first_name ? idInvitation[0].first_name : null} !
                                             
                                            <h1> Vous avez été invité au festival CineAlpes 2021 ! </h1>
                                             
                                          <p>   Voila le lien pour remplir le formulaire, ${myURL.href} </p>
                                             
                                             <img style="width:30%" src="https://cdn.discordapp.com/attachments/806914427986247691/809375180127862804/logo_Multimedialpes.png"> </img>
                                             `
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                                mailsend = true
                            }
                        });

                    } else {
                        next(new Error('Déja invité'))
                    }

                    let changeInvite = Promise.resolve(this.updateInvitation(idInvitation[0].first_name, idInvitation[0].last_name, idInvitation[0].email, idInvitation[0].role, idInvitation[0].isActive, 1))
                    changeInvite.then((res) => console.log(res))
                        .catch((err) => console.log(err))

                })

            }

        })
    }

    addInvitation(first_name, last_name, email, role, invited) {

        var texteAffiché = "Formulaire";

        return new Promise((next) => {

            if (email != undefined && email.trim() != '' && first_name != undefined && first_name.trim() != '') {
                email = email.trim()
                this.db.query('SELECT email FROM invitation WHERE email =?', [email])
                    .then((result) => {
                        let dt = new Date()
                        dt.setMonth(6)

                        if (result[0] !== undefined) {
                            next(new Error('Cette invitation existe déjà'))
                        } else {

                            this.db.query('INSERT INTO invitation (first_name,last_name,email,end_date,role, invited)VALUES (?,?,?,?,?,?)', [first_name, last_name, email, dt, role, invited])
                                .then((res) => {
                                    next('L\'invitation concernant : ' + email + ' a bien été ajoutée')

                                    const myIdInvitation = Promise.resolve(this.getIdWithEmail(email))
                                    myIdInvitation.then((idInvitation) => {

                                        let myURL

                                        if (role !== 3) {
                                            myURL = new URL('http://localhost:3000/newuser/' + idInvitation[0].id);
                                        } else {
                                            myURL = new URL('http://localhost:3000/newparticipant/' + idInvitation[0].id);
                                        }

                                        if (invited == 0) {
                                            const transporter = nodemailer.createTransport({
                                                service: 'gmail',
                                                auth: {
                                                    user: process.env.email,
                                                    pass: process.env.password
                                                }
                                            });
                                            var mailOptions = {
                                                from: 'boitedetest38@gmail.com',
                                                to: email,
                                                subject: 'CineAlpesFestival - Formulaire d/inscription',
                                                text: 'validation',
                                                html: `Bonjour ${first_name} !
                                             
                                            <h1> Vous avez été invité au festival CineAlpes 2021 ! </h1>
                                             
                                          <p>   Voila le lien pour remplir le formulaire, ${myURL.href} </p>
                                             
                                             <img style="width:30%" src="https://cdn.discordapp.com/attachments/806914427986247691/809375180127862804/logo_Multimedialpes.png"> </img>
                                             `
                                            };

                                            transporter.sendMail(mailOptions, function (error, info) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            });
                                            invited = 1
                                        } else {
                                            next(new Error('Déja invité'))
                                        }

                                    })


                                }).catch((err) => {
                                next(err)
                            })
                        }
                    }).catch((err) => {
                    next(err)
                })

            } else {
                next(new Error('pas de valeur nom'))
            }

        })
    }

    updateInvitation(first_name, last_name, email, role, isActive, invited) {
        return new Promise((next) => {
            if (email != undefined && email.trim() != '') {

                email = email.trim()
                this.db.query('SELECT * FROM invitation WHERE email = ?', [email])
                    .then((result) => {
                        if (result[0] !== undefined) {
                            let dt = new Date()
                            dt.setMonth(6)
                            this.db.query('UPDATE invitation SET first_name=?,last_name=?,email=?,end_date=?,role=?,isActive=?,invited=?  WHERE email = ?',
                                [first_name, last_name, email, dt, role, isActive, invited, email])
                                .then((res) => next(res))
                                .catch((err) => next(err))
                        } else {
                            next(new Error('ce media n\'existe pas'))
                        }
                    })
            } else {
                next(new Error('manque des valeurs'))
            }
        })
    }

    deleteInvitation(idMedia) {
        return new Promise((next) => {
            this.db.query('SELECT * FROM invitation WHERE id = ?', [idMedia])
                .then((result) => {
                    if (result[0] !== undefined) {
                        this.db.query('DELETE FROM invitation WHERE id =?', [idMedia])
                            .then((result2) => {
                                next('l\'invitation pour ' + result[0].first_name + 'a bien été supprimée')
                            }).catch((err) => {
                            next(err)
                        })
                    } else {
                        next(new Error('Cette invitation n\'existe pas'))
                    }
                }).catch(() => {
                new Error('Cette invitation n\'existe pas')
            })
        })
    }
}

module.exports = Invitation
