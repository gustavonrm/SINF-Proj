const taxonomy = require('./taxonomy.js')

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
    module.exports.jsonDB.products = [];
    if (products)
      products.forEach((product) => {
        // TODO: see if this works xd
        module.exports.jsonDB.products.push({
          key: product.ProductCode[0],
          name: product.ProductDescription[0],
          unitsSold: 0,
          sales: module.exports.makeMonthlyArray(),
        });
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
              const product =  module.exports.jsonDB.products.find((obj) => (obj.key === productCode));
              if(product === undefined) return;

              product.unitsSold += quantity;
              product.sales[periodIndex] += creditAmount;
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
              const product =  module.exports.jsonDB.products.find((obj) => (obj.key === productCode));
              if(product === undefined) return;

              product.unitsSold += quantity;
              product.sales[periodIndex] += creditAmount;
            });
        });
    }
  },

  generateAuxValues: (req, res, next) => {
    let auxValues = {
      Inventory: [0,0].concat(module.exports.makeMonthlyArray()),
      CashEquivalents: [0,0].concat(module.exports.makeMonthlyArray()),
      AccountsReceivable: [0,0].concat(module.exports.makeMonthlyArray()),
      CurrentAssets: [0,0].concat(module.exports.makeMonthlyArray()),
      NonCurrentAssets: [0,0].concat(module.exports.makeMonthlyArray()),
      Equity: [0,0].concat(module.exports.makeMonthlyArray()),
      AccountsPayable: [0,0].concat(module.exports.makeMonthlyArray()),
      CurrentLiabilities: [0,0].concat(module.exports.makeMonthlyArray()),
      NonCurrentLiabilities: [0,0].concat(module.exports.makeMonthlyArray()),
      Taxes: [0,0].concat(module.exports.makeMonthlyArray()),
      Interest: [0,0].concat(module.exports.makeMonthlyArray()),
      Revenue: [0,0].concat(module.exports.makeMonthlyArray()),
      Expenses: [0,0].concat(module.exports.makeMonthlyArray()),  
      AtivosBiologicosCorrentes: [0,0].concat(module.exports.makeMonthlyArray()),  
      Clientes: [0,0].concat(module.exports.makeMonthlyArray()),  
      EstadoEOutrosEntesAtivos: [0,0].concat(module.exports.makeMonthlyArray()), 
      CapitalSubscritoNaoRealizado:  [0,0].concat(module.exports.makeMonthlyArray()), 
      DiferimentosAtivos:  [0,0].concat(module.exports.makeMonthlyArray()),  
      AtivosFinanceirosDetidos: [0,0].concat(module.exports.makeMonthlyArray()),  
      OutrosAtivos: [0,0].concat(module.exports.makeMonthlyArray()),  
      AtivosNaoCorrentesDetidos:  [0,0].concat(module.exports.makeMonthlyArray()),  
      CaixaEDepositos: [0,0].concat(module.exports.makeMonthlyArray()),  
      AtivosFixosTangiveis: [0,0].concat(module.exports.makeMonthlyArray()),  
      PropriedadesDeInvestimento: [0,0].concat(module.exports.makeMonthlyArray()),  
      Goodwill: [0,0].concat(module.exports.makeMonthlyArray()),  
      AtivosIntangiveis: [0,0].concat(module.exports.makeMonthlyArray()),  
      AtivosBiologicosNaoCorrentes:  [0,0].concat(module.exports.makeMonthlyArray()),  
      ParticipacoesFinanceiras: [0,0].concat(module.exports.makeMonthlyArray()),  
      OutrosInvestimentos:    [0,0].concat(module.exports.makeMonthlyArray()),  
      CreditosAReceber:    [0,0].concat(module.exports.makeMonthlyArray()),  
      AtivosPorImpostosDiferidos:     [0,0].concat(module.exports.makeMonthlyArray()),  
      CapitalSubscrito:       [0,0].concat(module.exports.makeMonthlyArray()),  
      AcoesProprias:        [0,0].concat(module.exports.makeMonthlyArray()),  
      OutrosInstrumentosDeCapital:  [0,0].concat(module.exports.makeMonthlyArray()),  
      PremiosDeEmissao:       [0,0].concat(module.exports.makeMonthlyArray()),  
      ReservasLegais: [0,0].concat(module.exports.makeMonthlyArray()),  
      OutrasReservas: [0,0].concat(module.exports.makeMonthlyArray()),  
      ResultadosTransitados:  [0,0].concat(module.exports.makeMonthlyArray()),  
      ExcedentesDeRevalorizacao:  [0,0].concat(module.exports.makeMonthlyArray()),  
      Ajustamentos:  [0,0].concat(module.exports.makeMonthlyArray()),  
      ResultadoLiquidoDoPeriodo:  [0,0].concat(module.exports.makeMonthlyArray()),  
      DividendosAntecipados:     [0,0].concat(module.exports.makeMonthlyArray()),  
      Fornecedores:       [0,0].concat(module.exports.makeMonthlyArray()),  
      AdiantamentosDeClientes:  [0,0].concat(module.exports.makeMonthlyArray()),  
      EstadoEOutrosEntesPassivos: [0,0].concat(module.exports.makeMonthlyArray()),  
      FinanciamentosObtidosAtivos:  [0,0].concat(module.exports.makeMonthlyArray()),  
      OutrasDividas: [0,0].concat(module.exports.makeMonthlyArray()),  
      DiferimentosPassivos: [0,0].concat(module.exports.makeMonthlyArray()),  
      PassivosFinanceirosDetidos:  [0,0].concat(module.exports.makeMonthlyArray()),  
      OutrosPassivosFinanceiros:  [0,0].concat(module.exports.makeMonthlyArray()),  
      PassivosNaoCorrentesDetidos: [0,0].concat(module.exports.makeMonthlyArray()),  
      Provisoes:  [0,0].concat(module.exports.makeMonthlyArray()),  
      FinanciamentosObtidosPassivos:  [0,0].concat(module.exports.makeMonthlyArray()),  
      Responsabilidades:  [0,0].concat(module.exports.makeMonthlyArray()),  
      PassivosPorImpostosDiferidos:  [0,0].concat(module.exports.makeMonthlyArray()),  
      OutrasDividasNaoCorrentes:  [0,0].concat(module.exports.makeMonthlyArray())
    }

    for(accountID in module.exports.auxDB.accounts){
      let account = module.exports.auxDB.accounts[accountID]
      let balance = account.openingDebit - account.openingCredit
      
      for(let i = -1; i < 12; ++i){
        if(i >= 0){
          balance = account.monthlyDebit[i] - account.monthlyCredit[i]
          if(i == 11){
            balance = account.closingDebit - account.closingCredit;
          }
        }

        let accountTypes = taxonomy.getAccountTypes(account.taxonomyCode, balance)
        if(Array.isArray(accountTypes)){
          accountTypes.forEach((operation) => {
            auxValues[operation.type][i + 1] += operation.value;

            switch(operation.type){
              case 'Inventory':
              case 'CashEquivalents':
              case 'AccountsReceivable':{
                auxValues.CurrentAssets[i + 1] += operation.value;
              }
              case 'AccountsPayable':{
                auxValues.CurrentLiabilities[i + 1] += operation.value;
              }
              default: break;
            }
          })
        }
      }
    }

    for(let auxType in auxValues){
      auxValues[auxType] = module.exports.flattenArray(auxValues[auxType]);
    }

    return auxValues;
  },

  generateBalanceSheet: (req, res, next) => {
    let sheet = {
      "Ativos":{
        "Ativo Não Corrente":{
          "Ativos fixos tangíveis":  module.exports.auxDB.auxValues.AtivosFixosTangiveis[12],
          "Propriedades de Investimento":  module.exports.auxDB.auxValues.PropriedadesDeInvestimento[12],
          "Goodwill":  module.exports.auxDB.auxValues.Goodwill[12],
          "Ativos intangíveis":  module.exports.auxDB.auxValues.AtivosIntangiveis[12],
          "Ativos Biológicos":  module.exports.auxDB.auxValues.AtivosBiologicosNaoCorrentes[12],
          "Participações Financeiras":  module.exports.auxDB.auxValues.ParticipacoesFinanceiras[12],
          "Outros Investimentos Financeiros":  module.exports.auxDB.auxValues.OutrosInvestimentos[12],
          "Créditos a Receber":  module.exports.auxDB.auxValues.CreditosAReceber[12],
          "Ativos por Impostos Diferidos":  module.exports.auxDB.auxValues.AtivosPorImpostosDiferidos[12]
        },
        "Ativo Corrente":{
          "Inventários":  module.exports.auxDB.auxValues.Inventory[12],
          "Ativos Biológicos":  module.exports.auxDB.auxValues.AtivosBiologicosCorrentes[12],
          "Clientes":  module.exports.auxDB.auxValues.Clientes[12],
          "Estado e Outros Entes Públicos":  module.exports.auxDB.auxValues.EstadoEOutrosEntesAtivos[12],
          "Capital Subscrito e Não Realizado":  module.exports.auxDB.auxValues.CapitalSubscritoNaoRealizado[12],
          "Outros Créditos a Receber":  module.exports.auxDB.auxValues.AccountsReceivable[12],
          "Diferimentos":  module.exports.auxDB.auxValues.DiferimentosAtivos[12],
          "Ativos Financeiros Detidos para Negociação":  module.exports.auxDB.auxValues.AtivosFinanceirosDetidos[12],
          "Outros Ativos Financeiros":  module.exports.auxDB.auxValues.OutrosAtivos[12],
          "Ativos Não Correntes Detidos para Venda":  module.exports.auxDB.auxValues.AtivosNaoCorrentesDetidos[12],
          "Caixa e Depósitos Bancários":  module.exports.auxDB.auxValues.CaixaEDepositos[12]
        },
        total: 0
      },
      "Capital Próprio e Passivo":{
        "Capital Próprio":{
          "Capital Subscrito":  module.exports.auxDB.auxValues.CapitalSubscrito[12],
          "Ações Próprias":  module.exports.auxDB.auxValues.AcoesProprias[12],
          "Outros Instrumentos de Capital Próprio":  module.exports.auxDB.auxValues.OutrosInstrumentosDeCapital[12],
          "Prémios de Emissão":  module.exports.auxDB.auxValues.PremiosDeEmissao[12],
          "Reservas legais":  module.exports.auxDB.auxValues.ReservasLegais[12],
          "Outras Reservas":  module.exports.auxDB.auxValues.OutrasReservas[12],
          "Resultados Transitados":  module.exports.auxDB.auxValues.ResultadosTransitados[12],
          "Excedentes de Revalorização":  module.exports.auxDB.auxValues.ExcedentesDeRevalorizacao[12],
          "Ajustamentos":  module.exports.auxDB.auxValues.Ajustamentos[12],
          total: 0
        },
        "Passivo":{
          "Passivo Não Corrente":{
            "Provisões":  module.exports.auxDB.auxValues.Provisoes[12],
            "Financiamentos Obtidos":  module.exports.auxDB.auxValues.FinanciamentosObtidosPassivos[12],
            "Responsabilidades por benefícios pós-emprego":  module.exports.auxDB.auxValues.Responsabilidades[12],
            "Passivos por Impostos Diferidos":  module.exports.auxDB.auxValues.PassivosPorImpostosDiferidos[12],
            "Outras Dívidas a Pagar":  module.exports.auxDB.auxValues.OutrasDividasNaoCorrentes[12]
          },
          "Passivo Corrente":{
            "Fornecedores":  module.exports.auxDB.auxValues.Fornecedores[12],
            "Adiantamentos de Clientes":  module.exports.auxDB.auxValues.AdiantamentosDeClientes[12],
            "Estado e Outros Entes Públicos":  module.exports.auxDB.auxValues.EstadoEOutrosEntesPassivos[12],
            "Financiamentos Obtidos":  module.exports.auxDB.auxValues.FinanciamentosObtidosPassivos[12],
            "Outras Dívidas a Pagar":  module.exports.auxDB.auxValues.OutrasDividas[12],
            "Diferimentos":  module.exports.auxDB.auxValues.DiferimentosPassivos[12],
            "Passivos Financeiros Detidos para Negociação":  module.exports.auxDB.auxValues.PassivosFinanceirosDetidos[12],
            "Outros Passivos Financeiros":  module.exports.auxDB.auxValues.OutrosPassivosFinanceiros[12],
            "Passivos Não Correntes Detidos para Venda":  module.exports.auxDB.auxValues.PassivosNaoCorrentesDetidos[12]
          },
          total: 0
        },
        total: 0
      }
    }

    for(element in sheet["Ativos"]["Ativo Não Corrente"]){
      sheet["Ativos"].total += sheet["Ativos"]["Ativo Não Corrente"][element];
    }
    for(element in sheet["Ativos"]["Ativo Corrente"]){
      sheet["Ativos"].total += sheet["Ativos"]["Ativo Corrente"][element];
    }

    for(element in sheet["Capital Próprio e Passivo"]["Capital Próprio"]){
      if(element != "total"){
        sheet["Capital Próprio e Passivo"]["Capital Próprio"].total += sheet["Capital Próprio e Passivo"]["Capital Próprio"][element];
      }
    }

    for(element in sheet["Capital Próprio e Passivo"]["Passivo"]["Passivo Corrente"]){
      sheet["Capital Próprio e Passivo"]["Passivo"].total += sheet["Capital Próprio e Passivo"]["Passivo"]["Passivo Corrente"][element];
    }
    for(element in sheet["Capital Próprio e Passivo"]["Passivo"]["Passivo Não Corrente"]){
      sheet["Capital Próprio e Passivo"]["Passivo"].total += sheet["Capital Próprio e Passivo"]["Passivo"]["Passivo Não Corrente"][element];
    }

    sheet["Capital Próprio e Passivo"].total = sheet["Capital Próprio e Passivo"]["Passivo"].total + sheet["Capital Próprio e Passivo"]["Capital Próprio"].total;

    return sheet;
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
    
    module.exports.jsonDB.totalAssets.value += module.exports.jsonDB.assets[11];
    module.exports.jsonDB.totalDebt.value += module.exports.jsonDB.debt[11];

    module.exports.jsonDB.salesProfit.value = netProfit

    module.exports.jsonDB.balanceSheet = module.exports.generateBalanceSheet();
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
