import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import ReactApexChart, { Props as ChartOptions } from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { BASE_CHART_COLORS } from "./constants";

interface DonutChartProps {
  title: string;
  data: ApexOptions["series"];
  labels: string[];
  className: string;
  description?: string;
}

const DonutChart = ({ title, data, labels, className, description }: DonutChartProps) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const hasValidLabels =
    Array.isArray(labels) && labels.length === (Array.isArray(data) ? data.length : 0);

  const colors = hasData
    ? data.map((_, index) => BASE_CHART_COLORS[index % BASE_CHART_COLORS.length])
    : BASE_CHART_COLORS;

  const chartConfig: ChartOptions = {
    type: "donut",
    height: 260,
    series: data,
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        y: {
          formatter: (val) => `${val}%`,
        },
      },
      labels: hasValidLabels ? labels : [],
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}%`,
      },
      colors: colors,
      legend: {
        position: "bottom",
      },
    },
  };
  return (
    <Card className={`donut-chart ${className}`}>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <FontAwesomeIcon icon={faLayerGroup} className="h-6 w-6" />
        </div>
        <div>
          <Typography variant="h6" color="blue-gray">
            {title}
          </Typography>
          <Typography variant="small" color="gray" className="max-w-sm font-normal">
            {description ?? ""}
          </Typography>
        </div>
      </CardHeader>
      <CardBody className="p-2 px-2 pb-0">
        <ReactApexChart {...chartConfig} />
      </CardBody>
    </Card>
  );
};

export default DonutChart;
