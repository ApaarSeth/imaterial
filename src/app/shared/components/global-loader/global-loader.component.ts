import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {GlobalLoaderService} from '../../services/global-loader.service';
import {LoggerService} from '../../services/logger.service';
import {Subscription} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-global-loader',
    styleUrls: ['./global-loader.component.css'],
    templateUrl: './global-loader.component.html'
})
export class GlobalLoaderComponent implements OnInit, OnDestroy {

    show = false;
    private loaderSubscription: Subscription;

    constructor(private globalLoader: GlobalLoaderService,
                private cd: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.loaderSubscription = this.globalLoader.loaderChanged$.pipe(distinctUntilChanged()).subscribe(res => {
            if (this.show !== res) {
                this.show = res;
                this.cd.detectChanges();
            }
        }, err => {
            LoggerService.error('failed to subscribe to loader changed event ' + err);
        });
    }

    ngOnDestroy() {
        if (this.loaderSubscription) {
            this.loaderSubscription.unsubscribe();
        }
    }
}
