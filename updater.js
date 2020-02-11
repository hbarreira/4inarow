var responses = [];
var fs = require('fs');
var crypto = require('crypto');

module.exports.queue = function(response, group, size){
  var date = new Date();
  var encriptz = "" + group + size + date.getTime().toString()[7];
  var game_id = crypto.createHash('md5').update(encriptz).digest('hex');

  response.writeHead(200, {'Content-type': "application/json"});
  response.write(JSON.stringify({"game": game_id}));
  response.end();

  var flag=0;

  for(var i=0; i<responses.length;i++) {
  	if (responses[i].hash==game_id) {
  		flag=1;
  		break;
  	}
  }

  if(flag==0) responses.push(newGame(game_id, size));
}

module.exports.remember = function(response, user, game) {
	var flag = 0;

	for (var i = 0; i < responses.length; i++) {
		if(game==responses[i].hash) { 
			if(responses[i].player1==undefined) { // player1 da login
				responses[i].player1=user;
				responses[i].res1=response;
				flag=1;
				break;
			}
			else { // player1 deu login e player2 da login 
				responses[i].player2 = user;
				responses[i].res2= response;

				responses[i].res1.write("data: "+ JSON.stringify({"board": responses[i].board, "turn": responses[i].player1})+"\n\n");
        		responses[i].res2.write("data: "+ JSON.stringify({"board": responses[i].board, "turn": responses[i].player1})+"\n\n");
        		flag=1;
        		break;
			}
		}
	}

	if (flag==0) {
		response.write("data: " + JSON.stringify({"error": "Invalid Game"})+"\n\n");
		response.end();
	}
}

module.exports.forget = function(response) {
	for (var i = 0; i<responses.length; i++) {
		if(responses[i].res1 == response || responses[i].res2 == response) {
      		responses.splice(i,1);
      		break;
    	}
	}
}

module.exports.leave = function(game, nick) {
 	leave_game(game,nick);
}

function newGame (game_id, game_size) {
	var game = {
		hash: game_id,
		turn: 1,
		player1: undefined,
		res1: undefined,
		player2: undefined,
		res2: undefined,
		board: []
	};

	return game;
}

function Ranking(winner, loser, boardsize) {
	fs.readFile("ranks.json",function(err,data) {
		if(!err) {
	    	var dados = JSON.parse(data.toString());
	      	var obj = dados['s'+boardsize];
	      	if(obj != undefined){
	      		var flag_win=0;
	        	var flag_lose=0;
	        	for(var i=0; i<obj.ranks.length; i++) {
	        		if(obj.ranks[i].nick == winner){
	            		obj.ranks[i].victories++;
	            		obj.ranks[i].games++;
	            		flag_win=1;
	          		}
	          		else if(obj.ranks[i].nick == loser) {
	            		obj.ranks[i].games++;
	            		flag_lose=1;
	          		}
	        	}
	        	if(flag_win == 0) {
	        		obj.ranks.push({nick:winner,victories:1,games:1});
	        	}
	        	if(flag_lose == 0) {
	        		obj.ranks.push({nick:loser,victories:0,games:1});
	        	}
	        	dados['s'+boardsize]=obj;
	      	}
	      	else {
	        	var obj2 = {ranks:[{nick:winner,victories:1,games:1},{nick:loser,victories:0,games:1}]}
	        	dados['s'+boardsize]=obj2;
	      	}
	      	fs.writeFile("ranks.json",JSON.stringify(dados),function(err){ if(err) throw err; });
	    } 
	    else console.log(err);
	});	
}

function leave(game, nick) {
	for(var i=0; i<responses.length; i++){
	    if(responses[i].hash == game) {
	      	if(responses[i].player1 == nick && responses[i].player2 == undefined){
	          	responses[i].p1_r.write("data: "+ JSON.stringify({"winner": null})+"\n\n");
	          	break;
	      	}
	      	else if(responses[i].player1 == nick){
	        	Ranking(responses[i].player2, responses[i].player1, responses[i].board.length);
	        	responses[i].p1_r.write("data: "+ JSON.stringify({"winner": responses[i].player2})+"\n\n");
	        	responses[i].p2_r.write("data: "+ JSON.stringify({"winner": responses[i].player2})+"\n\n");
	        	break;
	      	}
	      	else{
	        	Ranking(responses[i].player1, responses[i].player2, responses[i].board.length);
	        	responses[i].p1_r.write("data: "+ JSON.stringify({"winner": responses[i].player1})+"\n\n");
	        	responses[i].p2_r.write("data: "+ JSON.stringify({"winner": responses[i].player1})+"\n\n");
	        	break;
	      	}
	    }
  	}
}


