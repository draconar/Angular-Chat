//'use strict';

function HttpRequest(options, scope, q){
	//options esperadas: method, url, timeout, headers, parameters, onprogress, pollInterval, useXDR
	this.q = q;
	this.scope = scope;
	this.options = options;
	this.deferred = null;
	this.request = null;
	this.startOfRequest = null;
	
	this.isExpired = function(){
		if ("pollInterval" in this.options){
			if (this.startOfRequest == null) return false;
			return this.startOfRequest.getTime() + this.options.pollInterval < (new Date()).getTime();
		} else {
			return false;
		}
	};
	
	this.isCompleted = function(){
		if (this.request == null) return false;
		return this.request.readyState == 4;
	};
	
	this.abort = function(){
		if (!this.isCompleted()){
			this.request.abort();
			if(!this.scope.$$phase) {
				this.scope.$apply((function(d,r){
					var deferred = d;
					var request = r;
					return function(){
						deferred.resolve(request.responseText);
					}
				})(this.deferred, this.request));
			} else {
				this.deferred.resolve(this.request.responseText);
			}
			this.startOfRequest = null;
		}
	};
		
	this.execute = function(){
		var actualURL = "";
		var encodedParameters = "";
		this.deferred = this.q.defer();
		if (!("method" in options)) options.method = "get";
		options.method = options.method.toLowerCase();
		if ("useXDR" in options && options.useXDR == true && !("onprogress" in XMLHttpRequest) && "XDomainRequest" in window){
			//XDomainRequest usado para IE8 e IE9
			this.request = new XDomainRequest();
			if (!("parameters" in options)) options.parameters = {};
			options.parameters['preferResponseBody'] = true;
			options.parameters['referer'] = document.location.href;
			if ("headers" in options){
				for (var header in options.headers){
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
				encodedParameters = encodedParameters + param + "=" + encodeURIComponent(options.parameters[param]) + "&";
			}
			encodedParameters = encodedParameters.slice(0,encodedParameters.length-1);
		}
		if (options.method == "get") {
			if (encodedParameters.length>0){
				actualURL = options.url.indexOf("?")!=-1 ? options.url + "&" + encodedParameters : options.url + "?" + encodedParameters;
			} else {
				actualURL = options.url;
			}
		} else {
			actualURL = options.url;
		}
		this.request.open(options.method, actualURL, true);
		this.request.timeout = options.timeout || 600000;
		this.request.withCredentials = true;
		
		//Headers somente para XHR
		if (!("useXDR" in options) || options.useXDR != true || !("XDomainRequest" in window)) {
			if ("XDomainRequest" in window && !("onprogress" in XMLHttpRequest)){
				this.request.setRequestHeader("Origin", "http://batepapo.uol.com.br");
			} 
			if ("headers" in options){
				for (var header in options.headers){
					this.request.setRequestHeader(header, options.headers[header]);
				}
				if (options.method == "post"){
					this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
				}
			}
		}
		if ("onprogress" in options){
			this.request.onprogress = options.onprogress;
		}
		this.request.onload = (function(r,s,d) {
			var request = r;
			var deferred = d;
			var scope = s;
			return function(){
				if(!scope.$$phase) {
					scope.$apply(function(){
						if("responseText" in request && request.responseText.indexOf("errorMessage")==-1){
							deferred.resolve(request.responseText);
						} else {
							deferred.reject(request.responseText);
						}
					});
				} else {
					if("responseText" in request && request.responseText.indexOf("errorMessage")==-1){ 
						deferred.resolve(request.responseText);
					} else {
						deferred.reject(request.responseText);
					}
				}
			}})(this.request, this.scope, this.deferred);
			
		this.request.onerror = this.request.ontimeout = (function(r,s,d) {
			var request = r;
			var deferred = d;
			var scope = s;
			return function(){
				if(!scope.$$phase) {
					scope.$apply(function(){
						deferred.reject(request.responseText);
					});
				} else {
					deferred.reject(request.responseText);
				}
		}})(this.request, this.scope, this.deferred);

		if (options.method == "get") {
			this.request.send();
		} else if (options.method == "post"){
			this.request.send(encodedParameters);
		}
		this.startOfRequest = new Date();
		return this.deferred.promise;
	};
};

var Resources = {
	protocols : {
		http: "http://",
		https: "https://"
	},
	baseURI : "batepapo.uol.com.br/ws/v1/",
	getPath : function(){
		if ("XDomainRequest" in window && !("onprogress" in XMLHttpRequest)){
			return Resources.protocols.http + Resources.baseURI;
		} else {
			return Resources.protocols.https + Resources.baseURI;
		}
	},
	assets : {
		uri : "assets",
		get: function(){
			return Resources.getPath() + Resources.assets.uri;
		}
	},
	node : {
		uri : "node",
		root : function(){
			return Resources.getPath() + Resources.node.uri + "/root";
		},
		get : function(nodeId){
			return Resources.getPath() + Resources.node.uri + "/" + nodeId;
		},
		join : function(nodeId){
			return Resources.getPath() + Resources.node.uri + "/" + nodeId + "/join";
		},
		spy : function(nodeId){
			return Resources.getPath() + Resources.node.uri + "/" + nodeId + "/spy";
		}
	},
	search : {
		uri : "search",
		room : function(){
			return Resources.getPath() + Resources.search.uri + "/room";
		},
		user : function(){
			return Resources.getPath() + Resources.search.uri + "/user";
		}
	},
	stats : {
		uri : "stats",
		get : function() {
			return Resources.getPath + Resources.stats.uri;
		}
	},
	subscriber : {
		uri : "subscriber",
		getAllowedThemes : function(){
			return Resources.getPath() + Resources.subscriber.uri + "/allowedThemes";
		},
		createRoom : function(roomName){
			return Resources.getPath() + Resources.subscriber.uri + "/room/" + encodeURIComponent(roomName);
		},
		deleteRoom : function(nodeId){
			return Resources.getPath() + Resources.subscriber.uri + "/room/" + nodeId;
		},
		login : function(){
			return Resources.protocols.https + Resources.baseURI + Resources.subscriber.uri + "/login";
		},
		logout : function(){
			return Resources.protocols.https + Resources.baseURI + Resources.subscriber.uri + "/logout";
		},
		getUserInfo : function(){
			return Resources.getPath() + Resources.subscriber.uri + "/userInfo";
		}
	},
	users: {
		uri : "users",
		get : function(nodeId){
			return Resources.getPath() + Resources.users.uri + "/" + nodeId;
		}, 
		block : function(){
			return Resources.getPath() + Resources.users.uri + "/block";
		},
		unblock : function(){
			return Resources.getPath() + Resources.users.uri + "/unblock";
		},
		exclusive : function(){
			return Resources.getPath() + Resources.users.uri + "/exclusive";
		}
	},
	chatroom : {
		listen : function(host, port, roomToken){
			return Resources.protocols.http + host + ":" + port + "/listen.html?ro=" + roomToken;
		},
		quit : function(host, port){
			return Resources.protocols.http + host + ":" + port + "/quit.html";
		},
		spy : function(host, port, roomToken){
			return Resources.protocols.http + host + ":" + port + "/spy.html?ro=" + roomToken;
		},
		send : function(host, sendToken){
			return Resources.protocols.http + host + "/send.html?ro=" + sendToken + "&nout=1";
		}
	}
};