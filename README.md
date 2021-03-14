# NodeJSObjectize

##	Description: 

	Build objects and add it to global so that the require() is no longer needed in classes.
	Load all the js files in a project lib path.

##	Usage: 

	if ( !global.objects ) {
	    var Objects = require('/home/xxx/node-apps/lib/Objects').Objects;
	    Objects     = new Objects();
	
	    Objects.init( { path: '/home/xxx/node-apps/lib' } );
	    console.log( global.objects );
	}

##	Caller:

	const Obj = global.objects.ClassName.obj;
