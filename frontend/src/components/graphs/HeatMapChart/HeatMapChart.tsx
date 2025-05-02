import LoadingOverlay from "@achmadk/react-loading-overlay";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
  TooltipDataAttrs,
} from "react-calendar-heatmap";
import { Tooltip as ReactToolTip } from "react-tooltip";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  isLoading: boolean;
}

const HeatMapChart = ({
  startDate,
  endDate,
  title,
  data,
  className,
  description,
  isLoading,
}: HeatMapChartProps) => {
  const handleToolTip = (value?: ReactCalendarHeatmapValue<string>) => {
    return {
      "data-tooltip-content": `${value?.date ? new Date(value.date).toDateString() + " -" : ""} ${
        value?.count ?? 0
      } contributions`,
      "data-tooltip-id": "calendar-heatmap-tooltip",
    } as TooltipDataAttrs;
  };

  return (
    <Card className={`heatmap-chart ${className}`}>
      <CardHeader
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        <div className="w-max rounded-lg bg-gray-900 p-5 text-white">
          <FontAwesomeIcon icon={faLayerGroup} className="h-6 w-6" />
        </div>
        <div>
          <div className="font-semibold text-xl">{title}</div>
          <div color="gray" className="font-normal">
            {description ?? ""}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-2 px-3 pb-0 flex flex-col justify-center flex-grow gap-2">
        <LoadingOverlay
          active={isLoading}
          spinner
          text="Loading contributors..."
          className="h-full w-full overflow-x-hidden pr-1 flex flex-col gap-3 justify-center"
        >
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={data}
            tooltipDataAttrs={handleToolTip}
            gutterSize={2}
            classForValue={(value) => {
              if (!value) {
                return "color-empty";
              }
              return `color-scale-${Math.min(5, value.count)}`;
            }}
          />
          <div className="flex justify-end w-full items-center gap-3">
            <div className="font-small">Less</div>
            <div className="flex gap-1 heatmap-legend">
              <HeatMapSquare className="color-empty" />
              <HeatMapSquare className="color-scale-1" />
              <HeatMapSquare className="color-scale-2" />
              <HeatMapSquare className="color-scale-3" />
              <HeatMapSquare className="color-scale-4" />
              <HeatMapSquare className="color-scale-5" />
            </div>
            <div className="font-small">More</div>
          </div>
        </LoadingOverlay>
      </CardContent>
      <ReactToolTip id="calendar-heatmap-tooltip" />
    </Card>
  );
};

interface HeatMapSquareProps {
  className: string;
}

const HeatMapSquare = ({ className }: HeatMapSquareProps) => {
  return <div className={`w-3 h-3 md:w-4 md:h-4 ${className}`}></div>;
};

export default HeatMapChart;
