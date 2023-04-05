/*
 * File: url.js
 * Author: David Park
 * Date: 2016-04-17

 * require utf8.js
*/

(function(){

var URL = (function( ){

var URL = function(){
        return URL.object;
    };

URL.object = URL.prototype = {
    constructor: URL,
    encode: function( str ){
        var res = "", len,
            i = 0;

        len = str.length;

        for ( ; i < len; i++ ){
            var charCode = str.charCodeAt(i),
                j = 0;
            if ( charCode <= 0x7f ){
                res += "%" + charCode.toString(16).toUpperCase();
            }
            else {
                var utftext = utf8.encode( str.charAt(i) );
                for ( ; j < utftext.length; ){
                    res += "%" + utftext.charCodeAt( j++ ).toString(16).toUpperCase();
                }
            }
        }

        return res;
    },
    decode: function( str ){
        var res = "", buf = [], len = "",
            i = 0;

        len = str.length;
        for ( ; i < len; ){
            var data = str.charAt(i);
            if ( data == "%" ){
                buf.push( parseInt( str.charAt(i+1) + str.charAt(i+2), 16 ) );
                i += 3;
            }
            else {
                if ( data.charCodeAt(0) > 0x7f ) return str;

                buf.push( data.charCodeAt(0) );
                i++;
            }
        }

        len = buf.length;

        for ( i = 0 ; i < len; ){
            var tmp, data = buf[i];

            if ( 0x00 <= data && 0x7f >= data ){
                res += String.fromCharCode( buf[i++] );
            }
            else if( 0xc0 <= data && 0xdf >= data ){
                tmp = String.fromCharCode( buf[i++] ) + String.fromCharCode( buf[i++] );

                res += utf8.decode( tmp );
            }
            else if( 0xe0 <= data && 0xef >= data ){
                tmp = String.fromCharCode( buf[i++] ) + String.fromCharCode( buf[i++] ) + String.fromCharCode( buf[i++] );

                res += utf8.decode( tmp );
            }
            else if( 0xf0 <= data && 0xf7 >= data ){
                tmp = String.fromCharCode( buf[i++] ) + String.fromCharCode( buf[i++] ) + String.fromCharCode( buf[i++] ) + String.fromCharCode( buf[i++] );

                res += utf8.decode( tmp );
            }
        }

        return res;
    }
};

return URL;

})();

//global variable
window.url_encode = URL().encode;
window.url_decode = URL().decode;

})();
