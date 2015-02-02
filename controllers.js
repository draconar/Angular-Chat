//#!tpl;utf-8
'use strict';

/* Controllers */

function RobotHelper(scope){

	var txt = ["Chorando se foi quem um dia só me fez chorar","Chorando se foi quem um dia só me fez chorar","Chorando estará, ao lembrar de um amor","Que um dia não soube cuidar","Chorando estará, ao lembrar de um amor","Que um dia não soube cuidar", "A recordação vai estar com ele aonde for", "A recordação vai estar pra sempre aonde eu for","Dança, sol e mar, guardarei no olhar","O amor faz perder encontrar","Lambando estarei ao lembrar que este amor","Por um dia um istante foi rei","A recordação vai estar com ele aonde for","A recordação vai estar pra sempre aonde eu for","Chorando estará ao lembrar de um amor","Que um dia não soube cuidar","Canção, riso e dor, melodia de amor","Um momento que fica no ar","Ai, ai, ai","Dançando lambada"];

	return { 
		info: {"nick":"Brazuka","blacklisted":false},
		speak: function(){			
			var rdm = Math.floor(Math.random()* txt.length);
			return  {"sender":{"nickColor":"#000000","nick":this.info.nick},"moderatorId":0,"port":0,"body":txt[rdm],"style":"fala para","name":"","roomId":0,"type":1,"date":new Date(),"recipient":""};
		}

	}

}

function RestoreCtrl($state){
	if (typeof $state.current.data.lastState != "string"){
		$state.current.data.lastState.data.beingRestored = true;
	}
	$state.transitionTo($state.current.data.lastState, $state.current.data.lastStateParams);
}

function ThemeListCtrl($scope, $stateParams, $rootScope, $state, Perfil, HttpRequestManager, TabManager) {
		//$rootScope.$on('$routeChangeSuccess', function(evt, cur, prev) {
		   //Perfil.probeIfLogged(Perfil);
		//});
		/******************************
		$state.$current.parent.data.lastState = $state.current;
		$state.$current.parent.data.lastStateParams = $stateParams;
		
		if ($state.current.data.beingRestored == true) {
			$scope.data = $state.$current.parent.data.lastStateData;
			$state.current.data.beingRestored = false;
		} else {
		/******************************/
		var tabName = $scope.tabName = $stateParams.tab;
			var request = HttpRequestManager.createRequest({method: 'get', url: Resources.node.root(),headers:{'Accept':'application/json'}});
				
			request.execute().then(function(response){
				var data = angular.fromJson(response);
				$scope.data = {};
				$scope.data.themes = data.subthemes;
				$state.$current.parent.data.lastStateData = $scope.data;
				//$scope.data.tabName = $state.$current.parent.data.tabName;
			});
		/******************************
		}
		******************************/
		//console.log(h.deferred.promise.then.toString())
}

function SubthemeListCtrl($scope, $state, $stateParams, HttpRequestManager, TabManager){
	var node_id = $stateParams.node_id;
	var tabName = $scope.tabName = $stateParams.tab;	
	/***************
	$state.$current.parent.data.lastState = $state.current;
	$state.$current.parent.data.lastStateParams = $stateParams;
	
	if ($state.current.data.beingRestored == true) {
		$scope.data = $state.$current.parent.data.lastStateData;
		$state.current.data.beingRestored = false;
	} else {
	/*************/
		var request = HttpRequestManager.createRequest({method: 'get', url: Resources.node.get(node_id),headers:{'Accept':'application/json'} });

		request.execute().then(function(response) {
				var data = angular.fromJson(response);
				$scope.data = {};
				if(data.subthemes) {
					if( typeof data.subthemes.length === "undefined") {				
						$scope.data.themes = [data.subthemes];									
					} else {
						$scope.data.themes = data.subthemes;	
					}	
				} else {
					$scope.data.themes = [];
				}
				
				if(!data.rooms){
					$scope.data.rooms = [];
				} else {
					$scope.data.rooms = data.rooms;
				}
				$state.$current.parent.data.lastStateData = $scope.data;
				$scope.data.tabName = $state.$current.parent.data.tabName;
			});
	/****
	}
	****/
}

function TabCtrl($scope, $state, TabManager){
	$scope.criarAba = function(){
		console.log($state.current);
		$state.transitionTo("tabs.tab2Root");
		//TabManager.createTab();
	};
	$scope.removerAba = function(nomeAba){
		TabManager.removeTab(nomeAba);
	};
}

