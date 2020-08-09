import { Component, OnInit, Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { GoogleChartService } from '../../services/google-chart.service';

@Component({
    selector: 'app-pie-chart',
    templateUrl: 'pie-chart.component.html'
})

export class PieChartComponent implements OnInit {
    @ViewChild('pieChart', { static: false }) pieChart: ElementRef

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

        var options = {
            is3D: true,
            width: 500, height: 400,
            colors: ['#1584BA', '#60C1EF'],

        };

        let chart = new this.gLib.visualization.PieChart(this.pieChart.nativeElement);

        chart.draw(data, options);
    }

    ngAfterViewInit(): void {
        this.gChartService.pieChartData.subscribe(res => {
            this.chartData = res
            this.gLib = this.gChartService.getGoogle();
            this.gLib.charts.load('current', { 'packages': ['corechart'] });
            this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
        })
    }
}