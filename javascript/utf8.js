/*
 * File: utf8.js
 * Author: David Park
 * Date: 2016-04-17
*/

/* utf-8 encoder, decoder */
/*
UTF-8 definition - RFC 3629(3)

Char. number range  |        UTF-8 octet sequence
   (hexadecimal)    |              (binary)
--------------------+---------------------------------------------
0000 0000-0000 007F | 0xxxxxxx
0000 0080-0000 07FF | 110xxxxx 10xxxxxx
0000 0800-0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx
0001 0000-0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
*/

(function(){

var utf8 = (function(){

var utf8 = function( ){
        /* duplicate function */
        return utf8.prototype;
    },
    merge = function( a, b ){
        var i = a.length,
            j = 0;
        if ( typeof b.length === "number" ){
            for ( var k = b.length; j < k; ){
                a[ i++ ] = b[ j++ ];
            }
        }
        else {
            while ( b[j] !== undefined ){
                a[ i++ ] = b[ j++ ];
            }
        }
    },
    toBin = function( n ){
        var ret = [];

        while( true ){
            if ( n == 0 ) break;

            ret.push( n % 2 );
            n = Math.floor( n / 2 );
        }

        return ret.reverse();
    },
    toHex = function( n ){
        var ret = [], bin = [], len = 0,
            tmp = [];

        bin = toBin( n );
        len = bin.length;

        if ( len % 4 > 0 )
            for ( var i = 0; i < 4 - ( len % 4 ); i++ )
                tmp.push( 0 );

        merge( tmp, bin );

        for ( var i = 0; i < tmp.length; ){
            var hex = tmp.splice( 0, 4 ), calc = 0;

            for ( var j = 0; hex.length; j++ ){
                calc += hex[j] * Math.pow( 2, ( hex.length - 1 ) - j );
                ret.push( calc );
            }

            //proceed point
            i += 4;
        }

        return ret;
    },
    getBuffer = function( buf, x, length ){
        if ( buf.length > x && buf.length >= ( x + length ) ){
            var ary = [];

            for ( var i = 0; i < length; i++ )
                ary.push( buf[x++] );

            return ary;
        }

        return [];
    };

utf8.prototype = {
    encode: function( str ){
        var i = 0, len = 0,
            string = "", buf = [];

        len = str.length;
        
        for( ; i < len; i++ ){
            var data = str.charCodeAt(i);
            if ( 0x00 <= data && 0x7f >= data ){
                buf.push( data );
            }
            else if( 0x80    <= data && 0x7ff   >= data ){
                buf.push( ( data >> 0x06 ) | 0xc0 );
                buf.push( ( data  & 0x3f ) | 0x80 );
            }
            else if( 0x800   <= data && 0xffff  >= data ){
                buf.push( ( data >> 0x0c ) | 0xe0 );
                buf.push( ( ( data & 0xfff ) >> 0x06 ) | 0x80 );
                buf.push( ( data & 0x3f ) | 0x80 );
            }
            else if( 0x10000 <= data && 0x10ffff >= data ){
                buf.push( ( data >> 0x12 ) | 0xf0 );
                buf.push( ( ( data & 0x3ffff ) >> 0x0c ) | 0x80 );
                buf.push( ( ( data & 0x00fff ) >> 0x06 ) | 0x80 );
                buf.push( ( data & 0x3f ) | 0x80 );
            }
        }

        for ( i = 0; i < buf.length; )
            string += String.fromCharCode( buf[i++] );

        return string;
    },
    decode: function( str ){
        var i = 0, j = 0, len = str.length,
            string = "", binary = [];

        for ( ; i < len; )
            binary.push( str.charCodeAt( i++ ) );

        i = 0;
        len = binary.length;

        for ( ; i < len; ){
            var first = [], end = [], buf = [],code = 0,
                data = binary[i];

            if ( 0x00 <= data && 0x7f >= data ){
                // ASCII CODE
                code = data;
                string += String.fromCharCode( code );

                i++;
            }
            else if ( 0xc0 <= data && 0xdf >= data ){
                buf = getBuffer( binary, i, 2 );

                for ( j = 0; j < buf.length; j++ ){
                    if ( j == 0 )
                        first = toBin( buf[j] & 0x1f );
                    else
                        merge( end, toBin( buf[j] ).slice( 2 ) );
                }

                merge( first, end );

                for ( j = 0; j < first.length; j++ )
                    code += first[j] * Math.pow( 2, ( first.length - 1 ) - j );

                string += String.fromCharCode( code );

                i += 2;
            }
            else if ( 0xe0 <= data && 0xef >= data ){
                buf = getBuffer( binary, i, 3 );

                for ( j = 0; j < buf.length; j++ ){
                    if ( j == 0 )
                        first = toBin( buf[j] & 0x1f );
                    else
                        merge( end, toBin( buf[j] ).slice( 2 ) );
                }

                merge( first, end );

                for ( j = 0; j < first.length; j++ )
                    code += first[j] * Math.pow( 2, ( first.length - 1 ) - j );

                string += String.fromCharCode( code );

                i += 3;
            }
            else if ( 0xf0 <= data && 0xf7 >= data ){
                buf = getBuffer( binary, i, 4 );

                for ( j = 0; j < buf.length; j++ ){
                    if ( j == 0 )
                        first = toBin( buf[j] & 0x1f );
                    else
                        merge( end, toBin( buf[j] ).slice( 2 ) );
                }

                merge( first, end );

                for ( j = 0; j < first.length; j++ )
                    code += first[j] * Math.pow( 2, ( first.length - 1 ) - j );

                string += String.fromCharCode( code );

                i += 4;
            }
        }

        return string;
    }
};

return utf8;

})();

/* global variable */
window.utf8 = new utf8();

})();
