
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import React, { useEffect, useState } from "react";
import { useData } from '../DataFetcher';


const Chart = ({ activeYear, type }) => {

    const Data = useData();

    const [filteredData, setFilteredData] = useState([]);


    useEffect(() => {

        if (Data.length > 0 && activeYear) {

            // Finds Unique Business Categories / Asset Name / Lat etc..
            const hash = {};
            for (let i = 0; i < Data.length; i++) {
                hash[Data[i][type]] = true;
            }

            const uniqueArr = Object.keys(hash).map(String);
            // console.log(uniqueArr)

            // console.log(Object.keys(JSON.parse(Data[0]["Risk Factors"])))
            // console.log(Object.values(JSON.parse(Data[0]["Risk Factors"])))

            const filtered = [];
            let categoryName = "";
            let categoryData = [];
            // Creates a series for each Category {name:"categoryname", categoryData:[{y:"riskfactor value", ...RiskFactors}]}  
            for (let b = 0; b < uniqueArr.length; b++) {

                categoryName = uniqueArr[b];

                for (let i = 0; i < Data.length; i++) {
                    if (Data[i]["Year"] == activeYear && Data[i][type] == uniqueArr[b]) {

                        let riskFactors = {};

                        let factorsKey = Object.keys(JSON.parse(Data[i]["Risk Factors"]))
                        let factorsValue = Object.values(JSON.parse(Data[i]["Risk Factors"]))

                        for (let c = 0; c < factorsKey.length; c++) {
                            riskFactors[factorsKey[c]] = factorsValue[c].toFixed(2)
                        }
                        riskFactors['y'] = Number(Data[i]['Risk Rating']);
                        riskFactors['Asset Name'] = Data[i]['Asset Name'];
                        riskFactors['Year'] = Data[i]['Year'];

                        categoryData.push(riskFactors)

                    }
                }

                filtered.push({
                    name: categoryName,
                    data: categoryData.sort(function (x, y) {
                        if (x[0] === y[0]) {
                            return 0;
                        } else {
                            return x[0] < y[0] ? -1 : 1
                        }
                    }),
                    visible: type == "Asset Name" ? false : true,
                    // Datapoints above this range won't be displayed unless with only 2 dimensional array values. i,e no risk factors or other datapoints 
                    turboThreshold: 1500
                })
            }

            setFilteredData(filtered)
            // console.log(filtered)
        }

    }, [Data, activeYear, type])

    const options = {
        chart: {
            type: 'line',
            zoomType: 'x',
            backgroundColor: "transparent", 

        },
        title: {
            text: `Risk Rating By ${type} (${activeYear}) `,
            style: {
                color: "teal",
                fontSize: "1em",
                fontWeight:"bold"
            }
        },
        subtitle: {
            text: `${type == "Business Category" ? '(Highlight area for closer view)': type == 'Asset Name' ? '(Select Asset Name From Legend To View Data)': ""}`,
            style: {
                fontSize: "1em",
                fontWeight:"bold"
            }
        },

        xAxis: {
            type: 'datetime',
            visible: false,
            gridLineColor: 'transparent',
        },
        yAxis: {
            title: {
                text: 'Risk Rating'
            }
        },
        tooltip: {
            formatter: function () {
                // console.log(Object.keys(this.point.options))
                // console.log(Object.values(this.point.options))
                // console.log(this.point.options)

                let factorsKeys = Object.keys(this.point.options)
                let factorsValues = Object.values(this.point.options)
                let tooltip = ""
                for (let k = 0; k < factorsKeys.length; k++) {

                    if ((factorsKeys[k] != "y") && (factorsKeys[k] != "Asset Name") && (factorsKeys[k] != "Year")) {
                        tooltip += `${factorsKeys[k]} : ${factorsValues[k]} <br>`
                    }
                }
                return `<b> ${this.point.options['Asset Name']} - (${this.point.options['Year']}) </b> <br> Risk Rating` + `<b> ${this.y}</b>` + '<br> <br>' + tooltip;
            }
        },
        series: filteredData
    }

    return (
        <React.Fragment >
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </React.Fragment>
    )
}
export default Chart;