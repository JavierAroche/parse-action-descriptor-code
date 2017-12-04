/*
 *
 * Parse Action Descriptor Code
 * Author: Javier Aroche (https://github.com/JavierAroche)
 *
 */

const parseBtn = document.getElementById('parse');
const clearBtn = document.getElementById('clear');
const input = document.getElementById('input');
const inputCount = document.getElementById('inputCount');
const output = document.getElementById('output');
const outputCount = document.getElementById('outputCount');
const dropDown = document.getElementById('dropDown');
const cleanDescCheck = document.getElementById('cleanDescCheck');

input.focus();

/*
 * @public
 * Parse button click event
 */
parseBtn.addEventListener('click', () => {
	let data = input.value;
	let parsedData = data;

	if(cleanDescCheck.checked) {
		parsedData = parser.cleanDesc(parsedData);
	}

	switch(dropDown.value) {
		case 'cleanJSX':
			parsedData = parser.cleanJSX(parsedData);
			break;
		case 'sortIDs':
			parsedData = parser.sortIDs(parsedData);
			break;
		case 'createFunction':
			parsedData = parser.cleanJSX(parsedData);
			parsedData = parser.createFunction(parsedData);
			break;
	}

	output.value = parsedData;
	parser.getLineCounts();
	output.focus();
	output.select();
});

/*
 * @public
 * Get line count on change
 */
input.addEventListener('input', () => {
	parser.getLineCounts();
})

/*
 * @public
 * Clear button click event
 */
clearBtn.addEventListener('click', () => {
	input.value = '';
	parser.getLineCounts();
});

class Parser {
	/*
	 * Constructor
	 */
	constructor() {}

	/*
	 * Remove unnecessary charID and stringID variables for a shorter code
	 */
	cleanJSX(data) {
		let lines = data.split('\n');
		let variables = {};
		let actionLines = [];
		// Identify lines with charIDs or stringIDs
		lines.forEach(line => {
			if(line.match('var') && (line.match('charIDToTypeID') || line.match('stringIDToTypeID'))) {
				let variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
				let id = line.replace(/[\s+]*.+= /, '').replace(';', '');
				variables[variableName] = id;
			} else {
				let cleanLine;
				if(line[0] === ' ' || line[0] === '    ') {
					cleanLine = line.replace(/\s+/, '');
				} else {
					cleanLine = line;
				}
				actionLines.push(cleanLine);
			}
		});

		// Cleanup lines
		let parsedLines = [];
		actionLines.forEach(actionLine => {
			let idNames = actionLine.match(/id\w+/g);
			let parsedLine = actionLine;
			if(idNames && idNames.length > 0) {
				idNames.forEach(function(idName) {
					parsedLine = parsedLine.replace(idName, variables[idName]);
				});
			}
			parsedLines.push(parsedLine);
		});

		return parsedLines.join('\n');
	}

	/*
	 * Sort IDs by placing them at the top for easier readibility
	 */
	sortIDs(data) {
		let lines = data.split('\n');
		let variables = {};
		let actionLines = [];
		lines.forEach(line => {
			if(line.match('var') && (line.match('charIDToTypeID') || line.match('stringIDToTypeID'))) {
				let variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
				let id = line.replace(/[\s+]*.+= /, '').replace(';', '');
				variables[variableName] = id;
			} else {
				let cleanLine = line;
				if(cleanLine[0] === ' ') {
					cleanLine = cleanLine.replace(/\s+/, '');
				}
				actionLines.push(cleanLine);
			}
		});

		let varIDs = '';
		for(let i in variables) {
			varIDs = varIDs + 'var ' + i + ' = ' + variables[i] + ';' + '\n';
		};

		return varIDs + '\n' + actionLines.join('\n');
	}

	/*
	 * Create a function based on the action descriptor code
	 */
	createFunction(data) {
		let lines = data.split('\n');
		let variables = [];
		let parsedLines = [];
		let lineSplit, lineValue, lineProperty, parsedLine;
		lines.forEach(line => {
			if(line.match(/putBoolean|putUnitDouble|putDouble|putInteger|putString|putName|putPath/)) {
				lineSplit = line.split(', ');
				// Find value and property name
				lineValue = lineSplit[lineSplit.length - 1].replace(/ \);/, '');
				lineProperty = lineSplit[0].replace(/.+(stringIDToTypeID|charIDToTypeID)/, '').match(/\w+/)[0];
				// Add to array which will become the params object
				variables.push(`${lineProperty}: ${lineValue.replace(/"""/g,'"')}`);
				// Replace found value with param value
				parsedLine = line.replace(lineValue, `params.${lineProperty}`);
				parsedLines.push(parsedLine);
			} else {
				parsedLines.push(line);
			}
		});

		// Create function string
		let functionString = `
function newFunction(params) {
	${parsedLines.join('\n	')}
}

var params = {
	${variables.join(',\n	')}
};

newFunction(params);`;

		return functionString;
	}

	/*
	 * Clean descriptor variables to start count from 1
	 */
	cleanDesc(data) {
		let lines = data.split('\n');
		let variables = {};
		let actionLines = [];
		let descCount = 1;
		let refCount = 1;
		let listCount = 1;
		// Identify lines with variables
		lines.forEach(line => {
			if(line.match('var') && (line.match('ActionDescriptor') || line.match('ActionReference') || line.match('ActionList'))) {
				actionLines.push(line);
				let variableName = line.replace(/[\s+]*var /, '').replace(/ =.+/, '');
				let newVariableName;
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
				let cleanLine = line;
				if(cleanLine[0] === ' ') {
					cleanLine = cleanLine.replace(/\s+/, '');
				}
				actionLines.push(cleanLine);
			}
		});

		// Cleanup variable names
		let parsedLines = [];
		actionLines.forEach(actionLine => {
			let parsedLine = actionLine;

			let descVars = actionLine.match(/desc\w+/g);
			if(descVars && descVars.length > 0) {
				descVars.forEach(function(descVar) {
					parsedLine = parsedLine.replace(descVar, variables[descVar]);
				});
			}

			let refVars = actionLine.match(/ref\w+/g);
			if(refVars && refVars.length > 0) {
				refVars.forEach(function(refVar) {
					parsedLine = parsedLine.replace(refVar, variables[refVar]);
				});
			}

			let listVars = actionLine.match(/list\w+/g);
			if(listVars && listVars.length > 0) {
				listVars.forEach(function(listVar) {
					parsedLine = parsedLine.replace(listVar, variables[listVar]);
				});
			}

			parsedLines.push(parsedLine);
		});

		return parsedLines.join('\n');
	}

	/*
	 * Get line counts
	 */
	getLineCounts() {
		let inputData = input.value;
		let inputLines = [];
		if(inputData !== '') {
			inputLines = inputData.split('\n');
		}
		let outputData = output.value;
		let outputLines = [];
		if(outputData !== '') {
			outputLines = outputData.split('\n');
		}
		inputCount.innerHTML = inputLines.length;
		outputCount.innerHTML = outputLines.length;
	}
}

let parser = new Parser();
