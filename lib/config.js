var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

var defaultConfigFile = (process.env.HOME || process.env.USERDIR)
    + '/.config/browser-launcher/config.json';
exports.defaultConfigFile = defaultConfigFile;

exports.read = function (configFile, cb) {
    if (typeof configFile === 'function') {
        cb = configFile;
        configFile = defaultConfigFile;
    }
    if (!configFile) configFile = defaultConfigFile;
    var configDir = path.dirname(configFile);
    mkdirp(configDir)
        .then(function (made) {
            (fs.exists || path.exists)(configFile, function (ex) {
            if (ex) {
                fs.readFile(configFile, function (err, src) {
                    cb(null, JSON.parse(src), configDir);
                })
            }
            else cb(null, undefined, configDir);
            });
        })
        .catch(function (err) {
            return cb(err);
        })
};

exports.write = function (configFile, config, cb) {
    if (!cb) cb = function () {};
    if (typeof configFile === 'object') {
        cb = config;
        config = configFile;
        configFile = defaultConfigFile;
    }
    var configDir = path.dirname(configFile);
    var src = JSON.stringify(config, null, 2);
    mkdirp(configDir)
        .then(function (made) {
            fs.writeFile(configFile, src, cb);
        })
        .catch(function (err) {
            return cb(err)
        });
};
