(function( ){

var base = (function(){

var base = function(){
        return base.prototype;
    },
    base62 = function(){
        return base62.prototype;
    },
    baseKey62 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

base62.prototype = {
    encode: function( str ){
        var res = "", tmp = 0, i = 0, p, idx = 0;
    
        str = utf8.encode( str );
    
        for ( i, p = 1; i < str.length; i++ ){
            offset = Math.pow( 2, p )
            shift_pos = p * 2;
            idx = tmp | ( str.charCodeAt(i) >> shift_pos );
            tmp = str.charCodeAt(i) & ( Math.pow( 2, shift_pos ) - 1 );
    
            if ( offset < 8 ) tmp <<= ( 8 / offset );
    
            res += ( idx < 61 ? baseKey62.charAt( idx ) : baseKey62.charAt( 61 ) + baseKey62.charAt( idx - 61 ) );
    
            if ( p == 3 || ( i + 1 ) == str.length ){
                res += tmp < 61 ? baseKey62.charAt( tmp ) :
                    baseKey62.charAt( 61 ) + baseKey62.charAt( tmp - 61 );
    
                p = 0;
                tmp = 0;
            }
    
            p++;
        }
    
        return res;
    },
    decode: function( str ){
        var res = "", i = 0, ary = [];
    
        while ( i < str.length ){
            if ( baseKey62.indexOf( str.charAt( i ) ) == -1 ) return str;

            if ( str.charAt(i) != baseKey62.charAt(61) ){
                ary.push( baseKey62.indexOf( str.charAt(i++) ) );
            }
            else {
                if ( str.charAt(i++) != baseKey62.charAt(61) ){
                    ary.push( baseKey62.indexOf( str.charCodeAt(i++) ) + 0x3d );
                }
            }
    
            if ( ary.length > 0 && ary.length % 4 == 0 ){
                res += String.fromCharCode( ( ary[0] << 0x02 ) | ( ary[1] >> 0x04 ) );
                res += String.fromCharCode( ( (ary[1] & 0x0f ) << 0x04 ) | ( ary[2] >> 0x02 ) );
                res += String.fromCharCode( ( (ary[2] & 0x03 ) << 0x06) | ary[3] );
    
                /* reset array */
                ary = []
            }
        }
    
        if ( ary.length > 0 && ary.length < 4 ){
            if ( ary.length == 1 ) res += String.fromCharCode( ( ary[0] << 0x02 ) );
            else if ( ary.length == 2 ) res += String.fromCharCode( ( ary[0] << 0x02 ) | ( ary[1] >> 0x04 ) );
            else if ( ary.length == 3 ){
                res += String.fromCharCode( ( ary[0] << 0x02 ) | ( ary[1] >> 0x04 ) );
                res += String.fromCharCode( ( (ary[1] & 0x0f ) << 0x04 ) | ( ary[2] >> 0x02 ) );
            }
        }
    
        return utf8.decode( res );
    }
};

base.prototype = {
    constructor: base,
    base62: base62()
};

return base;
})();

//definite global variable
window.base62 = base().base62;

})()