function RoomListCtrl($scope, $routeParams){
	var node_id = $routeParams.node_id;
	$scope.rooms_node_id;
		/*
		$http({method: 'get', url: fetch_url+node_id,headers:{'Accept':'application/json'} }). success(function(data, status) {
			// this callback will be called asynchronously
			// when the response is available
			if(typeof data.subthemes !== "undefined"){
				$scope.rooms_node_id = data.subthemes.id;
			} else {
				$scope.rooms_node_id = data.id;
			}
			$scope.rooms = data.rooms;
			
		});	*/
		/*
		$http({method: 'get', url: fetch_url+rooms_node_id,headers:{'Accept':'application/json'} }). success(function(data, status) {
			// this callback will be called asynchronously
			// when the response is available
			$scope.rooms = data.rooms;
		});	*/		

}

function TuringListCtrl($scope, $state, $routeParams, $rootScope, Perfil){
	var node_id = $routeParams.node_id;	

	//$state.$current.parent.data.lastState = $state.current;
	//$state.$current.parent.data.lastStateParams = $stateParams;


	$rootScope.turingtoken;
	

	$scope.node_id = node_id;
	//$scope.spy_and_listen_ctrls = SpyRoomCtrl; /*********** http://stackoverflow.com/questions/13944207/angularjs-dynamically-assign-controller-from-ng-repeat **********/

}

function JoinRoom($scope, $state, $rootScope, $location, $stateParams, Perfil, HttpRequestManager){

	/*
	jQuery('#simple_color').simpleColor({
		cellWidth: 10,
		cellHeight: 10,
		boxWidth:30,
		boxHeight:30
	});
*/
	var node_id = $stateParams.node_id;
	var tabName = $stateParams.tab;

	var turing = $scope.turing = {
		token:'',
		captcha :'',
		nick : Perfil.data.nick,
		color:'#000000',
		useUserImage : false
	}

	var is_logged = $rootScope.is_logged = Perfil.data.isLogged;		

	var request = HttpRequestManager.createRequest({method: 'get', url: Resources.node.join(node_id),headers :{'Accept':'application/json'} });
	request.execute().then(function(response) {
			var data = angular.fromJson(response);
			$rootScope.turingtoken = data.captchaToken;	
			$scope.turingCode = data.code;		
			Perfil.data.turingCode = data.code;	
			console.log($rootScope.turingtoken);
	},function(response){
		var data = angular.fromJson(response);
		console.log(data.errorMessage);
	});	


	$scope.join = function(){
		$scope.turing.token = $rootScope.turingtoken; 

		if(typeof $scope.turing.nick === "undefined") {
			$scope.errorMsg = "Nick inválido"
			return null
		}

		HttpRequestManager.createRequest({
			method: 'POST',
			url: Resources.node.join(node_id),
			parameters: {
				nick:turing.nick,
				captchaToken:turing.token,
				captchaText:turing.captcha,
				useUserImage:turing.useUserImage,
				color:turing.color
			},
			headers : {'Accept':'application/json'}
			}).execute().then(function(response) {				
					var data = angular.fromJson(response);
					turing.host = data.host;
					turing.port = data.port;
					turing.roomToken = data.roomToken;
					$rootScope.turing = turing;
					console.log('entrando na sala....');
					if(turing.nick !== '') {						
						//$location.path(tabName+'/bp/'+node_id);
						$state.transitionTo("tabs.bp", {tab: tabName, node_id: node_id});							
					}
			},
			function(response) {
				var data = angular.fromJson(response);
				$scope.errorMsg = data.errorMessage;				
				//se deu erro aqui, reiniciar processo do Turing
				Perfil.data.nick = turing.nick;
				JoinRoom($scope, $state, $rootScope, $location, $stateParams, Perfil, HttpRequestManager);
				//TuringListCtrl($scope, $http, $routeParams, Perfil);
			});

	}

}

