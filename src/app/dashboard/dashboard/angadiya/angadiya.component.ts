import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-angadiya',
  templateUrl: './angadiya.component.html',
  styleUrls: ['./angadiya.component.scss']
})
export class AngadiyaComponent {
  public existingSendDetails: any;
  public selectedIndex: any = 0;
  public cityNameForPdf: any;
  constructor(private router: Router) { 
    this.existingSendDetails = history.state;
  }
  
  ngOnInit() {
    
    if (this.existingSendDetails.Guid != null) {
      if (this.existingSendDetails.TransitionType.toLowerCase() === 'send') {
        this.selectedIndex = 0;
      } else {
        this.selectedIndex = 1;
      }
    }

  }
  getCityNameForPdf(cityName: any) {
    this.cityNameForPdf = cityName || '';
  }
  generatePdf() {
    let documentDefinition: any = {
      content: [
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [150, 100],
            body: [
              [{ text: 'Token No:', style: 'subheader' }, { text: this.existingSendDetails.SendTokenNo, alignment: 'right', margin: [0, 10, 0, 5] }],
              [{text: '\n'}, {text: '', margin: [0, 10, 0, 5] }],
              [{ text: 'Charge: ', style: 'subheader' }, { text: this.existingSendDetails.ReceiveCharges.toFixed(2), alignment: 'right', margin: [0, 10, 0, 5] }],
              [{ text: 'Amount: ', style: 'subheader' }, { text: this.existingSendDetails.Amount.toFixed(2), alignment: 'right', margin: [0, 10, 0, 5] }],
              [{ text: 'Receiver Name: ', style: 'subheader' }, { text: (this.existingSendDetails.ReceiverName1 || this.existingSendDetails.ReceiverName), alignment: 'right', margin: [0, 10, 0, 5] }],
              [{ text: 'Receiver Mobile: ', style: 'subheader' }, { text: this.existingSendDetails.ReceiverMobileNo, alignment: 'right', margin: [0, 10, 0, 5] }],
              [{ text: 'City: ', style: 'subheader' }, { text: this.cityNameForPdf, alignment: 'right', margin: [0, 10, 0, 5] }],
              [{ text: 'Note No: ', style: 'subheader', border: [false, false, false, true] }, { text: this.existingSendDetails.NoteNo, alignment: 'right', margin: [0, 10, 0, 5], border: [false, false, false, true] }]
            ]
          },
          layout: {
            defaultBorder: false,
          }
        },
        // { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2 }] },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [150, 100],
            body: [
              [{ text: 'Sender Name:', style: 'subheader' }, { text: (this.existingSendDetails.SennderName || ''), alignment: 'right', margin: [0, 10, 0, 5] }],
              [{ text: 'Sender Mobile:', style: 'subheader' }, { text: (this.existingSendDetails.SenderMobileNo == "null" ? "" : this.existingSendDetails.SenderMobileNo), alignment: 'right', margin: [0, 10, 0, 5] }],
              [{ text: 'Remark:', style: 'subheader' }, { text: this.existingSendDetails.Remark, alignment: 'right', margin: [0, 10, 0, 5] }],
              [{text: '\n'}, {text: '', margin: [0, 10, 0, 5] }],
              [{text: 'Sender Branch:', style: 'subheader' }, {text: '', margin: [0, 10, 0, 5] }]

            ]
          },
          layout: {
            defaultBorder: false,
          }
        }

      ],
      styles: {
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      },
      pageSize: 'A5',
    }
    pdfMake.createPdf(documentDefinition).download();
  }
  back() {
    this.router.navigate(['/dashboard/main']);
  }
}
