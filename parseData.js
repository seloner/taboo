const csv = require('csv-parser');
const fs = require('fs');
const results = [];

fs.createReadStream('data.csv')
	.pipe(csv())
	.on('data', (data) => {
		if (data.Word)
			results.push({
				word: data.Word,
				forbiddenWords: [
					data.Forbidden1,
					data.Forbidden2,
					data.Forbidden3,
					data.Forbidden4,
				],
			});
	})
	.on('end', () => {
		fs.writeFile('./assets/data.json', JSON.stringify({ data: results }), (err) => {
			if (err) console.log(err);
		});
	});
