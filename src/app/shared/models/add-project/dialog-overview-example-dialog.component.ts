import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DialogData {
    animal: string;
    name: string;
    address1: string;
    address2: string;
    pinCode: number;
    state: string;
    projectArea: string;
    constructionCost: number;
  }

  export interface City {
    value: string;
    viewValue: string;
  }

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
  })
  export class DialogOverviewExampleDialog implements OnInit {

    //@Input('name') name: string; 
    //@Input('animal') animal: string; 

    form: FormGroup;
    startDate = new Date(1990, 0, 1);
    endDate = new Date(2021, 0, 1);

    constructor(
      private dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private formBuilder: FormBuilder
      ) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    ngOnInit(){
      this.initForm(); 
    }

    cities: City[] = [
      {value: 'Gurgaon-0', viewValue: 'Gurgaon'},
      {value: 'Delhi-1', viewValue: 'Delhi'},
      {value: 'Karnal-2', viewValue: 'Karnal'}
    ];

    initForm(){

      this.form = this.formBuilder.group({

        name:[this.data.name, Validators.required],
        address1:[this.data.address1, Validators.required],
        address2:[this.data.address2],
        pinCode:[this.data.pinCode, Validators.required],
        state:[this.data.state, Validators.required],
        projectArea:[this.data.projectArea],
        constructionCost:[this.data.constructionCost, Validators.required],
        animal:[ this.data.animal, Validators.required]

      });

    }

    submit(){
      console.log(this.form.value);
      this.dialogRef.close(this.form.value);
    }
  
  }