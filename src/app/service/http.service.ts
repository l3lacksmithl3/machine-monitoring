import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient
  ) { }
  Url: any = environment.UrlApi



  // //AMT master analog / digital
  // getMasterModel(): Observable<any> {
  //   return this.http.get(this.Url + "/master/")
  // }
  // addMasterModel(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master/", data)
  // }
  // CheckMaster(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master/getByCondition/", data)
  // }
  // DeleteMaster(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master/DelByCondition/", data)
  // }
  // updateMasterModel(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/master/insert/" + id, data)
  // }


  //User
  // getUserBySection(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master_employee/getByCondition/", data)
  // }


  // getSectionBySection(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master_section/getByCondition/", data)
  // }
  // AddMasterSection(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master_section/", data)
  // }
  // updateSection(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/master_section/insert/" + id, data)
  // }
  // getSectionAll(): Observable<any> {
  //   return this.http.get(this.Url + "/master_section/")
  // }




  // getMasterIT(): Observable<any> {
  //   return this.http.get(this.Url + "/master_it/")
  // }
  // AddMasterIT(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master_it/", data)
  // }
  // getSectionITBySection(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/master_it/getByCondition/", data)
  // }
  // updateSectionIT(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/master_it/insert/" + id, data)
  // }


  // //Approve_data
  // Approve_data(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Approve_data/", data)
  // }
  // getDataApprove(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Approve_data/getByCondition/", data)
  // }
  // delDataApprove(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Approve_data/DelByCondition/", data)
  // }
  // getDataApproveAll(): Observable<any> {
  //   return this.http.get(this.Url + "/Approve_data/")
  // }
  // ApproveUpdate(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/Approve_data/insert/" + id, data)
  // }
  // updateAt(): Observable<any> {
  //   return this.http.get(this.Url + "/Approve_data/lastData")
  // }
  // ApproveDelField(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/Approve_data/delete/", data)
  // }
  // // getApprove(data: any): Observable<any> {
  // //   return this.http.post(this.Url + "/Approve_data/getByAggregate/", data)
  // // }



  // // record
  // RecordApprove(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/RecordApprove/", data)
  // }
  // getRecordApprove(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/RecordApprove/getByCondition/", data)
  // }
  // getRecord(): Observable<any> {
  //   return this.http.get(this.Url + "/RecordApprove/")
  // }




  // MasterUserAll(): Observable<any> {
  //   return this.http.get("http://10.200.90.152:4012/user_masterGet")
  // }
  // MasterCode(): Observable<any> {
  //   return this.http.get("http://10.200.90.152:4012/code_masterGet")
  // }
  // MasterHoliDay(): Observable<any> {
  //   return this.http.get("http://10.200.90.152:4012/date_masterGet")
  // }


  //ITassetMouse
  // AssetMouseUpdate(id: any, data: any): Observable<any> {
  //   return this.http.put(this.Url + "/AssetMouser/insert/" + id, data)
  // }
  // AssetMouseAdd(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/AssetMouser/", data)
  // }
  // AssetMouseGetAll(): Observable<any> {
  //   return this.http.get(this.Url + "/AssetMouser/")
  // }
  // AssetMouseGetByID(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/AssetMouser/getByCondition/", data)
  // }
  // AssetMouseDelByID(data: any): Observable<any> {
  //   return this.http.post(this.Url + "/AssetMouser/delByCondition/", data)
  // }

  RawData_Step_1(): Observable<any> {
    return this.http.get(this.Url + "/raw_data_step_1/GetLastData/")
  }
  RawData_Step_1_CheckData(): Observable<any> {
    return this.http.get(this.Url + "/raw_data_step_1/CheckData/")
  }


  RawData_lastData(): Observable<any> {
    return this.http.get(this.Url + "/RawData/GetLastData/")
  }
  RawData_CheckData(): Observable<any> {
    return this.http.get(this.Url + "/RawData/CheckData/")
  }
  RawData_GetByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/RawData/GetDataByDay/", data)
  }





  Master_getall(): Observable<any> {
    return this.http.get(this.Url + "/Master_machine/")
  }

  Master_add(data: any): Observable<any> {
    return this.http.post(this.Url + "/Master_machine/", data)
  }
  Master_update(id: any, data: any): Observable<any> {
    return this.http.put(this.Url + "/Master_machine/insert/" + id, data)
  }
  Master_DelByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/Master_machine/delByCondition/", data)
  }




  // data_by_day
  data_by_day_getByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/data_by_day/getByCondition/", data)
  }

  data_by_month_getByCondition(data: any): Observable<any> {
    return this.http.post(this.Url + "/data_by_month/getByCondition/", data)
  }


}

// getDataView
