var fs = require('fs');
// Configuring the database
const dbConfig = require('../config');
const mongoose = require('mongoose');
const Image = require('../models/image');

mongoose.Promise = global.Promise;
exports.getImages = (req,res,next)=>{
    	var imageData = fs.readFileSync( 'C:\\Users\\JIshak\\Documents\\fossils\\nodefs\\assets\\puppy.png');
        const image = new Image({
            type: 'image/png',
            data: imageData
        });
        res.writeHead(200,{'Content-Type': 'image/gif'});
        res.end("<img style='height:1000px; width:1000px' src='../assets/puppy.png'/>" );
}
exports.testImages = (req,res,next)=>{

    mongoose.connect(dbConfig.url)
    .then(() => {
      // empty the collection
    Image.remove(err => {
		if (err) throw err;
		console.log("Removed all documents in 'images' collection.");
		var imageData = fs.readFileSync( 'C:\\Users\\JIshak\\Documents\\fossils\\nodefs\\assets\\puppy.png');

		// Create an Image instance
		const image = new Image({
			type: 'image/jpg',
			data: imageData
		});

	    // Store the Image to the MongoDB
		image.save()
		.then(img => {
			// Find the stored image in MongoDB, then save it in a folder
			Image.findById(img, (err, findOutImage) => {
				if (err) throw err;
				try{
                    fs.writeFileSync('C:\\Users\\JIshak\\Documents\\fossils\\nodefs\\assets\\puppy.png', findOutImage.data);
                    res.writeHead(200, {'Content-Type': 'image/png' });
                    res.send(findOutImage.data);

				}catch(e){
					console.log(e);
				}
			});
		});
	})
    });

}
