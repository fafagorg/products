const urljoin = require('url-join');
const request = require('request-promise-native').defaults({json: true});

const prefix = "[EXCHANGE_RESOURCE] ";

class ExchangeResource {
    static exchangeUrl(resourceUrl) {
        const exchangeServer = ('https://api.exchangeratesapi.io/latest');
        return urljoin(exchangeServer, resourceUrl);
    }

    static requestExchange() {
        console.log("GETTING DOLLAR EXCHANGE RATE")
        const url = ('https://api.exchangeratesapi.io/latest');
        console.log(url)
        return request.get(url);
    }
}

// ----------------- Helper methods -----------------

function addLogPrefix(message) {
    return new Date().toISOString() + " - " + prefix.concat(message);
}

module.exports = ExchangeResource;