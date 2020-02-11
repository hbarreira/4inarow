var COLS = 7;
var ROWS = 6;
var round = 0; // 0-Human || 1-CPU
var status = 0; // 0-Running| 1-Over
 
function jogadaOnline(c) {

    var nodecol = document.getElementsByClassName("col")[c];

        for(var r = ROWS-1; r >= 0; r--) {

            if (nodecol.childNodes[r].className == 'row') {
                nodecol.childNodes[r].className = 'coin1';
                break;
                }
        }
 
       // if(isFull()) alert("Empate!");    
}

function play(c,modo) {
    var coluna = document.createElement("div");
    coluna.className="col";
 
    coluna.onclick = function(event) {
        if(modo==0) {
            if(round == 0) place(c,0);
            else place(Math.floor(Math.random() * COLS),0);
        }
        else {
            place(c,1);
        }
    }
 
    return coluna;
}
 
function place(c,modo) {
    if(status == 0) {
        var flag = 0; // If it goes overboard
        var nodecol = document.getElementsByClassName("col")[c];

        for(var r = ROWS-1; r >= 0; r--) {

            if (nodecol.childNodes[r].className == 'row') {
                if(modo==0) {
                if (round == 1) nodecol.childNodes[r].className = 'coin1';
                else nodecol.childNodes[r].className = 'coin2';
                flag = 1;
                break;
                }
                else{
                    nodecol.childNodes[r].className = 'coin2';
                    notify(c);
                    flag=1;
                    break;
                }
            }
        }

        if((flag == 0 && round == 0) || (flag == 0 && round == 1)) {
            if(round == 0) alert("Jogada Inválida");
        }   
        else {
            if (modo==0) {
            winner(c, r);
            round = switchRound();
            }
        }   
 
        if(round == 1 && modo==0) place(Math.floor(Math.random() * COLS),0);
 
        if(isFull()) alert("Empate!");
    }    
}
 
function switchRound() {
    if(round == 0) return 1;
    else return 0;
}
 
function winner(c, r) {
    //debugger;
    if(checkVert(c, r)) { updateScore();return; }
    if(checkHoriz(c, r)) { updateScore();return; }
    if(checkDiag1(c, r)) { updateScore();return; }
    if(checkDiag2(c, r)) { updateScore();return; }
}
 
function checkVert(c, r) { // Check if someone won vertically
    var nodecol = document.getElementsByClassName("col")[c];
    var count = 0;
 
    for(var j=r; j<ROWS; j++) {
        if(round == 0) { // Player turn
            if(nodecol.childNodes[j].className == "coin2") count++;
            if(nodecol.childNodes[j].className == "coin1") {
                count = 0;
                return false;
            }   
            if(count == 4) {
                alert("Ganhou o jogador!");
                status = 1;
                return true;
            }
        }
        else { // CPU turn
            if(nodecol.childNodes[j].className == "coin1") count++;
            if(nodecol.childNodes[j].className == "coin2") {
                count = 0;
                return false;
            }   
            if(count == 4) {
                alert("Ganhou o Computador!");
                status = 1;
                return true;
            }
        }   
    }
 
    return false;
}
 
function checkHoriz(c, r) { // Check if someone won horizontally
    var count1 = 1;
    var count2 = 0;
 
    for(var i=c+1; i<COLS; i++) { // Check right
        var nodecol = document.getElementsByClassName("col")[i];
        if(round == 0) { // Player turn
            if(nodecol.childNodes[r].className == "coin2") count1++;
            else break;
            if(checkHorizAndDiag(count1,count2)) return true;;  
        }
        else { // CPU turn
            if(nodecol.childNodes[r].className == "coin1") count1++;
            else break;
            if(checkHorizAndDiag(count1,count2)) return true;;
        }
    }
    for(var i=c-1; i>=0; i--) { // Check left
        var nodecol = document.getElementsByClassName("col")[i];
        if(round == 0) { // Player turn
            if(nodecol.childNodes[r].className == "coin2") count2++;
            else break;
            if(checkHorizAndDiag(count1,count2)) return true;;
        }
        else { // CPU turn
            if(nodecol.childNodes[r].className == "coin1") count2++;
            else break;
            if(checkHorizAndDiag(count1,count2)) return true;;
        }
    }
 
    return false;
}
 
// [x][ ][ ][ ][ ][ ][ ]
// [ ][x][ ][ ][ ][ ][ ]
// [ ][ ][x][ ][ ][ ][ ]
// [ ][ ][ ][x][ ][ ][ ]
// [ ][ ][ ][ ][ ][ ][ ]
// [ ][ ][ ][ ][ ][ ][ ]
function checkDiag1(c, r) { // Check if someone won diagonally
    var count1 = 1;
    var count2 = 0;
    var j1 = r+1;
    var j2 = r-1;
 event
    for(var i=c+1; i<COLS; i++) { //Check right
        if(j1 < ROWS) {
            var nodecol = document.getElementsByClassName("col")[i];
            if(round == 0) { // Player turn
                if(nodecol.childNodes[j1].className == "coin2") count1++;
                else break;
                if(checkHorizAndDiag(count1,count2)) return true;   
            }
            else { // CPU turn
                if(nodecol.childNodes[j1].className == "coin1") count1++;
                else break;
                if(checkHorizAndDiag(count1,count2)) return true;
            }
            j1++;
        }   
    }
 
    for(var i=c-1; i>=0; i--) { // Check Left
        if(j2 >= 0) {
            var nodecol = document.getElementsByClassName("col")[i];
            if(round == 0) { // Player turn
                if(nodecol.childNodes[j2].className == "coin2") count2++;
                else break;
                if(checkHorizAndDiag(count1,count2)) return true;
            }
            else { // CPU turn
                if(nodecol.childNodes[j2].className == "coin1") count2++;
                else break;
                if(checkHorizAndDiag(count1,count2)) return true;
            }
            j2--;
        }   
    }
 
    return false;
}
 
