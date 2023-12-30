const express = require('express');
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const  bodyParser = require('body-parser')
const cors = require('cors')


const app = express()
const PORT =  3000;

const packageDefinition = protoLoader.loadSync('ml.proto', {})
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const mlService = grpcObject.MLService;
const savedCoordinates = []

const client = new mlService('0.0.0.0:50051', grpc.credentials.createInsecure());

app.use(cors())
app.use(bodyParser.json())

// write router

app.post('/api/getProcessingStatus', (req,res)=>{
  const {token} = req.body;

  client.GetProcessingStatus({token}, (error, response) => {
    if(error){
      console.log(error)
      res.status(500).json({error: 'Internal server error', error})
    }
    return res.json(response)
  })
})


app.post('/api/uploadRawData', (req, res) => {
  const {file, base64Files} = req.body;
  console.log('file', file)
  console.log('base64Files', base64Files)
  client.UploadRawData({file, base64Files}, (error, response)=> {
    if(error){
      console.log(error)
      res.status(500).json({error: 'Internal server error', error})
    }
    return res.json(response)
  })
})


app.post('/api/command', (req, res)=> {
  const {command, coordinates} = req.body
  if(command === 'predict' && coordinates){
    console.log('Received predict command with coordinate:', coordinates)

    // save coordinates
    savedCoordinates.push(coordinates)
    console.log('savedCoordinates', savedCoordinates)
    return res.json({message: 'Prediction successfully'})
  }else{
    return res.status(400).json({
      error: 'Invalid request'
    })
  }
  
})

app.listen(PORT, ()=> {
  console.log(`server is running on port ${PORT}`)
})