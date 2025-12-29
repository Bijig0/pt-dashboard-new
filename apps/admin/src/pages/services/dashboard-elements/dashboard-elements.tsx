import { Card } from "flowbite-react";
import {
  HiCube,
  HiTrendingUp,
  HiUserGroup,
  HiCurrencyDollar,
  HiChartBar,
  HiClock
} from "react-icons/hi";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
import { useLocale } from "../../../context/LocaleContext";

const DashboardElements = () => {
  const { t } = useLocale();

  // Mock data for summary cards
  const summaryData = {
    totalEquipment: 24,
    activeRentals: 156,
    totalCompanies: 18,
    monthlyRevenue: 125500000,
    utilizationRate: 78,
    pendingInvoices: 5,
  };

  // Mock data for Rental Trends (Line Chart)
  const rentalTrendsOptions: ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: true,
      },
    },
    colors: ["#3b82f6", "#ef4444"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    title: {
      text: t.dashboardElements?.charts.rentalTrends || "Rental Trends (Last 6 Months)",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: 600,
      },
    },
    grid: {
      borderColor: "#e5e7eb",
    },
    markers: {
      size: 5,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      title: {
        text: t.dashboardElements?.charts.month || "Month",
      },
    },
    yaxis: {
      title: {
        text: t.dashboardElements?.charts.quantity || "Quantity",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
  };

  const rentalTrendsSeries = [
    {
      name: t.dashboardElements?.charts.equipmentOut || "Equipment Out (Keluar)",
      data: [120, 145, 132, 168, 155, 175],
    },
    {
      name: t.dashboardElements?.charts.equipmentIn || "Equipment In (Masuk)",
      data: [85, 95, 110, 98, 125, 115],
    },
  ];

  // Mock data for Top Equipment by Usage (Bar Chart)
  const topEquipmentOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
      },
    },
    colors: ["#8b5cf6"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
        distributed: false,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 30,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    title: {
      text: t.dashboardElements?.charts.topEquipment || "Top Equipment by Usage",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: 600,
      },
    },
    xaxis: {
      categories: [
        "Scaffolding Frame",
        "U-Head Jack",
        "Cross Brace",
        "Base Plate",
        "Coupling Pin",
      ],
      title: {
        text: t.dashboardElements?.charts.totalRented || "Total Units Rented",
      },
    },
    yaxis: {
      title: {
        text: t.dashboardElements?.charts.equipment || "Equipment",
      },
    },
    grid: {
      borderColor: "#e5e7eb",
    },
  };

  const topEquipmentSeries = [
    {
      name: t.dashboardElements?.charts.unitsRented || "Units Rented",
      data: [245, 198, 186, 175, 162],
    },
  ];

  // Mock data for Revenue Distribution (Donut Chart)
  const revenueDistributionOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 350,
    },
    colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
    labels: [
      "PT Konstruksi A",
      "PT Bangunan B",
      "PT Proyek C",
      "PT Infrastruktur D",
      t.dashboardElements?.charts.others || "Others",
    ],
    title: {
      text: t.dashboardElements?.charts.revenueByCompany || "Revenue Distribution by Company",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: 600,
      },
    },
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const revenueDistributionSeries = [28, 22, 18, 15, 17];

  // Mock data for Monthly Revenue Trend (Area Chart)
  const monthlyRevenueTrendOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: true,
      },
    },
    colors: ["#10b981"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    title: {
      text: t.dashboardElements?.charts.monthlyRevenue || "Monthly Revenue Trend",
      align: "left",
      style: {
        fontSize: "16px",
        fontWeight: 600,
      },
    },
    grid: {
      borderColor: "#e5e7eb",
    },
    xaxis: {
      categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      title: {
        text: t.dashboardElements?.charts.month || "Month",
      },
    },
    yaxis: {
      title: {
        text: t.dashboardElements?.charts.revenue || "Revenue (IDR Million)",
      },
      labels: {
        formatter: function (val: number) {
          return val.toFixed(0);
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return "Rp " + val.toFixed(1) + " M";
        },
      },
    },
  };

  const monthlyRevenueTrendSeries = [
    {
      name: t.dashboardElements?.charts.revenue || "Revenue",
      data: [98.5, 115.2, 108.7, 132.4, 125.5, 145.8],
    },
  ];

  // Format currency for Indonesian Rupiah
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <div className="space-y-6">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {t.dashboardElements?.title || "Dashboard Elements"}
            </h2>
            <p className="text-base font-normal text-gray-600 dark:text-gray-400">
              {t.dashboardElements?.subtitle ||
                "Overview of business metrics and equipment rental analytics"}
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Total Equipment Card */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.dashboardElements?.cards.totalEquipment || "Total Equipment"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {summaryData.totalEquipment}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t.dashboardElements?.cards.equipmentTypes || "Equipment Types"}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                  <HiCube className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            {/* Active Rentals Card */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.dashboardElements?.cards.activeRentals || "Active Rentals"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {summaryData.activeRentals}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                    <HiTrendingUp className="h-4 w-4 mr-1" />
                    +12% {t.dashboardElements?.cards.fromLastMonth || "from last month"}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                  <HiChartBar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>

            {/* Total Companies Card */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.dashboardElements?.cards.totalCompanies || "Total Companies"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {summaryData.totalCompanies}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t.dashboardElements?.cards.activeClients || "Active Clients"}
                  </p>
                </div>
                <div className="rounded-full bg-pink-100 p-3 dark:bg-pink-900">
                  <HiUserGroup className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                </div>
              </div>
            </Card>

            {/* Monthly Revenue Card */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.dashboardElements?.cards.monthlyRevenue || "Monthly Revenue"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(summaryData.monthlyRevenue)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                    <HiTrendingUp className="h-4 w-4 mr-1" />
                    +8.5% {t.dashboardElements?.cards.fromLastMonth || "from last month"}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <HiCurrencyDollar className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>

            {/* Equipment Utilization Rate Card */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.dashboardElements?.cards.utilizationRate || "Utilization Rate"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {summaryData.utilizationRate}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t.dashboardElements?.cards.equipmentInUse || "Equipment in Use"}
                  </p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                  <HiTrendingUp className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </Card>

            {/* Pending Invoices Card */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t.dashboardElements?.cards.pendingInvoices || "Pending Invoices"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {summaryData.pendingInvoices}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t.dashboardElements?.cards.requiresAttention || "Requires Attention"}
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3 dark:bg-orange-900">
                  <HiClock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Rental Trends Chart */}
            <Card>
              <ReactApexChart
                options={rentalTrendsOptions}
                series={rentalTrendsSeries}
                type="line"
                height={350}
              />
            </Card>

            {/* Top Equipment Chart */}
            <Card>
              <ReactApexChart
                options={topEquipmentOptions}
                series={topEquipmentSeries}
                type="bar"
                height={350}
              />
            </Card>

            {/* Revenue Distribution Chart */}
            <Card>
              <ReactApexChart
                options={revenueDistributionOptions}
                series={revenueDistributionSeries}
                type="donut"
                height={350}
              />
            </Card>

            {/* Monthly Revenue Trend Chart */}
            <Card>
              <ReactApexChart
                options={monthlyRevenueTrendOptions}
                series={monthlyRevenueTrendSeries}
                type="area"
                height={350}
              />
            </Card>
          </div>
        </div>
      </div>
    </NavbarSidebarLayout>
  );
};

export default DashboardElements;
