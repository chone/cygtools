#!/usr/bin/env node

/**
 * Useage: 
 *  1. install this script use npm command
 *    $ npm install -g .
 *  2. run command 'hosts' in cygwin like 
 *    $ hosts add mydomain.com 127.0.0.1 
 *    $ hosts remove mydomain.com 127.0.0.1 
 *    $ hosts set mydomain.com 127.0.0.1 
 *    $ hosts find mydomain.com  
 */

var exec = require('child_process').exec;
var fs = require('fs');

doAction(getParams());

/**
 * Returns command params as a object.
 * @return {Object}
 */
function getParams() {
  var argv = process.argv;
  var action = argv[2];
  var domain = argv[3];
  var ip = argv[4];
  if (!/[0-9]*\.[0-9]*\.[0-9]\.[0-9]/.exec(ip)) {
    console.log('Invalid ip ' + ip);
    return;
  }
  return {
    action: action, 
    domain: domain, 
    ip: ip
  };
}

/**
 * Run action. 
 * @param {Object} param
 */
function doAction(param) {
  if (!param) return;
  switch(param.action) {
    case 'add':
      add(param.domain, param.ip);
      break;
    case 'remove':
      remove(param.domain);
      break;
    case 'set':
      set(param.domain, param.ip);
      break;
    case 'find':
      find(param.domain);
      break;
  }
}

/**
 * Returns path of file hosts in Windows.
 * @return {string}
 */
function getHostsPath() {
  return 'C:/Windows/System32/drivers/etc/hosts';
}

/**
 * Add a host configuration.
 * @param {String} domain
 * @param {String} ip
 */
function add(domain, ip) {
  if (_find(domain)) {
    console.log('Domain ' + domain + ' has been set in hosts file.');
  } else {
    fs.appendFile(getHostsPath(), createLine(domain, ip), function(err) {
      if (err) throw err;
    });
  }
}

/**
 * Add or replace a host domain.
 * @param {string} domain
 * @parma {string} ip
 */
function set(domain, ip) {
  var res = _find(domain);
  if (res) {
    var content = res.content.replace(res.regex, createLine(domain, ip));
    fs.writeFileSync(getHostsPath(), content, 'utf-8');
  } else {
    add(domain, ip);
  }
}

/**
 * Reomve a host domain.
 * @param {string} domain
 */
function remove(domain) {
  var res = _find(domain);
  if (res) {
    var content = res.content.replace(res.regex, '');
    fs.writeFileSync(getHostsPath(), content, 'utf-8');
  } else {
    console.log('Domain ' + domain + ' not set in hosts file.');
  }
}

/**
 * Find a host domain.
 * @param {string} domain
 */
function find(domain) {
  var res = _find(domain);
  if (res) {
    console.log(res.domain + ' ' + res.ip);
  }
}

/**
 * Return a line of hosts.
 * @param {string} domain
 * @parma {string} ip
 */
function createLine(domain, ip) {
  return "\n" + ip + ' ' + domain;
}

/**
 * Find a host ip in hosts file.
 * @param {string} domain
 * @return {Object|undefined}
 */
function _find(domain) {
  var content = fs.readFileSync(getHostsPath(), 'utf-8');
  var regex = new RegExp('\\n?([0-9]*\.[0-9]*\.[0-9]\.[0-9]) ' + domain);
  var matcher = content.match(regex);
  if (matcher && matcher[1]) {
    return {
      domain: domain,
      ip: matcher[1],
      regex: regex,
      content: content
    }
  }
}


