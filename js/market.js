
let stocks=[], indexValue=5000, speed=1, timer=null;

async function loadData(){
 stocks = await fetch('data/stocks.json').then(r=>r.json());
 render();
}

function render(){
 const tbody=document.querySelector("#marketTable tbody");
 tbody.innerHTML="";
 stocks.forEach(s=>{
  let tr=document.createElement("tr");
  tr.innerHTML=`<td>${s.code}</td><td>${s.name}</td>
  <td>${s.price.toFixed(2)}</td>
  <td>${((s.price/s.basePrice-1)*100).toFixed(2)}%</td>
  <td>${s.volume}</td>`;
  tbody.appendChild(tr);
 });
}

function simulate(){
 stocks.forEach(s=>{
  let change=(Math.random()-0.5)*0.02;
  s.price*=1+change;
  s.volume=Math.floor(Math.random()*100000);
 });
 indexValue = 5000*(stocks.reduce((a,s)=>a+s.price,0)/stocks.reduce((a,s)=>a+s.basePrice,0));
 document.getElementById("indexValue").innerText=indexValue.toFixed(2);
 render();
}

function startSim(){
 if(timer) clearInterval(timer);
 timer=setInterval(simulate,1000/speed);
}

function nextDay(){ simulate(); }

function toggleAuto(){
 if(timer){ clearInterval(timer); timer=null; }
 else startSim();
}

function setSpeed(v){ speed=v; if(timer) startSim(); }

loadData();
