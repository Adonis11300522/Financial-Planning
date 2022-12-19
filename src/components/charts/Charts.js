import Chart from "react-apexcharts";

export const PieChart = ({data, height}) => {
    const Option = {
        chart: {
          type: "donut",
          width: "100%",
          // offsetY: 30,
        },
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          pie: {
            donut: {
              size: "75%",
              labels: {
                show: true,
                value: {
                  fontSize: "24px",
                  fontWeight: 900,
                  color: "#000",
                  offsetY: -5,
                },
                total: {
                  show: false,
                },
              },
            },
            offsetY: 0,
          },
        },
        states: {
          normal: { filter: { type: "darken", value: 1 } },
          hover: { filter: { type: "lighten", value: 0.1 } },
          active: { filter: { type: "darken", value: 1 } },
        },
        colors: ["#ff0000", "#00B163", "#0000ff"],
        stroke: { width: 0 },
        legend: {
          show: true,
          position: "bottom",
          markers: {
            width: 7,
            height: 7,
            radius: 12,
          },
        },
        tooltip: {
          enabled: true,
        },
        labels: ["Expense", "Saving", "Investment"],
      };

    return(
        <Chart
              options={Option}
              series={data}
              height={height}
              type="donut"
            />
    )
}

export const PortfolioChart = ({data, height}) => {

    const Option = {
          chart: {
            type: 'bar',
            toolbar : false
            // height: 350
          },
          plotOptions: {
            bar: {
              borderRadius: 5,
              horizontal: false,
            }
          },
          colors: ["#ff0000", "#808080", "#0000ff"],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            position: "bottom",
            markers: {
              width: 7,
              height: 7,
              radius: 12,
            },
          },
          xaxis: {
            show : false,
            categories: [""],
          }
      };

    return(
        <Chart
              options={Option}
              series={data}
              height={height}
              type="bar"
            />
    )
}

export const TotalIncomeChart = ({data, height}) => {

    const Option = {
          chart: {
            type: 'bar',
            height: 350,
            toolbar : false
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
            }
          },
          colors: ["#ff0000", "#808080", "#0000ff", "#00B163"],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            position: "bottom",
            markers: {
              width: 7,
              height: 7,
              radius: 12,
            },
          },
          xaxis: {
            show : false,
            categories: [""],
          }
      };

    return(
        <Chart
              options={Option}
              series={data}
              height={height}
              type="bar"
            />
    )
}

export const InvestmentChart = ({data, height}) => {

    const Option = {
          chart: {
            type: 'bar',
            height: 350,
            toolbar : false
          },
          plotOptions: {
            bar: {
              borderRadius: 4,
              horizontal: false,
            }
          },
          colors: ["#ff0000", "#808080", "#0000ff", "#00B163"],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: true,
            position: "bottom",
            markers: {
              width: 7,
              height: 7,
              radius: 12,
            },
          },
          xaxis: {
            show : false,
            categories: [""],
          }
      };

    return(
        <Chart
              options={Option}
              series={data}
              height={height}
              type="bar"
            />
    )
}