var messagesJSONLastCharRead;
var globalXHR;
var msgs_onprogress = function(scope, RoomMessages, stateParams) {

	var messagesJSONLastCharRead = 0;	
	var JSONlength = 0;

	return function(e){
		var request = this;                          
		var data = request.responseText;
		var actualJSONlength = data.length;
		var isError = data.indexOf("errorMessage") != -1;
		
		if(isError) {
			data = JSON.parse(data);
			scope.errormsg = data.errorMessage.replace(/\&aacute\;/gi, 'á');
			//window.location = '#/turing/'+location.node;
			alert(angular.element("<div>" + data.errorMessage + "</div>").text());			
		} else {		
		var dataJSON = JSON.parse( data.replace(/,\s*$/, "").replace(/^\{,/, '{')+"]}" );
		if(data.match(/^.*"messages":\[/)) {
			scope.global_sendToken = dataJSON.sendToken; //data.replace(/^.*\"sendToken\"\:\"/,"").replace(/".*/,'');
		}

				var d = data.replace(/.*"messages":\[/,"");      
				d = '['+d.replace(/,\s*$/, "")+']';		
				var dd = JSON.parse(d);				
				var dd_last = dd[dd.length -1];
				JSONlength = actualJSONlength;		
		

		if (dataJSON.userList){
						//var r = new RobotHelper();
						//dataJSON.userList.push(r.info);
					if(!scope.users) 
						scope.users = dataJSON.userList;
						RoomMessages.users = dataJSON.userList;
				}
				

		if(typeof dd_last != "undefined") {
						
			//atualiza se não há última mensagem ou se a data da última mudou
			if (typeof RoomMessages.data[RoomMessages.data.length - 1] == "undefined" 
				|| dd_last.date != RoomMessages.data[RoomMessages.data.length - 1].date) {


			
				if(dd_last.messageClass == 'EnterRoomMessage') {

				if(dd_last.sender.nick != scope.my_nick) {
					scope.users.push({"nick":dd_last.sender.nick, "blacklist":"false"});
				}

			} else if (dd_last.messageClass == 'LeaveRoomMessage') {
				for (var i in scope.users) {					
					if(scope.users[i].nick == dd_last.sender.nick) {
						scope.users.splice(i,1);
						if (scope.outmessage.re == dd_last.sender.nick)
							scope.outmessage.re = scope.my_nick;
						break;
					}
				}
			}

			if(typeof dd_last.sound != "undefined") {
				if(typeof location != "undefined" && location.ref !== 'spy') {
					dd_last.sound = "http://bp.imguol.com/sons/" + dd_last.sound;	
				} else {
					dd_last.sound = "null";	
				}
				
			} 

			if (typeof dd_last.video != "undefined") {
				dd_last.video = "http://www.youtube.com/embed/" + dd_last.video;
			} else {
				dd_last.video = undefined;
			}

			if(typeof dd_last.emoticon != "undefined") {
				dd_last.emoticon = "http://bp.imguol.com/v07/icones/smiles/" + dd_last.emoticon;
			}

			if(typeof dd_last.sender.icon != "undefined") {
				dd_last.sender.icon = "http://"+dd_last.sender.icon+ ".avataruol.com.br/thumb_avatar.jpg";
			}
					
				if (RoomMessages.data.length > 20) {
					RoomMessages.data.shift();
				}
				RoomMessages.data.push(dd_last);
				scope.messages = RoomMessages.data;	
		
				//angular.extend(scope.messages, RoomMessages.data)				
			}

		}
	}	
		
		scope.$digest();
		

		
/*
var messagesJSONLastCharToRead = xhr.responseText.lastIndexOf(',');
if (messagesJSONLastCharToRead > messagesJSONLastCharRead){
console.log(xhr.responseText.substring(messagesJSONLastCharRead, messagesJSONLastCharToRead));
messagesJSONLastCharRead = messagesJSONLastCharToRead + 1;
}*/
window.scrollTo(0,99999);
}; }


var  getMsgsVrum = function(url, scope, RoomMessages, location){  	
	
};

var getMsgsAngular = function (fetch_url) { 		
		/*
		$http({method: 'GET', url: fetch_url ,headers :{'Accept':'application/json'}, isArray:true }).success(function(data, status) {
			// this callback will be called asynchronously
			// when the response is available
			//$scope.subthemes = data.subthemes;
			//$scope.turingtoken = data.turingToken;	
			//var d = data.replace(/,\s*$/, "");
			//var d = data.replace(/,\s*$/, "");
			var d = data.replace(/^\{"messages":\[/,"oi");

			d = '['+d.replace(/,\s*$/, "")+']';

				console.log(d);

			$scope.messages.concat( JSON.parse(d) );				
			
			});*/
	};

function SpyRoomCtrl($scope, $state, $stateParams, $location, $rootScope, RoomMessages, Perfil, HttpRequestManager){

	//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&RoomMessages.flushMsgs();

	$scope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 			
			//$scope.$destroy();
			console.log('mudando state do ROOM')		;		 
    	// transitionTo() promise will be rejected with 
    	// a 'transition prevented' error
	});


	var node_id = $stateParams.node_id;	
	var tabName = $stateParams.tab;
	
	var rm;

	RoomMessages.push(tabName);
	rm = RoomMessages;

			
    $scope.messages = rm.get(tabName).data;
            
	//var robot = new RobotHelper($scope);	

	//$scope.messages = [robot.speak()];
	//RoomMessages.timer = setInterval(function(){$scope.messages.push(robot.speak());RoomMessages.data=$scope.messages;$scope.$digest();window.scrollTo(0,99999);}, 40000);
	//$scope.welcome_msg = RoomMessages[0];

/*** obtém informações gerais do NODE_ID ***/
var n = HttpRequestManager.createRequest({
        method: 'GET',
        headers : {'Accept':'application/json'},
        url: Resources.node.get(node_id)
});

n.execute().then(function(response) {
        var data = angular.fromJson(response);
        var room_info = $rootScope.room_info = data;
        $rootScope.room_name = room_info.name;
});

/*** obtém o listen e carrega mensagens no espiar ***/	
var h = HttpRequestManager.createRequest({	
		method: 'POST',
		url: Resources.node.spy(node_id),
		headers : {'Accept':'application/json'},
		onprogress : new msgs_onprogress($scope, rm.get(tabName), $stateParams)
		});

h.execute().then(function(response) {
		console.log('then');
		var data = angular.fromJson(response);
		$scope.roomToken = data.roomToken;		
		console.log(data.host +':'+data.port+'/spy.html?ro='+data.roomToken);

		//$scope.messages = local;

		//getMessagesJSON('http://'+$scope.turing.host +':'+$scope.turing.port+'/spy.html?ro='+$scope.turing.roomToken);	
		//getMsgs();		

		var http_req = HttpRequestManager.createRequest({	
			method: 'GET',
			url: Resources.chatroom.spy(data.host, data.port, data.roomToken),
			headers : {'Accept':'application/json'},
			onprogress : new msgs_onprogress($scope,  rm.get(tabName), $stateParams),
			useXDR : true
			});
		http_req.execute();
			
});

$scope.flushAndOpenTuring = function(){	
	Perfil.data.nick = "";
	JoinRoom($scope, $state, $rootScope, $location, $stateParams, Perfil, HttpRequestManager);
}

$scope.voltarSpy = function(){
	history.back();
}

}

function RoomCtrl($scope, $state, $timeout, $stateParams, $location, $rootScope, RoomMessages, Perfil, HttpRequestManager){	
	jQuery(".modal-backdrop").fadeOut();
	var node_id = $stateParams.node_id;	
	var tabName = $stateParams.tab;


	$scope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 			
			//$scope.$destroy();		 
    	// transitionTo() promise will be rejected with 
    	// a 'transition prevented' error
	});
	//valores iniciais para ser usado em conjunto com o OutMessage CTRL 
	//@TODO passar para Service 
	var outmessage = $scope.outmessage = {
		body : "",
		so : "NULL", //sound
		ei : "NULL", //emoticon
		pk : "",
		st : "fala para", //style
		re : "", //recipient
		ro : "", //token
		ty : ""
	};

	//$scope.room_name = $rootScope.room_info.name;
	//$scope.room_owner = $rootScope.room_info.owner;
	//$scope.amIowner = $rootScope.room_info.owner == Perfil.data.username ? true : false;
	//$scope.my_nick = $rootScope.turing.nick;	
	
	//console.log("Am I owner? " + $scope.amIowner + '   ' + Perfil.data.username);

	//$scope.location = "chatroom";
	
	var rm;
	rm = RoomMessages;

    $scope.messages = rm.get(tabName).data;
    $scope.users = rm.get(tabName).users;

	console.log('estou no tabName ' + rm.name);
	if (!rm.isLoaded(tabName)) {
		rm.setLoaded(tabName, true);

		var h = HttpRequestManager.createRequest({	
		method: 'GET',
		url: Resources.chatroom.listen($scope.turing.host, $scope.turing.port, $scope.turing.roomToken),
		headers : {'Accept':'application/json'},
		onprogress : new msgs_onprogress($scope, rm.get(tabName), $stateParams),
		pollInterval : 60000,
		useXDR : true
		});
		h.execute().then(function(response) {	
			console.log('tentando criar request de novo....')	;
				
		});
	}
	

	$timeout(function someWork(){
        $scope.messages = rm.get(tabName).data;
    	$scope.users = rm.get(tabName).users;
    	console.log('tick');
        $timeout(someWork, 1000);
    },1000);

	
	
	$scope.exitRoom = function(){
		$scope.location = undefined;
		if(typeof globalXHR !== "undefined") {
			globalXHR.abort();
			globalXHR = undefined;
		};
		HttpRequestManager.createRequest({
			method: 'POST',
			url: Resources.chatroom.quit($scope.turing.host, $scope.turing.port),
			parameters: { ro : $scope.turing.roomToken },
			headers : {'Accept':'application/json'},
			useXDR : true
			})
			.execute().then(function(data, status){						
				if(data.redirToHome) {
					$location.path('/T')
				} else {
					$location.path('/T/'+data.parentId);					
				}

				
			});			

	};

	$scope.toggleBlockUser = function(username, toggleState) {		
		var gst = $scope.global_sendToken;
		var url_dispatch = Resources.users.block;
		if(!toggleState){
			url_dispatch = Resources.users.unblock;
		}
		HttpRequestManager.createRequest({
			method: 'POST',
			url: url_dispatch,
			parameters : { sendToken : gst, recipient : username},
			headers : {'Accept':'application/json'}})
			.execute().then(function(data, status) {									
					console.log(username + " bloqueado");
			});
	};

	$scope.togglePrivate = function(nick) {
		outmessage.re = nick;
	}

	$scope.closeRoom = function() {
		/*
		$http.delete('https://batepapo.uol.com.br/ws/v1/subscriber/room/'+node_id)
		.success(function(data){
			console.log("fechou!")
		});*/

		HttpRequestManager.createRequest({
			method: 'DELETE',
			url: Resources.subscriber.deleteRoom(node_id),			
			headers : {'Accept':'application/json'}})
			.execute().then(function(response) {									
					console.log("sala fechada");
			});
	};

	
		
}

