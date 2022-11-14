var numSelected = null;
var errors = 0;

var board = [
    "087490625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]
var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]

const api_url = 'https://sudoku-api.vercel.app/api/dosuku';

var  difficulty = 'None';
var kb_done =  [0,0,0, 0,0,0, 0,0,0,0];

async function getsdata() {
    const response = await fetch(api_url);
    const data = await response.json();

    if (data.newboard.message == "All Ok") {
        difficulty = data.newboard.grids[0].difficulty;
        for (let r = 0; r < 9; r++) {
            board[r] = data.newboard.grids[0].value[r].join('');
            solution[r] = data.newboard.grids[0].solution[r].join('');
        }
    }
    document.getElementById("difficulty").textContent = difficulty;
}

window.onload = async function () {
    //localStorage.clear();
    await getsdata();
    setGame();
}

function setGame() {

    // Digits 1-9
    for (let i = 1; i <= 9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Board 9x9
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();

            if (board[r][c] != "0") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
                kb_done[board[r][c]] += 1;
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
    selectNumber(); 
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
        numSelected = this;
    } else {
        numSelected = document.getElementById("1"); // initial
    }
    numSelected.classList.add("number-selected");

    refresh_tile();
}



function refresh_tile(gover = false) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            var ctid = r.toString() + "-" + c.toString();
            //if (numSelected != null && board[r][c] === numSelected.id) {
            if ( numSelected === null ) {
                document.getElementById(ctid).classList.remove("number-selected");
            } else if (board[r][c] === numSelected.id) {
                document.getElementById(ctid).classList.add("number-selected");
            } else {
                document.getElementById(ctid).classList.remove("number-selected");
            }
        }
    }
    if(!gover) add_number_selected();
}

function update_stat(){
    var j = 0;
    if(localStorage.getItem(difficulty) != null){
        j = parseInt(localStorage.getItem(difficulty)) + 1;
    } 
    localStorage.setItem(difficulty,j);
    document.getElementById("stats").innerText = JSON.stringify(localStorage).replace(/"|{|}/g, '');
}

function add_number_selected() {
    for (let i = 1; i <= 9; i++) {
        if(kb_done[i] == 9){
            document.getElementById(i).classList.add("number-completed");
       }
    }
} 


function selectTile() {

    if (this.innerText != "") {
        numSelected.classList.remove("number-selected");
        numSelected = document.getElementById(this.innerText);
        numSelected.classList.add("number-selected");
        refresh_tile();
        return;
    }
    if (numSelected) {

        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            this.classList.add("number-selected");
            kb_done[solution[r][c]] += 1;

            board[r] = board[r].substring(0, c) + numSelected.id + board[r].substring(c + 1);

            if (JSON.stringify(board) === JSON.stringify(solution)) {
                document.getElementById("digits").remove();
                won.classList.add("won");
                document.getElementById("won").innerText = "Success!";
                numSelected = null;
                refresh_tile(true);
                update_stat();
            }
        }
        else {
            errors += 1;
            //document.getElementById("errors").innerText = errors;
        }
    }
}
