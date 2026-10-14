import { useState } from "react";

function SpeedHistoryChart({ history }) {
  const chartWidth = 700;
  const chartHeight = 280;

  const paddingLeft = 65;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 55;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  const [activePoint, setActivePoint] = useState(null);

  if (!history || history.length === 0) {
    return (
      <section className="chart-panel">
        <h2>Speed History</h2>

        <p className="chart-empty">
          Run a speed test to see your chart.
        </p>
      </section>
    );
  }

  // Display older tests first.
  const tests = [...history].reverse();

  // Convert bits per second to Mbps.
  const downloadValues = tests.map(
    (test) => test.download / 1_000_000
  );

  const uploadValues = tests.map(
    (test) => test.upload / 1_000_000
  );

  const maxSpeed = Math.max(
    1,
    ...downloadValues,
    ...uploadValues
  );

  const axisMax = Math.ceil(maxSpeed / 10) * 10;

  function getX(index) {
    if (tests.length === 1) {
      return paddingLeft + plotWidth / 2;
    }

    return (
      paddingLeft +
      (index / (tests.length - 1)) * plotWidth
    );
  }

  function getY(speed) {
    return (
      paddingTop +
      plotHeight -
      (speed / axisMax) * plotHeight
    );
  }

  function createPoints(values) {
    return values
      .map((value, index) => `${getX(index)},${getY(value)}`)
      .join(" ");
  }

  function formatDate(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(date) {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown time";
    }

    return parsedDate.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  const gridLines = 4;

  const selectedTest =
    activePoint !== null ? tests[activePoint.index] : null;

  return (
    <section className="chart-panel">
      <div className="chart-header">
        <div>
          <h2>Speed History</h2>

          <p>Compare your download and upload speeds.</p>
        </div>
      </div>

      <div className="chart-legend">
        <span>
          <i className="legend-dot download-dot" />
          Download (Mbps)
        </span>

        <span>
          <i className="legend-dot upload-dot" />
          Upload (Mbps)
        </span>
      </div>

      <div className="chart-container">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="group"
          aria-label="Interactive chart showing download and upload speeds"
          className="speed-chart"
        >
          {/* Horizontal grid lines and axis labels */}
          {Array.from({ length: gridLines + 1 }, (_, index) => {
            const speed = (axisMax / gridLines) * index;
            const y = getY(speed);

            return (
              <g key={index}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
                  y2={y}
                  className="chart-grid-line"
                />

                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-axis-label"
                >
                  {speed.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Download line */}
          <polyline
            points={createPoints(downloadValues)}
            className="chart-line download-line"
          />

          {/* Upload line */}
          <polyline
            points={createPoints(uploadValues)}
            className="chart-line upload-line"
          />

          {/* Interactive data points */}
          {tests.map((test, index) => {
            const x = getX(index);

            const downloadY = getY(downloadValues[index]);
            const uploadY = getY(uploadValues[index]);

            const downloadActive =
              activePoint?.index === index &&
              activePoint?.type === "download";

            const uploadActive =
              activePoint?.index === index &&
              activePoint?.type === "upload";

            return (
              <g key={test.id ?? index}>
                <circle
                  cx={x}
                  cy={downloadY}
                  r={downloadActive ? 7 : 5}
                  className="chart-point download-point"
                  tabIndex={0}
                  role="button"
                  aria-label={`Download ${downloadValues[index].toFixed(2)} Mbps`}
                  onMouseEnter={() =>
                    setActivePoint({
                      index,
                      type: "download",
                    })
                  }
                  onMouseLeave={() => setActivePoint(null)}
                  onFocus={() =>
                    setActivePoint({
                      index,
                      type: "download",
                    })
                  }
                  onBlur={() => setActivePoint(null)}
                  onClick={() =>
                    setActivePoint({
                      index,
                      type: "download",
                    })
                  }
                />

                <circle
                  cx={x}
                  cy={uploadY}
                  r={uploadActive ? 7 : 5}
                  className="chart-point upload-point"
                  tabIndex={0}
                  role="button"
                  aria-label={`Upload ${uploadValues[index].toFixed(2)} Mbps`}
                  onMouseEnter={() =>
                    setActivePoint({
                      index,
                      type: "upload",
                    })
                  }
                  onMouseLeave={() => setActivePoint(null)}
                  onFocus={() =>
                    setActivePoint({
                      index,
                      type: "upload",
                    })
                  }
                  onBlur={() => setActivePoint(null)}
                  onClick={() =>
                    setActivePoint({
                      index,
                      type: "upload",
                    })
                  }
                />

                <text
                  x={x}
                  y={chartHeight - 20}
                  textAnchor="middle"
                  className="chart-axis-label"
                >
                  {new Date(test.date).toLocaleDateString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Interactive tooltip */}
        {selectedTest && (
          <div className="chart-tooltip" role="status">
            <strong>Test Details</strong>

            <p>
              <span>Date:</span>
              {formatDate(selectedTest.date)}
            </p>

            <p>
              <span>Time:</span>
              {formatTime(selectedTest.date)}
            </p>

            <p>
              <span>Download:</span>
              {downloadValues[activePoint.index].toFixed(2)} Mbps
            </p>

            <p>
              <span>Upload:</span>
              {uploadValues[activePoint.index].toFixed(2)} Mbps
            </p>

            <small>
              Selected:{" "}
              {activePoint.type === "download"
                ? "Download"
                : "Upload"}
            </small>
          </div>
        )}
      </div>

      <p className="chart-note">
        The chart displays up to {tests.length} saved tests.
        Hover over a data point to see its details.
      </p>
    </section>
  );
}

export default SpeedHistoryChart;