function OutMsgCtrl($scope, HttpRequestManager){	

	var outmessage = $scope.outmessage;
	
	
	//preenche opções de estilos de mensagem, emoticons, sons
	HttpRequestManager.createRequest({
	method: 'GET',
	headers : {'Accept':'application/json'},
	url: Resources.assets.get()
	}).execute().then(function(response) {
			var data = angular.fromJson(response);
			$scope.styles = data.styles;
			$scope.emoticons = data.emoticons;
			$scope.sounds = data.sounds;	

			$scope.emoticons.unshift("NULL");
			$scope.sounds.unshift("NULL");

			//pre-seleções
			$scope.outmessage.st = $scope.styles[0];		
			//outmessage.ei  = $scope.emoticons[0];		
			//outmessage.so = $scope.sounds[0];		
	});

	$scope.sendMsg = function(){
		outmessage.ro = $scope.global_sendToken;
		console.log(outmessage.ty)
		var ty = outmessage.ty ? '&ty='+encodeURIComponent(outmessage.ty) : '';
		HttpRequestManager.createRequest({
			method: 'POST',
			url: Resources.chatroom.send($scope.turing.host,outmessage.ro),
			parameters : {
				me : outmessage.body,
				ei : outmessage.ei,
				pk : outmessage.pk,
				re : outmessage.re,
				so : outmessage.so,
				st : outmessage.st,
				ty : outmessage.ty,
				x : 0,
				y : 0
			},
			headers : {'Accept':'application/json'},
			useXDR : true
			})
			.execute().then(function(data, status) {									
					outmessage.body = "";
					outmessage.so = "NULL";
					outmessage.ei = "NULL";
			});

	};	
};

