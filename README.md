# Risk-Viz

A data visualization assesment displaying climate risk score, risk factors and overall risk rating for businesses. 

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`NEXT_PUBLIC_GOOGLE_SHEETS_API`


## Tech Stack

**Client:** React, NextJs, TailwindCSS, @mui/material, mui-datatables,highcharts, leaflet. 

## Acknowledgements
- **Risk Over Time with Line Graphs:** I aggregated all selected criteria data points and calculated the overall average risk rating for a given period. I aslo, exposed all risk factors, calculated their average risk rating for the selected criteria & period of time.   


I used ChatGPT to generate this snippet of code for generating a color scale based on risk level. The higher the risk the more red color is.  

<img src="https://github.com/IbrahimSam96/Risk-Viz/blob/main/public/carbon.svg" width="600">

## Assesment Data 

https://docs.google.com/spreadsheets/d/1Y_yiT-_7IimioBvcqiCPwLzTLazfdRyzZ4k3cpQXiAw/edit#gid=681415175
