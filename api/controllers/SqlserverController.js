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
						return res.view('dashboard');
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

	busquedaCliente: function(req,res){
		var ced = req.param('cedula');
		console.log(ced);

		Sqlserver.query('USE AutoservicioDB; SELECT id, nombre, cedula, numero, direccion FROM cliente where cedula=\''+ced+'\';', function(err, cliente){
			console.log(cliente);
			if(cliente[0].id==null){
				res.view('registrocliente');
			}else{

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
		var numero = req.param('numero');
		var cliente = {
			nombre: nombre,
			cedula: cedula,
			direccion: direccion,
			numero: numero
		};

		Sqlserver.query('INSERT INTO cliente VALUES (\''+nombre+'\',\''+cedula+'\',\''+numero+'\',\''+direccion+'\');', function(err, info){
			res.view('visualCliente', cliente);
		});
	}
};