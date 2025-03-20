const apiKey = null;

var symbol = "";


//url com uma apiKey demo para poder testar, clique em pesquisar com o input vazio e será usada apiKey demo
const urlDemo =
  "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=demo";


async function main() {
  symbol = document.getElementById("input").value;

  try {

    let querry = validade();
    console.log(querry);

    const data = await Get(querry);
    update(data);


  } catch (error) {
    

    if (error.message.includes("claim your free API")) {
      showError("Usando Demo ApiKey, Informe sua ApiKey primeiro antes de pesquisar");

    } else if (error.message.includes("Invalid API call")) {
      showError("Codigo inválido ou não encontrado");

    } else {
      showError();
    }
  }
}


function validade(){
  if (apiKey != null) {
    if (symbol.length < 5) {
      throw new Error("Invalid API call");
    }
    
    return `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}.SA&interval=5min&apikey=${apiKey}`;

  }
  else{
    if(symbol.length > 0){
      throw new Error("claim your free API");
    }

    return urlDemo;
  }
}

function showError(erroMessage=null) {
  const div = document.getElementById("error");
  div.style.display = "block";
  div.innerHTML = "";

  const erro = document.createElement("p");

  div.style.maxWidth = "900px";
  div.style.textAlign = "center";
  div.style.backgroundColor = "#3e3e3e1a";
  div.style.borderRadius = "15px";
  div.style.margin = "7px";
  div.style.padding = "10px";

  erro.style.margin = "0px";

  erro.textContent = "Erro, não foi possivel conectar ao servidor.";

  if (erroMessage != null) {
    erro.textContent = erroMessage;
  }

  div.appendChild(erro);
}

function update(data) {
  const erro = document.getElementById("error");
  erro.innerHTML = "";
  erro.style.display = "none";

  //sy = symbol
  const sy = document.getElementById("symbol");
  const tableView = document.getElementById("view");

  sy.textContent = data["Meta Data"]["2. Symbol"];
  

  tableView.style.opacity = 1;
  

  const tableBody = document.getElementById("historic-tb");
  tableBody.innerHTML = "";
  const values = data["Time Series (Daily)"];

  let max = 0;
  let min = 99999;
  let avg = 0;
  let i = 0;

  for (let key in values) {


    const tRow = document.createElement("tr");

    const tData = document.createElement("td");
    const tData2 = document.createElement("td");
    const tData3 = document.createElement("td");

    let openValue = parseFloat(values[key]["1. open"]);
    let closeValue = parseFloat(values[key]["4. close"]);

    tData.textContent = openValue.toFixed(2);
    tData2.textContent = closeValue.toFixed(2);
    console.log(key);
    tData3.textContent = new Intl.DateTimeFormat("pt-BR").format(new Date(key));

    tRow.appendChild(tData3);
    tRow.appendChild(tData);
    tRow.appendChild(tData2);

    tableBody.appendChild(tRow);

    i++;
    avg += closeValue;

    if (max < parseFloat(values[key]["4. close"])) {
      max = parseFloat(values[key]["4. close"]);
    }

    if (min > parseFloat(values[key]["4. close"])) {
      min = parseFloat(values[key]["4. close"]);
    }


    if (i > 6) {
      break;
    }
  }

  const average = document.getElementById("avg");
  const maxima = document.getElementById("max");
  const minima = document.getElementById("min");

  average.textContent = (avg / i).toFixed(2);
  maxima.textContent = max.toFixed(2);
  minima.textContent = min.toFixed(2);
}

async function Get(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
}
