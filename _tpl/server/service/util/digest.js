var crypto = require('crypto');

function createDigest(){
	var d = crypto.createHash('sha1');
	return {
		update : function(chunk){d.update(chunk);},
		end : function(){return d.digest('hex');}
	};
}

exports.createDigest = createDigest;
exports.digestOnce = function(data){
	var checksum = createDigest();
	checksum.update(data);
	return checksum.end();
};
