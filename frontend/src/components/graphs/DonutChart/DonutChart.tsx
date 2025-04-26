import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import ReactApexChart, { Props as ChartOptions } from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface DonutChartProps {
  title: string;
  data: ApexOptions["series"];
  labels: string[];
  className: string;
  description?: string;
}

const CHART_COLORS = ["#5E2BFF", "#C04CFD", "#DE5DD4", "#FC6DAB", "#FC6DAB", "#FAB2B8", "#DCA1E1"];

const DonutChart = ({ title, data, labels, className, description }: DonutChartProps) => {
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
      labels: labels,
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val}%`,
      },
      colors: CHART_COLORS,
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