function PerfilCtrl ($scope, $location, Perfil) {
	/*
	var perfil = $scope.perfil = Perfil.data;
	Perfil.scope = $scope;
    	Perfil.probeIfLogged(Perfil, $scope, $q);
	var getPerfil = $scope.getPerfil =  function() {				
		perfil = Perfil.data;
		new httpRequest({
			method: 'POST',
			url: fetch_url_perfil+'login',
			parameters: {username:$scope.perfil.username, password: $scope.perfil.password},
			headers : {'Accept':'application/json'}}, $scope, $q)
			.then(function(response) {
					var data = angular.fromJson(response);
					$scope.perfil.image = data.codProfile;
					$scope.perfil.errorMsg = "";
					$scope.turingCode = "";
					Perfil.data= $scope.perfil;
					Perfil.data.isLogged = true;
					var probePerfilInt = setInterval(function(){Perfil.probeIfLogged(Perfil,$scope,$q)}, 10*60*1000);
			},
			function(response) {
				var data = angular.fromJson(response);
				console.log( 'error: '+data.errorMessage)					
				$scope.perfil.errorMsg = data.errorMessage;
				});
	};	

	$scope.logoutPerfil = function(){
		new httpRequest({
			method: 'POST',
			url: fetch_url_perfil+'logout',
			headers : {'Accept':'application/json'}}, $scope, $q)
			.then(function(response) {
				Perfil.flush();					
				$scope.perfil = Perfil.data;
			});	
	}*/
}

