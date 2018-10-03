var firstSecond = 2;
//grid object
var world = [
	{x :
		{y :
			{open : true,//for move refrance
			entity : {
				name: "Air",
				art : 0,//art will be set into array and the number will allow us to call which we need. 0 is art for air
				mortal : false,// this is here for telling if you can attack something
				HP : 0,
				Str : 0,
				Int : 0,
				Wep : "Fist",
				Inv : [
					{name : "Fist",
					Atk : 1,
					Rng : 1,
					Equipt : true
					}
				]
			}
			}
		}
	}
]
//0 is air, 1 is player, 2 is wall, 3 is bad guy

playerPlaceX = 1;
playerPlaceY = 1;
playerHp = 10;
p = true;



function move(x,y,d){//x and y are relation to grid,,,, d is the arrow key direction.
	var altX = x;
	var altY = y;
	switch(d) {
		case 1:
			altY++;
			 break;
		case 2:
			altX++;
			 break;
		case 3:
			altY--;
			 break;
		case 4:
			altX--;
			 break;
	}

	//now we use altX/Y to check if spot is open

	if (world[0].x[altX].y[altY].open){
		if(x==playerPlaceX && y==playerPlaceY){//is this the player?
			playerPlaceX = altX;
			playerPlaceY = altY;
		}
		(world[0].x[altX].y[altY]) = (world[0].x[x].y[y]);//player is cloned to new space
		(world[0].x[x].y[y].open) = true;
		(world[0].x[x].y[y].entity.art) = 0;
		(world[0].x[x].y[y].entity.mortal) = false;
		nextTurn();
	}
	else{//play bump sound to let user know something's wrong
		var audioElement = document.createElement("bump");
		audioElement.setAttribute("src", "assets/bump.mp3");

	}
}

function attackAim(x,y,r,p) { //we need to check all spots in range of players weapon and if its the player attacking
	//math to solve diagonal distance is to find the longer of x or y then to sub by 2 till you get to 1 or 0 counting how many times you do so the longer of x or y is then added to the number of times you had o subtract.
	for(var i = 0; i < 8; i++){
		var line = true;
		firstSecond = 2;
		var code = "";//will be used if not a line to create effeciant searching using the string as a signifer to find which direction the code will send the serch line next
		switch(i) {
			case 0://up
				line = true;
				code = "ux"
				y++;
			break;
			case 1://up right
				line = false;
				code = "ur"
				x++;
				y++;
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
				y--;
			break;
			case 4://down
				line = true;
				code = "dx"
				y--;
			break;
			case 5://down left
				line = false;
				code = "dl"
				x--;
				y--;
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
				y++;
			break;
		}
		attackAimLook(line,code,r,x,y,p);
	}
}

function attackAimLook(line,code,r,x,y,p){
	var read1 = code[0];
	var read2 = code[1];
	var step2 = line;

	if(r>0){return;}//ends search if out of range

	if(p){//if player
		if(world[0].x[x].y[y].entity.mortal){//and something we can hit
			var xy = x+","+y;
			var name = world[0].x[x].y[y].entity.name
			var b = $("<button>");
			b.position=xy;
			b.name=name;
			$("#attackList").append(b);//throw info to player attack list
			return;
		}
	}
	else{
		if(x==playerPlaceX && y==playerPlaceY){//is this the player?
			attackAction(x,y,1,1);//an npc is attacking
		}
	}

	if(firstSecond%2==0){//if first and every other diagonal
		if(line==false){//and proven diagonal
			firstSecond++;//make the next time read the diagonal as a second
			r--;//reduce the range of search
			line = true;
			switch(read1) {
			case u://up
				y++;
			break;
			case r://right
				x++;
			break;
			case d://down
				y--;
			break;
			case l://left
				x--;
			break;
			}
			attackAimLook(line,code,r,x,y);

			switch(read2) {
				case u://up
				y++;
				break;
				case r://right
				x++;
				break;
				case d://down
				y--;
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
				y++;
			break;
			case r://right
				x++;
			break;
			case d://down
				y--;
			break;
			case l://left
				x--;
			break;
			}
			attackAimLook(line,code,r,x,y);

			switch(read2) {
				case u://up
				y++;
				break;
				case r://right
				x++;
				break;
				case d://down
				y--;
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
				y++;
				attackAimLook(line,code,r,x,y);
			break;
			case r://right
				x++;
				attackAimLook(line,code,r,x,y);
			break;
			case d://down
				y--;
				attackAimLook(line,code,r,x,y);
			break;
			case l://left
				x--;
				attackAimLook(line,code,r,x,y);
			break;
		}
	}
}

function attackAction(x,y,atk,str){//enemy position//the base damage//the added dmg from stats
	var damage = atk+str;
	var hp = (world[0].x[x].y[y].entity.HP);
	hp =- damage;
	if (hp<=0){
		if(x==playerPlaceX && y==playerPlaceY){//is this the player?
			gameOver();
		}
		world[0].x[x].y[y].entity.HP = 0;
		world[0].x[x].y[y].open = true;
		world[0].x[x].y[y].entity.mortal = false;
		world[0].x[x].y[y].entity.art = 0;
		//death/gameover function if players hp is 0

	}
	else
		world[0].x[x].y[y].entity.HP = hp;
		if(x==playerPlaceX && y==playerPlaceY){
			playerHp = hp;
		}
	nextTurn();
	p = true;
}

function badGuyMove(x,y){
	var direction = 0;
	var startX = x;
	var startY = y;
	p = false;
	attackAim(x,y,1,p);
	if (!p){
		x = playerPlaceX - x;
		y = playerPlaceY - y
		if(x<=0){//is player left me?
			if(y<=0){//is player below me?
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
			if(y<=0){//is player below me?
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
		p = true;
	}
}