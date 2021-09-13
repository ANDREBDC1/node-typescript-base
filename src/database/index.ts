import { createConnection, Connection } from 'typeorm'

createConnection().then((connetion : Connection) => {
  connetion.runMigrations({ transaction: 'all' })
  console.log('connected data bese')
}).catch(erro => console.log(erro))
