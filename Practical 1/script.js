const jsBtn = document.getElementById('jsBtn');
const pyBtn = document.getElementById('pyBtn');
const javaBtn = document.getElementById('javaBtn');

let jsDisplay = document.getElementsByClassName('js-display')[0];
let pyDisplay = document.getElementsByClassName('py-display')[0];
let javaDisplay = document.getElementsByClassName('java-display')[0];

let jsCount = 0;
let pyCount = 0;
let javaCount = 0;

jsBtn.addEventListener('click', ()=>{
    jsCount = jsCount + 1;
    jsDisplay.textContent = jsCount;
    console.log(jsCount);
})

pyBtn.addEventListener('click', ()=>{
    pyCount = pyCount + 1;
    pyDisplay.textContent = pyCount;
    console.log(pyCount);
})

javaBtn.addEventListener('click', ()=>{
    javaCount = javaCount + 1;
    javaDisplay.textContent = javaCount;
    console.log(javaBtn);
})

setInterval(()=>{
    jsCount = jsCount + 1;
    pyCount = pyCount + 1;
    javaCount = javaCount + 1;

    jsDisplay.textContent = jsCount;
    pyDisplay.textContent = pyCount;
    javaDisplay.textContent = javaCount;
},3000)
