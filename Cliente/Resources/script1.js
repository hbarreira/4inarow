var flag = 0;
function Singleplayer() {
	document.getElementById("imglogo").style.display = "none";
	document.getElementById("menuoptions").style.display = "none";
	document.getElementById("singleplayer").style.display = "block";
}

function Settings() {
	document.getElementById("menuoptions").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("settings").style.display = "block";
}

function Instructions() {
	document.getElementById("menuoptions").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("instructions").style.display = "block";
}

function Instructions2() {
	document.getElementById("instructions2").style.display = "block";
}

function BacktoGame() {
	document.getElementById("instructions2").style.display = "none";
}

function GoBack() {
	document.getElementById("instructions").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("menuoptions").style.display = "block";
}

function GoBack2() {
	document.getElementById("scoreboard").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("menuoptions").style.display = "block";
}

function GoBack3() {
	document.getElementById("multiplayer").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("menuoptions").style.display = "block";
}

function GoBack4() {
	document.getElementById("settings").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("menuoptions").style.display = "block";
}

function GoBack5() {
	document.getElementById("menujoin").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("menuoptions").style.display = "block";
}

function GoBack6() {
	document.getElementById("onlscore").style.display = "none";
	document.getElementById("scoreboard").style.display = "block";
}

function QuitGame() {
	document.getElementById("singleplayer").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("menuoptions").style.display = "block";
	document.getElementById("desiste").style.display="none";
}

function Multiplayer () {
	document.getElementById("menuoptions").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("multiplayer").style.display = "block";
}

function Scoreboard() {
	document.getElementById("menuoptions").style.display = "none";
	document.getElementById("imglogo").style.display = "block";
	document.getElementById("scoreboard").style.display ="block";
}

function MenuJoin() {
	document.getElementById("multiplayer").style.display = "none";
	document.getElementById("imglogo").style.display = "block"
	document.getElementById("menujoin").style.display = "block";
}

function startGame() {
	document.getElementById("imglogo").style.display = "none"
	document.getElementById("menujoin").style.display = "none"
	document.getElementById("singleplayer").style.display = "block"
	document.getElementById("sair").style.display = "none";
	document.getElementById("desiste").style.display = "block";
	document.getElementById("vez").style.display = "block";
}

function Loading() {
	document.getElementById("menujoin").style.display = "none";
	document.getElementById("loading").style.display = "block";
}

function OnlineScores() {
	if(flag == 0) ranking();
	document.getElementById("scoreboard").style.display = "none";
	document.getElementById("onlscore").style.display ="block";
	flag = 1;
}