module.exports = {
    jsonDB: {},

    parseMonth: function(req, res, next){
        elements = req.split("-")
        return Number(elements[1])
    },

    parseProducts: function(req, res, next){
        products = req

        this.jsonDB.products = {}

        products = masterFiles.Product
        if(products)
            products.forEach(product => {
                code = product.ProductCode[0]
                this.jsonDB.products[code] = {name: product.ProductDescription[0], unitsSold: 0, sales: []}
                this.jsonDB.products[code].sales.length = 12
                this.jsonDB.products[code].sales.fill(0)
            });
    },

    parseLedgerAccount: function(req, res, next){
        taxonomyCode = req.TaxonomyCode
        if(Array.isArray(taxonomyCode)){
            taxonomyCode = taxonomyCode[0].split("")
            taxonomyCode.map(Number)

            console.log(taxonomyCode)

            openingDebit = Number(req.OpeningDebitBalance[0])
            openingCredit = Number(req.OpeningCreditBalance[0])
            closingDebit = Number(req.ClosingDebitBalance[0])
            closingCredit = Number(req.ClosingCreditBalance[0])

            switch(taxonomyCode[0]){
                case 1:{
                    //Meios financeiros líquidos

                }
                case 2:{
                    //Contas a receber e a pagar

                }
                case 3:{
                    //Inventários e ativos biológicos

                }
                case 4:{
                    //Investimentos

                }
                case 5:{
                    //Capital, reservas e resultados transitados

                }
                case 6:{
                    //Gastos

                }
                case 7:{
                    //Rendimentos
                    
                }
                case 8:{
                    //Resultados

                }
            }
        }
    },

    parseGeneralLedgerAccounts: function(req, res, next){
        ledgerAccounts = req[0].Account
        console.log(ledgerAccounts)
        ledgerAccounts.forEach(account => {
            this.parseLedgerAccount(account)
        });
    },

    parseMasterFiles: function(req, res, next){
        masterFiles = req

        this.parseProducts(masterFiles.Product)
        this.parseGeneralLedgerAccounts(masterFiles.GeneralLedgerAccounts)
    },

    parseTransaction: function(req, res, next){        
        lines = req.Lines[0]
        
        creditLines = lines.CreditLine
        creditLines.forEach(credit => {
            console.log(credit)
            periodIndex = this.parseMonth(credit.SystemEntryDate[0]) - 1
            value = Number(credit.CreditAmount[0])
            //TODO wat do
        })
        
        debitLines = lines.DebitLine
        debitLines.forEach(debit => {
            console.log(debit)
            periodIndex = this.parseMonth(debit.SystemEntryDate[0]) - 1
            value = Number(debit.DebitAmount[0])
            //TODO wat do
        })
    },

    parseGeneralLedgerEntries: function(req, res, next){
        console.log(req)
        journals = req.Journal
        journals.forEach(journal => {
            transactions = journal.Transaction
            if(transactions){
                transactions.forEach(transaction => {
                    this.parseTransaction(transaction)
                })
            }
            
        })
    },

    parseSAFT: function(req, res, next){
        //TODO parse xml
        console.log(req)
        
        //sales, expenses, assets, debt (every month) - Overview
        //TODO expenses?
        this.jsonDB.overview = {sales:[], expenses:[], assets:[], debt:[]}
        this.jsonDB.overview.sales.length = 12
        this.jsonDB.overview.expenses.length = 12
        this.jsonDB.overview.sales.fill(0)
        this.jsonDB.overview.expenses.fill(0)

        this.jsonDB.overview.assets.length = 12
        this.jsonDB.overview.debt.length = 12
        this.jsonDB.overview.assets.length = 12
        this.jsonDB.overview.assets.length = 12

        //average profit, top sold products, monthly sales value for each product - Sales
        //TODO profit, as in net profit or just sales?
        masterFiles = req.MasterFiles[0]
        this.parseMasterFiles(masterFiles)    
        
        ledgerEntries = req.GeneralLedgerEntries[0]
        this.parseGeneralLedgerEntries(ledgerEntries)
        
        sourceDocuments = req.SourceDocuments[0]

        if(sourceDocuments.SalesInvoices){
            invoices = sourceDocuments.SalesInvoices[0].Invoice

            if(invoices)
                invoices.forEach(invoice => {
                    periodIndex = parseInt(invoice.Period[0]) - 1
                    this.jsonDB.overview.sales[periodIndex] += Number(invoice.DocumentTotals[0].NetTotal[0])
                    
                    lines = invoice.Line
                    if(lines)
                        lines.forEach(line => {
                            productCode = line.ProductCode[0]
                            quantity = parseInt(line.Quantity[0])
                            creditAmount = Number(line.CreditAmount[0])

                            this.jsonDB.products[productCode].unitsSold += quantity
                            this.jsonDB.products[productCode].sales[periodIndex] += creditAmount
                        })
                });
        }

        if(sourceDocuments.WorkingDocuments){
            workDocuments = sourceDocuments.WorkingDocuments[0].WorkDocument
            
            if(workDocuments)
                workDocuments.forEach(workDocument => {
                    periodIndex = parseInt(workDocument.Period[0]) - 1
                    this.jsonDB.overview.sales[periodIndex] += Number(workDocument.DocumentTotals[0].NetTotal[0])
                    
                    lines = workDocument.Line
                    if(lines)
                        lines.forEach(line => {
                            productCode = line.ProductCode[0]
                            quantity = parseInt(line.Quantity[0])
                            creditAmount = Number(line.CreditAmount[0])

                            this.jsonDB.products[productCode].unitsSold += quantity
                            this.jsonDB.products[productCode].sales[periodIndex] += creditAmount
                        })
                });
        }
        
        //TODO purchases (supplier, product, quantity, date, cost), debt (supplier, product, due date, total amount), last month's total purchases and total debt (value) - Purchases
        
        //TODO accounts receivable (account, due date, cost of goods, interest), accounts payable (account, due date, total amount) - Accounts

        return this.jsonDB
    }
}