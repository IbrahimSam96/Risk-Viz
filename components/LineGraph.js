
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import React, { useEffect, useState } from "react";
import { useData } from '../DataFetcher';




const LineGraph = ({ type }) => {

    const Data = useData();
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {


        if (Data.length > 0 && type) {

            let finalArray = []

            const filtered = [];
            const filteredFactors = [];

            const hash = {};
            for (let i = 0; i < Data.length; i++) {
                hash[Data[i]['Year']] = true;
            }

            const uniqueArr = Object.keys(hash).map(String);



            for (let c = 0; c < uniqueArr.length; c++) {
                let nRecords = 0;
                let totalRisk = 0;
                let CriteriaRiskFactors = {};

                let uniqueFactors = [];

                for (let k = 0; k < Data.length; k++) {

                    if (Data[k]['Year'] == uniqueArr[c] && Data[k][type.group] == type.value) {
                        nRecords++;
                        totalRisk += Number(Data[k]['Risk Rating']);

                        let factorsKey = Object.keys(JSON.parse(Data[k]["Risk Factors"]))
                        let factorsValue = Object.values(JSON.parse(Data[k]["Risk Factors"]))

                        for (let z = 0; z < factorsKey.length; z++) {
                            uniqueFactors.push({ factor: factorsKey[z], value: factorsValue[z] })
                        }


                        for (let c = 0; c < factorsKey.length; c++) {
                            CriteriaRiskFactors[factorsKey[c]] = factorsValue[c].toFixed(2)
                        }


                    }
                }


                let avgRisk = totalRisk / nRecords;

                filtered.push({
                    x: new Date(uniqueArr[c]).getTime(),
                    y: Number(avgRisk.toFixed(3)),
                    ...CriteriaRiskFactors
                })


                let riskFactors = {};

                for (let g = 0; g < uniqueFactors.length; g++) {
                    riskFactors[uniqueFactors[g]['factor']] = true;
                }


                const unique = Object.keys(riskFactors).map(String);
                let factorsdata = []

                // For every factor calculate overall risk 
                for (let b = 0; b < unique.length; b++) {
                    let risk = 0;
                    let nRecords = 0;

                    for (let h = 0; h < uniqueFactors.length; h++) {
                        if (uniqueFactors[h]['factor'] == unique[b]) {
                            risk += uniqueFactors[h]['value']
                            nRecords++
                        }
                    }

                    let avgRisk = risk / nRecords;

                    factorsdata.push({ factor: unique[b], average: avgRisk, year: uniqueArr[c] });

                }

                // console.log(uniqueArr[c], factorsdata)

                for (let z = 0; z < factorsdata.length; z++) {
                    filteredFactors.push({ x: uniqueArr[c], y: factorsdata[z]['average'], name: factorsdata[z]['factor'] })
                }



            }

            let series = {}

            for (let x = 0; x < filteredFactors.length; x++) {
                const datum = filteredFactors[x];

                if (!series[datum['name']]) {
                    series[datum['name']] = {}
                }
                if (!series[datum['name']]['data']) {
                    series[datum['name']]['data'] = []
                }
                series[datum.name]['name'] = datum.name
                series[datum.name]['data'].push({ x: new Date(datum.x).getTime(), y: Number(datum.y.toFixed(3)) })

            }

            finalArray.push({ name: type.value, data: filtered }, ...Object.values(series))

            // console.log(finalArray)
            setFilteredData(finalArray)
        }


    }, [Data, type])



    const options = {
        chart: {
            type: 'line',
            zoomType: 'x',
            backgroundColor: "transparent",

        },
        title: {
            text: `Average Risk Rating Over Time (Deacade)`,
            style: {
                color: "teal",
                fontSize: "1em",
                fontWeight: "bold"
            }
        },
        subtitle: {
            text: type && `${type.group} - ${type.value}`,
            style: {
                fontSize: "1em",
                fontWeight: "bold"
            }
        },
        xAxis: {
            type: 'datetime',
            visible: true,
            // gridLineColor: 'transparent',
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
                // console.log(this.point)

                let factorsKeys = Object.keys(this.point.options)
                let factorsValues = Object.values(this.point.options)

                let tooltip = ""

                for (let k = 0; k < factorsKeys.length; k++) {

                    if ((factorsKeys[k] != "y") && (factorsKeys[k] != "x")) {

                        tooltip += `${factorsKeys[k]} : ${factorsValues[k]} <br>`
                    }
                }
                return `Average Risk Rating ` + `<b> ${this.y} </b> `+ '<br> <br>' + tooltip;

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
export default LineGraph;
