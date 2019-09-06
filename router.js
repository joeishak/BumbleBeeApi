let authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', { session: false });
const images = require('./controllers/images');
const etl = require('./controllers/etl');
const healthy = require('./controllers/healthy');
const elephant = require('./controllers/elephant');
const dashboard = require('./controllers/dashboard')
const red = require('./controllers/red');
const forms = require('./controllers/forms');

module.exports = function (app) {
       app.post('/signup', authentication.signup);
       app.post('/signin', requireSignIn, authentication.signin);
       app.get('/img', images.testImages);
       app.get('/puppy', images.getImages);
       //ETL
       app.get('/fossils/reds', etl.redData);
       app.get('/fossils/elephant', etl.elephantData);
       app.get('/fossils/khppsherds',etl.khppBodySherds)
       app.get('/fossils/khppdiagnostics',etl.khppDiagnostics)

       //Reds Queries
       app.get('/red', red.allRed);

       // Elephant Queries
       app.get('/elephant', elephant.allElephant); 
       app.post('/dash/latlang',dashboard.locusLatLangs);

       app.post('/dash/elephant', dashboard.allElephant); 
       app.post('/dash/details/totals',dashboard.getDetailTotals);
       app.post('/dash/details/table',dashboard.getDetailTable);
       // app.post('/dash/panel1', dashboard.totalWeightCountPerFabric);
       // app.post('/dash/panel2/count', dashboard.percentOfFabricTotalBlackened);
       // app.post('/dash/panel2/weight', dashboard.percentOfFabricWeightBlackened);
       // app.post('/dash/panel3/count', dashboard.totalCountPerType);
       // app.post('/dash/panel3/weight', dashboard.totalWeightPerType);

       app.post('/test', healthy.postRequestTest)

       // Forms
       app.post('/write/elephant', forms.writeElephantForms)
       app.post('/write/khpp', forms.writeToKHPP);
       app.get('/read/khpp', forms.readFromKHPP);
       app.post('/delete/khpp', forms.deleteFromKHPP);
       app.post('/edit/khpp', forms.editFromKHPP);
       app.post('/update/khpp', forms.updateFromKHPP);

       //New Queries For Thursday***
       app.post('/dash/khpp/fabric',dashboard.getKHPPFabricQuery);
       app.post('/dash/khpp/weight/blackened',dashboard.getKHPPWeightBlackenedQuery);
       app.post('/dash/khpp/count/blackened',dashboard.getKHPPCountBlackenedQuery);
       app.post('/dash/ele/fabric', dashboard.totalWeightCountPerFabric);
       app.post('/dash/ele/count/blackened', dashboard.percentOfFabricTotalBlackened);
       app.post('/dash/ele/weight/blackened', dashboard.percentOfFabricWeightBlackened);
       app.post('/dash/ele/count/type', dashboard.totalCountPerType);
       app.post('/dash/ele/weight/type', dashboard.totalWeightPerType);
       app.post('/dash/compare/fabric', dashboard.compareFabrics);

       app.get('/locusnumbers',dashboard.getLocusNumbers)
       app.get('/typevariants',forms.getTypeNumVariants);
       app.post('/khpp/excel/export', forms.getRecordsForExcel);

}
