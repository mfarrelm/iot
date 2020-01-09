/*----------------------
IOT Logger
Subscribe to MQTT broker, then insert the data into database
Provides TIMESTAMP service
------------------------*/

//---- Configuratior
const BROKER_ADDR = '192.168.43.62'
const SYS_TOPIC = 'TF-IIOT/'
const SYSTIME_TOPIC = 'TIMESTAMP'
const DB_CONFIG = {
  //host: "192.168.1.100",
  host: "192.168.43.62",
  user: "iiot",
  password: "industri40",
  database: "iiot03"
}
const TIME_INTERVAL = 10000;

// MQTT Subscriber
var mqtt = require('mqtt')
var logger = mqtt.connect('mqtt://'+ BROKER_ADDR)
var timer;

logger.on('connect', function () {
  logger.subscribe(SYS_TOPIC + '#');
  timer = setInterval(timeService, TIME_INTERVAL);

  console.log('IIOT Logger is up and running');
  console.log('Connect to MQTT broker at '+ BROKER_ADDR);
  console.log('Connect to DB Server at '+ DB_CONFIG.host);
})

logger.on('disconnect', function() {
  clearInterval(timer);
})


logger.on('message', function (topic, message) {
  console.log(topic + ' : ' + message.toString());	//debug

  // decode the topic
  var fields = topic.split('/')
  sNode = fields[1];
  sTag = fields[2]+fields[3];
  value = parseInt(message, 10);

  insertData1(sNode, sTag, value);
})

//---- SQL connection
var mysql = require('mysql');
var pool  = mysql.createPool(DB_CONFIG);

function insertData1(sNode, sTag, value) {
  var sql = "SELECT ID FROM TAG WHERE Tag='"+sTag+"'";  //query sql
  console.log(sql); //debug
  pool.query(sql, function (err, result, fields) {
     if (err) throw err;
     //console.log(result);
     tag_id = result[0].ID;
     insertData2(tag_id, value);
     console.log("Logged ",sNode,".",sTag,"=", value);
  });
  return 0;
}

function insertData2(tag_id, value) {
  var sql = "INSERT INTO DATA (TAG_ID, DTIME, VALUE) VALUES ("
     + tag_id +", NOW(), "+value+")";
  console.log(sql);	//debugging
  pool.query(sql, function (err, result) {
     if (err) throw err;
  });
}

//--- TIME SERVICE
function timeService() {
  var date = new Date();
  var timestamp = date.getTime();
  logger.publish(SYSTIME_TOPIC, timestamp.toString(),{retain: true});
  console.log('Timestamp = ',timestamp.toString());
}
