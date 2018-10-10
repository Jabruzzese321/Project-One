var world = [//grid object
	{a:[
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"}
	]},
	{a:[
		{art:"2",name:"Wall"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"3",name:"Orc Fighter"},
		{art:"2",name:"Wall"},
		{art:"0",name:"Orc"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"}
	]},
	{a:[
		{art:"2",name:"Wall"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"2",name:"Wall"},
		{art:"0",name:"Orc"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"}
	]},
	{a:[
		{art:"2",name:"Wall"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"0",name:"Orc"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"}
	]},
	{a:[
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"3",name:"Orc Fighter"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"1",name:"Player"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"}
	]},
	{a:[
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"}
	]},
	{a:[
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"0",name:"Orc"},
		{art:"0",name:"Orc"},
		{art:"3",name:"Orc Fighter"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"}
	]},
	{a:[
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"},
		{art:"2",name:"Wall"}
	]},
]
//0 is air, 1 is player, 2 is wall, 3 is bad guy
//world is two dimentions larger just to keep things in play area

var pictureHolder = [
	{picture: "./images/0.png"},
	{picture: "./images/1.png"},
	{picture: "./images/2.png"},
	{picture: "./images/3.png"}
]

//ajax jquery
$.ajax({    type: 'POST',    url: 'https://api.codetunnel.net/random-nick',    dataType: 'json',    data: JSON.stringify({theme: "game", sizeLimit: 11}) }).done(function(r){    alert(r.nickname); });

var firstSecond = 2;//used to count every other space for diagonals
var playerPlaceX = 4;//used to tell if target is player for bad guys
var playerPlaceY = 7;//used to tell if target is player for bad guys
var playerHp = 10;//used to tell if its game over
var p = true;//used to tell if its the players action
var turn = 0;//keeps track of turn order

var turns = [//this wil be where enemies start out on grid
	{x:playerPlaceX, y:playerPlaceY, hp:10, range:1, str:2},
	{x:1, y:4, hp:4},
	{x:4, y:2, hp:2},
	{x:6, y:6, hp:3}
]

function nextTurn(){
	render();//Render Refresh
	if (turn==0){
		turn++;
		//wait for player action
	}
	else{
		var x = turns[turn].x;
		var y = turns[turn].y;
		turn++;
		badGuyMove(x,y);
	}
	if(turn>3){
		turn=0;
	}
}

function move(x,y,d){//x and y are relation to grid,,,, d is the arrow key direction.
	p = true;
	var altX = x;
	var altY = y;
	switch(d) {
		case 1:
			altY--;
			 break;
		case 2:
			altX++;
			 break;
		case 3:
			altY++;
			 break;
		case 4:
			altX--;
			 break;
	}

	//now we use altX/Y to check if spot is open

	if (world[altX].a[altY].art=="0"){
		if(x==playerPlaceX && y==playerPlaceY){//is this the player?
			playerPlaceX = altX;
			playerPlaceY = altY;
			world[altX].a[altY].art = 1;//player is cloned to new space
		}
		else{
			world[altX].a[altY].art = 3;//enemy moved
		}
		world[x].a[y].art = 0;//first position is now empty

		turns[turn].x = altX;//update turns position
		turns[turn].y = altY;
		
		nextTurn();
	}
	else{//play bump sound to let user know something's wrong
		//if(x==playerPlaceX && y==playerPlaceY){//is this the player?
		//	var audioElement = document.createElement("bump");
		//	audioElement.setAttribute("src", "assets/bump.mp3");
		//}
	}
}

function attackAim(x,y,r,p){//we need to check all spots in range of players weapon and if its the player attacking
	//math to solve diagonal distance is to find the longer of x or y then to sub by 2 till you get to 1 or 0 counting how many times you do so the longer of x or y is then added to the number of times you had o subtract.
	for(var i = 0; i < 8; i++){
		var line = true;
		firstSecond = 2;
		var code = "";//will be used if not a line to create effeciant searching using the string as a signifer to find which direction the code will send the serch line next
		switch(i) {
			case 0://up
				line = true;
				code = "ux"
				y--;
			break;
			case 1://up right
				line = false;
				code = "ur"
				x++;
				y--;
			break;
			case 2://right
				line = true;
				code = "rx"
				x++;
			break;
			case 3://down right
				line = false;
				code = "dr"
				x++;
				y++;
			break;
			case 4://down
				line = true;
				code = "dx"
				y++;
			break;
			case 5://down left
				line = false;
				code = "dl"
				x--;
				y++;
			break;
			case 6://left
				line = true;
				code = "lx"
				x--;
			break;
			case 7://up left
				line = false;
				code = "ul"
				x--;
				y--;
			break;
		}
		attackAimLook(line,code,r,x,y,p);
	}
}

function attackAimLook(line,code,r,x,y,p){//is handed first step for branch from attackAim
	var read1 = code[0];
	var read2 = code[1];
	var step2 = line;

	if(r>0){return;}//ends search if out of range

	if(p){//if player
		if(world[altX].a[altY].art==3){//and something we can hit

			var name = world[altX].a[altY].name
			var b = $("<button>");
			b.attr("data-posX",x);
			b.attr("data-posY",y);
			b.attr("data-name",name);
			b.addClass("btn");
			b.addClass("hit");
			$(".button-section").append(b);//throw info to player attack list
			return;
		}
	}
	else{
		if(x==playerPlaceX && y==playerPlaceY){//is this the player?
			attackAction(x,y,1,0);//an npc is attacking
		}
	}

	if(firstSecond%2==0){//if first and every other diagonal
		if(line==false){//and proven diagonal
			firstSecond++;//make the next time read the diagonal as a second
			r--;//reduce the range of search
			line = true;
			switch(read1) {
			case u://up
				y--;
			break;
			case r://right
				x++;
			break;
			case d://down
				y++;
			break;
			case l://left
				x--;
			break;
			}
			attackAimLook(line,code,r,x,y);

			switch(read2) {
				case u://up
				y--;
				break;
				case r://right
				x++;
				break;
				case d://down
				y++;
				break;
				case l://left
				x--;
				break;
				}
				attackAimLook(line,read2,r,x,y);//we send read2 in place of code because of the new direction this line will take.
				line = false;//the x and y has been moved for next diagonal look
				attackAimLook(line,code,r,x,y);
		}line = step2;//return line to first state
	}

	else if(line==false){// if second diagonal sub by 2 then send next wave
		firstSecond++;
		r--;
		line = true;
		switch(read1) {
			case u://up
				y--;
			break;
			case r://right
				x++;
			break;
			case d://down
				y++;
			break;
			case l://left
				x--;
			break;
			}
			attackAimLook(line,code,r,x,y);

			switch(read2) {
				case u://up
				y--;
				break;
				case r://right
				x++;
				break;
				case d://down
				y++;
				break;
				case l://left
				x--;
				break;
				}
				attackAimLook(line,read2,r,x,y);
				line = false;//the x and y has been moved for next diagonal look
				attackAimLook(line,code,r,x,y);
	}line = step2;//return line to first state

	if(line){// if an up right left down direction
		r--;
		switch(read1) {
			case u://up
				y--;
				attackAimLook(line,code,r,x,y);
			break;
			case r://right
				x++;
				attackAimLook(line,code,r,x,y);
			break;
			case d://down
				y++;
				attackAimLook(line,code,r,x,y);
			break;
			case l://left
				x--;
				attackAimLook(line,code,r,x,y);
			break;
		}
	}
}

function attackAction(x,y,str){//enemy position//the base damage//the added dmg from stats
	$(".button-section").empty();
	$(".button-section").append('<button class="btn attack">Attack</button>')

	var hp = (turns[turn].hp);
	hp =- str;
	
	if (hp<=0){
		if(x==playerPlaceX && y==playerPlaceY){//is this the player?
			gameOver();
		}
		turns[turn].hp = 0;
		world[x].a[y].art = "0";
		nextTurn();
	}
	else{
		turns[turn].hp = hp;
		if(x==playerPlaceX && y==playerPlaceY){
			p = true;//this is here if the enemy attacked
			nextTurn();
		}
	}
}

function badGuyMove(x,y){//only needs the location of the bad guy to move
	var direction = 0;
	var startX = x;
	var startY = y;
	p = false;
	attackAim(x,y,1,p);
	if (!p){
		x = playerPlaceX - x;
		y = playerPlaceY - y
		if(x<=0){//is player left me?
			if(y>=0){//is player below me?
				x = Math.abs(x);
				y = Math.abs(y);
				if(x<=y){//is player more down?
					direction = 3;
				}
				else{//or left
					direction = 4;
				}
			}
			else{//player is above
				x = Math.abs(x);
				y = Math.abs(y);
				if(x<=y){//is player more up
					direction = 1;
				}
				else{//more left
					direction = 4;
				}
			}
		}
		else{//player is right
			if(y>=0){//is player below me?
				x = Math.abs(x);
				y = Math.abs(y);

				if(x<=y){//is player more down?
					direction = 3;
				}
				else{//or right
					direction = 2;
				}
			}
			else{//player is above
				x = Math.abs(x);
				y = Math.abs(y);
				if(x<=y){//is player more up
					direction = 1;
				}
				else{//more right
					direction = 2;
				}
			}
		}
		move(startX,startY,direction);
		if(!p){//if enemy has not moved random direction
			move(startX,startY,1);
			if(!p){
				move(startX,startY,2);
				if(!p){
					move(startX,startY,3);
					if(!p){
						move(startX,startY,4);
					}
				}
			}
		}
	}
}

function render(){
	for(var i = 1; i < 7; i++){
		for(var j = 1; j < 8; j++){
			var link = i.toString()+j;
			var art = world[i].a[j].art;
			$('.'+link).prepend('<img src="'+pictureHolder[art].picture+'" />');
		}
	}
}

$(document).keyup(function(e) {
	console.log(e);
	var ea = e.originalEvent.keyCode
	console.log(ea);
	switch (ea) {

	// Move Buttons (Keyboard Down)
	case "40":
	move(turns[0].x,turns[0].y,3)
	  break;

	  // Move Buttons (Keyboard Right)
	case "39":
	move(turns[0].x,turns[0].y,2)
	  break;

	  // Move Buttons (Keyboard Up)
	case "38":
	move(turns[0].x,turns[0].y,1);
	  break;

	  // Move Buttons (Keyboard Left)
	case "37":
	move(turns[0].x,turns[0].y,4)
	  break;

	default:
	  break;
	}
 });
// Move Buttons

$(".attack").on("click", attackAim(playerPlaceX,playerPlaceY,turns[0].range,p) );

$(".hit").on("click", function(){attackAction($(this).attr("data-posX"),$(this).attr("data-posY"),turns[0].str)});

$(".endGame").on("click", end());

function end(){//show and hide windows as made by the UI guy
	var dead;
	for(var i = 1; i < 3; i++){
		dead =+ turns[i].hp;
	}
	if(dead==0){//PLAYER WIN

	}
	else{//player Loss
		
	};
}

function startGame(){//resets the stage and places player back to start in turns[] and world[]
	turns=[{x:playerPlaceX, y:playerPlaceY, hp:10, range:1, str:2},{x:1, y:4, hp:4},{x:4, y:2, hp:2},{x:7, y:1, hp:3}]

	firstSecond = 2;playerPlaceX = 4;playerPlaceY = 7;playerHp = 10;p = true;turn = 0;
	
	world = [
		{a:[
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"}
		]},
		{a:[
			{art:"2",name:"Wall"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"3",name:"Orc Fighter"},
			{art:"2",name:"Wall"},
			{art:"0",name:"Orc"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"}
		]},
		{a:[
			{art:"2",name:"Wall"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"2",name:"Wall"},
			{art:"0",name:"Orc"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"}
		]},
		{a:[
			{art:"2",name:"Wall"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"0",name:"Orc"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"}
		]},
		{a:[
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"3",name:"Orc Fighter"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"1",name:"Player"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"}
		]},
		{a:[
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"}
		]},
		{a:[
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"0",name:"Orc"},
			{art:"0",name:"Orc"},
			{art:"3",name:"Orc Fighter"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"}
		]},
		{a:[
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"},
			{art:"2",name:"Wall"}
		]},
	]

	nextTurn();
}

startGame();