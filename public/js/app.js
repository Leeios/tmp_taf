//LAUNCHER
sand.require('appComments', function(r) {
  //Socket co
  socket = io.connect();

  //Start comments app
	// var current_file = !(JSON.stringify(file));
  console.log(current_file);
  app = new r.appComments();
});
