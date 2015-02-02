//#!tpl;utf-8
'use strict';

/* App Module */
var chat = angular.module('chathome', ['ui.state']).
    config(['$routeProvider', '$stateProvider', function($routeProvider, $stateProvider) {
    
	//$routeProvider.otherwise({redirectTo: '/1/root'});
	
    //$routeProvider.
    //when('/:tab', {templateUrl: 'partials/theme.html', controller: ThemeListCtrl}).
    //when('/:tab/T/:node_id', {templateUrl: 'partials/theme.html', controller: SubthemeListCtrl}).
    //when('/:tab/turing/:node_id', {templateUrl: 'partials/turing.html', controller: TuringListCtrl}).    
    //when('/:tab/bp/:node_id', {templateUrl: 'room.html', controller: RoomCtrl}).
    //when('/:tab/newroom', {templateUrl: 'partials/newroom.html', controller: CreateRoomCtrl}).
    //when('/:tab/newroom/:node_id', {templateUrl: 'partials/newroom.html', controller: CreateRoomCtrl}).
    //when('/:tab/search/:query', {templateUrl: 'partials/search.html', controller: SearchCtrl})
    //.otherwise({redirectTo: '/1'});
		
	$stateProvider.state('default', {
						url: "", // root route
						views: {
							"tabview@" : {
								controller: function($state) {
									$state.transitionTo('tabs.root', {tab: '1'});
								}
							}
						}
	});
	
	$stateProvider.state('tabs', {
		abstract : true,
		views: {
			"tabview@" : {}, //absolutely targets the "tabview" view in root unnamed state			
			"room@" : {},
			"spy" : {}
		}
	});
	
			
	$stateProvider.state('tabs.root', {
						url: "/:tab/root", 
						views: {
							"tabview@": {
								controller: 'ThemeListCtrl',
								templateUrl: 'partials/theme.html'
							}
						},
						data: {}
	});
	
	$stateProvider.state('tabs.subtheme', {
						url: "/:tab/T/:node_id",
						views: {
							"tabview@": {
								controller: 'SubthemeListCtrl',
								templateUrl: 'partials/theme.html'
							}
						},
						data: {}
	});

	$stateProvider.state('tabs.spy', {
						url: "/:tab/spy/:node_id",												
						views: {
							"tabview@": {		
								controller : 'ThemeListCtrl',						
								templateUrl: 'partials/theme.html'
							},
							"spy@" : {
								resolve: {RoomMessages: 'RoomMessages'},
								controller: 'SpyRoomCtrl',
								templateUrl: 'partials/turing.html'								
							}
						},
						data : {
							lastState : 'tabs.subtheme',
							lastStateParams : "",
							lastStateData : {
								loaded : false
							}
						}
	});

	$stateProvider.state('tabs.bp', {
						url: "/:tab/bp/:node_id",						
						views: {							
							"room@" : {
								resolve: {RoomMessages: 'RoomMessages'},
								controller: 'RoomCtrl',
								templateUrl: 'room.html'
							}
						},
						data : {
							lastState : 'tabs.spy',
							lastStateParams : "",
							lastStateData : {
								loaded : false
							}
						}
	});
	
		
}]);

// SERVICES

chat.factory('RoomMessages', function() {	
    var welcome_msg = {"sender":{"nickColor":"#000000","nick":"UOL"},"moderatorId":0,"port":0,"body":"UOL: Para bloquear um participante nesta sala, clique no ícone  que aparece ao lado do apelido","style":"fala para","name":"nicao","roomId":0,"type":1,"date":1359390088989,"recipient":""};
    var tabs = [];
    function Msg(name){
    	console.log('sou um novo ... MSG' + name)
    	this.name = name;
    	this.data = [welcome_msg];
    	this.users = [];
    	this.timer = "";
    	this.loaded = false;
    	this.flushMsgs = function(){if(this.timer !== "")clearTimeout(this.timer); this.data = [];}	
    }

	return {
		isLoaded: function(tabName) {
			return tabs[tabName].loaded;
		},
		setLoaded: function(tabName, bool) {
			tabs[tabName].loaded = bool;
		},
		push: function(tabName) {
			if(typeof tabs[tabName] == 'undefined') {
				tabs[tabName] = new Msg(tabName);				
			}
		},
		get: function(tabName, scope) {				 
			if(typeof tabs[tabName] != 'undefined') {				
				return tabs[tabName];
			} else {
				alert('esta tab não existe');
			}
		}
	}
	
});

