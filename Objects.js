'use strict';

const fs           = require('fs')
const req_from_str = require('require-from-string');

/* 

	Description: 

		Build objects and add it to global so that the require() is no longer needed in classes.
		Load all the js files in a project lib path.

	Usage: 

		if ( !global.objects ) {
			var Objects = require('/home/xxx/node-apps/lib/Objects').Objects;
			Objects     = new Objects();

			Objects.init( { path: '/home/xxx/node-apps/lib' } );
			console.log( global.objects );
		}

	Call it:

		const Obj = global.objects.ClassName.obj;

*/

exports.Objects = class {

	init( args ) {

		args = args || [];

		const path = args['path'];

		if ( path ) { 

			let objects         = {};
			objects['handlers'] = {};

			this.objectize( path, objects );

			// Using global in node is forbidden, unless you know what your doing.
			global.objects = objects;
		}
	}

	// Recursive function to load class objects.
	objectize( path, objects ) {

		let files = Object.keys( objects );
		
		fs.readdirSync( path ).forEach( file => {
		
			const file_loc = path + '/' + file;
			const is_dir   = fs.lstatSync( file_loc ).isDirectory();
		
			if ( is_dir == true ) {
		
				// Recursion.
				this.objectize( file_loc, objects );
		
			} else if ( file.match( /\.js$/i ) ) {
		
				const data = fs.readFileSync( file_loc );
		
				let code = Buffer.from( data ).toString( 'ascii' );
		
				if ( code ) {

					try { 
		
						const name = file.replace( /\.js/i, '' );
						const m    = req_from_str( code );
						const obj  = eval ( `new m.${name}()` );
		
						// App handlers.
						if ( file_loc.match( /handlers/ ) ) { 
							objects['handlers'][ name ] = { location: file_loc, obj: obj, exports: m };
						} else { 
							objects[ name ] = { location: file_loc, obj: obj, exports: m };
						}
					} catch( e ) { 
						console.log( e );
					}
				}
			}
		} );
	}
};
