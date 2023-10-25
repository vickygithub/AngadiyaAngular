import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';
import { CrudService } from 'src/app/services/crud.service';
import * as moment from 'moment';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  public selectedAcount: any;
  public loggedInUser: any;
  public report: any;
  public date: any = new Date();
  public balances: any = [];
  public displayedColumns = ['particular', 'type', 'tno', 'amount'];

  public sendToken: any = 0;
  public totalAmount: any = 0;
  public amountMatched: any = true;
  public selectedIndex: any = 0;
  constructor(private spinner: NgxSpinnerService, private crudService: CrudService, private commonService: CommonService, private router: Router) {
    this.selectedAcount = history.state;
    this.loggedInUser = JSON.parse(sessionStorage.getItem('userDetails')!);
  }
  back() {
    this.router.navigate(['/dashboard/ledger']);
  }
  getPdfBodyRows() {
    let rows: any = [];
    rows.push(
      [
        { text: 'Particular', style: 'tableHeader' },
        { text: 'Type', style: 'tableHeader' },
        { text: 'T No.', style: 'tableHeader', alignment: 'center' },
        { text: 'Amount', style: 'tableHeader', alignment: 'right' }
      ]
    )
    this.report.forEach((r: any, index: any) => {
      let row = [
        {
          text: r.displayParticular,
          fillColor: index == 0 ? '' : r.bgRed ? '#d8b0b0' : !r.bgRed ? '#c5e1c7' : ''
        },
        {
          text: r.TransitionType.toLowerCase() == 'send' ? 'S' : r.TransitionType.toLowerCase() == 'receive' ? 'R' : r.TransitionType,
          fillColor: index == 0 ? '' : r.bgRed ? '#d8b0b0' : !r.bgRed ? '#c5e1c7' : ''
        },
        {
          text: r.TransitionType.toLowerCase() == 'send' ? r.SendTokenNo : '',
          alignment: 'center',
          fillColor: index == 0 ? '' : r.bgRed ? '#d8b0b0' : !r.bgRed ? '#c5e1c7' : ''
        },
        {
          text: r.displayAmount,
          alignment: 'right',
          fillColor: index == 0 ? '' : r.bgRed ? '#d8b0b0' : !r.bgRed ? '#c5e1c7' : ''
        }
      ]
      rows.push(
        row
      )
    });
    rows.push([{ text: 'Total', style: 'tableHeader' }, { text: this.balances[0]?.ClosingBalance.toFixed(2), style: 'tableHeader', color: this.amountMatched ? 'green' : 'red' },{ text: this.sendToken, style: 'tableHeader', alignment: 'center' }, { text: this.totalAmount.toFixed(2), style: 'tableHeader', alignment: "right" }])
    return rows;
  }
  getPdfBody() {
    
  }
  generatePdf() {
    let documentDefinition: any = {
      content: [
        {text: 'Ledger', style: 'header', alignment: "center"},
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [200, 100, '*', '150'],
            body: [
              [{ text: this.selectedAcount.Name, style: 'tableHeader' }, { text: '', style: 'tableHeader' },{ text: '', style: 'tableHeader' }, { text: moment(this.date).format('DD-MM-YYYY'), style: 'tableHeader', alignment: "right" }]
            ]
          },
          layout: 'noBorders'
        },
        {
          style: 'tableExample',
          table: {
            widths: [200, 100, '*', 150],
            body: this.getPdfBodyRows()
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableExample: {
          margin: [0, 5, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    };
    pdfMake.createPdf(documentDefinition).download();
  }
  fetchReport(closingBalanceDate: any = null) {
    this.spinner.show();
    this.crudService.postByUrl('/LedgerReport', {
      DeviceId: "83e9568fa4df9fc1",
      Token: this.loggedInUser.Token,
      LoginId: this.loggedInUser.Guid,
      AdminGuid: this.loggedInUser.AdminGuid,
      AccountGuid: this.selectedAcount.Guid,
      StartDate: moment(closingBalanceDate == null ? this.date : new Date(this.commonService.getDatePickerDate(closingBalanceDate))).format('YYYY-MM-DD'),
      EndDate: moment(closingBalanceDate == null ? this.date : new Date(this.commonService.getDatePickerDate(closingBalanceDate))).format('YYYY-MM-DD')
    }).subscribe({
      next: (res: any) => {
        this.spinner.hide();

        this.sendToken = res.filter((r: any) => r.TransitionType.toLowerCase() === 'send').length;
        res.forEach((r: any) => {

          if (r.TransitionType.toLowerCase() === 'receive') {
            if (this.selectedAcount.Guid === r.DebitGuid) {
              r['displayParticular'] = `${r.ReceiverName1 || r.ReceiverName}`;
            } else {
              r['displayParticular'] = `${r.SennderName}`;
            }
          }
          if (r.TransitionType.toLowerCase() === 'jr' || r.TransitionType.toLowerCase() === 'cp' || r.TransitionType.toLowerCase() === 'cr') {
            if (this.selectedAcount.Guid === r.DebitGuid) {
              r['displayParticular'] = `To- ${r.ReceiverName}`;
            } else {
              r['displayParticular'] = `By- ${r.SennderName}`;
            }
          }
          if (r.TransitionType.toLowerCase() === 'send') {
            r['displayParticular'] = `To- ${r.ReceiverCity == 'NA' ? '' : r.ReceiverCity}`;
          }
          
          // if (r.TransitionType.toLowerCase() === 'cp' || r.TransitionType.toLowerCase() === 'cr') {
          //   r['displayParticular'] = 'By- Cash';
          // }
          if (this.selectedAcount.Type.toLowerCase() == 'commission') {
            r['bgRed'] = null;
            if (r.COMMAMOUNT > 0) {
              r['displayAmount'] = `-${r.COMMAMOUNT.toFixed(2)}`
            }
            if (r.COMMAMOUNT < 0) {
              r['displayAmount'] = `${Math.abs(r.COMMAMOUNT.toFixed(2))}`
            }
            if (r.COMMAMOUNT === 0) {
              r['displayAmount'] = `0.00`
            }
          } else {
            if (this.selectedAcount.Guid === r.CreditGuid) {
              r['bgRed'] = true;
              r['displayAmount'] = `-${r.CREADITAMOUNT.toFixed(2)}`
            } else if (this.selectedAcount.Guid !== r.CreditGuid) {
              r['bgRed'] = false;
              r['displayAmount'] = `${r.DEBITAMOUNT.toFixed(2)}`
            }
          }

        })
        const ob = {
          displayParticular: 'Opening',
          TransitionType: '',
          TranSerialNo: '',
          displayAmount: this.balances[0].OpeningBalance.toFixed(2) || "0.00"
        }
        res.unshift(ob);
        this.totalAmount = res.reduce((acc: any, curr: any) => {
          return acc + parseFloat(curr.displayAmount);
        }, 0);
        this.amountMatched = false;
        if (parseFloat(this.balances[0].ClosingBalance) === this.totalAmount) {
          this.amountMatched = true;
        }
        this.report = [...res];
        if (closingBalanceDate != null) {
          this.date = this.commonService.getDatePickerDate(closingBalanceDate);
          this.selectedIndex = 0;
        }

      },
      error: (err) => {
        this.spinner.hide();
        this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
      }
    });
  }
  goToSendComponent(row: any) {
    switch (row.TransitionType.toLowerCase()) {
      case "send":
        this.router.navigate(['/dashboard/angadiya'], { state: row });
        break;
      case "cr":
        this.router.navigate(['/dashboard/cashtransaction'], { state: row });
        break;
      case "cp":
        this.router.navigate(['/dashboard/cashtransaction'], { state: row });
        break;
      case "jr":
        this.router.navigate(['/dashboard/journaltransaction'], { state: row });
        break;
      case "receive":
        this.router.navigate(['/dashboard/angadiya'], { state: row });
        break;
      default:
        break;
    }
  }
  ngOnInit() {
    this.fetchDetails();
  }
  async fetchOpeninBalance(closingBalanceDate: any = null) {
    this.spinner.show();
    return new Promise((resolve, reject) => {
      this.crudService.postByUrl('/OpeningBalance', {
        DeviceId: "83e9568fa4df9fc1",
        Token: this.loggedInUser.Token,
        LoginId: this.loggedInUser.Guid,
        AdminGuid: this.loggedInUser.AdminGuid,
        AccountGuid: this.selectedAcount.Guid,
        StartDate: moment(closingBalanceDate == null ? this.date : new Date(this.commonService.getDatePickerDate(closingBalanceDate))).format('YYYY-MM-DD'),
        EndDate: moment(closingBalanceDate == null ? this.date : new Date(this.commonService.getDatePickerDate(closingBalanceDate))).format('YYYY-MM-DD')
      }).subscribe({
        next: (res: any) => {
          this.spinner.hide();

          this.balances = res;
          resolve(res);
        },
        error: (err) => {
          this.spinner.hide();
          this.commonService.emitSuccessErrorEventEmitter({ message: 'Error!', success: false });
        }
      });
    })

  }
  async fetchDetails(obj: any = null) {
    this.balances = await this.fetchOpeninBalance(obj == null ? null : obj.Date);
    this.fetchReport(obj == null ? null : obj.Date);
  }
}
