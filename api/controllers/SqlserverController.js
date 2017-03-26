/**
 * SqlserverController
 *
 * @description :: Server-side logic for managing queries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {




	busquedaVehiculo: function(req,res){
		var ced= req.param('cedula');

		res.view('dashboard');
	},

	login: function(req,res){
			u=req.param('usuario');
			c=req.param('contra');
			console.log(req.body);
			Sqlserver.query('Select nombre from administrator where (usuario=\''+u+'\' and password=\''+c+'\')', 
				function(err, results){
					if (err) { return res.serverError(err); }
					console.log(results);
					console.log(results[0]);
					if(results.length != 0){
						req.session.me = results[0].nombre;
						console.log(req.session.me);
						return res.view('menu-admin');
					}
					else{
						req.session.me = null;
						console.log(req.session.me);
						res.view('login', {fallo: true});
					}
				});
	    
	},

	logout: function(req,res){
		req.session.me=null;
		console.log(req.session.me);
		res.view('homepage');
	},

	verificar: function (req, res){
		if(req.session.me!=null){
			console.log(req.session.me);
			res.view('dashboard');
		}
		else{
			res.view('login', {fallo: false});
		}
	},

	verificar2: function(req,res){
		if(req.session.me!=null){
			console.log(req.session.me);
			res.view('menu-admin');
		}
		else{
			res.view('login', {fallo: false});
		}
	},

	busquedaCliente: function(req,res){
		var ced = req.param('cedula');
		console.log(ced);

		Sqlserver.query('USE AutoservicioDB; SELECT id, nombre, cedula, numero, direccion FROM cliente where cedula=\''+ced+'\';', function(err, cliente){
			console.log(cliente);
			if(cliente[0]==undefined){
				res.view('registrocliente',{cedula: ced});
			}else{
				req.session.cliente = cliente[0].id;
				console.log(req.session.cliente);
				Sqlserver.query('USE AutoservicioDB; Select vehiculo.marca, vehiculo.modelo, vehiculo.año, vehiculo.placa, vehiculo.cilindrada from vehiculo inner join vehiculoCliente on vehiculoCliente.idVehiculo = vehiculo.id where '+cliente[0].id+' = vehiculoCliente.idCliente;', function(err, vehiculos){

					cliente[0].vehiculos = vehiculos;
					console.log(vehiculos);
					console.log(cliente[0]);
					res.view('visualcliente', {data: cliente[0]});
				});
				
			}
		});
	},

	registrarCliente: function(req,res){
		var nombre = req.param('nombre');
		var cedula = req.param('cedula');
		var direccion = req.param('direccion');
		var numero = req.param('telefono');
		var cliente = {
			nombre: nombre,
			cedula: cedula,
			direccion: direccion,
			numero: numero,
			vehiculos: null
		};

		Sqlserver.query('INSERT INTO cliente VALUES (\''+nombre+'\',\''+cedula+'\',\''+numero+'\',\''+direccion+'\');', function(err, info){
			res.view('visualCliente', {data: cliente});
		});
	},

	registrarVehiculo: function(req,res){
		var tipo= req.param('tipo');
		var marca= req.param('marca');
		var modelo= req.param('modelo');
		var año= req.param('año');
		var placa= req.param('placa');
		var cilindrada= req.param('cilindrada');

		console.log('AQUI SE IMPRIME LO DEL VEHICULO');
		console.log(tipo);
		console.log(marca);
		console.log(modelo);
		console.log(año);
		console.log(placa);
		console.log(cilindrada);
		console.log(req.session.cliente);

		var tipo = typeof req.session.cliente;
		console.log(tipo);



		Sqlserver.query('USE AutoservicioDB; Execute insertaVehiculoCliente \''+tipo+'\', \''+marca+'\', \''+modelo+'\', \''+año+'\', \''+placa+'\', \''+cilindrada+'\', \''+req.session.cliente+'\'', function(err, info){
			console.log(err);
			console.log(info);
			if(err==null){

				Sqlserver.query('USE AutoservicioDB; SELECT id, nombre, cedula, numero, direccion FROM cliente where id=\''+req.session.cliente+'\';', function(err, cliente){
					console.log(cliente);
						
						Sqlserver.query('USE AutoservicioDB; Select vehiculo.marca, vehiculo.modelo, vehiculo.año, vehiculo.placa, vehiculo.cilindrada from vehiculo inner join vehiculoCliente on vehiculoCliente.idVehiculo = vehiculo.id where '+cliente[0].id+' = vehiculoCliente.idCliente;', function(err, vehiculos){

							cliente[0].vehiculos = vehiculos;

							res.view('visualcliente', {data: cliente[0]});
						});
				
					
				});
			}
		});





	}
};