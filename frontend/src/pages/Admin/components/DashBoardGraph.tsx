import { Chart } from "chart.js/auto";
import { format } from "date-fns";
import React, { useEffect } from "react";

const DashBoardGraph: React.FC<{
  appointmentDates: any[];
  appointmentStatus: any[];
}> = ({ appointmentDates, appointmentStatus }) => {
  useEffect(() => {
    drawChart();
  }, [appointmentDates]);

  // Doughnut chart data by appointment status
  const getStatus = () => {
    const appointment_status = {};
    appointmentStatus &&
      appointmentStatus.forEach((element) => {
        const status = element?.status;
        appointment_status[status] = (appointment_status[status] || 0) + 1;
      });
    return appointment_status;
  };

  const data = getStatus();
  const Keys = Object.keys(data);
  const Values = Object.values(data);
  const colors = [
    "rgba(0, 122, 255, 1)", // Blue
    "rgba(255, 99, 132, 1)", // Red
    "rgba(4, 200, 235, 1)", // Light Blue
    "rgba(255, 206, 86, 1)", // Yellow
    "rgba(153, 102, 255, 1)", // Purple
    "rgba(255, 159, 64, 1)", // Orange
  ];

  useEffect(() => {
    const bloodctx = document.getElementById("bloodChart") as HTMLCanvasElement;
    const existingChart = Chart.getChart(bloodctx);
    if (existingChart) {
      existingChart.destroy();
    }
    if (bloodctx) {
      try {
        new Chart(bloodctx, {
          type: "doughnut",
          data: {
            labels: Keys,
            datasets: [
              {
                label: "Appointment Status",
                data: Values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, [Keys, Values]);

  // Line graph data by month
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getEachMonthDates = () => {
    const eachMonth = {};
    appointmentDates &&
      appointmentDates.forEach((element) => {
        const month = parseInt(
          format(new Date(element.requested_date), "MM"),
          10
        );
        eachMonth[month] = (eachMonth[month] || 0) + 1;
      });
    return Array.from({ length: 12 }, (_, index) => ({
      month: monthNames[index],
      numberOfAppointments: eachMonth[index + 1] || 0,
    }));
  };

  const drawChart = () => {
    const cbx = document.getElementById("myChart") as HTMLCanvasElement;
    const existingChart = Chart.getChart(cbx);
    if (existingChart) {
      existingChart.destroy();
    }

    const collectionData = getEachMonthDates();

    if (cbx) {
      try {
        new Chart(cbx, {
          type: "line",
          data: {
            labels: collectionData.map((item) => item.month),
            datasets: [
              {
                label: "Appointments",
                data: collectionData.map((item) => item.numberOfAppointments),
                borderColor: "#07332F",
                borderWidth: 2,
                hoverBorderColor: "rgba(12, 12, 12, 0.7)",
                backgroundColor: "#07332F",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      } catch (error) {
        console.error("Error creating chart:", error);
      }
    }
  };

  return (
    <div className="w-full flex-col 1100px:flex-row flex mb-8 bg-white rounded-md shadow-md px-6 py-8">
      {/* Line Graph Section */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="w-full h-[300px] 1100px:h-[400px]">
          <canvas id="myChart" className="w-full h-full"></canvas>
        </div>
      </div>

      {/* Doughnut Chart and Legend Section */}
      <div className="flex flex-col items-center justify-center w-full 1100px:w-1/3 mt-8 1100px:mt-0">
        <div className="w-full h-[300px] flex items-center justify-center">
          <canvas id="bloodChart" className="w-full h-full"></canvas>
        </div>
        <div className="w-full mt-4 space-y-2">
          {Keys.map((key, index) => (
            <p
              className="font-normal text-sm select-none flex items-center"
              key={index}
            >
              <span
                style={{
                  backgroundColor: colors[index],
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  marginRight: "10px",
                }}
              ></span>
              <strong>{key}</strong> - {Values[index]}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashBoardGraph;
