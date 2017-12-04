# Parse Action Descriptor Code
[![npm-image](https://img.shields.io/badge/parse--action--descriptor--code-v1.0.0-09bc00.svg)](https://github.com/JavierAroche/parse-action-descriptor-code)

## Description
Parse your Photoshop Action Descriptor code from the Scripting Listener into a more readable format, or into a flexible function.

## Install
* Git clone this repository
* `npm install`

## Usage
Copy and paste your output from the Scripting Listener into the Input text area. Select the desired function. Click "Parse", and your parsed code will be shown in the Output text area.

## Example
Input from the Scripting Listener (Make new document)
```javascript
var idMk = charIDToTypeID( "Mk  " );
    var desc36 = new ActionDescriptor();
    var idNw = charIDToTypeID( "Nw  " );
        var desc37 = new ActionDescriptor();
        var idNm = charIDToTypeID( "Nm  " );
        desc37.putString( idNm, """New File""" );
        var idartboard = stringIDToTypeID( "artboard" );
        desc37.putBoolean( idartboard, false );
        var idMd = charIDToTypeID( "Md  " );
        var idRGBM = charIDToTypeID( "RGBM" );
        desc37.putClass( idMd, idRGBM );
        var idWdth = charIDToTypeID( "Wdth" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc37.putUnitDouble( idWdth, idRlt, 480.000000 );
        var idHght = charIDToTypeID( "Hght" );
        var idRlt = charIDToTypeID( "#Rlt" );
        desc37.putUnitDouble( idHght, idRlt, 360.000000 );
        var idRslt = charIDToTypeID( "Rslt" );
        var idRsl = charIDToTypeID( "#Rsl" );
        desc37.putUnitDouble( idRslt, idRsl, 300.000000 );
        var idpixelScaleFactor = stringIDToTypeID( "pixelScaleFactor" );
        desc37.putDouble( idpixelScaleFactor, 1.000000 );
        var idFl = charIDToTypeID( "Fl  " );
        var idFl = charIDToTypeID( "Fl  " );
        var idTrns = charIDToTypeID( "Trns" );
        desc37.putEnumerated( idFl, idFl, idTrns );
        var idDpth = charIDToTypeID( "Dpth" );
        desc37.putInteger( idDpth, 8 );
        var idprofile = stringIDToTypeID( "profile" );
        desc37.putString( idprofile, """sRGB IEC61966-2.1""" );
    var idDcmn = charIDToTypeID( "Dcmn" );
    desc36.putObject( idNw, idDcmn, desc37 );
    var idDocI = charIDToTypeID( "DocI" );
    desc36.putInteger( idDocI, 208 );
executeAction( idMk, desc36, DialogModes.NO );
```
Clean JSX | clean variables ✔︎ clean params ✔︎
```javascript
var desc1 = new ActionDescriptor();
var desc2 = new ActionDescriptor();
desc2.putString( charIDToTypeID( "Nm  " ), """New File""" );
desc2.putBoolean( stringIDToTypeID( "artboard" ), false );
desc2.putClass( charIDToTypeID( "Md  " ), charIDToTypeID( "RGBM" ) );
desc2.putUnitDouble( charIDToTypeID( "Wdth" ), charIDToTypeID( "#Rlt" ), 480.000000 );
desc2.putUnitDouble( charIDToTypeID( "Hght" ), charIDToTypeID( "#Rlt" ), 360.000000 );
desc2.putUnitDouble( charIDToTypeID( "Rslt" ), charIDToTypeID( "#Rsl" ), 300.000000 );
desc2.putDouble( stringIDToTypeID( "pixelScaleFactor" ), 1.000000 );
desc2.putEnumerated( charIDToTypeID( "Fl  " ), charIDToTypeID( "Fl  " ), charIDToTypeID( "Trns" ) );
desc2.putInteger( charIDToTypeID( "Dpth" ), 8 );
desc2.putString( stringIDToTypeID( "profile" ), """sRGB IEC61966-2.1""" );
desc1.putObject( charIDToTypeID( "Nw  " ), charIDToTypeID( "Dcmn" ), desc2 );
desc1.putInteger( charIDToTypeID( "DocI" ), 208 );
executeAction( charIDToTypeID( "Mk  " ), desc1, DialogModes.NO );
```
Sort IDs | clean variables ✔︎ clean params ✔︎
```javascript
var idMk = charIDToTypeID( "Mk  " );
var idNw = charIDToTypeID( "Nw  " );
var idNm = charIDToTypeID( "Nm  " );
var idartboard = stringIDToTypeID( "artboard" );
var idMd = charIDToTypeID( "Md  " );
var idRGBM = charIDToTypeID( "RGBM" );
var idWdth = charIDToTypeID( "Wdth" );
var idRlt = charIDToTypeID( "#Rlt" );
var idHght = charIDToTypeID( "Hght" );
var idRslt = charIDToTypeID( "Rslt" );
var idRsl = charIDToTypeID( "#Rsl" );
var idpixelScaleFactor = stringIDToTypeID( "pixelScaleFactor" );
var idFl = charIDToTypeID( "Fl  " );
var idTrns = charIDToTypeID( "Trns" );
var idDpth = charIDToTypeID( "Dpth" );
var idprofile = stringIDToTypeID( "profile" );
var idDcmn = charIDToTypeID( "Dcmn" );
var idDocI = charIDToTypeID( "DocI" );

var desc1 = new ActionDescriptor();
var desc2 = new ActionDescriptor();
desc2.putString( idNm, """New File""" );
desc2.putBoolean( idartboard, false );
desc2.putClass( idMd, idRGBM );
desc2.putUnitDouble( idWdth, idRlt, 480.000000 );
desc2.putUnitDouble( idHght, idRlt, 360.000000 );
desc2.putUnitDouble( idRslt, idRsl, 300.000000 );
desc2.putDouble( idpixelScaleFactor, 1.000000 );
desc2.putEnumerated( idFl, idFl, idTrns );
desc2.putInteger( idDpth, 8 );
desc2.putString( idprofile, """sRGB IEC61966-2.1""" );
desc1.putObject( idNw, idDcmn, desc2 );
desc1.putInteger( idDocI, 208 );
executeAction( idMk, desc1, DialogModes.NO );
```
Create function | clean variables ✔︎ clean params ✔︎
```javascript
function makeNewDocument(params) {
	var desc1 = new ActionDescriptor();
	var desc2 = new ActionDescriptor();
	desc2.putString( charIDToTypeID( "Nm  " ), params.name);
	desc2.putBoolean( stringIDToTypeID( "artboard" ), params.artboard);
	desc2.putClass( charIDToTypeID( "Md  " ), charIDToTypeID( "RGBM" ) );
	desc2.putUnitDouble( charIDToTypeID( "Wdth" ), charIDToTypeID( "#Rlt" ), params.width);
	desc2.putUnitDouble( charIDToTypeID( "Hght" ), charIDToTypeID( "#Rlt" ), params.height);
	desc2.putUnitDouble( charIDToTypeID( "Rslt" ), charIDToTypeID( "#Rsl" ), params.resolution);
	desc2.putDouble( stringIDToTypeID( "pixelScaleFactor" ), params.pixelScaleFactor);
	desc2.putEnumerated( charIDToTypeID( "Fl  " ), charIDToTypeID( "Fl  " ), charIDToTypeID( "Trns" ) );
	desc2.putInteger( charIDToTypeID( "Dpth" ), params.depth);
	desc2.putString( stringIDToTypeID( "profile" ), params.profile);
	desc1.putObject( charIDToTypeID( "Nw  " ), charIDToTypeID( "Dcmn" ), desc2 );
	desc1.putInteger( charIDToTypeID( "DocI" ), params.docID);
	executeAction( charIDToTypeID( "Mk  " ), desc1, DialogModes.NO );
}

var params = {
	name: "New File" ,
	artboard: false ,
	width: 480.000000 ,
	height: 360.000000 ,
	resolution: 300.000000 ,
	pixelScaleFactor: 1.000000 ,
	depth: 8 ,
	profile: "sRGB IEC61966-2.1" ,
	docID: 208
};

makeNewDocument(params);
```

## Changelog
**v1.0.0 (Dec 03 2017)**
* First release
* Feature: "Clean JSX"
* Feature: "Sort IDs"
* Feature: "Create Function"
* Feature: "Clean variables"
* Feature: "Clean params"
* Added Prism for easy readability

**v0.0.0 (Aug 16 2017)**
* Initial development.

## License
MIT © Javier Aroche
