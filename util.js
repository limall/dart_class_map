const fs = require('fs');

module.exports = {
    passChar: function (src, passChar, start) {
        if (!start) {
            start = 0;
        }

        const chars = src.split('');
        var index = start;
        while (index < chars.length) {
            if (chars[index] != passChar) {
                return index;
            }
            index++;
        }
        return index;
    },
    lastPassChar: function (src, passChar, start) {
        if (!start) {
            start = src.length - 1;
        }

        const chars = src.split('');
        var index = start;
        while (index >= 0) {
            if (chars[index] != passChar) {
                return index;
            }
            index--;
        }
        return index;
    },
    passCharUntil: function (src, untilChar, start) {
        if (!start) {
            start = 0;
        }

        const chars = src.split('');
        var index = start;
        while (index < chars.length) {
            if (chars[index] == untilChar) {
                return index;
            }
            index++;
        }
        return index;
    },
    lastPassCharUntil: function (src, untilChar, start) {
        if (!start) {
            start = src.length - 1;
        }

        const chars = src.split('');
        var index = start;
        while (index >= 0) {
            if (chars[index] == untilChar) {
                return index;
            }
            index--;
        }
        return index;
    },
    getOperateEnd:function(src,startIndex,endChar){
        const chars=src.split('');
        const startChar=chars[startIndex];

        var index=startIndex+1;
        var value=1;
        while(index<chars.length){
            if(chars[index]==startChar){
                value++;
            }else if(chars[index]==endChar){
                value--;
            }
            if(value==0){
                return index;
            }
            index++;
        }
        return index;
    },
};