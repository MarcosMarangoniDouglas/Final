let mysql = require('mysql2');
let fs = require("fs");
let express = require('express')
let bodyParser = require('body-parser');
let csv = require('csv');

let app = express();
let port = 8000 ;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

let server = app.listen(port, () => {
    console.log('server is listening on port', server.address().port)
})

let connectionPool = mysql.createPool({
        connectionLimit: 5,
        host     : 'ec2-3-87-228-242.compute-1.amazonaws.com',
        user     : 'myser',
        password : 'pass123',
        database : 'final'
    });
const connection = connectionPool.promise();

app.get('/', function(req, res) {
    res.send("WORKING");
});

app.get('/seed', async function (req, res) {
    console.log("SEED");
    let countries = fs.readFileSync('./Country.json', 'utf8');
    let countriesParsed = JSON.parse(countries);
    let african = fs.readFileSync('./African_crisis.json',`utf8`);
    let africanParsed = JSON.parse(african);
    try {
        await countriesParsed.forEach(async function(country) {
            const [rows, columns] = 
            await connection.query("insert into country (code, name, continent, region, surface_area, indep_year, \
                population, life_expectancy, gnp, gnp_old, local_name, government_form, head_of_state, capital, code2) \
                values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                [country.Code, country.Name, country.Continent, country.Region, country.SurfaceArea,
                 country.IndepYear, country.Population, country.LifeExpectancy, country.GNP,
                 country.GNPOld, country.LocalName, country.GovernmentForm, country.HeadOfState,
                 country.Capital, country.Code2]);
                 
        });
        await africanParsed.forEach(async function(African_crisis){
            const[rows,columns] = 
            await connection.query("insert into africancrise (`case`, cc3, country, `year`, \
                systematic_crisis, exch_usd, domestic_debt_in_default, sovereign_external_debt_default, \
                gdp_weighted_default, inflation_annual_cpi, independece, currency_crisis, inflation_crisis, \
                banking_crisis) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?);", [African_crisis.case,African_crisis.cc3,
                African_crisis.country,African_crisis.year,African_crisis.systemic_crisis,African_crisis.exch_usd,
            African_crisis.domestic_debt_in_default,African_crisis.sovereign_external_debt_default,African_crisis.gdp_weighted_default,
        African_crisis.inflation_annual_cpi,African_crisis.independence,African_crisis.currency_crises,
    African_crisis.inflation_crises,African_crisis.banking_crisis]);
        });
        res.send("Hello");

    } catch (error) {
        console.log('[ERROR]', error.message);
    }
});

app.get('/countries', async function(req, res) {
    const[rows,columns] = await connection.query("select * from country;");
    res.send(rows);
});

app.get('/countries/:code', async function(req, res) {
    try {
        const code = req.params.code;
        console.log('[CODE]', code);
        const[rows,columns] = await connection.query("select * from africancrise where cc3 = ?;", [code]);
        res.send(rows);
    } catch (error) {
        console.log('[ERROR]', error.message);
    }
});
 
app.post('/', function (req, res) {
    console.log("Got a GET request for the homepage");

    let qString = "SELECT * from president where state='" + req.body.state + "'"   
    connection.query(qString, function(err, rows, fields) {
    if (!err) {
        console.log("Displaying all the rows");
        
        res.send(JSON.stringify(rows));
    }
    else
        console.log('Error while performing Query.');
    });

   
 })
