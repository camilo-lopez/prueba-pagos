const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../database')
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contrasena',
    passReqToCallback: true
}, async( req, correo, contrasena, done ) => {
    const fila = await db.query('SELECT * FROM usuarios WHERE correo = ?',[correo]);
    if (fila.length > 0){
        const user = fila[0];
        const validPassword = await helpers.comparacontra(contrasena, user.contrasena)
        if(validPassword){
            done(null, user, req.flash('success','Bienvenido '+user.nombre));
        }else{
            done(null, false, req.flash('message','Contraseña invalida'));
        }
    }else{
        return done(null, false, req.flash('message','Correo no válido'));
    }
}));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'contrasena',
    passReqToCallback: true
   
    
}, async (req, correo, contrasena, done) => {
 const nuevoUsuario = {
     rut : req.body.rut,
     correo,
     nombre: req.body.nombre,
     apellidop: req.body.apellidop,
     apellidom: req.body.apellidom,
     contrasena 
 };
    const existe = await db.query ('SELECT * FROM usuarios WHERE rut = ? OR correo = ? ',[nuevoUsuario.rut, correo]);
    if(existe.length <= 0 ){
    nuevoUsuario.contrasena = await helpers.encriptar(contrasena)
    const result = await db.query ('INSERT INTO usuarios SET ?',[nuevoUsuario]);
    nuevoUsuario.id = result.insertId;
    return done(null, nuevoUsuario);
    
}else{
    done(null, false, req.flash('message','Correo o rut ya registrados!'));
}
}));

passport.serializeUser((user, done) => {
    done(null, user.id);    
});

passport.deserializeUser( async (id, done) => {
    const filas = await db.query('SELECT * FROM usuarios WHERE id = ?',[id]);
    done(null, filas[0]);
});