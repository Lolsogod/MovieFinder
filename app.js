// *! api key = 4dbc6037
console.log("Loading... Please wait...");
var express = require("express");
var app = express();
var request = require("request");

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("search");
});

app.get("/results", function (req, res) {
    var query = req.query.search;
    var pg2 = 2 * Number(req.query.pg);
    var pg1 = pg2 - 1;
    var url = "http://www.omdbapi.com/?s=" + query + "&apikey=4dbc6037&page=";
    for (i = pg1; i < pg2; i++) {
        request(url + i, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = [JSON.parse(body)];
                request(url + i, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        data.push(JSON.parse(body));
                        res.render("results", {
                            curS: query,
                            curPage: req.query.pg,
                            data: data
                        });
                    } else {
                        res.render("error");
                    }
                });

            } else {
                res.render("error");
            }
        });
    }
});

app.get("/results/:id", function (req, res) {
    var url = "http://www.omdbapi.com/?i=" + req.params.id + "&apikey=4dbc6037";
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = [JSON.parse(body)];
            console.log(data)
            res.render("show", {
                movie: data
            });
        } else {
            res.render("error");
        }
    });

});

app.listen(process.env.PORT, process.env.IP); 