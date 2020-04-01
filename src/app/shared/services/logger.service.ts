import { environment } from '../../../environments/environment';

export class LoggerService {

    static debug(...args) {
        if ((!environment.production) || (environment.debug_mode)) {
        }
    }

    static clear() {
        console.clear();
    }

    static info(...args) {
    }

    static error(...args) {
        // console.error(...args);
    }
}
