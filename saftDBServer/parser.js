module.exports = {
    jsonDB: {},

    auxDB: {},

    parseMonth: function(req, res, next){
        elements = req.split("-")
        return Number(elements[1])
    },

    flattenArray: function(req, res, next){
        return req.map((x) => {
                    if(Math.abs(x) < 0.01) return 0
                    return x
                })
    },

    makeMonthlyArray: function(req, res, next){
        let newArray = []
        newArray.length = 12
        newArray.fill(0)
        return newArray
    },

    parseCustomers: function(req, res, next){
        if(req){
            req.forEach(customer => {
                let customerID = customer.CustomerID[0]
                let accountID = customer.AccountID[0]
                let companyName = customer.CompanyName[0]

                this.auxDB.customers[customerID] = {accountID: accountID, companyName: companyName}
            })
        }
    },
    
    parseSuppliers: function(req, res, next){
        if(req){
            req.forEach(supplier => {
                let supplierID = supplier.SupplierID[0]
                let accountID = supplier.AccountID[0]
                let companyName = supplier.CompanyName[0]

                this.auxDB.suppliers[supplierID] = {accountID: accountID, companyName: companyName}
            })
        }
    },

    parseProducts: function(req, res, next){
        let products = req

        this.jsonDB.products = {}

        if(products)
            products.forEach(product => {
                let code = product.ProductCode[0]
                this.jsonDB.products[code] = {name: product.ProductDescription[0], unitsSold: 0, sales: this.makeMonthlyArray()}
            });
    },

    parseLedgerAccount: function(req, res, next){
        let accountID = req.AccountID[0]
        let accountDescription = req.AccountDescription[0]
        let taxonomyCode = req.TaxonomyCode
        if(Array.isArray(taxonomyCode)){
            taxonomyCode = taxonomyCode[0].split("")
            taxonomyCode = taxonomyCode.map(Number)

            let openingDebit = Number(req.OpeningDebitBalance[0])
            let openingCredit = Number(req.OpeningCreditBalance[0])
            let closingDebit = Number(req.ClosingDebitBalance[0])
            let closingCredit = Number(req.ClosingCreditBalance[0])

            let account = {description: accountDescription, taxonomyCode: taxonomyCode,
                            openingDebit: openingDebit, openingCredit: openingCredit,
                            closingDebit: closingDebit, closingCredit: closingCredit,
                            monthlyDebit: this.makeMonthlyArray(), monthlyCredit: this.makeMonthlyArray()}

            account.monthlyDebit[11] = closingDebit
            account.monthlyCredit[11] = closingCredit

            account.monthlyDebit.fill(openingDebit,0,11)
            account.monthlyCredit.fill(openingCredit,0,11)

            this.auxDB.accounts[accountID] = account
        }
    },

    parseGeneralLedgerAccounts: function(req, res, next){
        let ledgerAccounts = req[0].Account
        //console.log(ledgerAccounts)
        ledgerAccounts.forEach(account => {
            this.parseLedgerAccount(account)
        });
    },

    parseMasterFiles: function(req, res, next){
        let masterFiles = req

        this.parseCustomers(masterFiles.Customer)
        this.parseSuppliers(masterFiles.Supplier)
        this.parseProducts(masterFiles.Product)
        this.parseGeneralLedgerAccounts(masterFiles.GeneralLedgerAccounts)
    },

    parseTransaction: function(req, res, next){        
        let lines = req.Lines[0]
        /*
        let transaction = {credit: [], debit: []}
        transaction.credit.length = 12
        transaction.debit.length = 12
        transaction.credit.fill(0)
        transaction.debit.fill(0)
        */
       
        let supplier = req.SupplierID
        let customer = req.CustomerID

        let transaction = {monthlyBalance: this.makeMonthlyArray(), date:req.TransactionDate[0], value: 0}  

        let creditLines = lines.CreditLine
        if(creditLines){
            creditLines.forEach(credit => {
                //console.log(credit)
                let accountID = credit.AccountID[0]
                let periodIndex = this.parseMonth(credit.SystemEntryDate[0]) - 1
                let value = Number(credit.CreditAmount[0])

                //transaction.credit[periodIndex] += value
                let account = this.auxDB.accounts[accountID]
                for(i = periodIndex; i < 12; ++i){
                    if(account){
                        this.auxDB.accounts[accountID].monthlyCredit[i] += value
                    }
                    transaction.monthlyBalance[i] -= value
                }
            })

            if(transaction.value == 0)
                transaction.value = -transaction.monthlyBalance[11]
        }
        
        let debitLines = lines.DebitLine
        if(debitLines)
            debitLines.forEach(debit => {
                //console.log(debit)
                let accountID = debit.AccountID[0]
                let periodIndex = this.parseMonth(debit.SystemEntryDate[0]) - 1
                let value = Number(debit.DebitAmount[0])
                
                //transaction.debit[periodIndex] += value
                let account = this.auxDB.accounts[accountID]
                for(i = periodIndex; i < 12; ++i){
                    if(account){
                        this.auxDB.accounts[accountID].monthlyDebit[i] += value
                    }
                    transaction.monthlyBalance[i] += value
                }
            })

        transaction.monthlyBalance = transaction.monthlyBalance.map((x)=>{return -x})
        transaction.monthlyBalance = this.flattenArray(transaction.monthlyBalance)

        if(customer){
            customerObject = this.auxDB.customers[customer[0]]
            if(customerObject){
                transaction.account = customerObject.accountID
                this.auxDB.accountsReceivable.push(transaction)
            }
        }
        else if(supplier){
            supplierObject = this.auxDB.suppliers[supplier[0]]
            if(supplierObject){
                transaction.account = supplierObject.accountID
                this.auxDB.accountsPayable.push(transaction)

                if(transaction.monthlyBalance[11] == 0){
                    this.jsonDB.purchases.purchases.push({supplier: supplierObject.companyName, value: transaction.value})
                }
                else{
                    if(this.jsonDB.purchases.debt[supplierObject.accountID])
                        this.jsonDB.purchases.debt[supplierObject.accountID] += transaction.value
                    else
                        this.jsonDB.purchases.debt[supplierObject.accountID] = {supplier: supplierObject.companyName, value: transaction.value}
                }
            }
        }
    },

    parseGeneralLedgerEntries: function(req, res, next){
        let journals = req.Journal
        journals.forEach(journal => {
            let transactions = journal.Transaction
            if(transactions){
                transactions.forEach(transaction => {
                    this.parseTransaction(transaction)
                })
            }
            
        })
    },

    parseSourceDocuments: function(req, res, next){
        if(req.SalesInvoices){
            let invoices = req.SalesInvoices[0].Invoice

            if(invoices)
                invoices.forEach(invoice => {
                    let periodIndex = parseInt(invoice.Period[0]) - 1
                    //this.jsonDB.overview.sales[periodIndex] += Number(invoice.DocumentTotals[0].NetTotal[0])
                    
                    let lines = invoice.Line
                    if(lines)
                        lines.forEach(line => {
                            let productCode = line.ProductCode[0]
                            let quantity = parseInt(line.Quantity[0])
                            let creditAmount = Number(line.CreditAmount[0])

                            this.jsonDB.products[productCode].unitsSold += quantity
                            this.jsonDB.products[productCode].sales[periodIndex] += creditAmount
                        })
                });
        }

        if(req.WorkingDocuments){
            let workDocuments = req.WorkingDocuments[0].WorkDocument
            
            if(workDocuments)
                workDocuments.forEach(workDocument => {
                    let periodIndex = parseInt(workDocument.Period[0]) - 1
                    //this.jsonDB.overview.sales[periodIndex] += Number(workDocument.DocumentTotals[0].NetTotal[0])
                    
                    let lines = workDocument.Line
                    if(lines)
                        lines.forEach(line => {
                            let productCode = line.ProductCode[0]
                            let quantity = parseInt(line.Quantity[0])
                            let creditAmount = Number(line.CreditAmount[0])

                            this.jsonDB.products[productCode].unitsSold += quantity
                            this.jsonDB.products[productCode].sales[periodIndex] += creditAmount
                        })
                });
        }
    },

    createAccountsObject: function(req, res, next){
        let previousAccRec = 0
        this.auxDB.accountsReceivable.forEach(transaction => {
            if(transaction.monthlyBalance[10] != 0){
                previousAccRec += transaction.monthlyBalance[10]
            }
            let currentBalance = transaction.monthlyBalance[11]
            if(currentBalance != 0){
                this.jsonDB.accounts.accountsReceivable.total += currentBalance
                this.jsonDB.accounts.accountsReceivable.accounts.push({account: transaction.account, date: transaction.date, value: currentBalance})
            }
        });
        if(previousAccRec == 0){
            this.jsonDB.accounts.accountsReceivable.percentage = "-"
        }
        else
            this.jsonDB.accounts.accountsReceivable.percentage = (this.jsonDB.accounts.accountsReceivable.total - previousAccRec) / previousAccRec

        let previousAccPay = 0
        
        this.auxDB.accountsPayable.forEach(transaction => {
            if(transaction.monthlyBalance[10] != 0){
                previousAccPay += transaction.monthlyBalance[10]
            }
            let currentBalance = transaction.monthlyBalance[11]
            if(currentBalance != 0){
                this.jsonDB.accounts.accountsPayable.total += currentBalance
                this.jsonDB.accounts.accountsPayable.accounts.push({account: transaction.account, date: transaction.date, value: currentBalance})
            }
        });
        if(previousAccPay == 0){
            this.jsonDB.accounts.accountsPayable.percentage = "-"
        }
        else
            this.jsonDB.accounts.accountsPayable.percentage = (this.jsonDB.accounts.accountsPayable.total - previousAccPay) / previousAccPay
    },

    createBalanceSheet: function(req, res, next){
        let balanceSheet = {assets: this.makeMonthlyArray(), liabilities: this.makeMonthlyArray(), sales: this.makeMonthlyArray(), expenses: this.makeMonthlyArray(),
                            revenue: this.makeMonthlyArray(), interest: this.makeMonthlyArray(), cash: this.makeMonthlyArray(), currentAssets: this.makeMonthlyArray(), 
                            currentLiabilities: this.makeMonthlyArray(), inventory: this.makeMonthlyArray(), startingRevenue: 0, startingExpenses: 0, startingLiabilities: 0,
                            startingAssets: 0}

        for(accountID in this.auxDB.accounts){
            let account = this.auxDB.accounts[accountID]
            for(i = 0; i < 12; ++i){
                let balance = account.monthlyDebit[i] - account.monthlyCredit[i]

                switch(account.taxonomyCode[0]){
                    case 1:{
                        if(balance < 0){
                            if(i == 0){
                                balanceSheet.startingLiabilities -= account.openingDebit - account.openingCredit
                            }
                            balanceSheet.liabilities[i] -= balance
                        }
                        else{
                            if(i == 0){
                                balanceSheet.startingAssets += account.openingDebit - account.openingCredit
                            }
                            balanceSheet.assets[i] += balance
                            balanceSheet.inventory[i] += balance
                            balanceSheet.currentAssets[i] += balance
                        }
                        break;
                    }
                    case 2:{
                        if(balance < 0){
                            if((account.taxonomyCode[1] == 2 && account.taxonomyCode[2] == 2) || (account.taxonomyCode[1] == 1 && account.taxonomyCode[2] == 8)
                                || (account.taxonomyCode[1] == 7 && account.taxonomyCode[2] == 4) || (account.taxonomyCode[1] == 4)){
                                balanceSheet.currentLiabilities[i] -= balance
                            }
                            if(i == 0){
                                balanceSheet.startingLiabilities -= account.openingDebit - account.openingCredit
                            }
                            balanceSheet.liabilities[i] -= balance
                        }
                        else{
                            if(i == 0){
                                balanceSheet.startingAssets += account.openingDebit - account.openingCredit
                            }
                            if((account.taxonomyCode[1] == 1 && account.taxonomyCode[2] == 2) || (account.taxonomyCode[1] == 2 && account.taxonomyCode[2] == 8)){
                                balanceSheet.currentAssets[i] += balance
                            }
                            balanceSheet.assets[i] += balance
                        }
                        break;
                    }
                    case 3:
                    case 5:{
                        if(balance < 0){
                            if(i == 0){
                                balanceSheet.startingLiabilities -= account.openingDebit - account.openingCredit
                            }
                            balanceSheet.liabilities[i] -= balance
                        }
                        else{
                            if(i == 0){
                                balanceSheet.startingAssets += account.openingDebit - account.openingCredit
                            }
                            balanceSheet.assets[i] += balance
                            balanceSheet.cash[i] += balance
                            balanceSheet.currentAssets[i] += balance
                        }
                        break;
                    }
                    case 6:{
                        if(balance < 0){
                            if(i == 0){
                                balanceSheet.startingLiabilities -= account.openingDebit - account.openingCredit
                                balanceSheet.startingExpenses -= account.openingDebit - account.openingCredit
                            }
                            balanceSheet.expenses[i] -= balance
                            balanceSheet.liabilities[i] -= balance
                            if(account.taxonomyCode[1] == 9){
                                balanceSheet.interest[i] -= balance
                                balanceSheet.currentLiabilities[i] -= balance
                            }
                        }
                        else{
                            if(i == 0){
                                balanceSheet.startingAssets += account.openingDebit - account.openingCredit
                            }
                            balanceSheet.assets[i] += balance
                        }
                        break;
                    }
                    case 7:{
                        if(balance < 0){
                            if(i == 0){
                                balanceSheet.startingLiabilities -= account.openingDebit - account.openingCredit
                            }
                            if(account.taxonomyCode[1] == 9){
                                balanceSheet.interest[i] -= balance
                            }
                            balanceSheet.liabilities[i] -= balance
                        }
                        else{
                            if(i == 0){
                                balanceSheet.startingAssets += account.openingDebit - account.openingCredit
                                balanceSheet.startingRevenue += account.openingDebit - account.openingCredit
                            }
                            if(account.taxonomyCode[1] == 1 || account.taxonomyCode[1] == 2){
                                balanceSheet.sales[i] += balance
                            }
                            balanceSheet.assets[i] += balance
                            balanceSheet.revenue[i] += balance
                        }
                        break;
                    }
                    default:{
                        if(balance < 0){
                            if(i == 0){
                                balanceSheet.startingLiabilities -= account.openingDebit - account.openingCredit
                            }
                            balanceSheet.liabilities[i] -= balance
                        }
                        else{
                            if(i == 0){
                                balanceSheet.startingAssets += account.openingDebit - account.openingCredit
                            }
                            balanceSheet.assets[i] += balance
                        }
                        break;
                    }
                }
            }
        }
        
        this.jsonDB.overview.sales = balanceSheet.sales
        this.jsonDB.overview.assets = balanceSheet.assets
        this.jsonDB.overview.expenses = balanceSheet.expenses
        this.jsonDB.overview.debt = balanceSheet.liabilities
        this.jsonDB.overview.totalAssets = balanceSheet.assets.reduce((accumulator, currentValue) => {return accumulator + currentValue;})
        this.jsonDB.overview.totalDebt = balanceSheet.liabilities.reduce((accumulator, currentValue) => {return accumulator + currentValue;})
        this.auxDB.financial.revenue = balanceSheet.revenue
        this.auxDB.financial.interest = balanceSheet.interest
        this.auxDB.financial.cash = balanceSheet.cash
        this.auxDB.financial.inventory = balanceSheet.inventory
        this.auxDB.financial.currentAssets = balanceSheet.currentAssets
        this.auxDB.financial.currentLiabilities = balanceSheet.currentLiabilities
        this.auxDB.financial.startingAssets = balanceSheet.startingAssets
        this.auxDB.financial.startingLiabilities = balanceSheet.startingLiabilities
        this.auxDB.financial.startingExpenses = balanceSheet.startingExpenses
        this.auxDB.financial.startingRevenue = balanceSheet.startingRevenue
    },
    
    calculateFinancialData: function(req, res, next){
        for(i = 0; i < 12; ++i){
            let sales = this.jsonDB.overview.sales[i]
            let assets = this.jsonDB.overview.assets[i]
            let expenses = this.jsonDB.overview.expenses[i]
            let liabilities = this.jsonDB.overview.debt[i]

            let revenue = this.auxDB.financial.revenue[i]
            let interest = this.auxDB.financial.interest[i]
            let cash = this.auxDB.financial.cash[i]
            let inventory = this.auxDB.financial.inventory[i]
            let currentAssets = this.auxDB.financial.currentAssets[i]
            let currentLiabilities = this.auxDB.financial.currentLiabilities[i]

            let startingRevenue = i == 0 ? this.auxDB.financial.startingRevenue : this.auxDB.financial.revenue[i - 1]
            let startingExpenses = i == 0 ? this.auxDB.financial.startingRevenue : this.jsonDB.overview.expenses[i - 1]
            let startingLiabilities = i == 0 ? this.auxDB.financial.startingLiabilities : this.jsonDB.overview.debt[i - 1]
            let startingAssets = i == 0 ? this.auxDB.financial.startingAssets : this.jsonDB.overview.assets[i - 1]

            //aux vars
            let ebit = revenue - expenses
            let netIncome = sales - expenses
            let equity = assets - liabilities
            let startingProfit = startingRevenue - startingExpenses
            let startingEquity = startingAssets - startingLiabilities

            this.jsonDB.financial.returnRatios.returnOnSales[i] = ebit / sales
            this.jsonDB.financial.returnRatios.returnOnAssets[i] = netIncome / assets
            this.jsonDB.financial.returnRatios.returnOnEquity[i] = netIncome / equity

            this.jsonDB.financial.stability.equityToAssets[i] = equity / assets
            this.jsonDB.financial.stability.debtToEquity[i] = liabilities / equity
            this.jsonDB.financial.stability.interestCoverage[i] = ebit / interest

            this.jsonDB.financial.liquidity.current[i] = currentAssets / currentLiabilities
            this.jsonDB.financial.liquidity.quick[i] = (currentAssets - inventory) / currentLiabilities
            this.jsonDB.financial.liquidity.cash[i] = cash / currentLiabilities

            this.jsonDB.financial.growth.profit = (ebit - startingProfit) / startingProfit
            this.jsonDB.financial.growth.debt = (liabilities - startingLiabilities) / startingLiabilities
            this.jsonDB.financial.growth.equity = (equity - startingEquity) / startingEquity
        }
    },

    parseSAFT: function(req, res, next){
        //sales, expenses, assets, debt (every month) - Overview
        this.jsonDB.overview = {sales:this.makeMonthlyArray(), expenses:this.makeMonthlyArray(), assets:this.makeMonthlyArray(), debt:this.makeMonthlyArray(), totalAssets: 0, totalDebt: 0}

        this.jsonDB.accounts = {accountsReceivable: {total: 0, percentage: 0, accounts: []},
                                accountsPayable: {total: 0, percentage: 0, accounts: []}}

        this.jsonDB.purchases = {purchases: [], debt: {}, cash: {}}

        this.jsonDB.financial = {returnRatios: {returnOnSales: this.makeMonthlyArray(), returnOnAssets: this.makeMonthlyArray(), returnOnEquity: this.makeMonthlyArray()},
                                stability: {equityToAssets: this.makeMonthlyArray(), debtToEquity: this.makeMonthlyArray(), coverageOnFixedInvestments: this.makeMonthlyArray(), interestCoverage: this.makeMonthlyArray()},
                                liquidity: {current: this.makeMonthlyArray(), quick: this.makeMonthlyArray(), cash: this.makeMonthlyArray()},
                                growth: {profit: this.makeMonthlyArray(), debt: this.makeMonthlyArray(), equity: this.makeMonthlyArray()}}

        this.auxDB.accountsReceivable = []
        this.auxDB.accountsPayable = []

        this.auxDB.accounts = {}
        this.auxDB.customers = {}
        this.auxDB.suppliers = {}
        this.auxDB.financial = {revenue: [], interest: []}

        //average profit, top sold products, monthly sales value for each product - Sales
        let masterFiles = req.MasterFiles[0]
        this.parseMasterFiles(masterFiles)    
        
        let ledgerEntries = req.GeneralLedgerEntries[0]
        this.parseGeneralLedgerEntries(ledgerEntries)
        
        if(req.SourceDocuments){
            let sourceDocuments = req.SourceDocuments[0]
            this.parseSourceDocuments(sourceDocuments)
        }

        this.createAccountsObject()

        this.createBalanceSheet()

        this.calculateFinancialData()

        return this.jsonDB
    }
}