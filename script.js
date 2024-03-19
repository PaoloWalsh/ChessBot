"use strict";

const rows = 8;
const cols = 8;

function build () {
    console.log("hello world!")
    buildBoard();
}


function buildBoard() {
    console.log("hello world!")
    const board = document.getElementById("board");
    let count = 63;
    for(let i = rows-1; i >= 0; i--) {
        for(let j = cols-1; j >= 0; j--){
            const square = document.createElement("div");
            square.setAttribute("id", count--);
            //square.setAttribute("readonly", "readonly");
            square.classList.add("square");
            if(!((i+j)%2))
                square.classList.add("light");
            else
                square.classList.add("dark");
            board.appendChild(square);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    console.log("hello world!")
    build();
});

/*
function buildBoard() {
    console.log("hello world!")
    const board = document.getElementById("board");
    for(let i = rows-1; i >= 0; i--) {
        const row = document.createElement("div");
        row.setAttribute("id", "row: " + i);
        row.classList.add("rows");
        board.appendChild(row);
        for(let j = cols-1; j >= 0; j--){
            const square = document.createElement("input");
            square.setAttribute("id", "row, col: "+ i + " " + j);
            if(!(i+j)%2)
                square.classList.add("light-square");
            else
                square.classList.add("dark-square");
            row.appendChild(square);
        }
    }
}

*/