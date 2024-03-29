import { AppNotificationService } from './../../shared/services/app-notification.service';
import { AppNavigationService } from './../../shared/services/navigation.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-feedback',
    templateUrl: 'user-feedback.component.html'
})

export class UserFeedbackComponent implements OnInit {
    constructor(private router: Router,
        private notifier: AppNotificationService, private userService: UserService) { }

    ngOnInit() { }

    onSubmit(form: NgForm) {
        let quesAnsList: { question: string, answer: any }[] = []
        for (let val in form.value) {
            quesAnsList.push({ question: val, answer: form.value[val] })
        }
        this.userService.postUserFeedback({ questionMap: JSON.stringify(quesAnsList) }).then(res => {
            if (res.statusCode === 201) {
                this.notifier.snack(res.message)
                this.router.navigate(['/dashboard'])
            }
        })
    }
    onCancel() {
        this.router.navigate(['/dashboard'])
    }
}