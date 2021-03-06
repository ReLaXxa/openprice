// benchmark
console.time('Initialized in')

var express = require('express')
var fs = require('fs')
var request = require('request')
var cheerio = require('cheerio')
var env = require('node-env-file')
var neo4j = require('neo4j-js')

// benchmark
console.timeEnd('Initialized in')

env(__dirname + '/../.env')
var neo4jURL = 'http://';
neo4jURL += (process.env.DB_HOST || 'localhost')
neo4jURL += ':' + (process.env.DB_PORT || 7474)
neo4jURL += '/db/data/'

console.time('NEO4J');

neo4j.connect(neo4jURL, function(err, graph) {
	if(err) throw err;
	var q = 'match (n:OpenPriceProduct) return n'
	graph.query(q, null, function(err, results) {
		 if(err) {
			console.log(err);
			console.log(err.stack);
		}
		else {
			for(var i = 0; i < results.length; i++) {
				var node = results[i].n;
				console.log(node.data.name, node.data.updated_at)
			}
		}
	})
})

console.timeEnd('NEO4J');

//return

// benchmark
console.time('>> (sc)raped in')

var url = 'http://www.imdb.com/title/tt1229340/'

console.time('>> response')
request(url, function(error, response, html){
	if(!error){
		console.timeEnd('>> response')
		console.time('>> parsed in')
		var $ = cheerio.load(html)

		var json = { title: '', release: '', rating: '' }

		// Parse
		$('.header').filter(function(){
			var data = $(this)
			json.title = data.children().first().text()
			json.release = data.children().last().children().text()
		})
		$('.star-box-giga-star').filter(function(){
			var data = $(this)
			json.rating = data.text()
		})

		console.log(json)

		// benchmark
		console.timeEnd('>> parsed in')
	}

	// benchmark
	console.timeEnd('>> (sc)raped in')
})
