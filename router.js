let authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });
const images = require('./controllers/images');
const etl = require('./controllers/etl');
const etl = require('./controllers/healthy');
const elephant = require('./controllers/elephant');
const red = require('./controllers/red');

module.exports = function (app) {
       app.post('/signup', authentication.signup);
       app.post('/signin', requireSignIn, authentication.signin);
       app.get('/img', images.testImages);
       app.get('/puppy', images.getImages);
       //ETL
       app.get('/fossils/reds', etl.redData);
       app.get('/fossils/elephant', etl.elephantData);

       //Reds Queries
       app.get('/red', red.allRed);

       // Elephant Queries
       app.get('/elephant', elephant.allElephant); 
       app.get('/dash/panel1', elephant.totalWeightCountPerFabric);
       app.get('/dash/panel2/count', elephant.percentOfFabricTotalBlackened);
       app.get('/dash/panel2/weight', elephant.percentOfFabricWeightBlackened);
       app.get('/dash/panel3/count', elephant.totalCountPerType);
       app.get('/dash/panel3/weight', elephant.totalWeightPerType);

       app.post('/test', healthy.postRequestTest)

}
