import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import 'dotenv/config';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.post("/submit", (req,res) => {
    axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${req.body.location}`
    )
    .then(function (response) {
        const data = response.data;
        let reqd_data = {};
        reqd_data.name = data['location']['name'];
        reqd_data.region = data['location']['region'];
        reqd_data.country = data['location']['country'];
        reqd_data.local_time = data['location']['localtime'];
        reqd_data.temp_c = data['current']['temp_c'];
        reqd_data.temp_f = data['current']['temp_f'];
        reqd_data.condition_text = data['current']['condition']['text'];
        reqd_data.condition_icon = data['current']['condition']['icon'];
        reqd_data.windspeed = data['current']['wind_kph'];
        reqd_data.precipitation = data['current']['precip_mm'];
        reqd_data.feelslike_c = data['current']['feelslike_c'];
        reqd_data.feelslike_f = data['current']['feelslike_f'];
        reqd_data.humidity = data['current']['humidity'];
        reqd_data.last_updated = data['current']['last_updated'];
        const abbreviation = data['current']['wind_dir'];
        if (abbreviation === "N") {
            reqd_data.wind_dir = "North";
        } else if (abbreviation === "NNE") {
            reqd_data.wind_dir = "North-Northeast";
        } else if (abbreviation === "NE") {
            reqd_data.wind_dir = "Northeast";
        } else if (abbreviation === "ENE") {
            reqd_data.wind_dir = "East-Northeast";
        } else if (abbreviation === "E") {
            reqd_data.wind_dir = "East";
        } else if (abbreviation === "ESE") {
            reqd_data.wind_dir = "East-Southeast";
        } else if (abbreviation === "SE") {
            reqd_data.wind_dir = "Southeast";
        } else if (abbreviation === "SSE") {
            reqd_data.wind_dir = "South-Southeast";
        } else if (abbreviation === "S") {
            reqd_data.wind_dir = "South";
        } else if (abbreviation === "SSW") {
            reqd_data.wind_dir = "South-Southwest";
        } else if (abbreviation === "SW") {
            reqd_data.wind_dir = "Southwest";
        } else if (abbreviation === "WSW") {
            reqd_data.wind_dir = "West-Southwest";
        } else if (abbreviation === "W") {
            reqd_data.wind_dir = "West";
        } else if (abbreviation === "WNW") {
            reqd_data.wind_dir = "West-Northwest";
        } else if (abbreviation === "NW") {
            reqd_data.wind_dir = "Northwest";
        } else if (abbreviation === "NNW") {
            reqd_data.wind_dir = "North-Northwest";
        } else {
            reqd_data.wind_dir = "Invalid abbreviation";
        }
        res.render("index.ejs", {data: reqd_data, error: false})
    })
    .catch(function (error) {
        res.render("index.ejs", {error: true, msg: [error.code, error.response.statusText]})
    });
});