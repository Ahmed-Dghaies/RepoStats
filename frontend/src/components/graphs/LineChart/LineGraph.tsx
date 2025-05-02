import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactApexChart, { Props as ChartOptions } from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export interface ChartLine {
  name: string;
  data: number[];
}

interface LineChartProps {
  title: string;
  data: ApexOptions["series"];
  keys: string[];
  className: string;
  description?: string;
  yAxis: {
    maximumValue: number;
    minimumValue: number;
  };
}

const LineGraph = ({
  title,
  data,
  keys,
  className,
  description,
  yAxis: { maximumValue, minimumValue },
}: LineChartProps) => {
  const chartConfig: ChartOptions = {
    type: "line",
    height: 260,
    series: data,
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: data?.map((dataRow: any) => dataRow.color),
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: keys,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        max: Math.ceil(maximumValue + maximumValue * 0.2),
        min: minimumValue ?? undefined,
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        shared: true,
        theme: "light",
        intersect: false,
        cssClass: "tooltip-container",
      },
    },
  };

  return (
    <Card className={`line-chart ${className}`}>
      <CardHeader
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <FontAwesomeIcon icon={faLayerGroup} className="h-6 w-6" />
        </div>
        <div>
          <div className="font-semibold text-xl">{title}</div>
          <div className="max-w-sm font-normal">{description ?? ""}</div>
        </div>
      </CardHeader>
      <CardContent className="p-2 px-2 pb-0">
        <ReactApexChart {...chartConfig} />
      </CardContent>
    </Card>
  );
};

export default LineGraph;
