const validator = require('xsd-schema-validator');
const xml2js = require('xml2js');
const fs = require('fs');
const parser = require('./parser.js');

fs.readFile('saft/saft_accounting.xml', (err, data) => {
  var data = data.toString().replace('\ufeff', '');

  validator.validateXML(data, 'saft/saftSchema2.xsd', (err, result) => {
    if (err) {
      throw err;
    }

    if (result.valid) {
      console.log('Accounting XML file was valid');

      xml2js.parseString(data, (err, result) => {
        if (err) {
          throw err;
        }

        auditFile = result.AuditFile;

        parser.parseSAFTAccounting(auditFile);

        fs.readFile('saft/saft_01-12-2020_31-12-2020.xml', (err, data) => {
          var data = data.toString().replace('\ufeff', '');
        
          validator.validateXML(data, 'saft/saftSchema2.xsd', (err, result) => {
            if (err) {
              throw err;
            }
        
            if (result.valid) {
              console.log('Billing XML file was valid');
        
              xml2js.parseString(data, (err, result) => {
                if (err) {
                  throw err;
                }
        
                invoiceFile = result.AuditFile;
        
                parser.parseSAFTInvoice(invoiceFile);

                fs.writeFile('db.json', JSON.stringify(parser.jsonDB), (err, result) => {
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
          })
        });
      });
    }
  });
});
