/*
REMEBER TO START THE SERVICES:
mysql:
sudo service mysqld start
http:
sudo service httpd start
*/

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
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'final'
    });
const connection = connectionPool.promise();

app.get('/', function(req, res) {
    res.send("WORKING");
});

app.get('/fill_tables', async function (req, res) {
    const tablesSql = fs.readFileSync('final.sql', 'utf8');
    const countries = fs.readFileSync('./Country.json', 'utf8');
    const countriesParsed = JSON.parse(countries);
    const africanCrisis = fs.readFileSync('./African_crisis.json',`utf8`);
    const africanCrisisParsed = JSON.parse(africanCrisis);
    try {
        await connection.query(tablesSql)
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
        await africanCrisisParsed.forEach(async function(africanCrise){
            const[rows,columns] = 
            await connection.query("insert into africancrise (`case`, cc3, country, `year`, \
                systematic_crisis, exch_usd, domestic_debt_in_default, sovereign_external_debt_default, \
                gdp_weighted_default, inflation_annual_cpi, independece, currency_crisis, inflation_crisis, \
                banking_crisis) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?);", 
                [africanCrise.case,africanCrise.cc3,africanCrise.country,africanCrise.year,
                africanCrise.systemic_crisis,africanCrise.exch_usd,africanCrise.domestic_debt_in_default,
                africanCrise.sovereign_external_debt_default,africanCrise.gdp_weighted_default,
                africanCrise.inflation_annual_cpi,africanCrise.independence,africanCrise.currency_crises,
                africanCrise.inflation_crises,africanCrise.banking_crisis]);
        });
        res.send("Hello");

    } catch (error) {
        console.error('[ERROR]', error.message);
        res.status(500).send(error.message);
    }
});

app.get('/countries', async function(req, res) {
    try {
        const[rows,columns] = await connection.query("select * from country;");
        res.send(rows);
    } catch (error) {
        console.error('[ERROR]', error.message);
        res.status(500).send(error.message);
    }
});

app.get('/african_crises', async function(req, res) {
    try {
        const[rows,columns] = await connection.query("select * from africancrise;");
        res.send(rows);
    } catch (error) {
        console.log('[ERROR]', error.message);
        res.status(500).send(error.message);
    }
});

app.get('/countries/:code', async function(req, res) {
    try {
        const code = req.params.code;
        console.log('[CODE]', code);
        const[rows,columns] = await connection.query("select * from africancrise where cc3 = ?;", [code]);
        res.send(rows);
    } catch (error) {
        console.error('[ERROR]', error.message);
    }
});