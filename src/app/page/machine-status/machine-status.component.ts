import { Component, OnInit } from '@angular/core';

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import { interval, Subscription } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivatedRoute, Router } from '@angular/router';


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
  master: any
  moment: any = moment
  date_check: any
  show_mode: any = 1

  status_down: any = false

  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService,
    private route: Router,
  ) { }

  async ngOnInit(): Promise<void> {


    this.ngxService.start()
    this.master = await lastValueFrom(this.api.Master_getall())
    let data_realtime = await lastValueFrom(this.api.RawData_Step_1())


    this.data = data_realtime[0]?.Data.map((d: any) => {
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
    // console.log(this.data);

    this.date_check = data_realtime[0]?.Date
    // console.log(this.data);
    // console.log(this.date_check);

    // moment(element.Time_Change_State).format('ll H:mm')
    // console.log(this.data);

    this.dataSource = new MatTableDataSource(this.data)
    this.dataSource.paginator = this.paginator;

    setInterval(() => {
      this.realtime()
      this.CheckServer_Down()
    }, 5000)
    this.ngxService.stop()
  }


  async realtime() {
    let CheckUpdate = await lastValueFrom(this.api.RawData_Step_1_CheckData())

    let A: any = moment(CheckUpdate['date'])
    let B: any = moment()
    let C = B.diff(A, 'minute')

    if (CheckUpdate.date != this.date_check) {
      console.log("update")
      let data_realtime = await lastValueFrom(this.api.RawData_Step_1())
      this.data = data_realtime[0]?.Data.map((d: any) => {
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
      // console.log(this.data);
      this.status_down = false
      this.date_check = data_realtime[0]?.Date
      this.dataSource = new MatTableDataSource(this.data)
      this.dataSource.paginator = this.paginator;
      // console.log(this.data)
    }






  }


  async CheckServer_Down() {
    if (!this.status_down) {
    let CheckUpdate = await lastValueFrom(this.api.RawData_Step_1_CheckData())
    let A: any = moment(CheckUpdate['date'])
    let B: any = moment()
    let C = B.diff(A, 'minute')

    let date_check

    if (C > 5) {
      this.data = this.data.map((d: any) => {
        return {
          ...d,
          Machine_Status: 0
        }
      })
      if (this.show_mode == 1) {
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(this.data)
        this.dataSource.paginator = this.paginator;
      }, 100);
      }
    }
    this.status_down = true
    }

  }



  ngOnDestroy(): void { clearInterval(this.interval) }

  swap() {
    if (this.show_mode == 1) {
      this.show_mode = 0
    } else {
      this.show_mode = 1
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(this.data)
        this.dataSource.paginator = this.paginator;
      }, 100);
    }
  }


  view(i: any) {
    // console.log(i);
  }
  loo(i: any) {
    // console.log(i);
    if (i % 20 >= 10) {
      document.documentElement.style.setProperty('--pos1', "1");
      document.documentElement.style.setProperty('--pos2', "0");
    } else {
      document.documentElement.style.setProperty('--pos1', "0");
      document.documentElement.style.setProperty('--pos2', "1");
    }
    if (Math.floor(i / 20) >= 15) {
      document.documentElement.style.setProperty('--pos3', "100%");
      document.documentElement.style.setProperty('--pos4', "none");
    } else {
      document.documentElement.style.setProperty('--pos3', "none");
      document.documentElement.style.setProperty('--pos4', "100%");
    }

  }

  view_detail(e:any){
    // console.log(e);

    this.route.navigate(['/MachineStatusDetail'], {
      queryParams: { "Machine_CODE": e.Machine_CODE, "Machine_Name": e.Machine_Name }
    });
  }


}
