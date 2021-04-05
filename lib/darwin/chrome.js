var exec = require('child_process').exec;
var plist = require('plist');
var fs = require('fs');
var path = require('path');
var util = require('./util');
var exists = util.exists;

var currentPathError;
var currentPath;
var getPath = function(callback) {
    if (currentPathError || currentPath) {
        return callback(currentPathError, currentPath);
    }

    util.find('com.google.Chrome', function(err, p) {
        currentPathError = err;
        currentPath = p;
        callback(currentPathError, currentPath);
    });
};

var getVersion = function(callback) {
    getPath(function(err, p) {
        if (err) {
            return callback(err, null);
        }
        var pl = path.join(p, 'Contents', 'Info.plist');
        exists(pl, function(y) {
            if (y) {
                var file = fs.readFileSync(pl, 'utf8');
                plist.parse(file, function(err, data) {
                    callback(err, data[0].KSVersion);
                });
            } else {
                callback('not installed', null);
            }
        });
    });
};

exports.path = getPath;
exports.version = getVersion;
