const validator = require('xsd-schema-validator')
const xml2js = require('xml2js')
const fs = require('fs')
const parser = require('./parser.js')
 
console.log("Beep boop I am a robot")

fs.readFile('saft/saft4.xml', function(err, data) {
    var data = data.toString().replace("\ufeff", "");

    validator.validateXML(data, 'saft/saftSchema2.xsd', function(err, result) {
        console.log("And I said heyheyhey it's just an ordinary day, and it's just your state of mind, at the end of the day you just gotta say it's alright")
          if (err) {
            throw err;
          }
        
          if(result.valid){
            console.log("XML file was valid")
            
            xml2js.parseString(data, function (err, result) {
                if (err) {
                  throw err;
                }

                auditFile = result.AuditFile

                let jsonResult = parser.parseSAFT(auditFile)
                              
                fs.writeFile('db.json', JSON.stringify(jsonResult), function(err, result){
                  if(err){
                      throw err;
                  }
              
                  console.log("JSON database created")
                  
                  const jsonServer = require('json-server')
                  const server = jsonServer.create()
                  const router = jsonServer.router('db.json')
                  const middlewares = jsonServer.defaults()
                  
                  server.use(middlewares)


                  server.use(router)

                  //TODO Port should be changed to a different port
                  server.listen(5432, () => {
                    console.log('JSON Server is running on port 5432')
                  })
                })
              })
          }
        })
})