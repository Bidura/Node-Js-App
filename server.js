const express = require('express');
var mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Password"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  con.query("CREATE DATABASE Covid19", function (err, result) {
    if (err)
    {
        
    }
    else
    console.log("Database created");
  });
  con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Password",
    database: "Covid19"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  

  var sql = "CREATE TABLE Covid_details (State_Name VARCHAR(255) Primary Key,Date_of_Record DATE,No_of_Samples INTEGER, No_of_Deaths INTEGER, No_of_Positive INTEGER,No_of_Negative INTEGER, No_of_Discharge INTEGER)";
con.query(sql, function (err, result) {
if (err)
{

}
console.log("Table created");
});

//getting the form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Process the form data
app.post('/process', (req, res) => {
    const formData = req.body;
    console.log('Received form data:', formData);
    const stateName = req.body.stateName;
    var dateOfRecord = req.body.dateOfRecord;
    var noOfSamples = req.body.noOfSamples;
    var noOfDeaths = req.body.noOfDeaths;
    var noOfPositive = req.body.noOfPositive;
    var noOfNegative = req.body.noOfNegative;
    var noOfDischarge = req.body.noOfDischarge;
     

    // Process the data or perform any backend tasks
    // ...

    

  sql = "INSERT INTO Covid_details VALUES ('"+ stateName +"','"+dateOfRecord+"',"+noOfSamples+","+noOfDeaths+","+noOfPositive+","+noOfNegative+","+noOfDischarge+")";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });


  function createHtmlTable(data) {
    let html = '<table border="1"><thead><tr>';
  
    // Create table headers from JSON keys
    for (const key in data[0]) {
      html += `<th>${key}</th>`;
    }
    html += '</tr></thead><tbody>';
  
    // Populate table rows with JSON data
    data.forEach(item => {
      html += '<tr>';
      for (const key in item) {
        html += `<td>${item[key]}</td>`;
      }
      html += '</tr>';
    });
  
    html += '</tbody></table>';
    return html;
  }


  con.query("SELECT * FROM Covid_details ORDER BY No_of_Positive", function (err, result) {
    if (err) throw err;
    console.log(result);
    result2 = createHtmlTable(result)
    res.send(result2);
  });

});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
