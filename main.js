var btnAction = document.getElementById('parse');
var btnClear = document.getElementById('clear');
var input = document.getElementById('input');
var output = document.getElementById('output');

input.focus();

btnAction.addEventListener('click', function() {
	var data = input.value;
	parseJSX(data);
});

btnClear.addEventListener('click', function() {
	input.value = '';
});

function parseJSX(data) {
	var lines = data.split('\n');
	var variables = {};
	var actionLines = [];
	lines.forEach(function(line) {
		if (line.match('var') && (line.match('charIDToTypeID') || line.match('stringIDToTypeID'))) {
			var variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
			var id = line.replace(/[\s+]*.+= /, '').replace(';', '');
			variables[variableName] = id;
		} else {
			var cleanLine = line.replace(/\s+/, '');
			actionLines.push(cleanLine);
		}
	});

	var parsedLines = [];
	actionLines.forEach(function(actionLine) {
		var idNames = actionLine.match(/id\w+/g);
		var parsedLine = actionLine;
		if (idNames && idNames.length > 0) {
			idNames.forEach(function(idName) {
				parsedLine = parsedLine.replace(idName, variables[idName]);
			});
		}
		parsedLines.push(parsedLine);
	});

	var parsedData = parsedLines.join('\n');
	output.value = parsedData;
	output.focus();
	output.select();
}
