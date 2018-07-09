module.exports = (app, passport) => {
    app.get('/', (req, res)=>{
        res.render('index');
    });
    app.get('/login', (req, res)=>{
        res.render('login', {
            massage: req.flash('loginMassage')
        });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));
    app.get('/signup', (req, res)=>{
        res.render('signup', {
            massage: req.flash('signupMassage')
        });
    });
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));
    app.get('/profile', isLoggedIn, (req, res)=>{
        res.render('profile', {
            user: req.user
        });
    });
    app.get('/logout', (req, res)=>{
        req.logout();
        res.redirect('/');
    });
}
isLoggedIn=(req, res, next)=>{
    if (req.isAuthenticated()){ return next();}
    return res.redirect('/');
}