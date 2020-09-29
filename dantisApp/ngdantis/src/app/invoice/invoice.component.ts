import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { CurrencyPipe } from '@angular/common';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  @Input() pdfAction;
  @Input() products;
  @Output() afterInvoice: EventEmitter<boolean> = new EventEmitter();


  constructor(private currencyPipe: CurrencyPipe) { }

  ngOnInit(): void {
    this.generatePDF(this.pdfAction);
    console.log('prod', this.products)
  }

  generatePDF(action) {
    let docDefinition = {
      content: [
        {
          text: 'V.M Electricals & LED Point',
          fontSize: 16,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'INVOICE',
          fontSize: 20,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: this.products.fName + " " + this.products.lName,
                bold: true
              },
              { text: this.products.address },
              { text: this.products.email },
              { text: this.products.phoneNum }
            ],
            [
              {
                text: `Date: ${new Date().toLocaleString()}`,
                alignment: 'right'
              },
              {
                text: `Bill No : ${((Math.random() * 1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Product', 'Price', 'Tax', 'Quantity', 'Amount'],
              ...this.products.map(p => ([p.name, this.currencyPipe.transform(p.price, 'INR'), p.taxPercent + "%", p.qty, this.currencyPipe.transform((p.price + p.taxPrice) * p.qty, 'INR')])),
              [{ text: 'Total Amount', colSpan: 4 }, {}, {}, {}, this.currencyPipe.transform(this.products.reduce((sum, p) => sum + (p.qty * (p.price + p.taxPrice)), 0), 'INR')]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
          text: 'Additinal details',
          margin: [0, 0, 0, 15]
        },
        {
          columns: [
            [{ qr: `${'Ranjith'}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true }],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
          ul: [
            'Order can be return in max 10 days.',
            'Warrenty of the product will be subject to the manufacturer terms and conditions.',
            'This is system generated invoice.',
          ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15, 0, 15]
        }
      }
    };

    if (action === 'download') {
      pdfMake.createPdf(docDefinition).download();
    } else if (action === 'print') {
      pdfMake.createPdf(docDefinition).print();
    } else {
      pdfMake.createPdf(docDefinition).open();
    }
    this.afterInvoice.emit(true);

  }

}
