import { Component, OnInit, ViewChild } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from 'src/app/service/http.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from "ngx-ui-loader";

type AOA = any[][];

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
  dataExcel: any

  displayedColumns: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
  dataSource = new MatTableDataSource
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  inputFilter1 :any

  constructor(
    private api: HttpService,
    private ngxService: NgxUiLoaderService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.ngxService.start()
    let data = await lastValueFrom(this.api.Master_getall())
    console.log(data);
    this.dataSource = new MatTableDataSource(data)
    this.dataSource.paginator = this.paginator;
    this.ngxService.stop()
  }





  def_import_Master(evt: any) {
    this.ngxService.start()
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const data: any[] = []
      const files = evt.target.files
      data.push(...files)
      this.MasterAssetMaster(wb, data)
    };
    reader.readAsBinaryString(target.files[0]);
    let id_import = document.getElementById("files") as HTMLInputElement
    id_import.value = ""
  }


  async MasterAssetMaster(wb: any, data: any) {
    const ws: XLSX.WorkSheet = wb.Sheets['MACHINE'];
    if (!ws) {
      Swal.fire(`The information doesn't match.<br> Please check again.`, '', 'error')
    } else {
      // this.ngxService.start()
      let header
      this.dataExcel = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      // console.log(this.dataExcel);

      let startRow = 1
      header = this.dataExcel[startRow - 1].map((d: any) => {
        let text = d.replaceAll('.', '')
        let text2 = text.replaceAll('\r\n', '')
        return text2.trim()
      })
      // console.log(header);


      let data_raw: any = {}
      let max_row: any

      for (let index = startRow; index < this.dataExcel.length; index++) {
        max_row = this.dataExcel.length
        if (this.dataExcel[index][1] == undefined) {
          max_row = index
          break
        }
      }
      // console.log(max_row);

      let rawdata = []
      for (let index = startRow; index < max_row; index++) {
        data_raw = {}
        for (const [i, item] of this.dataExcel[index].entries()) {
          let datanew = item
          if (item == undefined || item == "") {
            datanew = "-"
          }
          data_raw[header[i]] = datanew
        }
        rawdata.push(data_raw)
      }
      // console.log(rawdata);

      let Master = await lastValueFrom(this.api.Master_getall())
      // console.log(Master);
      // Master_add
      let group_A = []
      if (Master.length) { group_A = Master.map((d: any) => d["Machine code"]) }
      let group_B = rawdata.map((d: any) => d["Machine code"])
      let group_asset = group_A.concat(group_B)
      const unique = [...new Set(group_asset.map((item: any) => item))];


      for (const name of unique) {
        if (rawdata.filter((d: any) => d["Machine code"] == name).length != 0) {
          if (Master.filter((d: any) => d["Machine code"] == name).length != 0) {
            let id = Master.filter((d: any) => d["Machine code"] == name)
            let data = rawdata.filter((d: any) => d["Machine code"] == name)
            let Update = await lastValueFrom(this.api.Master_update(id[0]._id, data[0]))
          } else {
            let data = rawdata.filter((d: any) => d["Machine code"] == name)
            let Adddate = await lastValueFrom(this.api.Master_add(data[0]))
          }
        } else {
          let delDel = await lastValueFrom(this.api.Master_DelByCondition({ "Machine code": name }))
        }
      }
      this.ngxService.stop()
      setTimeout(() => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Success',
          showConfirmButton: false,
          timer: 1500,
        })
      }, 1000);


    }
  }








  def_import(e:any){

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
