import { PiCurrencyInr } from "react-icons/pi";
import { BsShop } from "react-icons/bs";
import { PiUsersFourLight } from "react-icons/pi";
import TopCustomerBarChart from "../components/charts/TopCustomerBarChart";
import PieChart from "../components/charts/PieChart";
import BasicBars from "../components/charts/BasicBarChart";
import DoughnutChart from "../components/charts/DoughnutChart";
import { get } from "../utills";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SalesBarChart from "../components/charts/SalesBarChart";
import { useNavigate } from "react-router-dom";
import DailyUserTrendsChart from "../components/charts/DailyUserTrendsChart";
import TopPagesChart from "../components/charts/TopPagesChart";
import TopGeoLocationsChart from "../components/charts/TopGeoLocationsChart";
import DeviceStatsChart from "../components/charts/DeviceStatsChart";
import TrafficSourcesChart from "../components/charts/TrafficSourcesChart";
import EventCountsChart from "../components/charts/EventCountsChart";
import EventCountsDoughnutChart from "../components/charts/EventCountsDoughnutChart";
import { DateRangePicker } from "react-date-range";
import { enUS } from "date-fns/locale";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import { Spinner } from "../components/ui/Spinner";
import moment from "moment";

export function Home() {
  const navigate = useNavigate();
  const chartContainerStyle: any = {
    width: "100%",
    height: "270px",
    transform: "scale(1)", // Initial zoom-out
    transition: "transform 0.3s ease-in-out", // Smooth transition
    display: "flex",
    justifyContent: "center",
  };

  const [totalSalesLoading, setTotalSalesLoading] = useState<boolean>(true);
  const [totalSales, setTotalSales] = useState<any>({});

  const [productLoading, setProductLoading] = useState<boolean>(true);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const [orderLoading, setOrderLoading] = useState<boolean>(true);
  const [totalOrders, setTotalOrders] = useState<any>({});

  const [inquiryLoading, setInquiryLoading] = useState<boolean>(true);
  const [totalInquiries, setTotalInquiries] = useState<any>({});

  const [summaryStatsLoading, setSummaryStatsLoading] = useState<boolean>(true);
  const [summaryStats, setSummaryStats] = useState<any>({});

  const [newsletterLoading, setNewsletterLoading] = useState<boolean>(true);
  const [totalNewsletters, setTotalNewsletters] = useState<any>({});

  const [topProductsLoading, setTopProductsLoading] = useState<boolean>(true);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any>({});

  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
    key: "selection",
  });

  function handleSelectDateRange(ranges: any) {
    setSelectionRange(ranges.selection);
  }

  // Get Users
  useEffect(
    function () {
      async function getData() {
        setUserLoading(true);

        const url = `/users/report/totalUsers?startDate=${selectionRange.startDate}&endDate=${selectionRange.endDate}`;

        const apiResponse = await get(url, true);

        if (apiResponse?.status == 200) {
          setUsers(apiResponse?.body);
        } else {
          toast.error(apiResponse?.message);
        }
        setUserLoading(false);
      }

      getData();
    },
    [selectionRange]
  );

  // Get Total Product
  useEffect(
    function () {
      async function getData() {
        setTopProductsLoading(true);

        let startDate = moment(selectionRange.startDate).format("YYYY-MM-DD");
        let endDate = moment(selectionRange.endDate).format("YYYY-MM-DD");

        let url = `/orders/report/topSellingProducts?startDate=${startDate}&endDate=${endDate}`;

        const apiResponse = await get(url, true);

        if (apiResponse?.status == 200) {
          setTopProducts(apiResponse?.body);
        } else {
          toast.error(apiResponse?.message);
        }
        setTopProductsLoading(false);
      }

      getData();
    },
    [selectionRange]
  );

  // Get Total Sales
  useEffect(
    function () {
      async function getData() {
        setTotalSalesLoading(true);

        const url = `/orders/report/totalSales?startDate=${selectionRange.startDate}&endDate=${selectionRange.endDate}`;
        const apiResponse = await get(url, true);

        if (apiResponse?.status == 200) {
          setTotalSales(apiResponse?.body);
        } else {
          toast.error(apiResponse?.message);
        }
        setTotalSalesLoading(false);
      }

      getData();
    },
    [selectionRange]
  );

  // Get Products
  useEffect(function () {
    async function getData() {
      setProductLoading(true);
      let url = `/products`;

      const apiResponse = await get(url, true);

      if (apiResponse?.status == 200) {
        setTotalProducts(apiResponse?.totalRecords);
      } else {
        toast.error(apiResponse?.message);
      }
      setProductLoading(false);
    }

    getData();
  }, []);

  // Get Orders
  useEffect(
    function () {
      async function getData() {
        setOrderLoading(true);
        // let url = `/orders/report/totalOrders`;

        const url = `/orders/report/totalOrders?startDate=${selectionRange.startDate}&endDate=${selectionRange.endDate}`;

        const apiResponse = await get(url, true);

        if (apiResponse?.status == 200) {
          setTotalOrders(apiResponse?.body);
        } else {
          toast.error(apiResponse?.message);
        }
        setOrderLoading(false);
      }

      getData();
    },
    [selectionRange]
  );

  // Get Inquiries
  useEffect(function () {
    async function getData() {
      setInquiryLoading(true);
      // let url = `/inquiries/totalInquiries`;

      const url = `/inquiries/report/totalInquiries?startDate=${selectionRange.startDate}&endDate=${selectionRange.endDate}`;

      const apiResponse = await get(url, true);

      if (apiResponse?.status == 200) {
        setTotalInquiries(apiResponse?.body);
      } else {
        toast.error(apiResponse?.message);
      }
      setInquiryLoading(false);
    }

    getData();
  }, []);

  // Get Newsletters
  useEffect(
    function () {
      async function getData() {
        setNewsletterLoading(true);

        const url = `/newsletters/report/totalNewsletters?startDate=${selectionRange.startDate}&endDate=${selectionRange.endDate}`;

        const apiResponse = await get(url, true);

        console.log(apiResponse);

        if (apiResponse?.status == 200) {
          setTotalNewsletters(apiResponse?.body);
        } else {
          toast.error(apiResponse?.message);
        }
        setNewsletterLoading(false);
      }

      getData();
    },
    [selectionRange]
  );

  useEffect(() => {
    async function fetchSummaryStats() {
      try {
        setSummaryStatsLoading(true);
        let startDate = moment(selectionRange.startDate).format("YYYY-MM-DD");
        let endDate = moment(selectionRange.endDate).format("YYYY-MM-DD");
        let url = `/googleAnalytics/getSummaryStats?startDate=${startDate}&endDate=${endDate}`;
        const response = await get(url, true);
        if (response?.status === 200) {
          const body = response.body;
          setSummaryStats(body);
        } else {
          toast.error(response?.message || "Failed to load device stats");
        }
        setSummaryStatsLoading(false);
      } catch (err) {
        setSummaryStatsLoading(false);
        toast.error("Error loading device stats");
        console.error(err);
      }
    }

    fetchSummaryStats();
  }, [selectionRange]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              {/* <h4 className="font-weight-bold mb-0">Dashboard</h4> */}
            </div>
            {/* <div>
              <button
                type="button"
                className="btn btn-primary btn-icon-text btn-rounded"
              >
                <i className="ti-clipboard btn-icon-prepend"></i>Report
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mb-2">
          <div className="card bg-transparent shadow-none border-0">
            <div className="card-body p-0">
              <div className="row">
                <div className="col-md-4">
                  {/* Date Range */}
                  <div className="">
                    <span
                      style={{
                        // marginTop: "20px",
                        fontSize: "14px",
                        cursor: "pointer",
                        // boxShadow: "0px 1px 2px #5a5a5a",
                        padding: 8,
                        borderRadius: 2,
                        width: "100%",
                        display: "block",
                        textAlign: "center",
                        border: "1px solid #c9ccd7",
                        background: "white",
                      }}
                      onClick={() => {
                        setCalendarVisible(!isCalendarVisible);
                      }}
                    >
                      <span className="mt-3">
                        <i className="ti-calendar"></i>
                      </span>{" "}
                      {`${selectionRange.startDate.toDateString()} - ${selectionRange.endDate.toDateString()}`}
                    </span>

                    {isCalendarVisible && (
                      <div
                        style={{
                          marginTop: "10px",
                          position: "absolute",
                          left: "20px",
                          background: "white",
                          padding: "10px",
                          boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                          borderRadius: "8px",
                          zIndex: 999,
                        }}
                      >
                        <DateRangePicker
                          ranges={[selectionRange]}
                          onChange={(ranges) => {
                            handleSelectDateRange(ranges);
                          }}
                          locale={enUS}
                          minDate={new Date("2024-01-01")}
                          maxDate={new Date("2028-12-31")}
                          direction="horizontal"
                          editableDateInputs={true}
                          scroll={{ enabled: false }}
                          dateDisplayFormat="dd/MM/yyyy"
                          rangeColors={["#4caf50"]} // Customize the highlight color
                        />

                        <div className="d-flex gap-2 justify-content-end">
                          <div className="">
                            <button
                              className="btn btn-danger p-2"
                              onClick={() => {
                                setCalendarVisible(false); // Close calendar
                                // console.log(
                                //   "Selected Date Range:",
                                //   selectionRange
                                // );
                              }}
                            >
                              Cancel
                            </button>
                          </div>

                          {/* Apply Button */}
                          {/* <div className="">
                          <button
                            className="btn btn-success p-2"
                            onClick={() => {
                              setCalendarVisible(false);
                              console.log(
                                "Selected Date Range:",
                                selectionRange
                              );
                            }}
                          >
                            Apply
                          </button>
                        </div> */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="col-md-3 grid-margin">
          <div
            className="card rounded-2 border-0"
            style={{ background: "#ffebd6" }}
          >
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p className="card-title text-xl-left card-title-custom text-dark">
                  Total Sales
                </p>
                <i className="fa fa-dollar-sign mb-0 mb-md-3 mb-xl-0 bg-info p-1 rounded-2 text-light"></i>
              </div>

              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center mt-3">
                {totalSalesLoading ? (
                  <div className="py-2">
                    <Spinner text={"Loading."} />
                  </div>
                ) : (
                  <h3 className="">₹{totalSales?.totalSales}</h3>
                )}

                <div
                  className={`${
                    totalSales?.percentageChange <= 0
                      ? "text-danger"
                      : "text-success"
                  } d-flex text-center gap-1`}
                  style={{ fontSize: "12px" }}
                >
                  {totalSales.percentageChange <= 0 ? (
                    <FaArrowDownShortWide />
                  ) : (
                    <FaArrowUpShortWide />
                  )}
                  <span>{totalSales?.percentageChange}%</span>
                  {/* <span className="text-black">
                    <small>(Yesterday)</small>
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-md-3 grid-margin">
          <div
            className="card rounded-2 border-0"
            style={{ background: "#ffebd6" }}
            role="button"
            onClick={() => {
              navigate(`/orders`);
            }}
          >
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p className="card-title text-xl-left card-title-custom text-dark">
                  Total Orders
                </p>
                <i className="ti-shopping-cart mb-0 bg-info p-1 rounded-2 text-light"></i>
              </div>

              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center mt-3">
                {orderLoading ? (
                  <div className="py-2">
                    <Spinner text={"Loading."} />
                  </div>
                ) : (
                  <h3 className="">{totalOrders?.totalOrders}</h3>
                )}
                {/* <div
                  className="text-danger d-flex flex-column text-center gap-0"
                  style={{ fontSize: "11px" }}
                >
                  <span>0.12%</span>
                  <span className="text-black">
                    <small>(30 days)</small>
                  </span>
                </div> */}

                <div
                  className={`${
                    totalOrders?.percentageChange <= 0
                      ? "text-danger"
                      : "text-success"
                  } d-flex text-center gap-1`}
                  style={{ fontSize: "12px" }}
                >
                  {totalOrders?.percentageChange <= 0 ? (
                    <FaArrowDownShortWide />
                  ) : (
                    <FaArrowUpShortWide />
                  )}
                  <span>{totalOrders?.todayOrders}</span>
                  {/* <span className="text-black">
                    <small>(Yesterday)</small>
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Users */}
        <div className="col-md-3 grid-margin">
          <div
            className="card rounded-2 border-0"
            style={{ background: "#ffebd6" }}
            role="button"
            onClick={() => {
              navigate(`/users`);
            }}
          >
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p className="card-title text-xl-left card-title-custom text-dark">
                  Total Users
                </p>
                <i className="ti-user mb-0 mb-md-3 mb-xl-0 bg-info p-1 rounded-2 text-light"></i>
              </div>

              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center mt-3">
                {userLoading ? (
                  <div className="py-2">
                    <Spinner text={"Loading."} />
                  </div>
                ) : (
                  <h3 className="">{users?.totalUsers}</h3>
                )}

                <div
                  className={`${
                    users?.percentageChange <= 0
                      ? "text-danger"
                      : "text-success"
                  } d-flex text-center gap-1`}
                  style={{ fontSize: "12px" }}
                >
                  {users?.percentageChange <= 0 ? (
                    <FaArrowDownShortWide />
                  ) : (
                    <FaArrowUpShortWide />
                  )}
                  <span>{users?.todayUsers}</span>
                  {/* <span className="text-black">
                    <small>(Yesterday)</small>
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Subscriber */}
        <div className="col-md-3 grid-margin">
          <div
            className="card rounded-2 border-0"
            style={{ background: "#ffebd6" }}
            role="button"
            onClick={() => {
              navigate(`/newsletters`);
            }}
          >
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center">
                <p className="card-title text-xl-left card-title-custom text-dark">
                  Total Subscriber
                </p>
                <i className="ti-layers mb-0 mb-md-3 mb-xl-0 bg-info p-1 rounded-2 text-light"></i>
              </div>

              <div className="d-flex flex-wrap justify-content-between justify-content-md-center justify-content-xl-between align-items-center mt-3">
                {newsletterLoading ? (
                  <div className="py-2">
                    <Spinner text={"Loading."} />
                  </div>
                ) : (
                  <h3 className="">{totalNewsletters.totalNewsletters}</h3>
                )}
                <div
                  className={`${
                    totalNewsletters?.percentageChange <= 0
                      ? "text-danger"
                      : "text-success"
                  } d-flex text-center gap-1`}
                  style={{ fontSize: "12px" }}
                >
                  {totalNewsletters?.percentageChange <= 0 ? (
                    <FaArrowDownShortWide />
                  ) : (
                    <FaArrowUpShortWide />
                  )}
                  <span>{totalNewsletters?.totalNewsletters}</span>
                  {/* <span className="text-black">
                    <small>(Yesterday)</small>
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-12">
          {/* <!-- The main card component --> */}
          <div className="stats-card bg-white">
            {/* <!-- Bootstrap row with no gutters for seamless borders --> */}
            <div className="row g-0">
              {/* <!-- Stat 1: Active Users --> */}
              {/* <!-- col-6 makes it 2 columns on mobile, col-md-3 makes it 4 columns on desktop --> */}
              <div className="col-6 col-md-3">
                <div className="stat-item text-center">
                  <p className="stat-label mb-1">Active Users</p>
                  {summaryStatsLoading ? (
                    <div className="d-flex justify-content-center p-1">
                      <Spinner text={""} />
                    </div>
                  ) : (
                    <p className="stat-value mb-0">
                      {summaryStats?.activeUsers}
                    </p>
                  )}
                </div>
              </div>

              {/* <!-- Stat 2: New Users --> */}
              <div className="col-6 col-md-3">
                <div className="stat-item text-center">
                  <p className="stat-label mb-1">New Users</p>

                  {summaryStatsLoading ? (
                    <div className="d-flex justify-content-center p-1">
                      <Spinner text={""} />
                    </div>
                  ) : (
                    <p className="stat-value mb-0">{summaryStats?.newUsers}</p>
                  )}
                </div>
              </div>

              {/* <!-- Stat 3: Average Engagement --> */}
              <div className="col-6 col-md-3">
                <div className="stat-item text-center">
                  <p className="stat-label mb-1">Average Engagement</p>

                  {summaryStatsLoading ? (
                    <div className="d-flex justify-content-center p-1">
                      <Spinner text={""} />
                    </div>
                  ) : (
                    <p className="stat-value mb-0">
                      {summaryStats?.averageSessionDuration}
                    </p>
                  )}
                </div>
              </div>

              {/* <!-- Stat 4: Sessions --> */}
              <div className="col-6 col-md-3">
                <div className="stat-item text-center">
                  <p className="stat-label mb-1">Sessions</p>

                  {summaryStatsLoading ? (
                    <div className="d-flex justify-content-center p-1">
                      <Spinner text={""} />
                    </div>
                  ) : (
                    <p className="stat-value mb-0">
                      {summaryStats?.engagedSessions}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Daily User Trends</h4>
              <DailyUserTrendsChart
                startDate={moment(selectionRange.startDate).format(
                  "YYYY-MM-DD"
                )}
                endDate={moment(selectionRange.endDate).format("YYYY-MM-DD")}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Top Pages</h4>
              <TopPagesChart
                startDate={moment(selectionRange.startDate).format(
                  "YYYY-MM-DD"
                )}
                endDate={moment(selectionRange.endDate).format("YYYY-MM-DD")}
              />
            </div>
          </div>
        </div>

        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Website Visitors</h4>
              <TopGeoLocationsChart
                startDate={moment(selectionRange.startDate).format(
                  "YYYY-MM-DD"
                )}
                endDate={moment(selectionRange.endDate).format("YYYY-MM-DD")}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Device Stats</h4>
              <DeviceStatsChart
                startDate={moment(selectionRange.startDate).format(
                  "YYYY-MM-DD"
                )}
                endDate={moment(selectionRange.endDate).format("YYYY-MM-DD")}
              />
            </div>
          </div>
        </div>
        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Traffic Source</h4>
              <TrafficSourcesChart
                startDate={moment(selectionRange.startDate).format(
                  "YYYY-MM-DD"
                )}
                endDate={moment(selectionRange.endDate).format("YYYY-MM-DD")}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Event Chart</h4>
              <EventCountsDoughnutChart
                startDate={moment(selectionRange.startDate).format(
                  "YYYY-MM-DD"
                )}
                endDate={moment(selectionRange.endDate).format("YYYY-MM-DD")}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card position-relative">
            <div className="card-body">
              <p className="card-title">Avarage Sale Reports</p>
              <div className="row">
                <div className="col-md-12 col-xl-3 d-flex flex-column justify-content-center">
                  <div className="ml-xl-4">
                    <h1>33500</h1>
                    <h3 className="font-weight-light mb-xl-4">Total Sales</h3>
                  </div>
                </div>
                <div className="col-md-12 col-xl-9">
                  <div className="row">
                    <div className="col-md-6 mt-3 col-xl-5">
                      <DoughnutChart />
                    </div>
                    <div className="col-md-6 col-xl-7">
                      <div className="table-responsive mb-3 mb-md-0">
                        <table className="table table-borderless report-table">
                          <tr>
                            <td className="text-muted">Personalized Plans</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "70%" }}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">524</h5>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Hybrid Plans</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "30%" }}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">722</h5>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Group Plans</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "95%" }}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">173</h5>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Corporate Plans</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "60%" }}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">945</h5>
                            </td>
                          </tr>
                          <tr>
                            <td className="text-muted">Merchandise</td>
                            <td className="w-100 px-0">
                              <div className="progress progress-md mx-4">
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: "40%" }}
                                ></div>
                              </div>
                            </td>
                            <td>
                              <h5 className="font-weight-bold mb-0">553</h5>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
