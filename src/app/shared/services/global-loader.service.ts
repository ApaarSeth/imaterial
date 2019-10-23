import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GlobalLoaderService {
    private loaderCounter = 0;
    private loader = new Subject<boolean>();
    loaderChanged$ = this.loader.asObservable();

    show() {
        this.loaderCounter++;
        this.loader.next(true);
    }

    hide() {
        this.loaderCounter--;
        if (this.loaderCounter <= 0) {
            this.loaderCounter = 0;
            this.loader.next(false);
        }
    }
}
