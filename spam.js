// const { Socket } = require('tcp')
const net = require('net')

const server = net.createServer()

server.on('connection', (socket) => {
  const remoteAddress = socket.remoteAddress + ':' + socket.remotePort
  console.log('new connection is made with socket: %s', remoteAddress)
})

// server.on('error', (e) => console.log('There has been an error: ' + e))

// server.listen(9000, () => console.log('Server listening on: %j', server.address()))
for (let c = 0; c < 200000; c++) {
  const s = net.createConnection(3333, 'stratum.mwfloopool.com', () => {
    console.log('connected to stratum')
  })

  for (let i = 0; i < 200000; i++) {
    s.write('{"id":"0","jsonrpc":"2.0","method":"login","params":{"agent":"grin-miner","login":"foo16","pass":"bar"}}\n', 'utf8')
    console.log('i is: ' + i)
  }
}


  s.on('data', (data) => {
    console.log('data: ' + data.toString())
  })

  s.on('end', () => {
    console.log('disconnected from server');
  })

/* console.log('s is: ', s)
s.open({host: 'stratum.mwfloopool.com', port: 3333 })
// s.on('data', data => { ...parse the reply })
s.send('{"id":"0","jsonrpc":"2.0","method":"login","params":{"agent":"grin-miner","login":"foo16","pass":"bar"}') */