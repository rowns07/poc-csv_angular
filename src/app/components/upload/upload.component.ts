import { Component, OnInit, ViewChild } from '@angular/core';
import { TutorialModel } from 'src/app/models/tutorial-model';
import { CsvService } from 'src/app/services/csv.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  public records: any[] = [];
  public uploadCsv: TutorialModel;
  public valorTotal: number;
  @ViewChild('csvReader') csvReader: any;
  public testeTutorial: TutorialModel;

  constructor(public csvService: CsvService) { }

  ngOnInit(): void {
    this.teste();
  }

  uploadListener(event: any): void {

    let text = [];
    let files = event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData: any = reader.result;
        const csvRecordsArray: any[] = (csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };

    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any[], headerLength: any) {
    let csvArr: Array<TutorialModel> = [];
    let totalIdade: number[] = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (csvRecordsArray[i]).split(',');
      console.log("curruntRecord", curruntRecord);

      if (curruntRecord.length == headerLength) {
        let csvRecord: TutorialModel = new TutorialModel();
        csvRecord.id = curruntRecord[0];
        csvRecord.title = curruntRecord[1];
        csvRecord.description = curruntRecord[2].trim();
        csvRecord.published = curruntRecord[3].trim();
        this.uploadCsv = curruntRecord;

        csvArr.push(csvRecord);
        console.log('csvRecord', csvRecord);

        totalIdade.push(Number(curruntRecord[3]));

        this.valorTotal = totalIdade.reduce((valorAcumulado, proximoValor) => {
          return valorAcumulado + proximoValor
        })
      }
      console.log('VALOR TOTAL', this.valorTotal);
    }
    console.log('TESTE', csvArr);
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any[]) {
    let headers = (csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
  }

  teste() {
    this.csvService.list()
      .subscribe(dados => {
        console.log("DADOS BAIXADOS", dados)
      })
  }

  create() {
    const item: TutorialModel = {
      id: 23,
      title: "Criado Pelo Angular 2 ",
      description: "ANGULAR",
      published: true
    }

    this.csvService.newItem(item).subscribe({
      next: data => {
        console.log('DEU CERTO', data)
      }, error: error => {
        console.log(error)
      }
    });
    // this.teste();
    console.log('apertou')

  }
}
