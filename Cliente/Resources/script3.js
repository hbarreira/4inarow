var user;
var pass;
var jogo;
var columns;
var rows;
var grupo;

function register() {
 	user = document.getElementById("uname").value;
	pass = document.getElementById("psw").value;
	const url = "http://localhost:8108/register";
	var send = {nick: user, pass: pass};
	var s = JSON.stringify(send);

	fetch(url,{method:'POST',body:s})
		.then(response => response.json())
		.then(function(response) {
				if(response.error != null) {
					alert("Wrong Password!");
		 			console.log(response.error);
		 		}
			 	else {
			 		console.log("Success!");
			 		MenuJoin();
			 		console.log(response);
				}
		})
	.catch(1);
}

function join() {
	grupo = document.getElementById("ugroup");
	rows = 6;
	columns = 7;
	user = document.getElementById("uname").value;
	pass = document.getElementById("psw").value;
	const url = "http://localhost:8108/join";
	var send = {group: grupo, nick: user, pass: pass, size: { rows: rows, columns: columns } };
	var s = JSON.stringify(send);

	fetch(url,{method:'POST',body:s})
		.then(response => response.json())
		.then(function(response) {
				if(response.error != null) {
		 			console.log(response.error);
		 		}
			 	else {
			 		jogo = response.game;
			 		console.log("joinSuccess");
			 		console.log(response);
			 		Loading();
			 		update(user, jogo);
			 		//console.log(response);
				}
		})
	.catch(1);
}

function leave() {

	var send = {nick: user, pass: pass, game: jogo};
	var s = JSON.stringify(send);
	const url = "http://localhost:8108/leave";

	fetch(url,{method:'POST',body:s})
		.then(response => response.json())
		.then(function(response) {
			if(response.error != null) {
				alert("Error");
		 		console.log(response.error);
		 	}
			else {
			 	alert("Quitted Game");
			 	document.getElementById("desiste").style.display="none";
			 	document.getElementById("vez").style.display="none";
			 	console.log(response);
			}
		})
	.catch(1);
}


function update() {
	const url = "http://localhost:8108/update?nick="+user+"&game="+jogo;
	const eventSource = new EventSource(url);
	eventSource.onmessage = function(event) {

		const data = JSON.parse(event.data);
		//console.log(data);
		console.log(data);
		document.getElementById("vez").innerHTML = "É a vez de " + data.turn + " jogar";
		//alert(data.board.column);
		if (!isNaN(data.column)) { // coluna e um numero
			if(data.turn==user)
				jogadaOnline(data.column);
		}

		if (data.winner != null) {

			if (data.winner == user) alert("Ganhou voce");
			else alert("Ganhou o adversario");
			document.getElementById("vez").style.display="none";
			eventSource.close(); // fechar evento
			cleanTable();
			QuitGame();
		}
	}
}

function notify(c){
	user = document.getElementById("uname").value;
	pass = document.getElementById("psw").value;
	var send = {nick: user, pass: pass, game: jogo, column: c};
	var s = JSON.stringify(send);
	const url = "localhost:8108/notify";

	fetch(url,{method:'POST',body:s})
		.then(response => response.json())
		.then(function(response) {
			if(response.error != null) {
				alert("Error");
		 		console.log(response.error);
		 	}
			else {
				console.log("succnotify");
			}
		})
	.catch(1);
}

function ranking() {
	var send = {size: {rows: ROWS, columns: COLS}};
	var s = JSON.stringify(send);
	const url = "http://localhost:8108/ranking";

	fetch(url,{method:'POST',body:s})
		.then(response => response.json())
		.then(function(response) {
			if(response.error != null) console.log(response.error);
			 else {
			 	console.log(response);
			 	onlinescores(response);
			}
		})
	.catch(1);
}

function onlinescores(response) {
	var table = document.getElementById("onl");
	var table2 = document.createElement("onl2");

	var row = document.createElement("tr");
	var col = document.createElement("td");
	col.appendChild(document.createTextNode("User"));
	row.appendChild(col);
	col = document.createElement("td");
	col.appendChild(document.createTextNode("Victories"));
	row.appendChild(col);
	col = document.createElement("td");
	col.appendChild(document.createTextNode("Games Played"));
	row.appendChild(col);
	table2.appendChild(row);

	for(var i=0; i<4; i++) {
		row = document.createElement("tr");
		col = document.createElement("td");
		col.innerHTML = response.ranking[i].nick;
		//col.appendChild(document.createTextNode(response.ranking[i].nick));
		row.appendChild(col);
		col = document.createElement("td");
		col.innerHTML = response.ranking[i].victories;
		//col.appendChild(document.createTextNode(response.ranking[i].victories));
		row.appendChild(col);
		col = document.createElement("td");
		col.innerHTML = response.ranking[i].games;
		//col.appendChild(document.createTextNode(response.ranking[i].games));
		row.appendChild(col);
	    table2.appendChild(row);
	}
	table.appendChild(table2); 
}
