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

    /*static auth(jwt) {
        console.log(addLogPrefix("Validating JWT..."));
        const url = AuthResource.authUrl('/auth/validate');
        const options = {
            body: AuthResource.requestBody(jwt)
        }

        return request.post(url, options);
    }

    static register(username, name, surname, email, phone, password) {
        const url = AuthResource.authUrl('/auth/register');
        const options = {
            body: {
                "username": username,
                "name": name,
                "surname": surname,
                "email": email,
                "phone": phone,
                "password": password
            }
        }

        return request.post(url, options);
    }

    static login(username, password) {
        const url = AuthResource.authUrl('/auth/login');
        const options = {
            body: {
                "username": username,
                "password": password
            }
        }

        return request.post(url, options);
    }*/
}

// ----------------- Helper methods -----------------

function addLogPrefix(message) {
    return new Date().toISOString() + " - " + prefix.concat(message);
}

module.exports = ExchangeResource;