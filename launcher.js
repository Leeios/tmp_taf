var forever = require('forever');

  var child = new (forever.Forever)('server.js', {
    options: []
  });

/*Useless ?*/
child.on('start', function(process, data) {
    console.error('Start script ' + '{' + data + '}');
});

child.on('stop', function(process) {
    console.error('Stop script ');
});

child.on('restart', function(info) {
    console.error('Restarting script because ' + info.file + ' changed');
});

child.on('err', function(err) {
    console.error('Forever raised an error: ' + err);
});

child.on('exit', function(code) {
    console.error('Forever detected script exited with code ' + code);
});

child.start();
forever.startServer(child);
