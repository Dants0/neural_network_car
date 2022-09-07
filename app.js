const canvas = document.getElementById('myCanvas')
canvas.width = 300; //highway canvas width
const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width = 300; //highway canvas width

const saveBestCar = document.getElementById('saveTheBestCar')

const ctx = canvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9);

let pause = false;
const N = 100 //numbers to generated
const cars = generateCars(N) 
let bestCar = cars[0];//best car in gen

if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}


const traffic =[    
    new Car(road.getLaneCenter(2),-200, 30, 50,"DUMMY", 2),
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(3),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-750, 30, 50,"DUMMY", 2),
    new Car(road.getLaneCenter(1),-800,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-835,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-845,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(4),-950,30,50,"DUMMY",2),
];



const animate = (time) =>{
    for(let i =0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }

    
    for(let i =0;i<cars.length;i++){
        cars[i].update(road.borders,traffic)
        
    }
    
    bestCar = cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        )
    )
    
    canvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;
    
    ctx.save();
    ctx.translate(0,-bestCar.y+canvas.height*0.7)
    
    road.draw(ctx);
    for(let i = 0; i<traffic.length;i++){
        traffic[i].draw(ctx, "red")
    }
    ctx.globalAlpha = 0.2
    for(let i =0;i<cars.length;i++){
        cars[i].draw(ctx, "blue");
    }
    ctx.globalAlpha = 1
    bestCar.draw(ctx,"blue", true);
    
    ctx.restore();

    networkCtx.lineDashOffset=-time/25
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate)   
}

function generateCars(N){
    const cars = [];

    for(let i = 0; i<=N;i++){
        cars.push(new Car(road.getLaneCenter(2),100,30,50,"AI"))
    }
    return cars
}

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
        saveBestCar.innerText="Check your console for see the best car brain in this generation"
        console.log(bestCar.brain);
}

function discard(){
    localStorage.removeItem("bestBrain");
    console.log('discard')
}

function reinitialize(){
    window.location.reload()
}

function changeAccelerationCars(){
    return animate()
}

animate();

