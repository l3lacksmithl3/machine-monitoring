import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  page :any
  constructor() { }

  ngOnInit(): void {
    this.page = [
      { path: '/MachineStatus', title: 'Machine Status', icon: 'assets/machinestatus.png', class: '' },
      { path: '/Master', title: 'Master', icon: 'assets/Master.png', class: '' },


    ]
  }

}
