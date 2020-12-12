const taxonomy = require("./taxonomy.js")

module.exports = {
  jsonDB: {},

  auxDB: {},

  parseMonth: (req, res, next) => {
    elements = req.split('-');
    return Number(elements[1]);
  },

  flattenArray: (req, res, next) =>
    req.map((x) => (Math.abs(x) < 0.01 ? 0 : x)),

  makeMonthlyArray: (req, res, next) => {
    let newArray = [];
    newArray.length = 12;
    newArray.fill(0);
    return newArray;
  },

  parseCustomers: (req, res, next) => {
    if (req) {
      req.forEach((customer) => {
        let customerID = customer.CustomerID[0];
        let accountID = customer.AccountID[0];
        let companyName = customer.CompanyName[0];

        module.exports.auxDB.customers[customerID] = {
          accountID: accountID,
          companyName: companyName,
        };
      });
    }
  },

  parseSuppliers: (req, res, next) => {
    if (req) {
      req.forEach((supplier) => {
        let supplierID = supplier.SupplierID[0];
        let accountID = supplier.AccountID[0];
        let companyName = supplier.CompanyName[0];

        module.exports.auxDB.suppliers[supplierID] = {
          accountID: accountID,
          companyName: companyName,
        };
      });
    }
  },

  parseProducts: (req, res, next) => {
    let products = req;

    module.exports.jsonDB.products = {};

    if (products)
      products.forEach((product) => {
        let code = product.ProductCode[0];
        module.exports.jsonDB.products[code] = {
          name: product.ProductDescription[0],
          unitsSold: 0,
          sales: module.exports.makeMonthlyArray(),
        };
      });
  },

  parseLedgerAccount: (req, res, next) => {
    let accountID = req.AccountID[0];
    let accountDescription = req.AccountDescription[0];
    let taxonomyCode = req.TaxonomyCode;
    if (Array.isArray(taxonomyCode)) {
      taxonomyCode = Number(taxonomyCode[0]);

      let openingDebit = Number(req.OpeningDebitBalance[0]);
      let openingCredit = Number(req.OpeningCreditBalance[0]);
      let closingDebit = Number(req.ClosingDebitBalance[0]);
      let closingCredit = Number(req.ClosingCreditBalance[0]);

      let account = {
        description: accountDescription,
        taxonomyCode: taxonomyCode,
        openingDebit: openingDebit,
        openingCredit: openingCredit,
        closingDebit: closingDebit,
        closingCredit: closingCredit,
        monthlyDebit: module.exports.makeMonthlyArray(),
        monthlyCredit: module.exports.makeMonthlyArray(),
      };

      account.monthlyDebit[11] = closingDebit;
      account.monthlyCredit[11] = closingCredit;

      account.monthlyDebit.fill(openingDebit, 0, 11);
      account.monthlyCredit.fill(openingCredit, 0, 11);

      module.exports.auxDB.accounts[accountID] = account;
    }
  },

  parseGeneralLedgerAccounts: (req, res, next) => {
    let ledgerAccounts = req[0].Account;
    ledgerAccounts.forEach((account) => {
      module.exports.parseLedgerAccount(account);
    });
  },

  parseMasterFiles: (req, res, next) => {
    let masterFiles = req;

    module.exports.parseCustomers(masterFiles.Customer);
    module.exports.parseSuppliers(masterFiles.Supplier);
    module.exports.parseProducts(masterFiles.Product);
    if(masterFiles.GeneralLedgerAccounts)
      module.exports.parseGeneralLedgerAccounts(masterFiles.GeneralLedgerAccounts);
  },

  parseTransaction: (req, res, next) => {
    let lines = req.Lines[0];

    let creditLines = lines.CreditLine;
    if (creditLines) {
      creditLines.forEach((credit) => {
        let accountID = credit.AccountID[0];
        let periodIndex = module.exports.parseMonth(credit.SystemEntryDate[0]) - 1;
        let value = Number(credit.CreditAmount[0]);

        //transaction.credit[periodIndex] += value
        let account = module.exports.auxDB.accounts[accountID];
        if (account) {
          for (i = periodIndex; i < 12; ++i) {
            module.exports.auxDB.accounts[accountID].monthlyCredit[i] += value;
          }
        }
      });
    }

    let debitLines = lines.DebitLine;
    if (debitLines)
      debitLines.forEach((debit) => {
        let accountID = debit.AccountID[0];
        let periodIndex = module.exports.parseMonth(debit.SystemEntryDate[0]) - 1;
        let value = Number(debit.DebitAmount[0]);

        //transaction.debit[periodIndex] += value
        let account = module.exports.auxDB.accounts[accountID];
        if (account) {
          for (i = periodIndex; i < 12; ++i) {
            module.exports.auxDB.accounts[accountID].monthlyDebit[i] += value;
          }
        }
      });
  },

  parseGeneralLedgerEntries: (req, res, next) => {
    let journals = req.Journal;
    journals.forEach((journal) => {
      let transactions = journal.Transaction;
      if (transactions) {
        transactions.forEach((transaction) => {
          module.exports.parseTransaction(transaction);
        });
      }
    });
  },

  parseSourceDocuments: (req, res, next) => {
    if (req.SalesInvoices) {
      let invoices = req.SalesInvoices[0].Invoice;

      if (invoices)
        invoices.forEach((invoice) => {
          let periodIndex = parseInt(invoice.Period[0]) - 1;

          let lines = invoice.Line;
          if (lines)
            lines.forEach((line) => {
              let productCode = line.ProductCode[0];
              let quantity = parseInt(line.Quantity[0]);
              let creditAmount = Number(line.CreditAmount[0]);

              module.exports.jsonDB.products[productCode].unitsSold += quantity;
              module.exports.jsonDB.products[productCode].sales[
                periodIndex
              ] += creditAmount;
            });
        });
    }

    if (req.WorkingDocuments) {
      let workDocuments = req.WorkingDocuments[0].WorkDocument;

      if (workDocuments)
        workDocuments.forEach((workDocument) => {
          let periodIndex = parseInt(workDocument.Period[0]) - 1;

          let lines = workDocument.Line;
          if (lines)
            lines.forEach((line) => {
              let productCode = line.ProductCode[0];
              let quantity = parseInt(line.Quantity[0]);
              let creditAmount = Number(line.CreditAmount[0]);

              module.exports.jsonDB.products[productCode].unitsSold += quantity;
              module.exports.jsonDB.products[productCode].sales[
                periodIndex
              ] += creditAmount;
            });
        });
    }
  },

  generateAuxValues: (req, res, next) => {
    let auxValues = {
      Inventory: [0].concat(module.exports.makeMonthlyArray()),
      CashEquivalents: [0].concat(module.exports.makeMonthlyArray()),
      AccountsReceivable: [0].concat(module.exports.makeMonthlyArray()),
      CurrentAssets: [0].concat(module.exports.makeMonthlyArray()),
      NonCurrentAssets: [0].concat(module.exports.makeMonthlyArray()),
      Equity: [0].concat(module.exports.makeMonthlyArray()),
      AccountsPayable: [0].concat(module.exports.makeMonthlyArray()),
      CurrentLiabilities: [0].concat(module.exports.makeMonthlyArray()),
      NonCurrentLiabilities: [0].concat(module.exports.makeMonthlyArray()),
      Taxes: [0].concat(module.exports.makeMonthlyArray()),
      Interest: [0].concat(module.exports.makeMonthlyArray()),
      Revenue: [0].concat(module.exports.makeMonthlyArray()),
      Expenses: [0].concat(module.exports.makeMonthlyArray())
    }

    for(accountID in module.exports.auxDB.accounts){
      let account = module.exports.auxDB.accounts[accountID]
      let balance = account.openingDebit - account.openingCredit
      
      for(let i = -1; i < 12; ++i){
        if(i >= 0){
          balance = account.monthlyDebit[i] - account.monthlyCredit[i]
        }

        let accountTypes = taxonomy.getAccountTypes(account.taxonomyCode, balance)
        if(Array.isArray(accountTypes)){
          accountTypes.forEach((operation) => {
            auxValues[operation.type][i + 1] += operation.value;

            switch(operation.type){
              case "Inventory":
              case "CashEquivalents":
              case "AccountsReceivable":{
                auxValues.CurrentAssets[i + 1] += operation.value;
              }
              case "AccountsPayable":{
                auxValues.CurrentLiabilities[i + 1] += operation.value;
              }
              default: break;
            }
          })
        }
      }
    }

    auxValues.Inventory = module.exports.flattenArray(auxValues.Inventory);
    auxValues.CashEquivalents = module.exports.flattenArray(auxValues.CashEquivalents);
    auxValues.AccountsReceivable = module.exports.flattenArray(auxValues.AccountsReceivable);
    auxValues.CurrentAssets = module.exports.flattenArray(auxValues.CurrentAssets);
    auxValues.NonCurrentAssets = module.exports.flattenArray(auxValues.NonCurrentAssets);
    auxValues.Equity = module.exports.flattenArray(auxValues.Equity);
    auxValues.AccountsPayable = module.exports.flattenArray(auxValues.AccountsPayable);
    auxValues.CurrentLiabilities = module.exports.flattenArray(auxValues.CurrentLiabilities);
    auxValues.NonCurrentLiabilities = module.exports.flattenArray(auxValues.NonCurrentLiabilities);
    auxValues.Taxes = module.exports.flattenArray(auxValues.Taxes);
    auxValues.Interest = module.exports.flattenArray(auxValues.Interest);
    auxValues.Revenue = module.exports.flattenArray(auxValues.Revenue);
    auxValues.Expenses = module.exports.flattenArray(auxValues.Expenses);

    return auxValues;
  },

  calculateFinancialData: (req, res, next) => {
    for (i = 1; i <= 12; ++i) {
      let revenue = module.exports.auxDB.auxValues.Revenue[i];

      let currentAssets = module.exports.auxDB.auxValues.CurrentAssets[i];
      let totalAssets = currentAssets + module.exports.auxDB.auxValues.NonCurrentAssets[i];

      let expenses = module.exports.auxDB.auxValues.Expenses[i];

      let currentLiabilities = module.exports.auxDB.auxValues.CurrentLiabilities[i];
      let totalLiabilities = currentLiabilities + module.exports.auxDB.auxValues.NonCurrentLiabilities[i];
      
      let equity = module.exports.auxDB.auxValues.Equity[i];

      let interest = module.exports.auxDB.auxValues.Interest[i];

      let taxes = module.exports.auxDB.auxValues.Taxes[i];

      let cash = module.exports.auxDB.auxValues.CashEquivalents[i];

      let inventory = module.exports.auxDB.auxValues.Inventory[i];

      let startingRevenue = module.exports.auxDB.auxValues.Revenue[i - 1];

      let startingExpenses = module.exports.auxDB.auxValues.Expenses[i - 1];
      
      let startingLiabilities = module.exports.auxDB.auxValues.CurrentLiabilities[i - 1] +  module.exports.auxDB.auxValues.NonCurrentLiabilities[i - 1];

      let startingEquity = module.exports.auxDB.auxValues.Equity[i - 1];

      //aux vars
      let ebit = revenue - expenses;
      let netIncome = ebit - interest - taxes;
      let startingProfit = startingRevenue - startingExpenses;

      module.exports.jsonDB.returnRatios.returnOnSales[i - 1] = revenue != 0 ? ebit / revenue : 0;
      module.exports.jsonDB.returnRatios.returnOnAssets[i - 1] = totalAssets != 0 ? netIncome / totalAssets : 0;
      module.exports.jsonDB.returnRatios.returnOnEquity[i - 1] = equity != 0 ? netIncome / equity : 0;

      module.exports.jsonDB.stability.equityToAssets[i - 1] = totalAssets != 0 ? equity / totalAssets : 0;
      module.exports.jsonDB.stability.debtToEquity[i - 1] = equity != 0 ? totalLiabilities / equity : 0;
      module.exports.jsonDB.stability.interestCoverage[i - 1] = interest != 0 ? ebit / interest : 0;

      module.exports.jsonDB.liquidity.current[i - 1] = currentLiabilities != 0 ? currentAssets / currentLiabilities : 0;
      module.exports.jsonDB.liquidity.quick[i - 1] = currentLiabilities != 0 ? (currentAssets - inventory) / currentLiabilities : 0;
      module.exports.jsonDB.liquidity.cash[i - 1] = currentLiabilities != 0 ? cash / currentLiabilities : 0;

      module.exports.jsonDB.growth.profit[i - 1] = startingProfit != 0 ? (ebit - startingProfit) / startingProfit : 0;
      module.exports.jsonDB.growth.debt[i - 1] = startingLiabilities != 0 ? (totalLiabilities - startingLiabilities) / startingLiabilities : 0;
      module.exports.jsonDB.growth.equity[i - 1] = startingEquity != 0 ? (equity - startingEquity) / startingEquity : 0;
    }
  },

  setJSONDBvalues: (req, res, next) => {
    //Overview
    module.exports.jsonDB.sales = module.exports.auxDB.auxValues.Revenue.slice(1);
    module.exports.jsonDB.expenses = module.exports.auxDB.auxValues.Expenses.slice(1);

    let netProfit = 0
    
    for(let i = 0; i < 12; ++i){
      module.exports.jsonDB.assets[i] = module.exports.auxDB.auxValues.CurrentAssets[i + 1] + module.exports.auxDB.auxValues.NonCurrentAssets[i + 1]; 
      module.exports.jsonDB.debt[i] = module.exports.auxDB.auxValues.CurrentLiabilities[i + 1] + module.exports.auxDB.auxValues.NonCurrentLiabilities[i + 1]; 

      module.exports.jsonDB.totalAssets.value += module.exports.jsonDB.assets[i];
      module.exports.jsonDB.totalDebt.value += module.exports.jsonDB.debt[i];

      //Accounts
      let receivableTotal = module.exports.auxDB.auxValues.AccountsReceivable[i + 1];
      let payableTotal = module.exports.auxDB.auxValues.AccountsPayable[i + 1];
      let startingReceivableTotal = module.exports.auxDB.auxValues.AccountsReceivable[i];
      let startingPayableTotal = module.exports.auxDB.auxValues.AccountsPayable[i];

      module.exports.jsonDB.accountsReceivable.total += receivableTotal;
      module.exports.jsonDB.accountsPayable.total += payableTotal;

      module.exports.jsonDB.accountsReceivable.percentage += startingReceivableTotal != 0 ? (receivableTotal - startingReceivableTotal) / startingReceivableTotal : 0;
      module.exports.jsonDB.accountsPayable.percentage += startingPayableTotal != 0 ? (payableTotal - startingPayableTotal) / startingPayableTotal : 0;


      let sales = module.exports.jsonDB.sales[i]
      let expenses = module.exports.jsonDB.expenses[i]
      let taxes = module.exports.auxDB.auxValues.Taxes[i + 1]
      let interest = module.exports.auxDB.auxValues.Taxes[i + 1]

      netProfit = netProfit + sales - expenses - taxes - interest
    }

    module.exports.jsonDB.salesProfit.value = netProfit
  },

  parseSAFTAccounting: (req, res, next) => {
    //sales, expenses, assets, debt (every month) - Overview
    module.exports.jsonDB.sales = module.exports.makeMonthlyArray()
    module.exports.jsonDB.expenses = module.exports.makeMonthlyArray()
    module.exports.jsonDB.assets = module.exports.makeMonthlyArray()
    module.exports.jsonDB.debt = module.exports.makeMonthlyArray()
    module.exports.jsonDB.totalAssets = {value: 0}
    module.exports.jsonDB.totalDebt = {value: 0}

    module.exports.jsonDB.salesProfit = {value: 0};

    module.exports.jsonDB.accountsReceivable = { total: 0, percentage: 0, accounts: [] }
    module.exports.jsonDB.accountsPayable = { total: 0, percentage: 0, accounts: [] }

    module.exports.jsonDB.purchases = []
    module.exports.jsonDB.purchasesDebt = {}
    module.exports.jsonDB.purchasesCash = {}

    module.exports.jsonDB.returnRatios = {
        returnOnSales: module.exports.makeMonthlyArray(),
        returnOnAssets: module.exports.makeMonthlyArray(),
        returnOnEquity: module.exports.makeMonthlyArray(),
    }
      
    module.exports.jsonDB.stability = {
        equityToAssets: module.exports.makeMonthlyArray(),
        debtToEquity: module.exports.makeMonthlyArray(),
        coverageOnFixedInvestments: module.exports.makeMonthlyArray(),
        interestCoverage: module.exports.makeMonthlyArray(),
    }

    module.exports.jsonDB.liquidity = {
        current: module.exports.makeMonthlyArray(),
        quick: module.exports.makeMonthlyArray(),
        cash: module.exports.makeMonthlyArray(),
    }
      
    module.exports.jsonDB.growth = {
        profit: module.exports.makeMonthlyArray(),
        debt: module.exports.makeMonthlyArray(),
        equity: module.exports.makeMonthlyArray(),
    }
    

    module.exports.auxDB.accounts = {};
    module.exports.auxDB.customers = {};
    module.exports.auxDB.suppliers = {};

    //average profit, top sold products, monthly sales value for each product - Sales
    let masterFiles = req.MasterFiles[0];
    module.exports.parseMasterFiles(masterFiles);

    let ledgerEntries = req.GeneralLedgerEntries[0];
    module.exports.parseGeneralLedgerEntries(ledgerEntries);

    module.exports.auxDB.auxValues = module.exports.generateAuxValues();

    module.exports.calculateFinancialData();

    module.exports.setJSONDBvalues();
  },

  parseSAFTInvoice: (req, res, next) => {
    let masterFiles = req.MasterFiles[0];
    module.exports.parseMasterFiles(masterFiles);

    let sourceDocuments = req.SourceDocuments[0];
    module.exports.parseSourceDocuments(sourceDocuments);
  }
};
