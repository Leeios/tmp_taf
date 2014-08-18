//LAUNCHER
sand.require('ComApp', function(r) {
  //Socket co
  socket = io.connect();

  //Start comments app
  app = new r.ComApp({servData: current_proj.locals.proj});
});
