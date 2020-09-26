window.onload=function(){
	listar();
	document.getElementById('formCadastro').addEventListener('submit', adicionarOuAlterar);
	document.getElementById('formCadastro').addEventListener('submit', listar);
}

var idAlterar = null;

function adicionarOuAlterar(e){
	var nom = document.getElementById('txtArtista').value;
	var fot = document.getElementById('txtFoto').value;
	var palc = document.getElementById('txtPalco').value;
	var hor = document.getElementById('inputHorario').value;
	var p = {
		nome : !nom ? "Sem nome": nom,
		foto : !fot ? "sem-foto.png": fot,
		palco : !palc ? "A definir": palc,
		hora : !hor ? "A definir" : hor
	}
	if(idAlterar == null)	
		adicionar(p);
	else if(idAlterar > 0)
		alterar(p);
	else
		alert("Ação desconhecida");	
	
	e.preventDefault();
}

function adicionar(p){	
	var atracoes = [];	
	var idValido = 1;		
	if(localStorage.getItem('value') !== null ){
		atracoes = JSON.parse(localStorage.getItem('value'));
				
		if(atracoes.length > 0)
			idValido = 	(function obterIdValido() {
							for(var i = 0; i < atracoes.length; i++)
								if(atracoes[i].Id != i+1)
									return i + 1;							
							return atracoes[atracoes.length - 1].Id + 1;
						})();
	}	

	var atracao = {
		Id: idValido,
		Artista: p.nome,
		Foto: p.foto,
		Palco: p.palco,
		Hora: p.hora
	};
	
	atracoes.push(atracao);	
	atracoes.sort(function(a,b) {
		return a.Id - b.Id;
	});			
	localStorage.setItem('value', JSON.stringify(atracoes));	
	//console.log(localStorage.getItem('value'));
	document.getElementById('formCadastro').reset();	
}

function alterar(p){
	var btn = document.getElementById('btnCadastrarSalvar');	

	atracoes = JSON.parse(localStorage.getItem('value'));
	for(var i = 0; i < atracoes.length; i++){
		if(atracoes[i].Id == idAlterar){
			atracoes[i].Artista = p.nome;
			atracoes[i].Foto = p.foto;
			atracoes[i].Palco = p.palco;
			atracoes[i].Hora = p.hora;
			
			btn.value = "Cadastrar";
			idAlterar = null;

			localStorage.setItem('value', JSON.stringify(atracoes));	
			document.getElementById('formCadastro').reset();			
			break;
		}
	}
}

function prepararAlterar(idRow){	
	document.getElementById('btnCadastrarSalvar').value = "Salvar";
	
	var txtArtista = document.getElementById('txtArtista'),
		txtFoto = document.getElementById('txtFoto'),
		txtPalco = document.getElementById('txtPalco'),
	    inputHorario = document.getElementById('inputHorario');

	var atracoes = JSON.parse(localStorage.getItem('value'));
	for(var i = 0; i < atracoes.length; i++){
		if(atracoes[i].Id == idRow){			
			txtArtista.value = atracoes[i].Artista;
			txtPalco.value = atracoes[i].Palco;
			inputHorario.value = atracoes[i].Hora;

			if(atracoes[i].Foto == 'sem-foto.png'){
				txtFoto.value = '';
			} else {
				txtFoto.value = atracoes[i].Foto;
			}
			
			listar();
			idAlterar = null;
			if(idAlterar === null){
				var th = document.getElementById("rowTable"+i);				
				th.className = "estadoAlteracao";				
			}

			idAlterar = atracoes[i].Id;
			break;
		}
	}
}

function excluir(cod){
	var atracoes = JSON.parse(localStorage.getItem('value'));

	for(var i = 0; i < atracoes.length; i++)
		if(atracoes[i].Id == cod)
			atracoes.splice(i, 1);
				
	
	localStorage.setItem('value', JSON.stringify(atracoes));
	listar();
	
	if(atracoes.length == 0)
		window.localStorage.removeItem("value");
}

function listar(){
	if(localStorage.getItem('value') === null){
		var atracoes = [];
		var alok = {
			nome : 'Alok',
			foto : 'alok.jpg',
			palco : 'Principal',
			hora : '21:45'
		};
		var dennis = {
			nome : 'Dennis DJ',
			foto : 'dennis.jpg',
			palco : 'Secundário',
			hora : '22:00'
		};
		var vintage = {
			nome : 'Vintage Culture',
			foto : 'vintage.jpg',
			palco : 'Principal',
			hora : '23:00'
		};
		atracoes.push(alok);
		atracoes.push(dennis);
		atracoes.push(vintage);

		for(var i=0;i<3;i++){
			adicionar(atracoes[i]);
		}

		return;
	}
	
	var atracoes = JSON.parse(localStorage.getItem('value'));
	var tbody = document.getElementById("tbodyResultados");

	tbody.innerHTML = '';
	
	for(var i = 0; i < atracoes.length; i++){
		var	id = atracoes[i].Id,
			artista = atracoes[i].Artista,
			foto = atracoes[i].Foto,
			palco = atracoes[i].Palco,
			hora = atracoes[i].Hora
			       
		tbody.innerHTML += '<tr id="rowTable'+i+'">'+
								'<td><img src="/img/'+foto+'" width="150px" height="150px"></td>'+
								'<td>'+artista+'</td>'+
								'<td>'+palco+'</td>'+
								'<td>'+hora+'</td>'+
								'<td><button onclick="prepararAlterar(\'' + id + '\')"><b>Alterar</b></button></td>'+
								'<td><button onclick="excluir(\'' + id + '\')"><b>Excluir</b></button></td>'+
						   '</tr>';		
	}
}