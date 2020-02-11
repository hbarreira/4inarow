const http = require('http');
const fs = require('fs');
const url = require('url');
const crypto = require('crypto');
const updater = require('./updater.js');


var server = http.createServer( (request, response) => {

	response.setHeader('Access-Control-Allow-Origin', '*');

	if (request.method == 'POST') {

//REGISTER
		if(request.url== "/register") {
			let body = '';

			request.on('data', (chunk) => {
				body += chunk;
			});

			request.on('end', () => {
				try {
					var flag=0;
					var query = JSON.parse(body);
					console.log(JSON.stringify(query));
					fs.readFile("users_data.json", (err,data) => {
						if(!err) {
							var u_nick = query.nick;
							var u_pass = crypto.createHash('md5').update(query.pass).digest('hex');
							var dados = JSON.parse(data.toString());

							for (var i = 0; i < dados.users.length; i++) {
								/*
								flag(1)=> user existe com pass diferente, nao da login
								flag(2)=> user existe da login
								flag(0)=> user n existe, mete user info no users_login file da login
								*/
								var user = dados.users[i];

								if(user.nick==u_nick && user.pass==u_pass) {// user e pass existem => flag = 2
									flag=2;
									break;
								}
						
								else if(user.nick==u_nick && user.pass!=u_pass) {// user certo pass errada => flag = 1
									flag=1;
									break;
								}
							}

							if(flag==0) {  // adiciona user ao file users_login.json

								var userObj = JSON.parse(data);
								userObj.users.push({nick: u_nick, pass: u_pass});

								fs.writeFile("users_data.json",JSON.stringify(userObj), (err) => {
									if(err) throw err;
								});
							}

							if(flag==0 || flag==2) {  // da login
								response.writeHead(200, {'Content-Type': "application/json"});
								response.end(JSON.stringify({}));
							}

							else { // login falha pass errada
								response.writeHead(400, {'Content-Type': "application/json"});
								response.end(JSON.stringify({"error": "Wrong Password"}));
							}
						}
						else
							console.log(err);
					});
				}
				catch(err) { console.log(err.message); }
			});

			request.on('error', (err) => {
				console.log(err.message);
			});
		}

// JOIN
		else if(request.url=="/join") {
			let body = '';

			request.on('data', (chunk) => {
				body+=chunk;
			});

			request.on('end', () => {
				try {
					var query = JSON.parse(body);
					fs.readFile("users_data.json", (err,data) => {
						var flag=0;
						var user_nick = query.nick;
            			var user_pass = crypto.createHash('md5').update(query.pass).digest('hex');
           				var dados = JSON.parse(data.toString());

            			for(var i = 0; i<dados.users.length; i++){

              				var user = dados.users[i];

              				if(user.nick==user_nick && user.pass==user_pass){
                				flag=1;
                				break;
                			}

                			else if(user.nick==user_nick && user.pass!=user_pass) {
                				flag=2;
               					break;
             				}
           				}

            			if(flag==1) // user existe na base de dados
              				updater.queue(response, query.group, query.size);
           				else{
              				response.writeHead(401, {'Content-Type': "application/json"});
              				response.end(JSON.stringify( {"error": "Wrong Password"}));
            			}
					});
				}	
				catch(err) { console.log(err.message); }
			});

			request.on('error', (err) => {
				console.log(err.message);
			});
		}

//RANKING
		else if(request.url=="/ranking") {
			let body = '';

		    request.on('data', (chunk) => {
				body += chunk;
			});

		    request.on('end', function () {
		    	try { 
		    		var query = JSON.parse(body);

		        	if(query.size == undefined) {
			          	response.writeHead(400, {'Content-Type': "application/json"});
			          	response.end(JSON.stringify({"error": "Undefined size"}));
		        	}

		        	else {
		          		fs.readFile("ranks.json",function(err,data) {
		            	if(!err) {
			              	var dados = JSON.parse(data.toString());
			              	response.writeHead(200, {'Content-Type': "application/json"});
			              	var obj = dados['s'+query.size];
			              	if(obj == undefined) response.end(JSON.stringify({}));
			              	else {
			                	var temp = obj.ranks;
			                	var sorted = temp.sort(function(a, b){
			                  		return b.victories-a.victories;
			                		}).slice(0, 10);
			                	obj.ranks = sorted;
			                	response.end(JSON.stringify(obj));
			              	}
		            	} else console.log(err);
		          	});
		        	}
		      	}
		    	catch(err) { console.log(err.message); }
		    });
		    
		    request.on('error', function (err) {
		      console.log(err.message);
		    });
		}

		else {
    		response.writeHead(404, {"Content-Type": "application/json"});
    		response.write(JSON.stringify({ "error": "Unknown POST request"}));
    		response.end();
  		}
	}

	else if(request.method == 'GET') {
		const preq = url.parse(request.url,true);
		const pathname = preq.pathname; 

		if(pathname=='/update') {

			response.setHeader('Content-Type', 'text/event-stream');
			response.setHeader('Cache-Control', 'no-cache');
			response.setHeader('Connection', 'keep-alive');

			var query = url.parse(request.url,true).query;
			var qnick = query.nick;
			var qgame = query.game;

			if(qgame == undefined) {
				response.writeHead(400, {'Content-Type': "application/json"});
				response.end(JSON.stringify({"error": "Undefined Game"}));
			}

			else {
				response.writeHead(200);
				updater.remember(response, qnick, qgame);
				request.on('close', () => updater.forget(response));
			}
		}

		else{
      		response.writeHead(404, {"Content-Type": "application/json"});
      		response.write(JSON.stringify({ "error": "Unknown GET Request"}));
      		response.end();
    	}
	}

	else{
    	response.writeHead(404, {"Content-Type": "application/json"});
   		response.write(JSON.stringify({ "error": "404 Page not found"}));
    	response.end();
  	}
});

server.listen(8108);

console.log("Server Online");
