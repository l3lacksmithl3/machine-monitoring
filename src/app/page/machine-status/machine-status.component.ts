import { Component, OnInit } from '@angular/core';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { interval, Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-machine-status',
  templateUrl: './machine-status.component.html',
  styleUrls: ['./machine-status.component.scss']
})

export class MachineStatusComponent implements OnInit {

  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  interval: any;
  data: any
  master:any
  moment: any = moment

  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.ngxService.start()
    this.master = await lastValueFrom(this.api.Master_getall())
    let data_realtime = await lastValueFrom(this.api.RawData_lastData())
    console.log(data_realtime);

    this.data = data_realtime.map((d: any) => {
      let Name = 'No Master'
      let date = '-'
      let McName = this.master.filter((e: any) => e["Machine code"].match(new RegExp(d.Machine_CODE, "i")))
      if (McName.length != 0) {
        Name = McName[0]['Machine Name']
      }
      if (d.Time_Change_State != '-') {
        date = moment(d.Time_Change_State).utcOffset(0).format('ll H:mm')
      }
      return {
        ...d,
        Machine_Name: Name,
        Time_Change_State: date
      }
    })
    // moment(element.Time_Change_State).format('ll H:mm')
    // console.log(this.data);

    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator;

    setInterval(() => {
      this.realtime()
    }, 5000)
    this.ngxService.stop()
  }


  async realtime(){
    let data_realtime = await lastValueFrom(this.api.RawData_lastData())
    if (data_realtime.length == 400) {
      if (data_realtime[0].Date != this.data[0].Date) {
        this.data = data_realtime.map((d: any) => {
          let Name = 'No Master'
          let date = '-'
          let McName = this.master.filter((e: any) => e["Machine code"].match(new RegExp(d.Machine_CODE, "i")))
          if (McName.length != 0) {
            Name = McName[0]['Machine Name']
          }
          if (d.Time_Change_State != '-') {
            date = moment(d.Time_Change_State).utcOffset(0).format('ll H:mm')
          }
          return {
            ...d,
            Machine_Name: Name,
            Time_Change_State: date
          }
        })
        this.dataSource = new MatTableDataSource(this.data)
        this.dataSource.paginator = this.paginator;
        // console.log(this.data);

      }

    }


  }

  ngOnDestroy(): void { clearInterval(this.interval) }


}
