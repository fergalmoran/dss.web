/**
 * Created by fergalm on 16/08/15.
 */

module.exports = DualKeyDict;
var Map = require("collections/map");

//this is the usual key val map
var __items = Map();
//this is a secondary map that maps secondary keys to primary keys
var __keyMap = Map();

function DualKeyDict() {

}

DualKeyDict.prototype.forEach = function (key, callback) {
    __items.forEach(function (result) {
        callback(result);
    })
};

DualKeyDict.prototype.has = function (key) {
    if (key.length != 2)
        throw new Error("key must be array of length 2.");
    if (key[0] != null)
        return __items.has(key[0]);
    else if (key[1] != null)
        return __keyMap.has(key[1]);
    else
        throw new Error("Must specify at least one key.");
};

DualKeyDict.prototype.set = function (key, value) {
    if (key.length != 2)
        throw new Error("key must be array of length 2.");
    __items[key[0]] = value;
    __keyMap[key[1]] = key[0];
};

DualKeyDict.prototype.get = function (key) {
    if (key.length != 2)
        throw new Error("key must be array of length 2.");
    if (key[0] != null)
        return __items.get(key[0]);
    else if (key[1] != null)
        return __items[__keyMap.get(key[1])];
    else
        throw new Error("Must specify at least one key.");
};

DualKeyDict.prototype.delete = function (key) {
    if (key.length != 2)
        throw new Error("key must be array of length 2.");
    if (key[0] != null) {
        __items.delete(key[0]);
        __keyMap.has(key[1]);
    }
    if (key[1] != null) {
        __items[__keyMap.get(key[1])].delete();
        __keyMap.delete(key[1]);
    }
};
