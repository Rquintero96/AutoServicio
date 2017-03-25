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
		console.log("Hola");
		console.log(req.body);
		console.log(req.param('name'));
		console.log(req.param('contra'));



	}
};