var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../models/user');

module.exports = function(app, passport){
    
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://example.com/auth/Facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function(acessToken, refreshToken, profile, done){
        //User.findOrCreate(..., function(err, user){
           // if(err){ return done(err); }
            //done(null, user);
      //  });
    }                                      
));
    return passport;
}