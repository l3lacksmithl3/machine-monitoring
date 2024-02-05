import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-machine-status-detail',
  templateUrl: './machine-status-detail.component.html',
  styleUrls: ['./machine-status-detail.component.scss']
})
export class MachineStatusDetailComponent implements OnInit {

  mc_code: any = "asdasd"
  mc_name: any = "asdasd"
  OEE: any
  dataShow: any
  Color_Running: any = '#00A9FF'
  Color_Stop: any = '#FF6969'
  moment: any = moment

  constructor(
    private route: ActivatedRoute,
    private api: HttpService,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.mc_code = params['Machine_CODE']
      this.mc_name = params['Machine_Name']
    });


    let date = moment("2023-12-20 14:38:00").add(7, "hour")



    this.getStatusNew()
    this.Total_of_Day_Operation(date, 0)
    this.Daily_Operation(date, 0)
    this.Monthly_Operation(date, 0)
  }


  // query data ----------------------------------------------------------------------------------------//


  async getStatusNew() {
    let raw = await lastValueFrom(this.api.RawData_Step_1())
    if (raw.length != 0) {
      this.dataShow = raw[0].Data.filter((d: any) => d['Machine_CODE'] == this.mc_code)[0]
    }
  }


  async Total_of_Day_Operation(date: any, loss: any) {
    let list = {
      date: moment(date).startOf('day').toDate()
    }
    let raw = await lastValueFrom(this.api.data_by_day_getByCondition(list))
    let status = raw[0].value.filter((d: any) => d['mc'] == this.mc_code)[0].status


    let running = status.filter((d: any) => d.type_name == 1).length != 0 ? status.filter((d: any) => d.type_name == 1)[0].total : 0
    let stop = status.filter((d: any) => d.type_name != 1).length != 0 ? status.filter((d: any) => d.type_name != 1).reduce((a: any, b: any) => a + b['total'], 0) : 0
    let total = running + stop
    // this.OEE = ((running / total) * 100).toFixed(2)

    console.log("🚀 ~ MachineStatusDetailComponent ~ Total_of_Day_Operation ~ running:", running)
    console.log("🚀 ~ MachineStatusDetailComponent ~ Total_of_Day_Operation ~ sdasd:", stop)
    console.log("🚀 ~ MachineStatusDetailComponent ~ Total_of_Day_Operation ~ status:", total)
    let date_chart = [
      {
        value: running,
        name: 'Running',
        itemStyle: { color: this.Color_Running },
        labelLine: { show: false },
        label: { show: false }

      },
      {
        value: stop,
        name: 'Stop',
        itemStyle: { color: this.Color_Stop },
        labelLine: { show: false },
        label: { show: false }

      },
    ]
    this.chart_TotalOfDay(date_chart, list.date)
    // (OpTime: any, PlanProTime: any, CycleTime: any, TotalPieced: any, GoodPieces: any)
    // this.OEE =  (await this.Find_OEE(running, 673, 60, 673, 673) * 100 ).toFixed(2)
    this.OEE = 0
  }


  async Daily_Operation(data: any, loss: any) {
    let M = moment(data).format('MM')
    let Y = moment(data).format('YYYY')


    let LoopDay = getDay(`${M}/${Y}`);

    let values = []

    for (const item of LoopDay) {
      let list = {
        date: moment(item).startOf('day').toDate()
      }
      // console.log(list);

      let raw = await lastValueFrom(this.api.data_by_day_getByCondition(list))
      if (raw.length != 0) {
        let status = raw[0].value.filter((d: any) => d['mc'] == this.mc_code)[0].status
        let running = status.filter((d: any) => d.type_name == 1).length != 0 ? status.filter((d: any) => d.type_name == 1)[0].total : 0
        let stop = status.filter((d: any) => d.type_name != 1).length != 0 ? status.filter((d: any) => d.type_name != 1).reduce((a: any, b: any) => a + b['total'], 0) : 0
        let total = running + stop
        values.push(
          {
            "date": moment(item).format("D"),
            "Running": running / total * 100,
            "Stop": stop / total * 100
          }
        )
      } else {
        values.push(
          {
            "date": moment(item).format("D"),
            "Running": 0,
            "Stop": 0
          }
        )
      }


    }

    this.chart_Daily_OP(values, data)

    function getDay(monthYear: any) {
      const [month, year] = monthYear.split('/').map(Number);
      const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
      const result = [];
      for (let day = 1; day <= daysInMonth; day++) {
        result.push(moment(`${year}-${month}-${day}`).format('YYYY-MM-DD'));
      }
      return result;
    }
  }


  async Monthly_Operation(data: any, loss: any) {
    let M = moment(data).format('MM')
    let Y = moment(data).format('YYYY')


    let LoopMonth = setMonthInYear(Y);


    let values = []

    for (const item of LoopMonth) {
      let list = {
        date: moment(item).startOf('month').toDate()
      }
      // console.log(list);

      let raw = await lastValueFrom(this.api.data_by_month_getByCondition(list))
      if (raw.length != 0) {
        let status = raw[0].value.filter((d: any) => d['mc'] == this.mc_code)[0].status
        let running = status.filter((d: any) => d.type_name == 1).length != 0 ? status.filter((d: any) => d.type_name == 1)[0].total : 0
        let stop = status.filter((d: any) => d.type_name != 1).length != 0 ? status.filter((d: any) => d.type_name != 1).reduce((a: any, b: any) => a + b['total'], 0) : 0
        let total = running + stop
        values.push(
          {
            "date": moment(item).format("M"),
            "Running": running / total * 100,
            "Stop": stop / total * 100
          }
        )
      } else {
        values.push(
          {
            "date": moment(item).format("M"),
            "Running": 0,
            "Stop": 0
          }
        )
      }
    }

    // console.log(values);

    this.chart_MonthlyOP(values, data)
    // this.chart_Daily_OP(values,data)

    function setMonthInYear(year: string): string[] {
      const startDate = moment(year + "-01-01");
      const endDate = moment(year + "-12-01");
      const months: string[] = [];

      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        months.push(currentDate.format("YYYY-MM-DD"));
        currentDate.add(1, 'months');
      }

      return months;
    }
  }



  // chart ----------------------------------------------------------------------------------------//

  chart_TotalOfDay(data: any, date: any) {
    var dom = document.getElementById('chart-container');
    var myChart: any = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};

    var option;

    option = {
      title: {
        text: 'Total of Day Operation',
        subtext: moment(date).format('LL'),
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: 'bottom'
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '65%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };



    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
  }



  chart_Daily_OP(data: any, date: any) {

    var dom = document.getElementById('chart-Daily-OP');
    var myChart: any = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};

    var option;


    option = {
      title: {
        text: 'Daily Operation',
        subtext: moment(date).format('MMMM, YYYY'),
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          var formattedValue = params.map(function (item: any) {
            return item.marker + item.seriesName + ': ' + item.value.toFixed(2) + " %";
          }).join('<br>');
          return `<span>Date : ${moment(date).format('YYYY-MM')}-${params[0].name}</span><br>` + formattedValue;
        }
      },
      legend: {
        top: 'bottom'
      },
      xAxis: {
        type: 'category',
        data: data.map((d: any) => d.date),
        axisLabel: {
          fontSize: 11,
          // fontWeight: 'bold',
          color: '#333',
          rotate: 90
        },
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: function (value: any) {
            return `${value} %`
          }
        },
      },
      series: [
        {
          data: data.map((d: any) => d.Running),
          type: 'bar',
          stack: 'S1',
          color: this.Color_Running,
          name: "Running"
          // label: {
          //   align: 'left',
          //   verticalAlign: 'middle',
          //   distance: 0,
          //   show: true,
          //   rotate : 90,
          //   fontSize: 9,
          //   position : "bottom",
          //   formatter: function (value: any) {
          //     console.log(value);
          //     if (value.data == 0) {
          //       return ``
          //     }else{
          //       return `${value.data.toFixed(2)} %`
          //     }

          //   }
          // }
        },
        {
          data: data.map((d: any) => d.Stop),
          type: 'bar',
          stack: 'S1',
          color: this.Color_Stop,
          name: "Stop"
        }
      ]
    };



    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
  }



  chart_MonthlyOP(data: any, date: any) {
    var dom = document.getElementById('chart_MonthlyOP');
    var myChart: any = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};

    var option;

    option = {
      title: {
        text: 'Monthly Operation',
        subtext: moment(date).format('YYYY'),
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function (params: any) {
          var formattedValue = params.map(function (item: any) {
            return item.marker + item.seriesName + ': ' + item.value.toFixed(2) + " %";
          }).join('<br>');
          return `<span>Date : ${moment(date).format('YYYY-MM')}-${params[0].name}</span><br>` + formattedValue;
        }
      },
      legend: {
        top: 'bottom'
      },
      xAxis: {
        type: 'category',
        data: data.map((d: any) => d.date)
      },
      yAxis: {
        type: 'value',
        max: 100,
        axisLabel: {
          formatter: function (value: any) {
            return `${value} %`
          }
        },
      },
      series: [
        {
          data: data.map((d: any) => d.Running),
          type: 'bar',
          stack: 'S1',
          color: this.Color_Running,
          name: "Running"
        },
        {
          data: data.map((d: any) => d.Stop),
          type: 'bar',
          stack: 'S1',
          color: this.Color_Stop,
          name: "Stop"
        }
      ]
    };



    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
  }



  backPage() {
    this.router.navigate(['/MachineStatus'])
  }

  async Find_OEE(OpTime: any, PlanProTime: any, CycleTime: any, TotalPieced: any, GoodPieces: any) {

    let OEE = Availability(OpTime, PlanProTime) * Performance(CycleTime, OpTime, TotalPieced) * Quality(GoodPieces, TotalPieced)
    return  OEE
    console.log("🚀 ~ MachineStatusDetailComponent ~ Find_OEE ~ OEE:", OEE)

    function Availability(Operating: any, PlanedProduction: any) {
      console.log(Number(Operating) / Number(PlanedProduction));
      return Number(Operating) / Number(PlanedProduction)
    }


    function Performance(Cycle: any, Operating: any, Total: any) {
      console.log((1 / Number(Cycle)) / (Number(Operating) / Number(Total)));
      return (1 / Number(Cycle)) / (Number(Operating) / Number(Total))
    }


    function Quality(Good: any, Total: any) {
      console.log(Number(Good) / Number(Total));
      return Number(Good) / Number(Total)
    }

  }

}
