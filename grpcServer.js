const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = './ml.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const mlProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

server.addService(mlProto.MLService.service, {
  GetProcessingStatus:( call, callback) => {
    callback(null, {status: 'tranning'})
  },
  UploadRawData: (call, callback)=> {
    callback(null, {message: 'Data upload successfully!'})
  }
})


const PORT_GRPC = 50051;
const HOST_GPRC = '0.0.0.0';

server.bind(`${HOST_GPRC}:${PORT_GRPC}`, grpc.ServerCredentials.createInsecure())
console.log(`grpc Server running at ${HOST_GPRC}:${PORT_GRPC}`);
server.start()