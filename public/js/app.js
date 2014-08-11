//LAUNCHER
sand.require('appComments', function(r) {
  //Socket co
  socket = io.connect();

  //Start comments app
  app = new r.appComments({servData: current_file.locals.file});
});
