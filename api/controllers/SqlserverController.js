/**
 * SqlserverController
 *
 * @description :: Server-side logic for managing queries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	consulta: function(req, res){

	var obj;

	Sqlserver.query('SELECT nombre FROM cliente;', function(err, results){
		if(err) return res.serverError(err);

		obj = results;
		console.log(results);
	});

	return res.view('dashboard', { objetos: obj});
	},

	busquedaVehiculo: function(req,res){

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
};