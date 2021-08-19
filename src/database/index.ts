import { createConnection } from 'typeorm'

createConnection().then(() => {
  console.log('connected data base')
}).catch(erro => console.log(erro))
