document.addEventListener("DOMContentLoaded", function(){

// =======================
// STARS BACKGROUND
// =======================
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars=[];
for(let i=0;i<300;i++){
  stars.push({
    x:Math.random()*canvas.width,
    y:Math.random()*canvas.height,
    size:Math.random()*2,
    speed:Math.random()*0.2+0.05
  });
}

function animateStars(){
  ctx.fillStyle="black";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#7df9ff";

  stars.forEach(s=>{
    s.y-=s.speed;
    if(s.y<0) s.y=canvas.height;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}
animateStars();

// =======================
// PAGES
// =======================
const page1=document.getElementById("page1");
const page2=document.getElementById("page2");

document.getElementById("backBtn").onclick=()=>{
  page2.style.display="none";
  page1.style.display="block";
};

// =======================
// COUNTRIES
// =======================
const countriesByContinent={
  asia:["Kazakhstan","China","India","Japan","South Korea"],
  europe:["Germany","France","United Kingdom","Italy","Spain"],
  africa:["Egypt","Nigeria","South Africa","Kenya"],
  northamerica:["United States","Canada","Mexico"],
  southamerica:["Brazil","Argentina","Chile"],
  australia:["Australia","New Zealand"],
  antarctica:["Antarctica"]
};

const continentSelect=document.getElementById("continent");
const countrySelect=document.getElementById("country");

continentSelect.addEventListener("change", function(){

  const selected=this.value;

  countrySelect.innerHTML="<option value=''>Select Country</option>";

  if(!countriesByContinent[selected]) return;

  countriesByContinent[selected].forEach(country=>{
    const opt=document.createElement("option");
    opt.value=country;
    opt.textContent=country;
    countrySelect.appendChild(opt);
  });

});

// =======================
// TIME OF DAY
// =======================
function getTimeOfDay(){
  const h=new Date().getHours();
  if(h>=5&&h<11) return "Morning";
  if(h>=11&&h<17) return "Day";
  if(h>=17&&h<21) return "Evening";
  return "Night";
}

// =======================
// NOAA DATA (REPLACE URL)
// =======================
let noaaData=[];

fetch("noaa_data.json")
.then(r=>r.json())
.then(data=>noaaData=data)
.catch(()=>console.log("NOAA not loaded"));

// =======================
// SOLAR FUNCTIONS
// =======================
function getSolarData(country){
  return noaaData.find(e=>e.country===country) || {flux:0};
}

function getFlareClass(f){
  if(f<10) return "A";
  if(f<50) return "B";
  if(f<100) return "C";
  if(f<200) return "M";
  return "X";
}

function impactLevel(cls){
  return {
    A:"None",
    B:"Minimal",
    C:"Minor",
    M:"Moderate risk",
    X:"Severe disruption"
  }[cls];
}

// =======================
// START ANALYSIS
// =======================
document.getElementById("startBtn").onclick=()=>{

  const country=countrySelect.value;
  if(!country) return alert("Select country");

  page1.style.display="none";
  page2.style.display="block";

  const solar=getSolarData(country);
  const cls=getFlareClass(solar.flux);
  const prob=Math.min(100,Math.round(solar.flux/3));

  document.getElementById("time").innerText=
    "Location: "+country+" | "+getTimeOfDay();

  document.getElementById("class").innerText=cls;
  document.getElementById("prob").innerText=prob+"%";
  document.getElementById("aviation").innerText=impactLevel(cls);
  document.getElementById("power").innerText=impactLevel(cls);
  document.getElementById("humans").innerText=impactLevel(cls);
  document.getElementById("devices").innerText=impactLevel(cls);

};

});