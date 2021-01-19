'use strict'

const ExchangeResource = require('../resources/exchangeResource.js')


module.exports.getRates = function getRates(req, res, next) {

  ExchangeResource.requestExchange().then((response) =>{

    var divisas = Object.keys(response.rates).map((key) => [key, response.rates[key]]);
    res.send(divisas);
    
  })
}