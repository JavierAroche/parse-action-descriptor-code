var parseBtn = document.getElementById('parse');
var clearBtn = document.getElementById('clear');
var input = document.getElementById('input');
var output = document.getElementById('output');
var dropDown = document.getElementById('dropDown');
var cleanDescCheck = document.getElementById('cleanDescCheck');

input.focus();

parseBtn.addEventListener('click', function() {
	var data = input.value;
	var parsedData = data;

	if(cleanDescCheck.checked) {
		parsedData = cleanDesc(parsedData);
	}

	switch(dropDown.value) {
		case 'cleanJSX':
			parsedData = cleanJSX(parsedData);
			break;
		case 'sortIDs':
			parsedData = sortIDs(parsedData);
			break;
		case 'createFunction':
			parsedData = cleanJSX(parsedData);
			parsedData = createFunction(parsedData);
			break;
	}

	output.value = parsedData;
	output.focus();
	output.select();
});

clearBtn.addEventListener('click', function() {
	input.value = '';
});

function cleanJSX(data) {
	var lines = data.split('\n');
	var variables = {};
	var actionLines = [];
	// Identify lines with charIDs or stringIDs
	lines.forEach(function(line) {
		if (line.match('var') && (line.match('charIDToTypeID') || line.match('stringIDToTypeID'))) {
			var variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
			var id = line.replace(/[\s+]*.+= /, '').replace(';', '');
			variables[variableName] = id;
		} else {
			var cleanLine;
			if(line[0] === ' ' || line[0] === '    ') {
				cleanLine = line.replace(/\s+/, '');
			} else {
				cleanLine = line;
			}
			actionLines.push(cleanLine);
		}
	});

	// Cleanup lines
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

	return parsedLines.join('\n');
}

function sortIDs(data) {
	var lines = data.split('\n');
	var variables = {};
	var actionLines = [];
	lines.forEach(function(line) {
		if (line.match('var') && (line.match('charIDToTypeID') || line.match('stringIDToTypeID'))) {
			var variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
			var id = line.replace(/[\s+]*.+= /, '').replace(';', '');
			variables[variableName] = id;
		} else {
			var cleanLine = line;
			if(cleanLine[0] === ' ') {
				cleanLine = cleanLine.replace(/\s+/, '');
			}
			actionLines.push(cleanLine);
		}
	});

	var varIDs = '';
	for(var i in variables) {
		varIDs = varIDs + 'var ' + i + ' = ' + variables[i] + ';' + '\n';
	};

	return varIDs + '\n' + actionLines.join('\n');
}

function createFunction(data) {
	var lines = data.split('\n');
	var variables = {};
	var actionLines = [];
	lines.forEach(function(line) {
		if (line.match(/desc\w+.put/)) {
			var variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
			var id = line.replace(/[\s+]*.+= /, '').replace(';', '');
			variables[variableName] = id;
		} else {
			var cleanLine = line;
			if(cleanLine[0] === ' ') {
				cleanLine = cleanLine.replace(/\s+/, '');
			}
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

	return parsedLines.join('\n');

	return data
}

function cleanDesc(data) {
	var lines = data.split('\n');
	var variables = {};
	var actionLines = [];
	var descCount = 1;
	var refCount = 1;
	var listCount = 1;
	// Identify lines with variables
	lines.forEach(function(line) {
		if (line.match('var') && (line.match('ActionDescriptor') || line.match('ActionReference') || line.match('ActionList'))) {
			actionLines.push(line);
			var variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
			var newVariableName;
			if(line.match('ActionDescriptor')) {
				newVariableName = 'desc' + descCount;
				descCount = descCount + 1;
			} else if(line.match('ActionReference')) {
				newVariableName = 'ref' + refCount;
				refCount = refCount + 1;
			} else if(line.match('ActionList')) {
				newVariableName = 'list' + listCount;
				listCount = listCount + 1;
			}
			variables[variableName] = newVariableName;
		} else {
			var cleanLine = line;
			if(cleanLine[0] === ' ') {
				cleanLine = cleanLine.replace(/\s+/, '');
			}
			actionLines.push(cleanLine);
		}
	});

	// Cleanup variable names
	var parsedLines = [];
	actionLines.forEach(function(actionLine) {
		var parsedLine = actionLine;

		var descVars = actionLine.match(/desc\w+/g);
		if (descVars && descVars.length > 0) {
			descVars.forEach(function(descVar) {
				parsedLine = parsedLine.replace(descVar, variables[descVar]);
			});
		}

		var refVars = actionLine.match(/ref\w+/g);
		if (refVars && refVars.length > 0) {
			refVars.forEach(function(refVar) {
				parsedLine = parsedLine.replace(refVar, variables[refVar]);
			});
		}

		var listVars = actionLine.match(/list\w+/g);
		if (listVars && listVars.length > 0) {
			listVars.forEach(function(listVar) {
				parsedLine = parsedLine.replace(listVar, variables[listVar]);
			});
		}

		parsedLines.push(parsedLine);
	});

	return parsedLines.join('\n');
}
