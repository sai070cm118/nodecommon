
var ErrorHandaller={
	Error404:function (req, res, next) {
		var err = new Error('Not Found Error');
		err.status = 404;
		next(err);
	},
	Error500D:function (err, req, res, next) {
        res.status(err.status || 500);
        res.send( {
            status: 1,
            error: err,
			message:err.message
        });
    },
	Error500P:function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            status: 1,
            error: err,
			message:err.message
        });
    }
};

var ErrorHandaller_M = module.exports = ErrorHandaller;
