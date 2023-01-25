import { serializeNodes } from '@angular/compiler/src/i18n/digest';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CommonFunctionsService {
  readonly DELIMITER = "-";
  constructor() {}
  arr = [
    {
      name: "No Of Issues",
      plot: ["Issues"],
      series: "Issues",
    },
    {
      name: "Percentage (%)",
      plot: ["Percentage (%)"],
      series: "Percentage (%)",
    },
  ];
  //TIME HANDLING
  convertObjToTime(obj: {
    hour: string;
    minute: string;
    second: string;
  }): any {
    if(Object.keys(obj).length > 0)
      return String(obj.hour).padStart(2, "0") + ":" + String(obj.minute).padStart(2, "0") + ":" + String(obj.second).padStart(2, "0");
    
    return null;
  }

  convertTimeToObj(time: string): object {
    if (time == "" || time == null) return {};

    var data = time.split(":");
    var obj = {
      hour: parseInt(data[0]),
      minute: parseInt(data[1]),
      second: parseInt(data[2]),
    };

    return obj;
  }

  //DATE HANDLING
  convertStringToDate(date: string): object {
    if (date == "" || date == null) return {};

    var fdate = new Date(date);
    return {
      day: fdate.getDate(),
      month: fdate.getMonth() + 1,
      year: fdate.getFullYear(),
    };
  }

  convertDateToString(date: any): string {
    return (
      date.year +
      this.DELIMITER +
      String(date.month).padStart(2, "0") +
      this.DELIMITER +
      String(date.day).padStart(2, "0")
    );
  }

  //DATETIME HANDLING
  convertDateTimeToString(datetime: any): string {
    if (datetime == "" || datetime == null) return datetime;

    var date = new Date(datetime);
    var final = "";
    final =
      String(date.getDate()).padStart(2, "0") +
      this.DELIMITER +
      String(date.getMonth() + 1).padStart(2, "0") +
      this.DELIMITER +
      date.getFullYear() +
      " " +
      String(date.getHours()).padStart(2, "0") +
      ":" +
      String(date.getMinutes()).padStart(2, "0") +
      ":" +
      String(date.getSeconds()).padStart(2, "0");
    return final;
  }

  convertStringToDateTime(datetime: string): string {
    if (datetime==""|| datetime==null) return datetime;
    var arr = datetime.split(" ");
    var date = arr[0].split("-");
    var final = "";
    final =
      date[2] +
      this.DELIMITER +
      String(date[1]).padStart(2, "0") +
      this.DELIMITER +
      String(date[0]).padStart(2, "0") +
      " " +
      arr[1];
    return final;
  }

  //SORTING BASED ON x type DATE for graphs
  sortArray(data: any): Array<any> {
    data.sort((a: any, b: any) => {
      var parts = a.x.split("-");
      var string = parts[2] + "-" + parts[1] + "-" + parts[0];
      const date1 = new Date(string);
      parts = b.x.split("-");
      string = parts[2] + "-" + parts[1] + "-" + parts[0];
      const date2 = new Date(string);
      return <any>date1 - <any>date2;
    });
    return data;
  }

  sortColumnObj(columnGraphData: any): any {
    for (var i = 0; i < columnGraphData["series"].length; i++) {
      columnGraphData["series"][i].data = this.sortArray(
        columnGraphData["series"][i].data
      );
    }

    return columnGraphData;
  }

  convertToPieChartObject(data: any) {
    var obj: any = {
      series: [],
      labels: [],
      height: window.innerHeight * 20 / 100,
      show : false
    };

    for (var i = 0; i < data.length; i++) {
      if(data[i].y > 0){
        obj.show = true;
        obj.labels.push(data[i].x);
        obj.series.push(data[i].y);
      }
    }

    return obj;
  }
  countTotalFaults(data: any): number {
    var sum = 0;
    for (var i = 0; i < data.length; i++) {
      sum += data[i].y;
    }

    return sum;
  }

  //MULTISELECT HANDLING
  convertArrayToInt(data: any): Array<any> {
    for (var i = 0; i < data.length; i++) {
      data[i] = parseInt(data[i]);
    }
    return data;
  }

  //MAX VALUE OF GRAPH
  calculateMax(data: any): number {
    let totalArr: Array<any> = [];
    for (var i = 0; i < data.length; i++) {
      totalArr = totalArr.concat(data[i].data);
    }
    return Math.max.apply(
      Math,
      totalArr.map(function (o: any) {
        return o.y;
      })
    );
  }

  //TO GET THE OBJECT OF YAXIS
  getYaxis(data: any): any {
    let yAxisArr: Array<any> = [];

    for (var i = 0; i < data.yAxis.length; i++) {
      let obj: any;
      let text = data.yAxis[i].name;
      let seriesName = data.yAxis[i].series;
      let seriesData: Array<any> = [];
      let decimal = data.yAxis[i].decimal;
      for (var j = 0; j < data.yAxis[i].plot.length; j++) {
        let seriesObj = data.series.find(
          (obj: any) => obj.name == data.yAxis[i].plot[j]
        );
        seriesData.push(seriesObj);
      }

      let max = this.calculateMax(seriesData);
      
      for (var z = 0; z < data.yAxis[i].plot.length; z++) {
        
        obj = {
          forceNiceScale: false,
          title: {
            text: text,
          },
          seriesName: seriesName,
          max: (max)? max : 100,
          labels: {
            formatter: function(val: any, index: any) {
              return (val) ? val.toFixed(decimal) : val;
            }
          }
        };
        if (i > 0) obj["opposite"] = true;
        if (z == 0) {
          obj["show"] = true;
        } else {
          obj["show"] = false;
        }
        yAxisArr.push(obj);
      }
    }

    return yAxisArr;
  };

  //SORT ARRAY BASED ON sort_seq/name
  sortMultiArray(data: any): any {
    var type = '', fa, fb;

    if(typeof data[0].sort_seq == 'string')
      type = 'string';

    data.sort((a: any,b: any)=>{
      if(a.sort_seq && b.sort_seq && type != 'string'){
        return a.sort_seq - b.sort_seq;
      }
      else if(a.sort_seq && b.sort_seq && type == 'string'){
        fa = a.sort_seq.toLowerCase();
        fb = b.sort_seq.toLowerCase();
      }
      else {
        fa = a.name.toLowerCase();
        fb = b.name.toLowerCase();
      }
      if (fa < fb) {
        return -1;
      }
      else if (fa > fb) {
          return 1;
      }
      return 0;
      
    });
    return data;
  };

  sortByDate(data: any): any{
    data.sort((a: any, b: any) => {
      
      const date1 = new Date(a.x);
      const date2 = new Date(b.x);

      return <any>date1 - <any>date2;
    });
    return data;
  };
  
  modifySeries(series: any, type: string): any{

    for(var i = 0 ; i < series.length ; i++){
      if(series[i].data === null){
        series.splice(i,1);
        i--;
      }else{
        switch (type) {
          case 'date':
            series[i].data = this.sortByDate(series[i].data);
            break;
        
          default:
            break;
        }
      }
    }

    return series;
  }

  checkLevel(value: any): string{
    if (-value <-100){
      return 'level1';
    }
    else if (-value <= -86 && -value >= -100)
      return 'level2';
    else if (-value < -70 && -value>=-85)
      return 'level3';
    else if (-value >= -70)
      return 'level4';

    return '';
  };

  lastSync(data: any): string{

    var timeval: any;
    if(data == null)
      return 'NA'
    if (typeof data == 'object') {
        timeval = data;
        if (timeval === null)
            return "NA"
    } else {
        timeval = data;
    }
    var currentDate = new Date(timeval * 1000);
    var localTime = currentDate.getTime();
    
    var localOffset = currentDate.getTimezoneOffset() * 60000;
    var utc = localTime + localOffset;
    timeval = utc;
    var a: any = new Date();
    var b: any = new Date(timeval)
    var seconds = Math.floor((a-b) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
        return interval + " years ago";
    }
    if (interval === 1) {
        return interval + " year ago";
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months ago";
    }
    if (interval === 1) {
        return interval + " month ago";
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days ago";
    }
    if (interval === 1) {
        return interval + " day ago";
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours ago";
    }
    if (interval === 1) {
        return interval + " hour ago";
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes ago";
    }
    if (interval === 1) {
        return interval + " minute ago";
    }
    return Math.floor(seconds) + " seconds ago";
  }

  convertToProperDate(data:any):any{
    if(data)
      return new Date(data);
    return 'NA';
  };

  modifyCodetoInt(data: any): any{
    data.map(item => {
      item.code = parseInt(item.code);
    });

    return data;
  }

  toTitleCase(phrase: string): string{
    return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
