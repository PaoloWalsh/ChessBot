"use strict";



const rows = 8;
const cols = 8;

function build () {
    buildBoard();
    init_drag();
}


function buildBoard() {
    const board = document.getElementById("board");
    let count = 63;
    for(let i = rows-1; i >= 0; i--) {
        for(let j = cols-1; j >= 0; j--){
            const square = document.createElement("div");
            square.innerHTML = pieces[count];
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
let allSquares;
document.addEventListener("DOMContentLoaded", function() {
    build();
});

function init_drag() {
    allSquares = document.querySelectorAll("#board .square");
    allSquares.forEach(square => {
        square.addEventListener('dragstart', dragStart)
        square.addEventListener('dragover', dragOver)
        square.addEventListener('drop', dragDrop)
    });
}

let startPositionId;
let draggedElement;

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('id');   //square id
    draggedElement = e.target;
    console.log(draggedElement);
}

function dragOver (e) {
    e.preventDefault();
}

function dragDrop (e) {
    e.stopPropagation();
    //e.target.parentNode.append(draggedElement);
    //e.target.remove();
    //e.target.append(draggedElement);
    /*
    if(e.target.parentNode) {
        let square = e.target.parentNode();
        square.remove();
        square.append(draggedElement);
    }
    e.target.append(draggedElement);
    */
}




