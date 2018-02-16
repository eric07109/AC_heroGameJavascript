class BaseCharacter {
	constructor(name, hp, ap){
		this.name = name;
		this.hp = hp;
		this.ap = ap;
		this.maxHP = hp;
		this.alive = true;
	}

	attack(enemy, damage){
		if(this.alive == false){
			return;
		}
		enemy.getHurt(damage);
	}

	getHurt(damage){
		this.hp -= damage;
		if(this.hp <= 0){
			this.die();
		}

		var _this = this;
		var i = 1;

		_this.id = setInterval(function(){

			if (i == 1){
				_this.element.getElementsByClassName("effect-image")[0].style.display = "block";
				_this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
				_this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
			}

			_this.element.getElementsByClassName("effect-image")[0].src = "images/effect/blade/" + i + ".png";
			
			//special effect continues
			i++;

			if (i > 8){
				_this.element.getElementsByClassName("effect-image")[0].style.display = "none";
				_this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
				_this.element.getElementsByClassName("hurt-text")[0].textContent = "";
				clearInterval(_this.id);
			}

		}, 50);
	}

	die(){
		this.alive = false;
	}

	updateHTML(hpElement, hurtElement){
		hpElement.textContent = this.hp;
		hurtElement.style.width = (100- (this.hp/this.maxHP)*100) + "%";
	}

	heal(){
		this.hp += 30
		if (this.hp > this.maxHP){
			this.hp = this.maxHP
		}
		this.updateHTML(this.hpElement, this.hurtElement);
	}
}

class Hero extends BaseCharacter {
	constructor(name, hp, ap){
		super(name, hp, ap);

		this.element = document.getElementById("hero-image-block");
		this.hpElement = document.getElementById("hero-hp");
		this.maxHpElement = document.getElementById("hero-max-hp");
		this.hurtElement = document.getElementById("hero-hp-hurt");

		this.hpElement.textContent = this.hp;
		this.maxHpElement.textContent = this.maxHP;

		console.log("召喚英雄 " + this.name + "!");
	}

	attack(character) {
    	var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    	super.attack(character, Math.floor(damage));
  	}

  	getHurt(damage){
  		super.getHurt(damage);
  		this.updateHTML(this.hpElement, this.hurtElement);
  	}
}

class Monster extends BaseCharacter {
	constructor(name, hp, ap){
		super(name, hp, ap);

		this.element = document.getElementById("monster-image-block");
		this.hpElement = document.getElementById("monster-hp");
		this.maxHpElement = document.getElementById("monster-max-hp");
		this.hurtElement = document.getElementById("monster-hp-hurt");

		this.hpElement.textContent = this.hp;
		this.maxHpElement.textContent = this.maxHP;

		console.log("遇到怪獸 " + this.name + "!");
	}
	attack(character) {
    	var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    	super.attack(character, Math.floor(damage));
  	}
  	getHurt(damage){
  		super.getHurt(damage);
  		this.updateHTML(this.hpElement, this.hurtElement);
  	}
}

function addActionsEvent(){
	var skill = document.getElementById("skill");
	var heal = document.getElementById("heal");
	skill.onclick = function(){
		heroAttack();
	}
	heal.onclick = function(){
		console.log("heal pressed");
		healHero();
	}
}
addActionsEvent();

function heroAttack(){
	//document.getElementsByClassName("skill-block")[0].style.display = "none";
	//why not use getElementById("skill")?
	document.getElementById("skill").style.display = "none";
	document.getElementById("heal").style.display = "none";
	setTimeout(function(){
		hero.element.classList.add("attacking");
		setTimeout(function(){
			hero.attack(monster);
			hero.element.classList.remove("attacking");
		}, 500);
	}, 100);

	setTimeout(function(){
		if (monster.alive){
			monster.element.classList.add("attacking");
			setTimeout(function(){
				monster.attack(hero);
				monster.element.classList.remove("attacking");
				endTurn();
				if(hero.alive == false){
					// end game
				}else{
					//document.getElementsByClassName("skill-block")[0].style.display = "block";
					document.getElementById("skill").style.display = "inline";
					document.getElementById("heal").style.display = "inline";
				}

			}, 500);
		}
		else{
			finish()
		}
	}, 1100);
}

function healHero(){
	//hide button
	document.getElementById("heal").style.display = "none";
	//heal hero
	hero.heal();
	//show button
	document.getElementById("heal").style.display = "inline";
	endTurn()
}

var rounds = 10;

function endTurn(){
	rounds --;
	document.getElementById("round-num").textContent = rounds;
	if(rounds < 1){
		finish()
	}
}

function finish(){
	var dialog = document.getElementById("dialog");
	dialog.style.display = "block";
	if (monster.alive == false) {
		dialog.classList.add("win");
	}else{
		dialog.classList.add("lose");
	}
}