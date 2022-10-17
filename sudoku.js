var numSelected = null;
var tileSelected = null;
var difficulty = null;
var errors = 0;

var board = [
    "-87491625",
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

async function getsdata() {
    const response = await fetch(api_url);
    const data = await response.json();
    const message = data.newboard.message;
    difficulty = 'None';
    if (data.newboard.message == "All Occck") {
        difficulty = data.newboard.grids[0].difficulty;
        for (let r = 0; r < 9; r++) {
            board[r] = JSON.stringify(data.newboard.grids[0].value[r]);
            board[r] = board[r].replace(/[,\[\]]/g,"")

            board[r] = board[r].replace(/0/g,"-")
            solution[r] = JSON.stringify(data.newboard.grids[0].solution[r]);
            solution[r] = solution[r].replace(/[,\[\]]/g,"")
        }
    }
    document.getElementById("difficulty").textContent = difficulty;
}


window.onload = async function() {
     
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

            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
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
}

function selectNumber(){
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
    refresh_tile();
}

function refresh_tile(){
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            var ctid = r.toString() + "-" + c.toString();
            if (board[r][c] == numSelected.id) {
                document.getElementById(ctid).style.color = "#ff0000"; 
            } else {
                document.getElementById(ctid).style.color = "initial"; 
            }
        }
    }
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            numSelected.classList.remove("number-selected");
            numSelected.id = this.innerText;
            refresh_tile();
            return;
        }

        // "0-0" "0-1" .. "3-1"
        let coords = this.id.split("-"); //["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            this.innerText = numSelected.id;
            //board[r][c] = numSelected.id.toString();
            let rboard = board[r];
            rboard = rboard.split('');
            rboard[c] = numSelected.id;
            rboard = rboard.join('');
            board[r] = rboard;
            this.style.color = "#ff0000";
            if(JSON.stringify(board) == JSON.stringify(solution)) {
                document.getElementById("digits").remove();
                won.classList.add("won");
                document.getElementById("won").innerText = "You won!";
            }
        }
        else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}