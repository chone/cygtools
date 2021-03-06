#!/usr/bin/env node

/**
 * Useage: 
 *  1. install this script use this command
 *    $ npm install -g .
 *  2. run command 'chrome' in cygwin like 
 *    $ chrome http://github.com
 *    $ chrome ./my/page/index.html
 */

var exec = require('child_process').exec;
var path = require('path');

getUri(function(uri) {
  exec(getChromeUri() + ' ' + uri);
});

/**
 * Returns path of file chrome.exe in Windows.
 * @return {string}
 */
function getChromeUri() {
  return '%UserProfile%/AppData/Local/Google/Chrome/Application/chrome.exe';
}

/**
 * Find the command line first param as a local path in Windows or a url 
 * of website. 
 * @param {Function} callback Success callback. 
 * @param {Function} fail Failure callback. 
 */
function getUri(callback, fail) {
  var uri = process.argv[2];
  if (!uri) {
    callback('.');
  } else if (/^http/.exec(uri)) {
    callback(uri);
  } else {
    exec('cygpath -m ' + uri, function(err, stdout) {
      if (stdout) {
	callback(stdout);
      } else {
	fail(err);
      }
    });
  }
}