chat.factory('Perfil', function($http){
    
    return {
        scope : null
        , probeIfLogged : function(obj, scope, q) {
            new httpRequest({
            method: 'POST',
            url: "https://batepapo.uol.com.br/ws/v1/subscriber/userInfo",          
            headers : {'Accept':'application/json'}
            },scope, q)

        }
        , data: { username: ""
            , password: ""
            , email: ""
            , image: ""
            , errormsg: ""
            , turingCode: ""
            , isLogged: false
            , nick: ""}
        , flush: function(){ this.data = { username: ""
            , password: ""
            , email: ""
            , image: ""
            , errormsg: ""
            , turingCode: ""
            , isLogged: false
            , nick: ""};
        }
    }
});

chat.factory('HttpRequestManager', function($rootScope, $q){
	var manager = {
		scope : $rootScope,
		q : $q,
		requests : {},
		addRequest : function(key, request){
			this.requests[key] = request;
		},
		createRequest : function(options){
			this.addRequest(options.url, new HttpRequest(options, this.scope, this.q));
			return this.requests[options.url];
		},
		removeRequest : function(key){
			this.requests[key].abort();
			delete this.requests[key];
		},
		redoRequest : function(key){
			if (this.requests[key].request && (this.requests[key].request.responseText && this.requests[key].request.responseText.indexOf("errorMessage") == -1)){
				this.requests[key].abort();
				this.requests[key].execute();
			}
		},
		redoExpiredRequests : function(){
			for (var requestKey in this.requests){
				if (this.requests[requestKey].isExpired()){
					this.redoRequest(requestKey);
				}
			}
		},
		removeCompletedRequests : function(){
			for (var requestKey in this.requests){
				if (this.requests[requestKey].isCompleted()){
					this.removeRequest(requestKey);
				}
			}
		},
		validateRequests : function(){
			this.removeCompletedRequests();
			this.redoExpiredRequests();
		}
	}
	var validateRequestsInterval = function(manager){
		var manager;
		return function(){
			manager.validateRequests();
		}
    };
    manager.validateRequestsInterval = setInterval(validateRequestsInterval(manager), 5000);
    return manager;
});

chat.factory('TabManager', function(){
	var manager = {
		tabs : new Array,
		getTabFromParam : function(tabParam){
			if (/(\d)/.test(tabParam) == false) return this.tabs[0];
			return this.tabs[tabParam-1];
		},
		createTab: function(){
			var newTab = {
				url : 'partials/theme.html',
				name: this.tabs.length + 1,
				data : {}
			}
			this.tabs[this.tabs.length] = newTab;
			return newTab;
		},
		removeTab: function(tabName){
			this.tabs.splice(tabName-1,tabName-1);
		},
		getTabs: function(){
			return this.tabs;
		}
    };
	
	var tab1 = {
			url : 'partials/theme.html',
			name: 1,
			data : {}
	};
	
	manager.tabs[tab1.name-1] = tab1;	
    return manager;
});

/**************** DIRECTIVES ****************/


chat.directive("msgtheyareblocked", [function() {    
            return {
            restrict: "AE",
            replace: true,            
            transclude: true,
            scope: "isolate",
            template: "<span> <h6>{{msgClass}}</h6></span>",           
            controller: function($scope){
               // console.log( $scope );
            },
            compile: function(tplEle, attrs, transFunc){
                

                var getTemplateMsg = function(msgClass,scope) {                                        
                    var msg = "";                    
                    switch(msgClass){
                        case "EnterRoomMessage":
                            scope.msgClass = "::: EnterRoomMessage";
                            break;
                        case "IgnoreMessage":
                             scope.msgClass = "::: IgnoreMessage";
                            break;
                        case "AcceptMessage":
                             scope.msgClass = "::: AcceptMessage";
                            break;
                        case "ChatMessage":
                             scope.msgClass = "::: ChatMessage";
                            break;                        
                        default:
                            scope.msgClass = "::: " + msgClass
                            break;
                    }                 
                    
                }

                
                return function postlink(scope, iEle, iAttrs){                    
                    iAttrs.$observe("procMsgClass", function(nv){getTemplateMsg(nv, scope)});                    
                }
            }
        }
}])



chat.directive("midi", [function() {
    return {
        restrict: "ACE",
        replace: true,
        transclude: true,
        scope: "isolate",
        //template: '<object type="audio/x-midi" width="150" height="28" controls="smallconsole" autostart="true" type="audio/midi" src="{{midiUrl}}" />',
        link: function(scope, element, attrs) {
            //http://stackoverflow.com/questions/15282859/angular-directive-to-display-flash-via-object-tag-causes-flash-to-attempt-to-l
            attrs.$observe('midiUrl', function(value) {
            if (value) {
                    element.html('<embed type="audio/x-midi" width="150" height="28" controls="smallconsole" autostart="false" type="audio/midi" src="'+value+'" />');
                  } else {
                    element.html("<div></div>"); // We have to put something into the DOM
                  }
            })
        }        
    }
}])
