module.exports = {
  jsonDB: {},

  auxDB: {},

  parseMonth: (req, res, next) => {
    elements = req.split("-");
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
      taxonomyCode = taxonomyCode[0].split("");
      taxonomyCode = taxonomyCode.map(Number);

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
    //console.log(ledgerAccounts)
    ledgerAccounts.forEach((account) => {
      module.exports.parseLedgerAccount(account);
    });
  },

  parseMasterFiles: (req, res, next) => {
    let masterFiles = req;

    module.exports.parseCustomers(masterFiles.Customer);
    module.exports.parseSuppliers(masterFiles.Supplier);
    module.exports.parseProducts(masterFiles.Product);
    module.exports.parseGeneralLedgerAccounts(masterFiles.GeneralLedgerAccounts);
  },

  parseTransaction: (req, res, next) => {
    let lines = req.Lines[0];
    /*
        let transaction = {credit: [], debit: []}
        transaction.credit.length = 12
        transaction.debit.length = 12
        transaction.credit.fill(0)
        transaction.debit.fill(0)
        */

    let supplier = req.SupplierID;
    let customer = req.CustomerID;

    let transaction = {
      monthlyBalance: module.exports.makeMonthlyArray(),
      date: req.TransactionDate[0],
      value: 0,
    };

    let creditLines = lines.CreditLine;
    if (creditLines) {
      creditLines.forEach((credit) => {
        //console.log(credit)
        let accountID = credit.AccountID[0];
        let periodIndex = module.exports.parseMonth(credit.SystemEntryDate[0]) - 1;
        let value = Number(credit.CreditAmount[0]);

        //transaction.credit[periodIndex] += value
        let account = module.exports.auxDB.accounts[accountID];
        for (i = periodIndex; i < 12; ++i) {
          if (account) {
            module.exports.auxDB.accounts[accountID].monthlyCredit[i] += value;
          }
          transaction.monthlyBalance[i] -= value;
        }
      });

      if (transaction.value == 0)
        transaction.value = -transaction.monthlyBalance[11];
    }

    let debitLines = lines.DebitLine;
    if (debitLines)
      debitLines.forEach((debit) => {
        //console.log(debit)
        let accountID = debit.AccountID[0];
        let periodIndex = module.exports.parseMonth(debit.SystemEntryDate[0]) - 1;
        let value = Number(debit.DebitAmount[0]);

        //transaction.debit[periodIndex] += value
        let account = module.exports.auxDB.accounts[accountID];
        for (i = periodIndex; i < 12; ++i) {
          if (account) {
            module.exports.auxDB.accounts[accountID].monthlyDebit[i] += value;
          }
          transaction.monthlyBalance[i] += value;
        }
      });

    transaction.monthlyBalance = transaction.monthlyBalance.map((x) => -x);
    transaction.monthlyBalance = module.exports.flattenArray(transaction.monthlyBalance);

    if (customer) {
      customerObject = module.exports.auxDB.customers[customer[0]];
      if (customerObject) {
        transaction.account = customerObject.accountID;
        module.exports.auxDB.accountsReceivable.push(transaction);
      }
    } else if (supplier) {
      supplierObject = module.exports.auxDB.suppliers[supplier[0]];
      if (supplierObject) {
        transaction.account = supplierObject.accountID;
        module.exports.auxDB.accountsPayable.push(transaction);

        if (transaction.monthlyBalance[11] == 0) {
          module.exports.jsonDB.purchases.purchases.push({
            supplier: supplierObject.companyName,
            value: transaction.value,
          });
        } else {
          if (module.exports.jsonDB.purchases.debt[supplierObject.accountID])
            module.exports.jsonDB.purchases.debt[supplierObject.accountID] +=
              transaction.value;
          else
            module.exports.jsonDB.purchases.debt[supplierObject.accountID] = {
              supplier: supplierObject.companyName,
              value: transaction.value,
            };
        }
      }
    }
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
          //module.exports.jsonDB.overview.sales[periodIndex] += Number(invoice.DocumentTotals[0].NetTotal[0])

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
          //module.exports.jsonDB.overview.sales[periodIndex] += Number(workDocument.DocumentTotals[0].NetTotal[0])

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

  createAccountsObject: (req, res, next) => {
    let previousAccRec = 0;
    module.exports.auxDB.accountsReceivable.forEach((transaction) => {
      if (transaction.monthlyBalance[10] != 0) {
        previousAccRec += transaction.monthlyBalance[10];
      }
      let currentBalance = transaction.monthlyBalance[11];
      if (currentBalance != 0) {
        module.exports.jsonDB.accounts.accountsReceivable.total += currentBalance;
        module.exports.jsonDB.accounts.accountsReceivable.accounts.push({
          account: transaction.account,
          date: transaction.date,
          value: currentBalance,
        });
      }
    });
    if (previousAccRec == 0) {
      module.exports.jsonDB.accounts.accountsReceivable.percentage = "-";
    } else
      module.exports.jsonDB.accounts.accountsReceivable.percentage =
        (module.exports.jsonDB.accounts.accountsReceivable.total - previousAccRec) /
        previousAccRec;

    let previousAccPay = 0;

    module.exports.auxDB.accountsPayable.forEach((transaction) => {
      if (transaction.monthlyBalance[10] != 0) {
        previousAccPay += transaction.monthlyBalance[10];
      }
      let currentBalance = transaction.monthlyBalance[11];
      if (currentBalance != 0) {
        module.exports.jsonDB.accounts.accountsPayable.total += currentBalance;
        module.exports.jsonDB.accounts.accountsPayable.accounts.push({
          account: transaction.account,
          date: transaction.date,
          value: currentBalance,
        });
      }
    });
    if (previousAccPay == 0) {
      module.exports.jsonDB.accounts.accountsPayable.percentage = "-";
    } else
      module.exports.jsonDB.accounts.accountsPayable.percentage =
        (module.exports.jsonDB.accounts.accountsPayable.total - previousAccPay) /
        previousAccPay;
  },

  createBalanceSheet: (req, res, next) => {
    let balanceSheet = {
      assets: module.exports.makeMonthlyArray(),
      liabilities: module.exports.makeMonthlyArray(),
      sales: module.exports.makeMonthlyArray(),
      expenses: module.exports.makeMonthlyArray(),
      revenue: module.exports.makeMonthlyArray(),
      interest: module.exports.makeMonthlyArray(),
      cash: module.exports.makeMonthlyArray(),
      currentAssets: module.exports.makeMonthlyArray(),
      currentLiabilities: module.exports.makeMonthlyArray(),
      inventory: module.exports.makeMonthlyArray(),
      startingRevenue: 0,
      startingExpenses: 0,
      startingLiabilities: 0,
      startingAssets: 0,
    };

    for (accountID in module.exports.auxDB.accounts) {
      let account = module.exports.auxDB.accounts[accountID];
      for (i = 0; i < 12; ++i) {
        let balance = account.monthlyDebit[i] - account.monthlyCredit[i];

        switch (account.taxonomyCode[0]) {
          case 1: {
            if (balance < 0) {
              if (i == 0) {
                balanceSheet.startingLiabilities -=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.liabilities[i] -= balance;
            } else {
              if (i == 0) {
                balanceSheet.startingAssets +=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.assets[i] += balance;
              balanceSheet.inventory[i] += balance;
              balanceSheet.currentAssets[i] += balance;
            }
            break;
          }
          case 2: {
            if (balance < 0) {
              if (
                (account.taxonomyCode[1] == 2 &&
                  account.taxonomyCode[2] == 2) ||
                (account.taxonomyCode[1] == 1 &&
                  account.taxonomyCode[2] == 8) ||
                (account.taxonomyCode[1] == 7 &&
                  account.taxonomyCode[2] == 4) ||
                account.taxonomyCode[1] == 4
              ) {
                balanceSheet.currentLiabilities[i] -= balance;
              }
              if (i == 0) {
                balanceSheet.startingLiabilities -=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.liabilities[i] -= balance;
            } else {
              if (i == 0) {
                balanceSheet.startingAssets +=
                  account.openingDebit - account.openingCredit;
              }
              if (
                (account.taxonomyCode[1] == 1 &&
                  account.taxonomyCode[2] == 2) ||
                (account.taxonomyCode[1] == 2 && account.taxonomyCode[2] == 8)
              ) {
                balanceSheet.currentAssets[i] += balance;
              }
              balanceSheet.assets[i] += balance;
            }
            break;
          }
          case 3:
          case 5: {
            if (balance < 0) {
              if (i == 0) {
                balanceSheet.startingLiabilities -=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.liabilities[i] -= balance;
            } else {
              if (i == 0) {
                balanceSheet.startingAssets +=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.assets[i] += balance;
              balanceSheet.cash[i] += balance;
              balanceSheet.currentAssets[i] += balance;
            }
            break;
          }
          case 6: {
            if (balance < 0) {
              if (i == 0) {
                balanceSheet.startingLiabilities -=
                  account.openingDebit - account.openingCredit;
                balanceSheet.startingExpenses -=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.expenses[i] -= balance;
              balanceSheet.liabilities[i] -= balance;
              if (account.taxonomyCode[1] == 9) {
                balanceSheet.interest[i] -= balance;
                balanceSheet.currentLiabilities[i] -= balance;
              }
            } else {
              if (i == 0) {
                balanceSheet.startingAssets +=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.assets[i] += balance;
            }
            break;
          }
          case 7: {
            if (balance < 0) {
              if (i == 0) {
                balanceSheet.startingLiabilities -=
                  account.openingDebit - account.openingCredit;
              }
              if (account.taxonomyCode[1] == 9) {
                balanceSheet.interest[i] -= balance;
              }
              balanceSheet.liabilities[i] -= balance;
            } else {
              if (i == 0) {
                balanceSheet.startingAssets +=
                  account.openingDebit - account.openingCredit;
                balanceSheet.startingRevenue +=
                  account.openingDebit - account.openingCredit;
              }
              if (
                account.taxonomyCode[1] == 1 ||
                account.taxonomyCode[1] == 2
              ) {
                balanceSheet.sales[i] += balance;
              }
              balanceSheet.assets[i] += balance;
              balanceSheet.revenue[i] += balance;
            }
            break;
          }
          default: {
            if (balance < 0) {
              if (i == 0) {
                balanceSheet.startingLiabilities -=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.liabilities[i] -= balance;
            } else {
              if (i == 0) {
                balanceSheet.startingAssets +=
                  account.openingDebit - account.openingCredit;
              }
              balanceSheet.assets[i] += balance;
            }
            break;
          }
        }
      }
    }

    module.exports.jsonDB.overview.sales = balanceSheet.sales;
    module.exports.jsonDB.overview.assets = balanceSheet.assets;
    module.exports.jsonDB.overview.expenses = balanceSheet.expenses;
    module.exports.jsonDB.overview.debt = balanceSheet.liabilities;
    module.exports.jsonDB.overview.totalAssets = balanceSheet.assets.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    module.exports.jsonDB.overview.totalDebt = balanceSheet.liabilities.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );
    module.exports.auxDB.financial.revenue = balanceSheet.revenue;
    module.exports.auxDB.financial.interest = balanceSheet.interest;
    module.exports.auxDB.financial.cash = balanceSheet.cash;
    module.exports.auxDB.financial.inventory = balanceSheet.inventory;
    module.exports.auxDB.financial.currentAssets = balanceSheet.currentAssets;
    module.exports.auxDB.financial.currentLiabilities = balanceSheet.currentLiabilities;
    module.exports.auxDB.financial.startingAssets = balanceSheet.startingAssets;
    module.exports.auxDB.financial.startingLiabilities = balanceSheet.startingLiabilities;
    module.exports.auxDB.financial.startingExpenses = balanceSheet.startingExpenses;
    module.exports.auxDB.financial.startingRevenue = balanceSheet.startingRevenue;
  },

  calculateFinancialData: (req, res, next) => {
    for (i = 0; i < 12; ++i) {
      let sales = module.exports.jsonDB.overview.sales[i];
      let assets = module.exports.jsonDB.overview.assets[i];
      let expenses = module.exports.jsonDB.overview.expenses[i];
      let liabilities = module.exports.jsonDB.overview.debt[i];

      let revenue = module.exports.auxDB.financial.revenue[i];
      let interest = module.exports.auxDB.financial.interest[i];
      let cash = module.exports.auxDB.financial.cash[i];
      let inventory = module.exports.auxDB.financial.inventory[i];
      let currentAssets = module.exports.auxDB.financial.currentAssets[i];
      let currentLiabilities = module.exports.auxDB.financial.currentLiabilities[i];

      let startingRevenue =
        i == 0
          ? module.exports.auxDB.financial.startingRevenue
          : module.exports.auxDB.financial.revenue[i - 1];
      let startingExpenses =
        i == 0
          ? module.exports.auxDB.financial.startingRevenue
          : module.exports.jsonDB.overview.expenses[i - 1];
      let startingLiabilities =
        i == 0
          ? module.exports.auxDB.financial.startingLiabilities
          : module.exports.jsonDB.overview.debt[i - 1];
      let startingAssets =
        i == 0
          ? module.exports.auxDB.financial.startingAssets
          : module.exports.jsonDB.overview.assets[i - 1];

      //aux vars
      let ebit = revenue - expenses;
      let netIncome = sales - expenses;
      let equity = assets - liabilities;
      let startingProfit = startingRevenue - startingExpenses;
      let startingEquity = startingAssets - startingLiabilities;

      module.exports.jsonDB.financial.returnRatios.returnOnSales[i] = ebit / sales;
      module.exports.jsonDB.financial.returnRatios.returnOnAssets[i] = netIncome / assets;
      module.exports.jsonDB.financial.returnRatios.returnOnEquity[i] = netIncome / equity;

      module.exports.jsonDB.financial.stability.equityToAssets[i] = equity / assets;
      module.exports.jsonDB.financial.stability.debtToEquity[i] = liabilities / equity;
      module.exports.jsonDB.financial.stability.interestCoverage[i] = ebit / interest;

      module.exports.jsonDB.financial.liquidity.current[i] =
        currentAssets / currentLiabilities;
      module.exports.jsonDB.financial.liquidity.quick[i] =
        (currentAssets - inventory) / currentLiabilities;
      module.exports.jsonDB.financial.liquidity.cash[i] = cash / currentLiabilities;

      module.exports.jsonDB.financial.growth.profit =
        (ebit - startingProfit) / startingProfit;
      module.exports.jsonDB.financial.growth.debt =
        (liabilities - startingLiabilities) / startingLiabilities;
      module.exports.jsonDB.financial.growth.equity =
        (equity - startingEquity) / startingEquity;
    }
  },

  calculateSalesProfit: (req, res, next) => {
    let netProfit = 0
    for(i = 0; i < 12; ++i){
      let sales = module.exports.jsonDB.overview.sales[i]
      let expenses = module.exports.jsonDB.overview.expenses[i]

      netProfit = netProfit + sales - expenses
    }

    module.exports.jsonDB.salesProfit = {value: netProfit};
  },

  parseSAFT: (req, res, next) => {
    //sales, expenses, assets, debt (every month) - Overview
    module.exports.jsonDB.overview = {
      sales: module.exports.makeMonthlyArray(),
      expenses: module.exports.makeMonthlyArray(),
      assets: module.exports.makeMonthlyArray(),
      debt: module.exports.makeMonthlyArray(),
      totalAssets: 0,
      totalDebt: 0,
    };

    module.exports.jsonDB.salesProfit = 0;

    module.exports.jsonDB.accounts = {
      accountsReceivable: { total: 0, percentage: 0, accounts: [] },
      accountsPayable: { total: 0, percentage: 0, accounts: [] },
    };

    module.exports.jsonDB.purchases = { purchases: [], debt: {}, cash: {} };

    module.exports.jsonDB.financial = {
      returnRatios: {
        returnOnSales: module.exports.makeMonthlyArray(),
        returnOnAssets: module.exports.makeMonthlyArray(),
        returnOnEquity: module.exports.makeMonthlyArray(),
      },
      stability: {
        equityToAssets: module.exports.makeMonthlyArray(),
        debtToEquity: module.exports.makeMonthlyArray(),
        coverageOnFixedInvestments: module.exports.makeMonthlyArray(),
        interestCoverage: module.exports.makeMonthlyArray(),
      },
      liquidity: {
        current: module.exports.makeMonthlyArray(),
        quick: module.exports.makeMonthlyArray(),
        cash: module.exports.makeMonthlyArray(),
      },
      growth: {
        profit: module.exports.makeMonthlyArray(),
        debt: module.exports.makeMonthlyArray(),
        equity: module.exports.makeMonthlyArray(),
      },
    };

    module.exports.auxDB.accountsReceivable = [];
    module.exports.auxDB.accountsPayable = [];

    module.exports.auxDB.accounts = {};
    module.exports.auxDB.customers = {};
    module.exports.auxDB.suppliers = {};
    module.exports.auxDB.financial = { revenue: [], interest: [] };

    //average profit, top sold products, monthly sales value for each product - Sales
    let masterFiles = req.MasterFiles[0];
    module.exports.parseMasterFiles(masterFiles);

    let ledgerEntries = req.GeneralLedgerEntries[0];
    module.exports.parseGeneralLedgerEntries(ledgerEntries);

    if (req.SourceDocuments) {
      let sourceDocuments = req.SourceDocuments[0];
      module.exports.parseSourceDocuments(sourceDocuments);
    }

    module.exports.createAccountsObject();

    module.exports.createBalanceSheet();

    module.exports.calculateFinancialData();

    module.exports.calculateSalesProfit();

    return module.exports.jsonDB;
  },
};
