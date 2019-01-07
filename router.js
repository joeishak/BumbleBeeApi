let authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt',{session:false});
const requireSignIn = passport.authenticate('local',{session:false});
const images = require('./controllers/images');
const fossils = require('./controllers/fossildata');
module.exports = function (app) {
   app.post('/signup',authentication.signup);
   app.post('/signin',requireSignIn, authentication.signin);
   app.get('/img', images.testImages);
   app.get('/puppy',images.getImages);
   app.get('/fossils/elephant',fossils.elephantData);
   app.get('/elephant',fossils.allElephant);
   app.get('/fossils/reds',fossils.redData);
   app.get('/red', fossils.allRed);

   //Refactored totalweightperfabric and countofweightperfabric into totalWeightCountPerFabric
   app.get('/weight/total', fossils.totalWeightPerFabric);
   app.get('/weight/count', fossils.countOfWeightPerFabric);
   app.get('/dash/panel1',fossils.totalWeightCountPerFabric);

   
   app.get('/percent/diagnostics', fossils.percentOfDiagnostics);

   app.get('/percent/blackened/ext', fossils.percentOfFireBlackenedExt);
   app.get('/weight/blackened/total/ext', fossils.countOfFireBlackenedExt);
   app.get('/dash/panel2/count',fossils.percentOfFabricTotalBlackened);
   app.get('/dash/panel2/weight',fossils.percentOfFabricWeightBlackened);


   
   app.get('/percent/blackened/int', fossils.percentOfFireBlackenedInt);
   app.get('/weight/blackened/total/int', fossils.countOfFireBlackenedInt);


   app.get('/percent/blackened/both', fossils.percentOfFireBlackenedIntExt);
   app.get('/weight/blackened/total/both', fossils.countOfFireBlackenedIntExt);

   
}
