const taxonomyCodes = {
    Inventory: {
        plus:[165, 166, 167, 171, 172, 173, 174, 175, 176, 183, 184, 187, 188, 189, 193, 209, 210, 211, 212, 213],
        ifNegative: [],
        ifPositive: [],
        minus:[177,178,179,180,181,182,185, 186,190,191,192, 194, 168, 169, 170],
        balance: [],
        inverseBalance: []
    },
    
    CashEquivalents: {
        plus:[1,106,107, 8],
        ifNegative: [],
        ifPositive: [2,3],
        minus:[115,116],
        balance: [],
        inverseBalance: []
    },
    
    AccountsReceivable: {
        plus:[51, 55, 56, 108, 111, 128, 130],
        ifNegative: [],
        ifPositive: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 61, 63, 109, 110, 113, 124, 126, 138],
        minus:[52, 65, 66, 67, 69, 117, 118, 119, 120, 122, 140, 142, 144],
        balance: [],
        inverseBalance: []
    },
    
    AtivosBiologicosCorrentes: {
        plus:[195, 196, 214],
        ifNegative: [],
        ifPositive: [],
        minus:[199, 201],
        balance: [],
        inverseBalance: []
    },
    
    Clientes: {
        plus:[],
        ifNegative: [],
        ifPositive: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        minus:[24, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
        balance: [],
        inverseBalance: []
    },

    CapitalSubscritoNaoRealizado: {
        plus:[106, 107],
        ifNegative: [],
        ifPositive: [],
        minus:[115, 116],
        balance: [],
        inverseBalance: []
    },
    
    EstadoEOutrosEntesAtivos: {
        plus:[73, 74, 79, 80],
        ifNegative: [],
        ifPositive: [71, 76, 77, 81, 82, 83, 84, 85],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    DiferimentosAtivos: {
        plus:[146],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    AtivosFinanceirosDetidos: {
        plus:[4, 6],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    OutrosAtivos: {
        plus:[8],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    AtivosNaoCorrentesDetidos: {
        plus:[320, 321, 322, 323, 324],
        ifNegative: [],
        ifPositive: [],
        minus:[326, 327, 328, 329, 330],
        balance: [],
        inverseBalance: []
    },
    
    CaixaEDepositos: {
        plus:[1],
        ifNegative: [],
        ifPositive: [2, 3],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    //Does not include previous accounts
    CurrentAssets: {
        plus:[195, 196, 214, 73, 74, 79, 80, 146, 4, 8, 6, 320, 321, 322, 323, 324, 1],
        ifNegative: [],
        ifPositive: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 71, 76, 77, 81, 82, 83, 84, 85, 2, 3],
        minus:[199, 201, 24, 25, 26,  27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 326, 327, 328, 329, 330],
        balance: [],
        inverseBalance: []
    },
    
    AtivosFixosTangiveis: {
        plus:[268, 269, 270, 271, 272, 273, 274, 306, 310],
        ifNegative: [],
        ifPositive: [],
        minus:[275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 314, 318],
        balance: [],
        inverseBalance: []
    },

    PropriedadesDeInvestimento: {
        plus:[259, 260, 261, 305, 309],
        ifNegative: [],
        ifPositive: [],
        minus:[262, 263, 264, 265, 266, 267, 313, 317],
        balance: [],
        inverseBalance: []
    },

    Goodwill: {
        plus:[217, 222, 227, 289],
        ifNegative: [],
        ifPositive: [],
        minus:[236, 237, 238, 240, 245, 250, 294, 299],
        balance: [],
        inverseBalance: []
    },

    AtivosIntangiveis: {
        plus:[290, 291, 292, 293, 307, 311],
        ifNegative: [],
        ifPositive: [],
        minus:[295, 296, 297, 298, 300, 301, 302, 303, 315, 319],
        balance: [],
        inverseBalance: []
    },

    AtivosBiologicosNaoCorrentes: {
        plus:[197, 198, 215],
        ifNegative: [],
        ifPositive: [],
        minus:[200, 202],
        balance: [],
        inverseBalance: []
    },

    ParticipacoesFinanceiras: {
        plus:[216, 221, 226],
        ifNegative: [],
        ifPositive: [],
        minus:[239, 244, 249],
        balance: [],
        inverseBalance: []
    },

    OutrosInvestimentos: {
        plus:[218, 219, 220, 223, 224, 225, 228, 229, 230, 231, 232, 
                233, 234, 235, 304, 308],
        ifNegative: [],
        ifPositive: [],
        minus:[241, 242, 243, 246, 247, 248, 251, 252, 253, 254, 255, 256, 257, 258, 312, 316],
        balance: [],
        inverseBalance: []
    },

    CreditosAReceber: {
        plus:[112, 129],
        ifNegative: [],
        ifPositive: [62, 64, 114, 125, 127, 139],
        minus:[68, 70, 121, 123, 141, 145],
        balance: [],
        inverseBalance: []
    },

    AtivosPorImpostosDiferidos: {
        plus:[133],
        ifNegative: [],
        ifPositive: [],
        minus:[143],
        balance: [],
        inverseBalance: []
    },

    NonCurrentAssets: {
        plus:[268, 269, 270, 271, 272, 273, 274, 306, 310, 259, 260, 261, 305, 309, 217, 222, 227, 289, 290, 291, 292, 293, 307, 311, 197, 198, 215, 216, 221, 226, 218, 219, 220, 223, 224, 225, 228, 229, 230, 231, 232, 
                233, 234, 235, 304, 308, 112, 129, 133],
        ifNegative: [],
        ifPositive: [62, 64, 114, 125, 127, 139],
        minus:[275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 314, 318, 262, 263, 264, 265, 266, 267, 313, 317, 236, 237, 238, 240, 245, 250, 294, 299, 295, 296, 297, 298, 300, 301, 302, 303, 315, 319,
                200, 202, 239, 244, 249, 241, 242, 243, 246, 247, 248, 251, 252, 253, 254, 255, 256, 257, 258, 312, 316, 68, 70, 121, 123, 141, 145, 143],
        balance: [],
        inverseBalance: []
    },
    
    CapitalSubscrito: {
        plus:[331],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    AcoesProprias: {
        plus:[],
        ifNegative: [],
        ifPositive: [],
        minus:[332],
        balance: [],
        inverseBalance: [333]
    },
    
    OutrosInstrumentosDeCapital: {
        plus:[334],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    PremiosDeEmissao: {
        plus:[335],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    ReservasLegais: {
        plus:[336],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    OutrasReservas: {
        plus:[337],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    ResultadosTransitados: {
        plus:[],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: [338]
    },
    
    ExcedentesDeRevalorizacao: {
        plus:[343, 345],
        ifNegative: [],
        ifPositive: [],
        minus:[344, 346],
        balance: [],
        inverseBalance: []
    },
    
    Ajustamentos: {
        plus:[340, 349, 351],
        ifNegative: [],
        ifPositive: [],
        minus:[350],
        balance: [],
        inverseBalance: [339, 341, 342,347, 348, 352]
    },
    
    ResultadoLiquidoDoPeriodo: {
        plus:[],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: [646]
    },
    
    DividendosAntecipados: {
        plus:[],
        ifNegative: [],
        ifPositive: [],
        minus:[647],
        balance: [],
        inverseBalance: []
    },
    
    Equity: {
        plus:[331, 334, 335, 336, 337, 343, 345, 340, 349, 351],
        ifNegative: [],
        ifPositive: [],
        minus:[332, 344, 346, 350, 647],
        balance: [],
        inverseBalance: [333, 338, 339, 341, 342,347, 348, 352, 646]
    },
    
    AccountsPayable: {
        plus:[53, 54, 57, 59, 131, 135],
        ifNegative: [61, 63, 109, 110, 113, 124, 126, 138],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },

    Fornecedores: {
        plus:[],
        ifNegative: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    AdiantamentosDeClientes: {
        plus:[23, 137],
        ifNegative: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    EstadoEOutrosEntesPassivos: {
        plus:[72, 75, 78],
        ifNegative: [71, 76, 77, 81, 82, 83, 84, 85],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    FinanciamentosObtidosAtivos: {
        plus:[86, 88, 90, 92, 94, 96, 98, 100, 102, 104],
        ifNegative: [2, 3],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    OutrasDividas: {
        plus:[53, 54, 57, 59, 131, 135],
        ifNegative: [61, 63, 109, 110, 113, 124, 126, 138],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    DiferimentosPassivos: {
        plus:[147],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    PassivosFinanceirosDetidos: {
        plus:[5, 7],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    OutrosPassivosFinanceiros: {
        plus:[9],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    PassivosNaoCorrentesDetidos: {
        plus:[325],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    //Does not include previous accounts
    CurrentLiabilities: {
        plus:[23, 137, 72, 75, 78, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 53, 54, 57, 59, 131, 135, 147, 5, 7, 9, 325],
        ifNegative: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 71, 76, 77, 81, 82, 83, 84, 85, 2, 3, 61, 63, 109, 110, 113, 124, 126, 138],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    Provisoes: {
        plus:[148, 149, 150, 151, 152, 153, 154, 155],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    FinanciamentosObtidosPassivos: {
        plus:[87, 89, 91, 93, 95, 97, 99, 101, 103, 105],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    Responsabilidades: {
        plus:[132],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    PassivosPorImpostosDiferidos: {
        plus:[134],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    OutrasDividasNaoCorrentes: {
        plus:[58, 60, 136],
        ifNegative: [62, 64, 114, 125, 127, 139],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    NonCurrentLiabilities: {
        plus:[148, 149, 150, 151, 152, 153, 154, 155, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 132, 134, 58, 60, 136],
        ifNegative: [62, 64, 114, 125, 127, 139],
        ifPositive: [],
        minus:[],
        balance: [],
        inverseBalance: []
    },
    
    Taxes: {
        plus:[644],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: [645],
        inverseBalance: []
    },
    
    Interest: {
        plus:[635, 641],
        ifNegative: [],
        ifPositive: [],
        minus:[500, 501, 502, 503, 504, 505],
        balance: [],
        inverseBalance: []
    },
    
    Revenue: {
        plus:[506, 507, 508, 509, 513, 514, 515, 516, 527, 528, 614, 615, 616, 638, 639, 523, 524, 525, 526, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 
                613, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 636, 637, 640, 642],
        ifNegative: [],
        ifPositive: [],
        minus:[511, 512, 518, 479, 480, 481, 482, 454, 455, 456, 457, 458, 459, 460, 461, 462],
        balance: [510, 517, 519, 520, 521, 522],
        inverseBalance: []
    },
    
    Expenses: {
        plus:[353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 389, 390, 391, 392, 393,
            415, 416, 417, 418, 419, 420, 421, 413, 414, 463, 464, 465, 466, 467, 468, 469, 470, 422, 423, 424, 425, 441, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 471, 472, 473, 474, 475, 
            476, 477, 478, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 495, 496, 497, 498, 499],
        ifNegative: [],
        ifPositive: [],
        minus:[549, 550, 551, 552, 553, 554, 555, 547, 548, 586, 587, 588, 589, 590, 591, 592, 593, 556, 557, 558, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585],
        balance: [387, 388, 412],
        inverseBalance: []
    }/*,

    : {
        plus:[],
        ifNegative: [],
        ifPositive: [],
        minus:[],
        balance: []
    }*/
}


module.exports = {
    isOfType: (type, code, balance) => {
        if(type.plus.includes(code) || (type.ifPositive.includes(code) && balance > 0) || (type.ifNegative.includes(code) && balance < 0)){
            return 1;
        }
        if(type.minus.includes(code)){
            return -1;
        }
        if(type.balance.includes(code)){
            return balance;
        }
        if(type.inverseBalance.includes(code)){
            return -balance;
        }
        return 0;
    },

    getAccountTypes: (code, balance) => {
        let types = []

        for(let accountType in taxonomyCodes){
            operation = module.exports.isOfType(taxonomyCodes[accountType], code, balance);

            if(operation < 0){
                types.push({type:accountType, value:-Math.abs(balance)});
            }
            else if(operation > 0){
                types.push({type:accountType, value:Math.abs(balance)});
            }
        }

        return types;
    } 
}