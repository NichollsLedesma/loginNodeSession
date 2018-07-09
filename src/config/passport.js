const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = (passport)=> {
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user);
        });
    });
    // signup
    passport.use('local-signup', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done)=>{
        User.findOne({'local.email': email},(err, user)=>{
            if (err) {return done(err)}; 
            if (user) {
                return done(null, false, req.flash('signupMassage', 'Ya se encuentra registrado.'));
            }else{
                var newUser=new User();
                newUser.local.email=email;
                newUser.local.password=newUser.generateHash(password);
                newUser.save((err)=>{ 
                    if(err){ throw err; } 
                    return done(null, newUser); 
                });
            }
        });
    }));
    // login
    passport.use('local-login', new localStrategy({
        usernameField: 'email', // campo del form
        passwordField: 'password',
        passReqToCallback: true
    },
    (req, email, password, done)=>{
        User.findOne({'local.email': email}, (err, user)=>{
            if (err) return done(err); 
            if (!user) {  return done(null, false, req.flash('loginMassage', 'El usuario no ha sido encontrado.'))  }
            if (!user.validatePassword(password)){ return done(null, false, req.flash('loginMassage', 'Contraseña erronea.')) }
            return done(null, user);
        });
    }));
}