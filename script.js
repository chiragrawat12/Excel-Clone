let rowNumberSectionDiv = document.querySelector(".row-number-section");

let formulaBarSelectedCellArea = document.querySelector(".selected-cell-div");

let dataObj = {};

let lastcell;

for(let i = 1 ; i <= 100 ; i++){
    let div = document.createElement("div");
    div.innerText = i;
    div.classList.add("row-number")
    rowNumberSectionDiv.append(div);
}

let columnTagSectionDiv = document.querySelector(".column-tag-section"); 

for(let i = 0 ; i < 26 ; i ++){
    let reqAlpha = String.fromCharCode(65 + i);

    let div = document.createElement("div");
    div.classList.add("column-tag");
    div.innerText = reqAlpha;
    columnTagSectionDiv.append(div);
}


let cellSectionDiv = document.querySelector(".cell-section");

cellSectionDiv.addEventListener("scroll" , function(e) {
    rowNumberSectionDiv.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;
    columnTagSectionDiv.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
});


for(let i = 1 ; i <= 100 ; i++) {
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    for(let j = 0 ; j < 26 ; j++) {
        let reqAlpha = String.fromCharCode(65 + j);
        let dataAddress = reqAlpha+i;

        dataObj[dataAddress] = {
            value: undefined,
            formula: undefined,
            upstream: [],
            downstream: []
        }

        let cellDiv = document.createElement("div");

        cellDiv.addEventListener("input" , function(e) {
            if(!e.currentTarget.innerText){
                return;
            } 
            let currDataAddress = e.currentTarget.getAttribute("data-address");

            let currCellObj = dataObj[currDataAddress];

            currCellObj.value = e.currentTarget.innerText;
            currCellObj.formula = undefined;

            let currUpstream = currCellObj.upstream;

            for (let k = 0; k < currUpstream.length; k++) {
                // removeFromDownstream(parent,child)
                removeFromDownstream(currUpstream[k], currCellAddress);
            }

            currCellObj.upstream = [];

            let currDownstream = currCellObj.downstream;

            for(let i = 0 ; i < currDownstream.length ; i++){
                updateCell(currDownstream[i]);
            }

            dataObj[currDataAddress] = currCellObj;


            // console.log(dataObj);
        });

        cellDiv.classList.add("cell");

        cellDiv.contentEditable = true;
        
        cellDiv.setAttribute("data-address" , dataAddress);

        cellDiv.addEventListener("click" , function(e) {
            if(lastcell){
                lastcell.classList.remove("cell-selected");
            }
            e.currentTarget.classList.add("cell-selected");
            lastcell = e.currentTarget;

            let currentCellAddress = e.currentTarget.getAttribute("data-address");
            formulaBarSelectedCellArea.innerText = currentCellAddress;
        });

        rowDiv.append(cellDiv);
    }

    cellSectionDiv.append(rowDiv);
}

dataObj["A1"].value = 20;
dataObj["A1"].downstream = ["B1"];
dataObj["B1"].formula = "2 * A1";
dataObj["B1"].upstream = ["A1"];
dataObj["B1"].downstream = ["C1"];
dataObj["B1"].value = 40;
dataObj["C1"].formula = "2 * B1";
dataObj["C1"].upstream = ["B1"];
dataObj["C1"].value = 80;

let a1cell = document.querySelector("[data-address='A1']")
let b1cell = document.querySelector("[data-address='B1']")
let c1cell = document.querySelector("[data-address='C1']")

a1cell.innerText = 20
b1cell.innerText = 40
c1cell.innerText = 80


function removeFromDownstream(parentCell, childCell) {
    //1- fetch parentCell's downstream
  
    let parentDownstream = dataObj[parentCell].downstream;
  
    //2- filter kro childCell ko parent ki downstream se
  
    let filteredDownstream = []; //a1
  
    for (let i = 0; i < parentDownstream.length; i++) { 
      if (parentDownstream[i] != childCell) {
        filteredDownstream.push(parentDownstream[i]);
      }
    }
  
    //3- filtered upstream ko wapis save krwado dataObj me req cell me
    dataObj[parentCell].downstream = filteredDownstream
  }


  function updateCell(cell) {
    let dependentCell = document.querySelector(`[data-address=${cell}]`);
    
    let cellObj = dataObj[cell];
    let upstream = cellObj.upstream;
    let formula = cellObj.formula;


    let valObj = {}

    for(let i = 0 ; i < upstream.length ; i++){
        let cellValue = dataObj[upstream[i]].value;

        valObj[upstream[i]] = cellValue;
    }

    for(key in valObj){
        formula = formula.replace(key , valObj[key]);
    }

    let newValue = eval(formula);

    dataObj[cell].value = newValue;

    let downstream = cellObj.downstream;
    dependentCell.innerText = newValue;


    for(let i = 0 ; i < downstream.length ; i++){
        updateCell(downstream[i]);
    }
    
  }
  