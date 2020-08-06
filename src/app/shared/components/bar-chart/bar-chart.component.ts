import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { GoogleChartService } from '../../services/google-chart.service';

@Component({
    selector: 'app-bar-chart',
    templateUrl: 'bar-chart.component.html'
})

export class BarChartComponent implements OnInit {
    private gLib: any;
    chartData: [];
    chartTitle: string;

    ngOnInit() {
        this.gChartService.barChartData.subscribe(res => {
            this.chartData = res
            this.gLib = this.gChartService.getGoogle();
            this.gLib.charts.load('current', { 'packages': ['corechart'] });
            this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
        })
    }


    constructor(private gChartService: GoogleChartService) {

    }
    private drawChart() {

        let data = this.gLib.visualization.arrayToDataTable([
            ...this.chartData
        ]);

        let chart = new this.gLib.visualization.ColumnChart(document.getElementById('divBarChart'));

        chart.draw(data, {
            title: "Yearly Coffee Consumption by Country",
            width: 600, height: 400,
            vAxis: '', isStacked: true
        });
    }

}