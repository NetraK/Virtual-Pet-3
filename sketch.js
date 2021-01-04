//Create variables here
var dog;
var dogImage;
var happyDog;
var bedroom,garden,washroom;
var database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;

function preload()
{
  //load images here
  dogImage=loadImage("images/Dog.png");
  happyDog=loadImage("images/happydog.png");
  bedroom=loadImage("images/Bed_Room.png");
  garden=loadImage("images/Garden.png");
  washroom-loadImage("images/Wash_Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500,500);
  dog=createSprite(250,250,1,1);
  dog.scale=0.15;
  dog.addImage(dogImage);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  feed=createButton("FEED DOG");
  feed.position(500,15);
  feed.mousePressed(feedDog);

  addFood=createButton("ADD FOOD");
  addFood.position(400,15);
  addFood.mousePressed(addFoods);

}


function draw() {
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }
  
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
   feed.show();
   addFood.show();
  }

 drawSprites();

  

}

function readStock(data){
  foodS=data.val();
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}