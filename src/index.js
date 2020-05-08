const express = require ('express');
const morgan = require ('morgan');
const exhbs = require('express-handlebars');
const path = require('path');

//Inicializaciones
const app = express();

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs',exhbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//Variables globales
app.use((req, res, next)=>{
    next();
})


//Rutas
app.use(require('./routes/'));
app.use(require('./routes/authentication'));
app.use('pagos', require('./routes/pagos'));

//Public
app.use(express.static(path.join(__dirname, 'public')))

//Partit el servidor
app.listen(app.get('port'), () =>{
    console.log('servidor en el puerto: ', app.get('port'));
})