// [ ][ ][ ][ ][x][ ][ ]
// [ ][ ][ ][x][ ][ ][ ]
// [ ][ ][x][ ][ ][ ][ ]
// [ ][x][ ][ ][ ][ ][ ]
// [ ][ ][ ][ ][ ][ ][ ]
// [ ][ ][ ][ ][ ][ ][ ]
function checkDiag2(c, r) {
    var count1 = 1;
    var count2 = 0;
    var j1 = r-1;
    var j2 = r+1;
 
    for(var i=c+1; i<COLS; i++) { // Check right
        if(j1 >= 0) {
            var nodecol = document.getElementsByClassName("col")[i];
            if(round == 0) { // Player turn
                if(nodecol.childNodes[j1].className == "coin2") count1++;
                else break;
                if(checkHorizAndDiag(count1,count2)) return true;
            }
            else { // CPU turn
                if(nodecol.childNodes[j1].className == "coin1") count1++;
                else break;
                if(checkHorizAndDiag(count1,count2)) return true;
            }
            j1--;
        }   
    }   
 
    for(var i=c-1; i>=0; i--) { // Check Left
        if(j2 < ROWS) {
            var nodecol = document.getElementsByClassName("col")[i];
            if(round == 0) { // Player turn
                if(nodecol.childNodes[j2].className == "coin2") count2++;
                else break;
                if(checkHorizAndDiag(count1,count2)) return true;
            }
            else { // CPU turn
                if(nodecol.childNodes[j2].className == "coin1") count2++;
                else break;
                if(checkHorizAndDiag(count1,count2)) return true;
            }
            j2++;
        }   
    }   
 
    return false;
}
 
function checkHorizAndDiag(count1, count2) {
    var count = count1+count2;
    if(count == 4 && round == 0) {
        alert("Ganhou o jogador!");
        status = 1;
        return true;
    }
    if(count == 4 && round == 1) {
        alert("Ganhou o Computador!");
        status = 1;
        return true;
    }
 
    return false;
}
 
function isFull() {
    var count=0;
    for(var i=0; i<COLS; i++) {
        var nodecol = document.getElementsByClassName("col")[i];
        if (nodecol.childNodes[0].className != 'row') count++;
        else return false;
    }
 
    if(count == COLS) {
        status = 1;
        return true;
    }   
    else return false;
}

function cleanTable() {
    var parent = document.getElementById("connect4");
    parent.removeChild(parent.firstChild);
}
 
function makeTable(modo) {
    status = 0;
    var parent = document.getElementById("connect4");
    var table = document.createElement("div");
 
    table.className = "table";
    parent.appendChild(table);
    for(var c=0; c<COLS; c++) {
        var col = play(c,modo);
        table.appendChild(col);
        for(let r=0; r<COLS-1; r++) {
            var row = document.createElement("div");
            row.className = "row";
            col.appendChild(row);
        }
    }
}


function settings() {
    if(document.getElementById("7x8").checked) {
        ROWS = 7;
        COLS = 8;
    }
    else if(document.getElementById("6x7").checked) {
        ROWS = 6;
        COLS = 7;
    }
    else if(document.getElementById("5x6").checked) {
        ROWS = 5;
        COLS = 6;
    }
    else if (document.getElementById("4x5").checked) {
        ROWS = 4;
        COLS = 5;
    }

    if(document.getElementById("cpu").checked) round = 1;
    else if(document.getElementById("human").checked) round = 0;
}


function updateScore() {

    if(round == 0) {  // jogador ganha
        if (ROWS == 4 && COLS == 5) {
            var x = document.getElementById("u4").innerHTML;
            x++;
            document.getElementById("u4").innerHTML = x;
        }

        if (ROWS == 5 && COLS == 6) {
            var x2 = document.getElementById("u5").innerHTML;
            x2++;
            document.getElementById("u5").innerHTML = x2;
        }

        if (ROWS == 6 && COLS == 7) {
            var x3 = document.getElementById("u6").innerHTML;
            x3++;
            document.getElementById("u6").innerHTML = x3;
        }

        if (ROWS == 7 && COLS == 8) {
            var x4 = document.getElementById("u7").innerHTML;
            x4++;
            document.getElementById("u7").innerHTML = x4;
        }
    }

    else if(round == 1){
        if (ROWS == 4 && COLS == 5) {
            var xx = document.getElementById("b4").innerHTML;
            xx++;
            document.getElementById("b4").innerHTML = xx;
        }

        if (ROWS == 5 && COLS == 6) {
            var xx2 = document.getElementById("b5").innerHTML;
            xx2++;
            document.getElementById("b5").innerHTML = xx2;
        }

        if (ROWS == 6 && COLS == 7) {
            var xx3 = document.getElementById("b6").innerHTML;
            xx3++;
            document.getElementById("b6").innerHTML = xx3;
        }

        if (ROWS == 7 && COLS == 8) {
            var xx4 = document.getElementById("b7").innerHTML;
            xx4++;
            document.getElementById("b7").innerHTML = xx4;
        }
    }
}