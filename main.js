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
const outputTextArea = document.getElementById('outputTextArea');
const outputCount = document.getElementById('outputCount');
const dropDown = document.getElementById('dropDown');
const cleanVariables = document.getElementById('cleanVariables');
const cleanParams = document.getElementById('cleanParams');
const copyBtn = document.getElementById('copy');

input.focus();

/*
 * @public
 * Parse button click event
 */
parseBtn.addEventListener('click', () => {
	let data = input.value;
	let parsedData = data;

	if(cleanVariables.checked) {
		parsedData = parser.cleanVariables(parsedData);
	}

	switch(dropDown.value) {
		case 'cleanJSX':
			parsedData = parser.cleanJSX(parsedData);
			break;
		case 'sortIDs':
			parsedData = parser.sortIDs(parsedData);
			break;
		case 'createFunction':
			let functionName = document.getElementById('functionName').value;
			parsedData = parser.cleanJSX(parsedData);
			parsedData = parser.createFunction(parsedData, functionName);
			break;
	}

	parser.clipboard = parsedData;
	outputTextArea.value = parsedData;
	output.innerHTML = Prism.highlight(parsedData, Prism.languages.javascript);
	parser.getLineCounts();
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
	output.innerHTML = '';
	parser.getLineCounts();
});

/*
 * @public
 * Copy to clipboard button click event
 */
copyBtn.addEventListener('click', () => {
	outputTextArea.select();
	document.execCommand("Copy");
});

class Parser {
	/*
	 * Constructor
	 */
	constructor() {
		this.clipboard = '';
	}

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
			} else if(line !== '') {
				let cleanLine;
				if(line[0] === ' ' || line[0] === '	') {
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
	createFunction(data, functionName) {
		let lines = data.split('\n');
		let variables = [];
		let lists = {};
		let parsedLines = [];
		let lineSplit, lineValue, lineProperty, parsedLine, listNumber;
		lines.forEach(line => {
			if(line.match(/list|ref/) && line.match(/putIndex|putInteger|putIdentifier/)) {
				// Get list/ref number and capitalize first letter
				listNumber = line.match(/\w+/)[0];
				// Get value
				lineValue = Number(line.match(/ \d+ /)[0]);
				if(!lists.hasOwnProperty(listNumber)) {
					lists[listNumber] = [];
				}
				lists[listNumber].push(lineValue);
				// Replace found value with param value
				parsedLine = line.replace(/ \d+ /, ` params.${listNumber}[${lists[listNumber].length - 1}] `);
				parsedLines.push(parsedLine);
			} else if(line.match(/putBoolean|putUnitDouble|putEnumerated|putDouble|putInteger|putIdentifier|putIndex|putString|putName|putPath/)) {
				// Almost every line will contain the param after the last comma
				// Example: "desc2.putBoolean( stringIDToTypeID( "artboard" ), false );"
				// Result: " false );"
				lineSplit = line.split(', ');
				// Get the value or the stringID or CharID to be used as param
				// Example: "desc2.putBoolean( stringIDToTypeID( "artboard" ), false );"
				// Result: false
				lineValue = lineSplit[lineSplit.length - 1].replace(/\);/, '');
				// Catch any UnitDouble or Enumerated that use a stringID or charID as the param
				// Example: "desc2.putEnumerated( charIDToTypeID( "Fl  " ), charIDToTypeID( "Fl  " ), charIDToTypeID( "Trns" ) );"
				// Result: "Trns"
				if(lineValue.match(/stringIDToTypeID|charIDToTypeID/)) {
					lineValue = lineValue.match(/".+"/)[0];
				}
				// Clean any remaining extra quotes in the param
				// Example: """sRGB IEC61966-2.1"""
				// Result: "sRGB IEC61966-2.1"
				lineValue = lineValue.replace(/"+/g,'"');
				// Get the stringID or charID by parsing the string
				// Example: "desc2.putBoolean( stringIDToTypeID( "artboard" ), false );"
				// Result: "artboard"
				lineProperty = lineSplit[0].replace(/.+(stringIDToTypeID|charIDToTypeID)/, '').match(/\w+/)[0];
				// Use the constant list to make properties more readible, per user request
				// Example: Rslt
				// Result: resolution
				if(cleanParams.checked) {
					lineProperty = this.replaceConstant(lineProperty);
				}
				// Add to array. This will become the params object
				variables.push(`${lineProperty}: ${lineValue}`);
				// Replace found value with param value
				// Example: "desc2.putBoolean( stringIDToTypeID( "artboard" ), false );"
				// Result: "desc2.putBoolean( stringIDToTypeID( "artboard" ), params.artboard );"
				parsedLine = line.replace(lineValue, `params.${lineProperty}`);
				parsedLines.push(parsedLine);
			} else {
				parsedLines.push(line);
			}
		});

		// Add lists as variables
		for(let key in lists) {
			variables.push(`${key}: [${lists[key].join(',')}]`);
		}

		// Create function string
		let functionString =
`function ${functionName}(params) {
	${parsedLines.join('\n	')}
}

var params = {
	${variables.join(',\n	')}
};

${functionName}(params);`;

		return functionString;
	}

	/*
	 * Replace constant from list
	 */
	replaceConstant(variable) {
		if(constants.hasOwnProperty(variable)) {
			return constants[variable];
		} else {
			return variable.charAt(0).toLowerCase() + variable.slice(1);
		}
	}

	/*
	 * Clean variables to start count from 1
	 */
	cleanVariables(data) {
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
		let outputData = output.innerHTML;
		let outputLines = [];
		if(outputData !== '') {
			outputLines = outputData.split('\n');
		}
		inputCount.innerHTML = inputLines.length;
		outputCount.innerHTML = outputLines.length;
	}
}

let parser = new Parser();
