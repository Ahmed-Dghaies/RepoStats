import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, CardBody, CardHeader, Typography } from "@material-tailwind/react";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
  TooltipDataAttrs,
} from "react-calendar-heatmap";
import { Tooltip as ReactToolTip } from "react-tooltip";

interface HeatMapEvent {
  date: string;
  count: number;
}
interface HeatMapChartProps {
  title: string;
  startDate: Date;
  endDate: Date;
  data: HeatMapEvent[];
  className: string;
  description?: string;
}

const HeatMapChart = ({
  startDate,
  endDate,
  title,
  data,
  className,
  description,
}: HeatMapChartProps) => {
  const handleToolTip = (value?: ReactCalendarHeatmapValue<string>) => {
    return {
      "data-tooltip-content": `${value?.count ?? 0} contributions`,
      "data-tooltip-id": "calendar-heatmap-tooltip",
    } as TooltipDataAttrs;
  };

  return (
    <Card className={`heatmap-chart ${className}`}>
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
      <CardBody className="p-2 px-3 pb-0 flex flex-col justify-center flex-grow">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={data}
          showWeekdayLabels
          tooltipDataAttrs={handleToolTip}
          weekdayLabels={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
          gutterSize={2}
          classForValue={(value) => {
            if (!value) {
              return "color-empty";
            }
            return `color-scale-${Math.min(5, value.count)}`;
          }}
        />
      </CardBody>
      <ReactToolTip id="calendar-heatmap-tooltip" />
    </Card>
  );
};

export default HeatMapChart;
