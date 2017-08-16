# Parse-Action-Descriptor-Code
[![npm-image](https://img.shields.io/badge/parse--action--descriptor--code-v0.0.0-09bc00.svg)](https://github.com/JavierAroche/parse-action-descriptor-code)

## Description
Parse your Photoshop Action Descriptor code from the Scripting Listener into a more readable format.

## Example
```javascript
// Input from the Scripting Listener
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


// Output from parse-action-descriptor-code
var desc36 = new ActionDescriptor();
var desc37 = new ActionDescriptor();
desc37.putString( charIDToTypeID( "Nm  " ), """New File""" );
desc37.putBoolean( stringIDToTypeID( "artboard" ), false );
desc37.putClass( charIDToTypeID( "Md  " ), charIDToTypeID( "RGBM" ) );
desc37.putUnitDouble( charIDToTypeID( "Wdth" ), charIDToTypeID( "#Rlt" ), 480.000000 );
desc37.putUnitDouble( charIDToTypeID( "Hght" ), charIDToTypeID( "#Rlt" ), 360.000000 );
desc37.putUnitDouble( charIDToTypeID( "Rslt" ), charIDToTypeID( "#Rsl" ), 300.000000 );
desc37.putDouble( stringIDToTypeID( "pixelScaleFactor" ), 1.000000 );
desc37.putEnumerated( charIDToTypeID( "Fl  " ), charIDToTypeID( "Fl  " ), charIDToTypeID( "Trns" ) );
desc37.putInteger( charIDToTypeID( "Dpth" ), 8 );
desc37.putString( stringIDToTypeID( "profile" ), """sRGB IEC61966-2.1""" );
desc36.putObject( charIDToTypeID( "Nw  " ), charIDToTypeID( "Dcmn" ), desc37 );
desc36.putInteger( charIDToTypeID( "DocI" ), 208 );
executeAction(charIDToTypeID( "Mk  " ), desc36, DialogModes.NO );
```

## Usage
Copy and paste your output from the Scripting Listener into the Input text area. Hit "parse", and your parsed code will be shown in the Output text area.

## Changelog
**v0.0.0 (Aug 16 2017)**
* Initial development.

## License
MIT © Javier Aroche
