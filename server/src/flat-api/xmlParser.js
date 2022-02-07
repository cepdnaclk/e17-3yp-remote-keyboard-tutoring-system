const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');

const parser = new xml2js.Parser();

fs.readFile('score.xml', (err, data) => {
    //console.log(data);
	parser.parseString(data, (err, result) => {
        console.log(result);
		//console.log(util.inspect(result, false, null, true));
	});
});