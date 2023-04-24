
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import React, { useEffect, useState } from "react";
import GSheetReader from 'g-sheets-api'
import { useData } from '../DataFetcher';



const Chart2 = () => {
    const getData = useData();


    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);

    console.log("dATA",getData)
    useEffect(() => {

        const options = {
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API,
            sheetId: '1Y_yiT-_7IimioBvcqiCPwLzTLazfdRyzZ4k3cpQXiAw',
            sheetNumber: 1,
            sheetName: 'sample_data', // if sheetName is supplied, this will take precedence over sheetNumber
            returnAllResults: true,
        }

        GSheetReader(
            options,
            results => {

                // Finds Unique Asset Names 
                const hash = {};
                for (let i = 0; i < results.length; i++) {
                    hash[results[i]["Asset Name"]] = true;
                }

                const uniqueArr = Object.keys(hash).map(String);
                setColumns(uniqueArr)
                console.log(uniqueArr)

                // console.log(Object.keys(JSON.parse(results[0]["Risk Factors"])))
                // console.log(Object.values(JSON.parse(results[0]["Risk Factors"])))

                const filtered = [];
                let categoryName = "";
                let categoryData = [];

                for (let b = 0; b < uniqueArr.length; b++) {

                    categoryName = uniqueArr[b];

                    for (let i = 0; i < results.length; i++) {
                        if (results[i]["Year"] == "2040" && results[i]["Asset Name"] == uniqueArr[b]) {

                            let riskFactors = {};

                            let factorsKey = Object.keys(JSON.parse(results[i]["Risk Factors"]))
                            let factorsValue = Object.values(JSON.parse(results[i]["Risk Factors"]))

                            for (let c = 0; c < factorsKey.length; c++) {
                                riskFactors[factorsKey[c]] = factorsValue[c].toFixed(2)
                            }
                            riskFactors['y'] = Number(results[i]['Risk Rating']);
                            riskFactors['Asset Name'] = results[i]['Asset Name'];

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
                        visible: false

                    })
                }

                setData(filtered)
                // console.log(filtered)
            },
            error => {
                // OPTIONAL: handle errors here
            });

    }, [])

    const options = {
        chart: {
            type: 'line',
            zoomType: 'x',
        },
        title: {
            text: 'Risk Rating By Asset Name '
        },
        subtitle: {
            text: '(Select Asset Name From Legend To View Data)'
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

                    if ((factorsKeys[k] != "y") && (factorsKeys[k] != "Asset Name")) {
                        tooltip += `${factorsKeys[k]} : ${factorsValues[k]} <br>`
                    }
                }
                return `<b> ${this.point.options['Asset Name']} </b> <br> Risk Rating` + `<b> ${this.y}</b>` + '<br> <br>' + tooltip;
            }
        },
        plotOptions: {
            series: {
                pointStart: new Date('2030').getTime(),
                boostThreshold: 1000
            },
        },
        series: data
    }


    return (
        <React.Fragment >

            {data.length < 0 ?

                <>
                    <span className={`flex mx-auto p-6 bg-[grey] w-[30%] h-[35px] rounded animate-pulse `}>  </span>
                    <span className={`flex mx-auto p-6 bg-[grey] w-[20%] h-[30px] rounded animate-pulse my-2 `}>  </span>

                    <span className={`flex mx-auto p-6 bg-[grey] w-[75%] h-[35%] rounded animate-pulse my-2 `}>  </span>

                </>
                :

                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            }

        </React.Fragment>
    )
}
export default Chart2;