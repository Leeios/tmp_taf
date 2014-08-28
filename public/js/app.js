//LAUNCHER
sand.require('ComApp', function(r) {
  //Socket co
  socket = io.connect();

  //Start comments app
  app = new r.ComApp({data: current_proj.locals.proj});
});
