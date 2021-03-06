(function(){

/*
*	SINGLETON
*/

// instância em propriedade estática
function Universo(){

	// verifica se já tem instância
	if(typeof Universo.instance === "object"){
		return Universo.instance;
	}

	// se não, continua normalmente
	this.name = "Universo";

	Universo.instance = this;

	return this;
}

Universo.prototype.getName = function(){
	return "O nome é: " + this.name;
};

var uni = new Universo();
var uni2 = new Universo();

Universo.prototype.getName2 = function(){
	return "O nome 2 é: " + this.name;
};

mostrarNaTela("O uni é igual ao uni2? " + (uni === uni2));

mostrarNaTela(uni.getName());
mostrarNaTela(uni2.getName());

// a referância se mantém
mostrarNaTela(uni.getName2());
mostrarNaTela(uni2.getName2());



// instância um uma closure
function Universo2(){

	console.log("construtor inicial");

	// aloca a instânica
	var instance = this;

	// continua normalmente
	this.name = "Universo";

	// reescreve o construtor
	Universo2 = function(){
		console.log("construtor reescrito");
		return instance;
	}
}


Universo2.prototype.getName = function(){
	return "O nome é: " + this.name;
};

var unib = new Universo2();
var unib2 = new Universo2();

Universo2.prototype.getName2 = function(){
	return "O nome 2 é: " + this.name;
};

mostrarNaTela("O unib é igual ao unib2? " + (unib === unib2));


mostrarNaTela(unib.getName());
mostrarNaTela(unib2.getName());

// note que perde a referênica
mostrarNaTela(unib.getName2);
mostrarNaTela(unib2.getName2);


// resolvendo problema de referência do prototype

function Universo3(){
	var instance;

	Universo3 = function Universo3(){
		return instance;
	}

	Universo3.prototype = this;

	instance = new Universo3();
	instance.constructor = Universo3;

	this.name = "Universo 3";

	return instance;
}

Universo3.prototype.getName = function(){
	return "O nome é: " + this.name;
};

var unic = new Universo3();
var unic2 = new Universo3();

Universo3.prototype.getName2 = function(){
	return "O nome 2 é: " + this.name;
};

mostrarNaTela("O unic é igual ao unic2? " + (unic === unic2));


mostrarNaTela(unic.getName());
mostrarNaTela(unic2.getName());

// note que perde a referênica
mostrarNaTela(unic.getName2());
mostrarNaTela(unic2.getName2());



// resolvendo com função imediata
var Universo4;
(function(){
	var instance;

	Universo4 = function Universo4(){
		if(instance){
			return instance;
		}

		instance = this;

		this.name  = "Universo 4";
	}
}());

Universo4.prototype.getName = function(){
	return "O nome é: " + this.name;
};

var unid = new Universo4();
var unid2 = new Universo4();

Universo4.prototype.getName2 = function(){
	return "O nome 2 é: " + this.name;
};

mostrarNaTela("O unid é igual ao unid2? " + (unid === unid2));


mostrarNaTela(unid.getName());
mostrarNaTela(unid2.getName());

// note que perde a referênica
mostrarNaTela(unid.getName2());
mostrarNaTela(unid2.getName2());




/*
*	FACTORY
*/
function CarMaker(){
	this.name = "CarMaker";
}
CarMaker.prototype.sayHello = function(){
	mostrarNaTela("Olá desde CarMaker");
};
CarMaker.factory = function(type){
	var constr = type,
		newcar;

	// erro caso o construtor não exista
	if (typeof CarMaker[constr] !== "function"){
		throw{
			name: "Error",
			message: constr + " não existe"
		};
	}

	// construtor existe segue adiante
	if(typeof CarMaker[constr].prototype.sayHello !== "function"){
		CarMaker[constr].prototype = new CarMaker();
	}

	newcar = new CarMaker[constr]();
	return newcar;
};


CarMaker.Compact = function(){
	this.doors = 4;
	this.name = "Compact";
}

var corolla = CarMaker.factory('Compact');
console.log(corolla);
corolla.sayHello();
mostrarNaTela(corolla.name);


// ITERATOR
var agg = (function(){

	var index = 0,
		data = [1, 2, 3, 4, 5],
		length = data.length;


	return{
		next: function(){
			var element;
			if(!this.hasNext()){
				return null;
			}
			element = data[index];
			index++;
			return element;
		},
		hasNext: function(){
			return index < length;
		},
		reset: function(){
			index = 0;
		}
	}

}());

var elementTest;
while(elementTest = agg.next()){
	mostrarNaTela("O elemento é: " + elementTest);
}

agg.reset();

while(agg.hasNext()){
	mostrarNaTela("O elemento agora é: " + agg.next());
}



// DECORATOR

function Sale(price){
	this.price = price || 100;
}

Sale.prototype.getPrice = function(){
	return this.price;
};

Sale.decorators = {};

Sale.prototype.decorate = function(decorator){
	var F = function(){},
		overrides = this.constructor.decorators[decorator],
		i, newObj;

	F.prototype = this;
	newObj = new F();
	newObj.uber = F.prototype;

	for(i in overrides){
		if(overrides.hasOwnProperty(i)){
			newObj[i] = overrides[i];
		}
	}
	return newObj;
};

Sale.decorators.fedtax = {
	getPrice: function(){
		var price = this.uber.getPrice();
		price += price * 7.5 / 100;
		return price;
	}
};

Sale.decorators.money = {
	getPrice: function(){
		return "$ " + (this.uber.getPrice().toFixed(2));
	}
};

Sale.decorators.cdn = {
	getPrice: function(){
		return "CDN" + (this.uber.getPrice());
	}
};

var sale = new Sale(100);
mostrarNaTela("O preço agora é: " + sale.getPrice());

sale = sale.decorate('fedtax');
mostrarNaTela("O preço agora é: " + sale.getPrice());

sale = sale.decorate('money');
mostrarNaTela("O preço agora é: " + sale.getPrice());

sale = sale.decorate('cdn');
mostrarNaTela("O preço agora é: " + sale.getPrice());



// DECORATOR SEM HERANÇA
function Vendas(price){
	this.price = price || 100;
	this.decorators_list = [];
}

Vendas.decorators = {};

Vendas.decorators.fedtax = {
	getPrice: function(price){
		return price + price * 7.5 / 100;
	}
};

Vendas.decorators.money = {
	getPrice: function(price){
		return "$ " + price;
	}
};

Vendas.decorators.cdn = {
	getPrice: function(price){
		return "CDN" + price;
	}
};

Vendas.prototype.decorate = function(decorator){
	this.decorators_list.push(decorator);
};

Vendas.prototype.getPrice = function(){
	var price = this.price,
		i,
		max = this.decorators_list.length,
		name;

	for(i = 0; i < max; i++){
		name = this.decorators_list[i];
		price = Vendas.decorators[name].getPrice(price);
	}

	return price;
};


var venda = new Vendas(100);
mostrarNaTela("O preço de venda agora é: " + venda.getPrice());

venda.decorate('fedtax');
mostrarNaTela("O preço de venda agora é: " + venda.getPrice());

venda.decorate('money');
mostrarNaTela("O preço de venda agora é: " + venda.getPrice());

venda.decorate('cdn');
mostrarNaTela("O preço de venda agora é: " + venda.getPrice());





// Estrategy

var validator = {
	types: {},
	messages: [],
	config: {},
	validate: function(data){
		var i, msg, type, checker, result_ok;

		this.messages = [];

		for(i in data){
			if(data.hasOwnProperty(i)){
				type = this.config[i];
				if(!type){
					continue;
				}

				checker = this.types[type];
				if(!checker){
					throw{
						name: "ValidatonError",
						message: "Não é capaz de validar o tipo: " + type
					};
				}

				result_ok = checker.validate(data[i]);
				if(!result_ok){
					msg = "Invalid value for "+ i +", "+ checker.instructions;
					this.messages.push(msg);
				}
			}
		}
		return this.hasErrors();
	},
	hasErrors: function(){
		return this.messages.length !== 0;
	}
};

validator.types.isNonEmpty = {
	validate: function(value){
		return value !== "";
	},
	instructions: "O valor não pode ser vazio"
};

validator.types.isNumber = {
	validate: function(value){
		return !isNaN(value);
	},
	instructions: "O valor deve ser um número"
};

validator.types.isAlphaNum = {
	validate: function(value){
		return !/[^a-z0-9]/i.test(value);
	},
	instructions: "O valor não permite caracteres especiais"
};



validator.config = {
	first_name: "isNonEmpty",
	age: "isNumber",
	username: "isAlphaNum",
	email: "isEmail"
};
var data = {
	first_name: "Super",
	last_name:"Man",
	age: "unknown",
	username: "$Clarck"
};
validator.validate(data);
if(validator.hasErrors()){
	console.log(validator.messages.join("\n"));
}






}());