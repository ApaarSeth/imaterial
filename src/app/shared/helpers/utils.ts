import { isUndefined } from 'util';
const salt = 'BuildSupply';
const num = 5;
const alpha = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
export class Utils {


    // static generateRandomId(id) {
    //     const hashId = new Hashids();
    //     return (hashId.encode(id));
    //     // return id;
    // }

    // static extractIdFromString(string) {
    //     const hashId = new Hashids();
    //     return string ? hashId.decode(string)[ 0 ] : '';
    //     // return string;
    // }

    // static baseUrl(): string {
    //     return ((window.location.host.split('.').length < 3 && window.location.host.split('.').length !== 1) ?
    //         (window.location.protocol + '//api.' + window.location.host) : (window.location.host.split('.').length > 1) ?
    //             (
    //                 window.location.protocol + '//api.' +
    //                 window.location.host.split('.')[window.location.host.split('.').length - 2]
    //                 + '.' + window.location.host.split('.')[window.location.host.split('.').length - 1]
    //             ) : "https:" + '//api.yeho.ga') + '/';
    // }
    static baseUrl(): string {

        return (window['env'] && window['env']['api_url']) || 'https://dev-api.buildsupply.io/';

    }

    // static formatCardNumber(type, card) {
    //     switch (type) {
    //         case 'american-express':
    //             return card.replace(/\W/gi, '').replace(/^(.{4})(.{6})(.*)$/, '$1 $2 $3').trim();
    //         case 'dankort':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         case 'diners-club':
    //             return card.replace(/\W/gi, '').replace(/^(.{4})(.{4})(.{4})(.*)$/, '$1 $2 $3 $4 ').trim();
    //         case 'discover':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         case 'jcb':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         case 'laser':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         case 'mastercard':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         case 'union-pay':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         case 'visa-electron':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         case 'elo':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         case 'visa':
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //         default:
    //             return card.replace(/\W/gi, '').replace(defaultFormat, '$1 ').trim();
    //     }
    // }




    // static setMinMax(type) {
    //     const cardObj = { max_length: 0, min_length: 0 };
    //     switch (type) {
    //         case 'american-express':
    //             cardObj.max_length = 17;
    //             cardObj.min_length = 15;
    //             return cardObj;
    //         case 'dankort':
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //         case 'diners-club':
    //             cardObj.max_length = 17;
    //             cardObj.min_length = 14;
    //             return cardObj;
    //         case 'discover':
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //         case 'jcb':
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //         case 'laser':
    //             cardObj.max_length = 18;
    //             cardObj.min_length = 15;
    //             return cardObj;
    //         case 'mastercard':
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //         case 'union-pay':
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //         case 'visa-electron':
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //         case 'elo':
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //         case 'visa':
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //         default:
    //             cardObj.max_length = 19;
    //             cardObj.min_length = 16;
    //             return cardObj;
    //     }
    // }

    static isLive(): boolean {
        return window.location.host.indexOf('buildsupply.com') !== -1;
    }


    static JSON_to_URLEncoded(element, key, list) {
        var list = list || [];
        if (typeof (element) == 'object') {
            for (var idx in element)
                this.JSON_to_URLEncoded(element[idx], key ? key + '[' + idx + ']' : idx, list);
        } else {
            list.push(key + '=' + encodeURIComponent(element));
        }
        return list.join('&');
    }
}
