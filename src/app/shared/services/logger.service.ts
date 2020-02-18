import { environment } from '../../../environments/environment';

export class LoggerService {

    static debug(...args) {
        if ((!environment.production) || (environment.debug_mode)) {
            console.log(...args);
        }
    }

    static clear() {
        console.clear();
    }

    static info(...args) {
        //console.log(...args);
    }

    static error(...args) {
        // console.error(...args);
    }
}
