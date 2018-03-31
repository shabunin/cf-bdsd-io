var socket = io('http://192.168.1.49:49199');

socket.on('connect', function(){
  CF.log('Connected to bobaos server!');
});

// register listener for incoming values
socket.on('value', function(payload){
  CF.log('got broadcasted value: [id: ' + payload.id + ', value: ' + payload.value + ']');
  switch (payload.id) {
    case 43:
      CF.setJoin('d43', payload.value);
      break;
    default:
      break;
  }
});

// function to switch datapoint
function switchDatapointValue(id) {
  CF.log('switch datapoint');
  socket.emit('get value', id, function (err, res) {
    if (err) {
      CF.log('an error occured while getting datapoint value');
    }
    // now set new value
    var newValue = !res.value;
    socket.emit('set value', id, newValue, function(err, res) {
      if (err) {
        CF.log('an error occured while setting datapoint value');
      }
      CF.setJoin('d43', newValue? 1: 0);
      CF.log('set datapoint value success');
    })
  })
}

CF.userMain = function() {
  CF.log('starting cf-bdsd-io..');
  // on d43 press we switch datapoint 43
  CF.watch(CF.ObjectPressedEvent, "d43", function (j, v, t) {
    switchDatapointValue(43);
  });
};