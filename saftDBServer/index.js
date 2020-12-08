const validator = require('xsd-schema-validator');
const xml2js = require('xml2js');
const fs = require('fs');
const parser = require('./parser.js');

fs.readFile('saft/saft4.xml', (err, data) => {
  var data = data.toString().replace('\ufeff', '');

  validator.validateXML(data, 'saft/saftSchema2.xsd', (err, result) => {
    if (err) {
      throw err;
    }

    if (result.valid) {
      console.log('XML file was valid');

      xml2js.parseString(data, (err, result) => {
        if (err) {
          throw err;
        }

        auditFile = result.AuditFile;

        let jsonResult = parser.parseSAFT(auditFile);

        fs.writeFile('db.json', JSON.stringify(jsonResult), (err, result) => {
          if (err) {
            throw err;
          }

          console.log('JSON database created');

          const jsonServer = require('json-server');
          const server = jsonServer.create();
          const router = jsonServer.router('db.json');
          const middlewares = jsonServer.defaults();

          server.use(middlewares);

          server.use(router);

          server.listen(5432, () => {
            console.log('JSON Server is running on port 5432');
          });
        });
      });
    }
  });
});
