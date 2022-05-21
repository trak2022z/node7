/*
 * API for a theoretical cafe.
 *
 * An API that can provide items from the cafe menu,
 * and submit cafe orders for processing.
 * *** Endpoint Documentation ***
 * Endpoint: /menu
 * Description: Provides all items on the menu, sorted into categories.
 *              Items within each category are in alphabetical order.
 * Request Type: GET
 * Response Type: JSON
 * Example Request: /menu
 * Example Response:
 *  {
 *   'Bakery': [
 *     {
 *       'name': 'Blueberry Scone',
 *       'subcategory': 'Scones',
 *       'price': 3.50
 *     },
 *     ...
 *   ],
 *   ...
 *  }
 * *************************************
 * Endpoint: /menu/:category
 * Description: Responds with an alphabetically sorted list of menu items in the :category.
 * Request Type: GET
 * Response Type: JSON
 * Example Request: /menu/Bakery
 * Example Response:
 *  [
 *    {
 *      'name': 'Blueberry Scone',
 *      'subcategory': 'Scones',
 *      'price': 3.50
 *    },
 *    ...
 *  ]
 * Error Handling: If there are no items for the given category, responds in text with 400 status.
 */

'use strict';

const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

const INVALID_PARAM_ERROR = 400;
const SEVER_ERROR = 500;
const SERVER_ERROR_MSG = 'Something went wrong on the server.';

// TODO: Implement /menu. Gets all menu items, organized by category and in alphabetical order.


//https://node7.tomkrok1.repl.co/menu

app.get('/menu', async function(req, res) {
 let db = await getDBConnection();
  try {
    let allItems = await db.all('SELECT * FROM menu ORDER BY category, name');
    res.json(allItems);
    await db.close();
  } catch(err) {
    res.status(400);
    res.type('text').send('error');
  }
});


/*
//Ordered version
app.get('/menu', async function(req, res) {
  try {
    let db = await getDBConnection();
    let results = {};
    let categories = await db.all("SELECT DISTINCT category FROM menu;");
    for (let i = 0; i < categories.length; i++) {
      let query = "SELECT name, subcategory, price FROM menu WHERE category = ? ORDER BY category ASC";
      let result = await db.all(query, categories[i].category);
      results[categories[i].category] = result;
    }
    await db.close();
    res.json(results);
  } catch(err) {
    console.error(err);
    res.status(500);
    res.type('text').send("error, try again later");
  }
});
*/

/*
//wrong???
app.get('/menu', async function(req, res) {
  try {
    let db = await getDBConnection();
    let sql = "SELECT name, category, subcategory, price FROM menu ORDER BY name";
    let results = await db.all(sql);
    let ending = processData(results);

    await db.close();
    res.type("json").send(ending);
    
  } catch (err) {
    res.type('text');
    res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
  }
});



// put in JSON nice form by category
function processData(menu) {
  // stat with empty JSON
  let results = {};
  for (let i = 0; i < menu.length; i++) {
    let name1 = menu[i]['name'];
    let subcategory1 = menu[i]["subcategory"];
    let price1 = menu[i]["price"];
    let category = menu[i]["category"];
    if (!result[category]) {
      result[category] = [];
    }
    results[category].push({
      name:name1, 
      subcategory:subcategory1, 
      price:price1
    });
  }
  return results;
}
*/


//https://node7.tomkrok1.repl.co/menu/Bakery
// TODO: Implement /menu/:category. Gets all menu items in a given :category in alphabetical order.

app.get("/menu/:category", async function(req,res) {
  try {
    let category = req.params['category'];
    if (category) {
      let db = await getDBConnection();
      let query = "SELECT name, subcategory, price FROM menu WHERE category = ? ORDER BY category ASC";
      let result = await db.all(query, category);
      res.json(result);
      await db.close();
    } else {
      res.status(400).type("text").send("error");
    }
  } catch (err) {
    console.error(err);
    res.status(500).type("text").send("error");
  }
});

/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'demo.db',
    driver: sqlite3.Database
  });
  return db;
}

const PORT = process.env.PORT || 8000;
app.listen(PORT);