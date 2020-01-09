// Configuration
const HTTP_PORT = 8080;
const DBCONFIG = {
  //host: "192.168.1.100",
  host: "192.168.1.107",
  user: "iiot",
  password: "industri40",
  database: "iiot03"
}

var mysql = require('mysql');
var express = require("express");
var bodyParser = require('body-parser');
//============================================
// database initialization
var pool  = mysql.createPool(DBCONFIG);

//=============================================
// Express initialization
var app = express()
spath="public";
console.log(`Web Root = ${spath}!`);
app.use(express.static(spath));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(HTTP_PORT, () => console.log(`WebApp listening on port ${HTTP_PORT}!`));

//=========================================================
// Web Services

/* /api/nodes
 Meminta daftar node
*/
app.get('/api/nodes', function (req, res) {
  var sql = "SELECT * FROM node";

  if (req.query.order) {
    sql+=" ORDER BY "+req.query.order;
  }
  console.log('/api/nodes SQL:', sql);
  pool.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
})


/* /api/node/:id
 Meminta satu node berdasar id, cara aman dari sql injection
*/
app.get('/api/node/:id', function (req, res) {
  var sql = "SELECT * FROM NODE WHERE id=?";
  console.log('/api/nodes SQL:', sql, req.params.id);
  pool.query(sql,req.params.id,function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
})

/* /api/tags
Meminta daftar tags
*/
app.get('/api/tags', function (req, res) {
  var sql = "SELECT * FROM tag JOIN node ON node_id=node.id";
  console.log('/api/tags SQL:', sql);
  pool.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
})

/* /api/tags/:node
Meminta daftar tags untuk node tertentu
*/
app.get('/api/tags/:node_id', function (req, res) {
  var sql = "SELECT * FROM tag";
  sql += " WHERE node_id=? ";
  if (req.query.order) {
    sql+=" ORDER BY "+req.query.order;
  }
  console.log('/api/tags/:node SQL:', sql);
  pool.query(sql, req.params.node_id, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
})

/* /api/tags/:node_id/:prefix
Meminta daftar tags untuk node dan prefix tertentu
node bisa memakai wildcard '+'
*/
app.get('/api/tags/:node_id/:prefix', function (req, res) {
  var sql = "SELECT * FROM tag JOIN node ON node_id=node.id";
  sql += " WHERE ";
  if (req.params.node_id && (req.params.node_id != '+')) {
    sql+="NODE_ID="+pool.escape(req.params.node_id)+ " AND ";
  }
  // ini memakai regular expression untuk mencocokkan prefix
  // misal prefix = TT, maka regular expressionnya ^TT[0-9]
  // akan cocok dengan tag TT101, TT102, dll
  // tapi tak akan cocok dengan TTY101 atau T101
  sql+="(TAG REGEXP '^"+req.params.prefix+"[0-9]')";
  if (req.query.order) {
    sql+=" ORDER BY "+req.query.order;
  }
  console.log('/api/tags/:node/:prefix SQL:', sql);
  pool.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
})


/* /api/tag/:id
 Meminta satu tag berdasar id
*/
app.get('/api/tag/:id', function (req, res) {
  var sql = "SELECT * FROM tag JOIN node ON node_id=node.id ";
  sql += " WHERE TAG.ID=?";
  console.log('/api/tag/:id SQL:', sql, req.params.id);
  pool.query(sql,req.params.id,function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
})


/* /api/tag_id/:node/:tag
 Meminta satu tag_id berdasar node dan tag
*/
app.get('/api/tag_id/:node/:tag', function (req, res) {
  var sql = "SELECT tag.id FROM tag JOIN node ON node_id=node.id ";
  sql += " WHERE node=? AND tag=?";
  console.log('/api/tag_id/:id SQL:', sql, req.params.node, req.params.tag);
  pool.query(sql,[req.params.node, req.params.tag],function (err, result, fields) {
      if (err) throw err;
      res.send(result);
  });
})

/* /api/data/:tag_id
Meminta data untuk tag tertentu
*/
app.get('/api/data/:tag_id', function (req, res) {
  var sql = "SELECT * FROM data";
  sql += " WHERE tag_id="+req.params.tag_id;
  console.log('/api/data/:tag_id SQL:', sql);
  pool.query(sql,req.params.tag_id,function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
})

/* /api/data/:tag_id/:limit
Meminta data untuk tag tertentu sebanyak N terakhir
Data masih di-sort descending
*/
app.get('/api/data/:tag_id/:limit', function (req, res) {
  var sql = "SELECT * FROM data";
  sql += " WHERE tag_id=? ORDER BY dtime DESC LIMIT "+req.params.limit;
  console.log('/api/data/:tag/:limit SQL:', sql);
  pool.query(sql,req.params.tag_id,function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
})

/* /api/datum/:id
Meminta satu datum berdasar id
*/
app.get('/api/datum/:id', function (req, res) {
  var sql = "SELECT * FROM data WHERE id=?";
  pool.query(sql,req.params.id,function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
})

/* /api/login
login username & password
*/
app.post('/api/login', function (req, res) {
  var sql = "SELECT * FROM users WHERE username=? and password=?";
  console.log(sql);
  pool.query(sql,[req.body.username,req.body.password],function (err, result, fields) {
    if (err) throw err;

    if(result.length > 0) {
      res.send({ status: 200, message:'ok', data: result[0] });
    } else {
      res.send({ status: 200, message:'error' });
    }
  });
})


/* /api/users
Meminta data users
*/
app.get('/api/users', function (req, res) {
  var sql = "SELECT * FROM users";
  console.log('/api/users SQL:', sql);
  pool.query(sql,req.params.tag_id,function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
})

/* /api/edit
Edit data from inline editing table
*/
app.post('/api/edit/:table', function (req, res) {
  var data = req.body;
  var id = req.body.ID;
  var table = req.params.table;

  var sql = `UPDATE ${table} SET `;

  for(var key in data) {
    if(req.body.hasOwnProperty(key)){
      sql += `${key}="${data[key]}",`;
    }
  }

  sql = sql.slice(0, -1); //remove comma
  sql += ` WHERE id=${id}`;
  console.log(sql);
  pool.query(sql,req.params.tag_id,function (err, result, fields) {
    if (err) throw err;
    res.send({ status: 200, message:'ok' });
  });
})

/* /api/edit
delete data from inline editing table
*/
app.post('/api/delete/:table/:id', function (req, res) {

  var id = req.params.id;
  var table = req.params.table;

  var sql = `DELETE FROM ${table} WHERE id=${id}`;

  pool.query(sql,req.params.tag_id,function (err, result, fields) {
    if (err) throw err;
    res.send({ status: 200, message:'ok' });
  });
})

/* /api/add
add data from inline editing table
*/
app.post('/api/add/:table', function (req, res) {

  var data = req.body;
  var table = req.params.table;

  var sql = `INSERT INTO ${table} `;
  var column = '';
  var values = '';

  for(var key in data) {
    if(req.body.hasOwnProperty(key)){
      column += `${key},`;
      values += `"${data[key]}",`;
    }
  }

  sql += `(${column.slice(0, -1)}) VALUES (${values.slice(0, -1)})`;

  console.log(sql);
  pool.query(sql,req.params.tag_id,function (err, result, fields) {
    if (err) throw err;
    res.send({ status: 200, message:'ok' });
  });
})
