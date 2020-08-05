import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class GlobalLoaderService {
    public isLoading = new BehaviorSubject(false);

    show() {
        this.isLoading.next(true);
    }

    hide() {
        this.isLoading.next(false);
    }
}
