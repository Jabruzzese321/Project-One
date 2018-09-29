
//grid object
var world = [
	{x : 
		{y : 
			{open : true,
			entity : {
				HP : 10,
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
		(world[0].x[altX].y[altY]) = (world[0].x[x].y[y]); //player is cloned to new space
		(world[0].x[x].y[y]) = whateverAirIs;
		nextTurn();
	}
	else{
		//play bump sound to let user know something's wrong
	}
}