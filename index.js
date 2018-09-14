var md5 = require('md5');
var fs = require('fs');
var loaderUtils = require("loader-utils");
//var mime = require("mime");
var tinify = require('tinify');
var path = require("path");
var log = require('./log.js');
/**
 *
 *
 * @param {*} content img buffer
 * @param {*} options 配置
 * @param {*} context 上下文
 * @returns
 * 
 */

function tinifyImg(resourcePath, options, context) {
    tinify.key = options.key;
    var p = new Promise((resolve, reject) => {
        log.default.info('tinify ' + context.resource);
        tinify.fromBuffer(fs.readFileSync(resourcePath)).toBuffer((err, data) => {
            if (err) {
                throw err;
                reject(fs.readFileSync(resourcePath));
            }
            resolve(data)

        })
    })
    return p;
}
var cacheModule = {
    is_cache: false,
    cacheFile: 'cache_tinypng.json',
    cacheDir: 'tinifiedImgs',
    getCache: function () {
        if (!this.is_cache) {
            return {};
        }
        var is_exist = fs.existsSync(this.cacheFile);
        if (is_exist) {
            this.data = fs.readFileSync(this.cacheFile, "utf-8");
            try {
                this.data = JSON.parse(this.data);
            } catch (e) {
                this.data = {};
            }
        } else {
            this.data = {};
        }
        return this.data;
    },
    getCacheByMd5: function (fileMd5) {
        if (!this.is_cache) {
            return null;
        }
        if (!this.data) {
            this.getCache();
        }
        return this.data[fileMd5];
    },
    setCache: function (fileMd5, buffer, resourcePath, radio) {
        var basename = path.basename(resourcePath);
        if (!this.is_cache) {
            return false;
        }
        if (!this.data) {
            this.getCache();
        }
        if (fs.existsSync(this.cacheDir)) {
            fs.writeFileSync(path.resolve(this.cacheDir, basename), buffer);
        } else {
            fs.mkdirSync(this.cacheDir);
            fs.writeFileSync(path.resolve(this.cacheDir, basename), buffer);
        }
        var saveObj = {
            originPath: resourcePath,
            tinifiedPath: path.resolve(this.cacheDir, basename),
            radio: radio
        }
        this.data[fileMd5] = saveObj;
        fs.writeFileSync(this.cacheFile, JSON.stringify(this.data));
    }
}

module.exports = function (imgSource) {
    //var filePath = this.resourcePath
    var fileMd5 = md5(imgSource + this.resourcePath);
    this.cacheable && this.cacheable();
    var options = loaderUtils.getOptions(this) || {};
    var content = null;
    var fileLoader = require("file-loader");
    if (!options.isProduct) {//默认 生产环境启用tinypng
        return fileLoader.call(this, imgSource);
    }
    content = imgSource;
    // if (limit) {
    //     limit = parseInt(limit, 10);
    // }
    if (options.cache) {
        cacheModule.is_cache = true;
        var cacheValue = cacheModule.getCacheByMd5(fileMd5);
        if (cacheValue) {
            log.default.warn('fromCache radio= ' + cacheValue['radio'] + " " + cacheValue['tinifiedPath']);
            return fileLoader.call(this, fs.readFileSync(cacheValue['tinifiedPath']));
        }
    }

    //var mimetype = options.mimetype || options.minetype || mime.lookup(this.resourcePath);

    // No limits or limit more than content length
    // if (!limit || content.length < limit) {

    //     if (typeof content === "string") {
    //         content = new Buffer(content);
    //     }
    //     return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
    // } else {
    var callback = this.async();
    var that = this;
    var radio = 0;
    tinifyImg(this.resourcePath, options, this)
        .then(tinifiedBuffer => {
            radio = Math.round(tinifiedBuffer.length / content.length * 10000) / 100 + "% ";
            log.default.note('\n tinyfy end  radio ' + radio + " " + this.resourcePath);
            cacheModule.setCache(fileMd5, tinifiedBuffer, this.resourcePath, radio);
            callback(null, fileLoader.call(this, tinifiedBuffer));
        })
        .catch(e => {
            log.default.info(e);
            callback(null, fileLoader.call(this, content));
        })

    // }
}

module.exports.raw = true;
