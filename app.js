
var express = require("express");
var http = require("http");
var fs = require("fs");
var app = express(); 

var bodyParser = require('body-parser')
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({    
  extended: true
})); 

app.use(express.static('public')); 

var discos=[];

http.createServer(app).listen(8000, function() {
	console.log("Servidor escuchando en puerto 8000");
});

app.get("/", function(request, response) {
	fs.readFile("discos.json", function (err, data) {    
		var cadena = data.toString();
		cadena = cadena.substr(cadena.indexOf("["));
		console.log("JSON LEIDO");
		console.log(cadena);
		discos = JSON.parse(cadena);
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("<h1>Discos disponibles</h1>");
		response.write("<img src='images/discos.jpg' />");
		response.write("<ul>");		
		for (var i in discos) {
			response.write("<li>");
			response.write(discos[i].id + ". " + 
				discos[i].Titulo + " (" + discos[i].Grupo + ") ");
			response.write("<a href='http://localhost:8000/eliminar/"+i+"' />Eliminar</a>")
			response.write("</li>");
		}
		response.write("</ul>");
		response.write("<p><a href='http://localhost:8000/nuevo'>Nuevo disco</a></p>");              
		
		
		response.write(
		"Agregar disco"+
		'<form action="http://localhost:8000/add" method="post">'+
		'<input type="text" name="id" value="Numero">'+'<br>'+
		'<input type="text" name="Titulo" value="Titulo">'+'<br>'+
		'<input type="text" name="Grupo" value="Grupo">'+'<br>'+
		'<input type="submit" value="Agregar">'+'<br>'+
		'</form>'		
		);
		
		
		response.write('Eliminar disco'+'<form action="/eliminarid" method="post">'+'<input type="text" value="Numero del disco" name="id">'
		+'<input type="submit" value="Eliminar">');
	
		response.end();
	});
});

app.get("/nuevo", function(request, response) {
	fs.readFile("nuevo.html", function (err, data) {				
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(data.toString());                
		response.end();		
	});
});

app.post("/add", function(request, response) {  
	
	discos.push({
		
		"id": parseInt(request.body.id),
		"Titulo": request.body.Titulo,
		"Grupo": request.body.Grupo
	});
	fs.writeFile('discos.json', JSON.stringify(discos));
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("<p>Nuevo disco agregado</p>");
	response.write("<p><a href='http://localhost:8000'>Volver al listado</a></p>");
	response.write("<p><a href='http://localhost:8000/nuevo'>Introducir otro disco</a></p>");
	response.end();	
});


app.get("/eliminar/:posicion", function(request, response) {
	
	discos.splice(request.params.posicion,1);
	fs.writeFile('discos.json', JSON.stringify(discos));
	
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("<p>Se ha eliminado el disco con exito</p>");
	response.write("<p><a href='http://localhost:8000'>Volver</a></p>");
	response.end();	
});



app.post("/eliminarid", function(request, response) {  
	
	for (i in discos) {
		if (parseInt(request.body.id)==discos[i].id) {
			discos.splice(i,1);
		}
	}
	fs.writeFile('discos.json', JSON.stringify(discos));
	response.redirect('http://localhost:8000');
	response.end();  

})






