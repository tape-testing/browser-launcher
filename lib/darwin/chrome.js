var exec = require('child_process').exec;
var plist = require('plist');
var fs = require('fs');
var path = require('path');
var util = require('./util');
var exists = util.exists;

var getPathResult;
var getPath = function(callback) {
    if (getPathResult) {
        return callback.apply(null, getPathResult);
    }

    util.find('com.google.Chrome', function(err, p) {
        getPathResult = [err, p];
        getPath(callback);
    });
};

var getVersion = function(callback) {
    getPath(function(err, p) {
        if (err) {
            return callback(err);
        }
        var pl = path.join(p, 'Contents', 'Info.plist');
        exists(pl, function(y) {
            if (y) {
                var file = fs.readFileSync(pl, 'utf8');
                plist.parse(file, function(err, data) {
                    callback(err, data[0].KSVersion);
                });
            } else {
                callback('not installed');
            }
        });
    });
};

exports.path = getPath;
exports.version = getVersion;