function UserCtrl ($scope, $routeParams, HttpRequestManager){
	var node_id = $routeParams.node_id;	
	HttpRequestManager.createRequest({
			method: 'GET',
			url: Resources.users.get(node_id),
			headers : {'Accept':'application/json'}
			}).execute().then(function(data, status) {		
				//var r = new RobotHelper();				
				//data.push(r.info);
				$scope.users = data;										
			});	
}

function CreateRoomCtrl ($scope, $routeParams, HttpRequestController) {
	
	var node_id = $routeParams.node_id;
	var themes = $scope.themes = {};


	//para bindar com o formulário
	var room = $scope.room = {
		name : '',
		message : '',
		triedToOpen : false,		
		isOpen: false,
		themeSelected: '',
		node_id: ''
	}
	

	HttpRequestController.createRequest({
			method: 'GET',
			url: Resources.subscriber.getAllowedThemes(),
			headers : {'Accept':'application/json'}
			}).execute().then(function(response) {
				var data = angular.fromJson(response);
				$scope.themes = data;
				themes = $scope.themes;
				if(node_id){							
					for ( var i in themes) {			
							if (themes[i].nodeId == node_id) {
								room.themeSelected = themes[i].name ;
							}
						}
					}
			});	
	
	

	$scope.openRoom = function(){
			if(!room.name) {
				room.message = "Digite um nome para a sala";
				room.triedToOpen = true;
			} else {
				HttpRequestController.createRequest({
				method: 'POST',
				url: Resources.subscriber.createRoom(room.name),
				parameters: {themeId:node_id},
				headers : {'Accept':'application/json'}})
				.execute().then(function(response) {
					var data = angular.fromJson(response);
					room.triedToOpen = true;
					room.message = "deu certo";
					room.isOpen = true;
					room.node_id = data.nodeId;
				},
				function(response) {
					var data = angular.fromJson(response);
					room.triedToOpen = true;
					room.message = data.errorMessage;
					room.isOpen = false;
				});;	
			}
			
	}
}


function SearchDispatcher ($scope, $location) {
	var search = $scope.search = {
		query : '',
		optRoomUser : 'both'
	}	

	$scope.doSearch = function(){		
		$location.path('/search/'+search.query);
	}	
}


function SearchCtrl($scope, $routeParams, HttpRequestController) {
	
	//é preciso reencodar o parâmetro (o que vier, será enviado em utf-8)
	//, pois a aplicação espera que a chamada seja feita em UTF-8
	
	var fetch = function(what) {
		var url = what === 'room'? Resources.search.room() : Resources.search.user();
		HttpRequestController.createRequest({
			method: 'GET',
			headers : {'Accept':'application/json'},
			url: url,
			parameters: {query: $routeParams.query}
		},$scope,$q).then(function(response) {
			var data = angular.fromJson(response);
			if (what === 'room')
				$scope.rooms = data;
			else if (what === 'user')
				$scope.users = data;
		},function(response){
			var data = angular.fromJson(response);
			console.log(data.errorMessage);
		});
	}

	fetch('room');
	fetch('user');
		
}

