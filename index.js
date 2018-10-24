/**
 * Node Js application
 * Express API example
 * Using a static json
 */

const express = require('express');
const logger = require('morgan');
const methodOverride = require('method-override');

const PORT = process.env.PORT || 4000;
const app = module.exports = express();
const db = require('./data.js');

// TODO: move this to model or helper
const getItemById = (id) => {
    return db.find((item) => {
        if (Number(item.id) === Number(id)) {
            return item;
        }
    });
};

/**
 * return the item id from a collection 
 * Search by id
 * @param {Number} id 
 */
const getIdByItemId = (id) => {
    return db.findIndex((item) => {
        if (Number(item.id) === Number(id)) {
            return item;
        }
    });
};

// TODO: move to MW
const validateParamsId = (req, res, next) => {
    if (!req.params.id) {
        return res.status(500).json({
            code: '500',
            message: 'BadRequest missing id'
        });
    }
    return next();
};



// log
if (!module.parent) {
    app.use(logger('dev'));
}
// parse request bodies (req.body)
app.use(express.urlencoded({ extended: true }))

// allow overriding methods in query (?_method=put)
app.use(methodOverride('_method'));

// Let's add our Endpoint
// Get all data
app.get('/data', (req, res, next) => {
    return res.status(200).json({
        code: '200',
        body: db
    });
});
// Get single attribute by id
app.get('/data/:id', validateParamsId, (req, res, next) => {
    const item = getItemById(req.params.id);
    if (!item) {
        return next();
    }
    return res.status(200).json({
        code: '200',
        body: item
    });
});

app.delete('/data/:id', validateParamsId, (req, res, next) => {
    itemId = getIdByItemId(req.params.id)
    db.splice(itemId, 1)
    return res.status(200).json({
        code: '200',
        body: db
    });
});


app.use(function(err, _, res, __){
  // log it
  if (!module.parent) {
      console.error(err.stack);
  }

  // error page
  res.status(500).json({ code: '500', message: 'Error' });
});

// assume 404 since no middleware responded
app.use(function(req, res, next){
  res.status(404).json({ code: '404', message: 'NotFound' });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(PORT);
  console.log(`Express started on port ${PORT}`);
}