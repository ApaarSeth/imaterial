import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { GoogleChartService } from '../../services/google-chart.service';

@Component({
    selector: 'app-bar-chart',
    templateUrl: 'bar-chart.component.html'
})

export class BarChartComponent implements OnInit {

    @ViewChild('barChart', { static: false }) barChart: ElementRef

    private gLib: any;
    chartData: [];
    chartTitle: string;

    ngOnInit() {

    }

    constructor(private gChartService: GoogleChartService) {
    }

    private drawChart() {

        let data = this.gLib.visualization.arrayToDataTable([
            ...this.chartData
        ]);

        let chart = new this.gLib.visualization.ColumnChart(this.barChart.nativeElement);

        chart.draw(data, {
            width: 600, height: 400,
            vAxis: '', isStacked: true
        });
    }

    ngAfterViewInit(): void {
        this.gChartService.barChartData.subscribe(res => {
            this.chartData = res
            this.gLib = this.gChartService.getGoogle();
            this.gLib.charts.load('current', { 'packages': ['corechart'] });
            this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
        })
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.
    }
}