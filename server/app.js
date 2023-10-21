var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');

const animalSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
}, {
    collection: 'animals'   // this gives reference to the required collection 
}
);

  const Animal = mongoose.model('animals', animalSchema);

// Variables
var mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/animalDevelopmentDB';
var port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(mongoURI).catch(function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());

// Import routes
app.get('/api', function(req, res) {
    res.json({'message': 'Welcome to your DIT342 backend ExpressJS project!'});
});
app.get('/api/mytest', function (req, res) {
    res.json({'anothermessage': 'this is my test text'})
})


// to get list of objects by using schema (defined here in the same file)
app.get('/students', async function(req, res) {

   try {
    const animalList = await Animal.find({})
    res.status(200).json({animalList})
   } catch (err) {
    res.status(500).json({message: "internal server error 2"})
   }
})



// app post method to create object, by using schema (defined here in the same file)
app.post('/students', async function(req, res) {

    try {
        const newAnimal = new Animal({
            name: "test name 5"
        })
    
    const animalCreated = await newAnimal.save()

    res.status(201).json(animalCreated)

    } catch (err){
        res.status(500).json({err: "Internal Server Error 2"});
    }
    
})

// L03:p19 - camels post method 
const camels = []; // Camels storage array
app.post('/camels', function(req, res) {
    var new_camel = {
        "_id": camels.length,
        "color": req.body.color,
        "position": req.body.position
    }
    camels.push(new_camel);
    res.json(new_camel);
});

// L03:p19 - camels Get method 

app.get('/camels', function(req, res) {
    res.json({"camels": camels});
});


// L03:p19 - camels Get method 

app.get('/camels/:id', function(req, res) {
    
    var id = req.params.id

    res.json(camels[id]);
});

// L03:p26 - camels Put method 

app.put('/camels/:id', function(req, res) {
    
    var id = req.params.id
    var update_camels = {
        "_id": id,
        "color": req.body.color,
        "position": req.body.position
    }
    camels[id] = update_camels
    res.json(update_camels)
});



// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        // Return sensitive stack trace only in dev mode
        err_res['error'] = err.stack;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;
