var config = require('../config/config');
var mongoose = require('mongoose');
var CodePad = mongoose.model('CodePad');
var utils = require(config.root + '/helper/utils');
var screenshot = require('url-to-screenshot');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var _ = require('lodash');
var randomstring = require("randomstring")

var codepads = require('express').Router();

exports.load = function(req, res, next) {
  CodePad.load(req.params.codePadId, function (err, codePad) {
    req.codePad = codePad
    next()
  })
}

/* Create a CodePad */

exports.create = function (req, res, next) {
  var codePad = new CodePad({
  	_id : randomstring.generate(6)
  });

  codePad.save(function(err, curCodePad){
  	if(err){
  		res.send(err);
  	}
  	req.session[curCodePad._id] = curCodePad.editKey;
	res.redirect('/' + curCodePad._id);
  });
  
}

exports.getInfo = function (req, res, next){
	var codePad = req.codePad;
}


exports.show  = function(req, res, next){
	if(req.codePad){

	}else{
		res.render('404', {
			error : "404 - Not Found",
			url   : 'Your requested url is not available.'
		});
		return;
	}

	var codePad = req.codePad;


	
	codePad.readOnly = true;

	if(req.session[codePad._id]){
		if(req.session[codePad._id] == codePad.editKey){
			codePad.readOnly = false;
		}
	}

	codePad = _.pick(codePad, '_id', 'language', 'code', 'readOnly');

	res.render('codepads/show',{
		title : 'CodePal',
		codePad : codePad
	});
}


exports.edit = function(req, res, next){
	var codePad = req.codePad;
	if(codePad){

	}else{
		res.send(404);
	}

	if(req.session[codePad._id]){
		if(req.session[codePad._id] == codePad.editKey){

		}else{
			res.send(403);
		}
	}else{
		res.send(403);
	}

	codePad.language = req.body.language;
	codePad.code 	 = req.body.code;

	codePad.save(function(err){
		if(err){
			res.send(err);
		}

		res.json({
			'success' : true
		});
	});
}
