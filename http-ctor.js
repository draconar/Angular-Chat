//'use strict';

function httpRequest(options, scope, q){
	//options esperadas: method, url, timeout, headers, parameters, onprogress
	this.deferred = q.defer();
	this.request;
	this.encodedParameters = "";
	this.actualURL = "";
	if (!("method" in options)) options.method = "get";
	if (window.XDomainRequest){
		//XDomainRequest usado para IE8+
		this.request = new XDomainRequest();
		if ("headers" in options){
			for (var header in options.headers){
				if (!("parameters" in options)) options.parameters = {};
				options.parameters['errorOnResponseBody'] = true;
				options.parameters['referer'] = document.location.href;
				if (header.toLowerCase() == "accept"){
					switch(options.headers[header].toLowerCase()){
						case 'application/json' : options.parameters['format'] = 'json';break;
						case 'application/xml' : options.parameters['format'] = 'xml';break;
						case 'application/x-javascript' : options.parameters['format'] = 'jsonp';break;
					}
				}
			}
		}
	} else {
		this.request = new XMLHttpRequest();
	}
	if ("parameters" in options){
		for (var param in options.parameters){
			this.encodedParameters = this.encodedParameters + param + "=" + encodeURIComponent(options.parameters[param]) + "&";
		}
		this.encodedParameters = this.encodedParameters.slice(0,this.encodedParameters.length-1);
	}
	if (options.method.toLowerCase() == "get") {
		if (this.encodedParameters.length>0){
			this.actualURL = options.url.indexOf("?")!=-1 ? options.url + "&" + this.encodedParameters : options.url + "?" + this.encodedParameters;
		} else {
			this.actualURL = options.url;
		}
	} else {
		this.actualURL = options.url;
	}
	this.request.open(options.method, this.actualURL, true);
	//this.request.timeout = options.timeout || 60000;
	this.request.withCredentials = true;
	if ("XDomainRequest" in window){
		if (options.method.toLowerCase() == "post") {
			if (this.encodedParameters.length > 0) this.encodedParameters = this.encodedParameters + "&";
			this.encodedParameters = this.encodedParameters + "cookie=" + encodeURIComponent(document.cookie);
		}
	} else {
		//Headers somente para XHR
		if ("headers" in options){
			for (var header in options.headers){
				this.request.setRequestHeader(header, options.headers[header]);
			}
			if (options.method.toLowerCase() == "post"){
				this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
			}
		}
	}
	if ("onprogress" in options){
		this.request.onprogress = options.onprogress;
	}
	this.request.onload = (function(d) {
		var deferred = d;
	return function(){
		if(!scope.$$phase) {
			var request = this;
			scope.$apply(function(){
				if("responseText" in request && request.responseText.indexOf("errorMessage")==-1){

		console.log('deferred resolve 1')
					deferred.resolve(request.responseText);
				} else {
		
		console.log('deferred reject 1')

					deferred.reject(request.responseText);
				}
			});
		} else {
			if("responseText" in this && this.responseText.indexOf("errorMessage")==-1){ 
				console.log('deferred resolve 2')
				deferred.resolve(this.responseText);
			} else {
				console.log('deferred resolve 2')
				deferred.reject(this.responseText);
			}
		}
	}})(this.deferred);
	this.request.onerror = (function(d) {
		var deferred = d;
		return function(){
		if(!scope.$$phase) {
			scope.$apply(function(){
				deferred.reject(request.responseText);
			});
		} else {
			deferred.reject(request.responseText);
		}
	}})(this.deferred);

	

	if (options.method.toLowerCase() == "get") {
		this.request.send();
	} else if (options.method.toLowerCase() == "post"){
		this.request.send(this.encodedParameters);
	}
	
};
