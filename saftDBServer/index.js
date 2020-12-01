const validator = require('xsd-schema-validator');
const xml2js = require('xml2js')
const fs = require('fs')
 
console.log("Beep boop I am a robot")

fs.readFile('saft/saft3.xml', function(err, data) {
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
                jsonDB = {}
              
                //TODO parse xml
                console.log(result)
                console.log(result.AuditFile.MasterFiles)
                console.log(result.AuditFile.GeneralLedgerEntries)
                console.log(result.AuditFile.SourceDocuments)

                //average profit, top sold products, monthly sales value for each product - Sales
                //TODO profit, as in net profit or just sales?
                //TODO sales value/volume?
                masterFiles = auditFile.MasterFiles[0]
                jsonDB.products = {}

                products = masterFiles.Product
                if(products)
                    products.forEach(product => {
                        code = product.ProductCode[0]
                        jsonDB.products[code] = {name: product.ProductDescription[0], unitsSold: 0, sales: []}
                        jsonDB.products[code].sales.length = 12
                        jsonDB.products[code].sales.fill(0)
                    });
                

                //sales, expenses (every month) - Overview
                //TODO expenses?
                jsonDB.overview = {sales:[], expenses:[]}
                jsonDB.overview.sales.length = 12
                jsonDB.overview.expenses.length = 12
                jsonDB.overview.sales.fill(0)
                jsonDB.overview.expenses.fill(0)
                
                sourceDocuments = auditFile.SourceDocuments[0]

                if(sourceDocuments.SalesInvoices){
                    invoices = sourceDocuments.SalesInvoices[0].Invoice

                    if(invoices)
                        invoices.forEach(invoice => {
                            periodIndex = parseInt(invoice.Period[0]) - 1
                            jsonDB.overview.sales[periodIndex] += Number(invoice.DocumentTotals[0].NetTotal[0])
                            
                            lines = invoice.Line
                            if(lines)
                                lines.forEach(line => {
                                    productCode = line.ProductCode[0]
                                    quantity = parseInt(line.Quantity[0])
                                    creditAmount = Number(line.CreditAmount[0])

                                    jsonDB.products[productCode].unitsSold += quantity
                                    jsonDB.products[productCode].sales[periodIndex] += creditAmount
                                })
                        });
                }

                if(sourceDocuments.WorkingDocuments){
                    workDocuments = sourceDocuments.WorkingDocuments[0].WorkDocument
                    
                    if(workDocuments)
                        workDocuments.forEach(workDocument => {
                            periodIndex = parseInt(workDocument.Period[0]) - 1
                            jsonDB.overview.sales[periodIndex] += Number(workDocument.DocumentTotals[0].NetTotal[0])
                            
                            lines = workDocument.Line
                            if(lines)
                                lines.forEach(line => {
                                    productCode = line.ProductCode[0]
                                    quantity = parseInt(line.Quantity[0])
                                    creditAmount = Number(line.CreditAmount[0])

                                    jsonDB.products[productCode].unitsSold += quantity
                                    jsonDB.products[productCode].sales[periodIndex] += creditAmount
                                })
                        });
                }

                console.log(jsonDB.overview)
                console.log(jsonDB.products)
                
                //TODO purchases (supplier, product, quantity, date, cost), debt (supplier, product, due date, total amount), last month's total purchases and total debt (value) - Purchases
                
                //TODO accounts receivable (account, due date, cost of goods, interest), accounts payable (account, due date, total amount) - Accounts
              
                fs.writeFile('db.json', JSON.stringify(result), function(err, result){
                  if(err){
                      throw err;
                  }
              
                  console.log("JSON database created")
                })
              })
          }
        })
})

 /*

*/
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
 
server.use(middlewares)

//////////////
//This might not be necessary, but I'm keeping this here just in case
module.exports = (req, res, next) => {
    //TODO check if the requested saft exists and if not retrieve it from the jasmin api
    
    next()
}
//////////////
/*
server.use(router)

//TODO Port should be changed to a different port
server.listen(3000, () => {
  console.log('JSON Server is running')
})*/