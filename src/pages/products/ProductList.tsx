import {
  CustomSelect,
  DataTable,
  GoBackButton,
  Pagination,
} from "../../components";
import {
  Column,
  Row,
  TableInstance,
  useFilters,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { deleteConfirmation, get, remove } from "../../utills";
import { toast } from "react-toastify";
import Select from "react-select";
import { styles } from "../../constants/selectStyle";
import { FILE_URL } from "../../constants";
import { addUrlToFile } from "../../utills/addUrlToFile";

export function ProductList() {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [status, setStatus] = useState<boolean | string>("");
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [types, setDecorSeries] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [showOption, setShowOption] = useState<boolean>(false);

  type SelectValue = {
    label: string;
    value: string;
  };

  const [selectedCategory, setSelectedCategory] = useState<SelectValue | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SelectValue | null>(null);
  const [topSelling, setTopSelling] = useState<boolean>(false);
  const [selectedSizes, setSelectedSizes] = useState<SelectValue[] | null>(
    null
  );

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData() {
        setLoading(true);
        let url = `/products?page=${pagination.page}&limit=${pagination.limit}`;
        if (searchQuery) url += `&searchQuery=${searchQuery}`;
        if (status) url += `&status=${status}`;
        if (selectedCategory?.value)
          url += `&category=${selectedCategory.value}`;
        if (selectedSubCategory?.value)
          url += `&subCategory=${selectedSubCategory.value}`;
        if (topSelling) url += `&topSelling=${topSelling}`;

        if (selectedSizes?.length) {
          for (let size of selectedSizes) {
            url += `&sizes=${size.value}`;
          }
        }

        const apiResponse = await get(url, true);

        if (apiResponse?.status == 200) {
          setRecords(apiResponse.body);
          setPagination({
            ...pagination,
            page: apiResponse?.page as number,
            totalPages: apiResponse?.totalPages as number,
            totalRecords: apiResponse?.totalRecords as number,
          });
        } else {
          setRecords([]);
          toast.error(apiResponse?.message);
        }
        setLoading(false);
      }

      getData();
    },
    [
      pagination.page,
      pagination.limit,
      searchQuery,
      needReload,
      status,
      selectedCategory,
      selectedSubCategory,
      selectedSizes,
      topSelling,
    ]
  );

  // clearFilterOption
  function handleClearFilter() {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedSizes(null);
    setTopSelling(false);
  }

  // get category
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/categories", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setCategories(modifiedValue);
      }
    }
    getData();
  }, []);

  // get sub category
  useEffect(
    function () {
      async function getData() {
        let url = `/subCategories`;
        if (selectedCategory?.value) {
          url += `?category=${selectedCategory?.value}`;
        }

        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const modifiedValue = apiResponse?.body?.map((value: any) => {
            return {
              label: value.name,
              value: value._id,
            };
          });
          setSubCategories(modifiedValue);
        }
      }
      getData();
    },
    [selectedCategory?.value]
  );

  // get Size
  useEffect(function () {
    async function getData() {
      let url = `/sizes`;
      const apiResponse = await get(url, true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.title,
            value: value._id,
          };
        });
        setSizes(modifiedValue);
      }
    }
    getData();
  }, []);

  type Record = {
    name: string;
    category: string;
    image: string;
    price: string;
    createdAt: string;
    status: boolean;
    id: string;
  };

  // Extend the TableInstance type
  type TableInstanceWithRowSelect<Record extends object> =
    TableInstance<Record> & {
      selectedFlatRows: Row<Record>[];
    };

  const columns: Column<Record>[] = React.useMemo(
    () => [
      {
        id: "selection",
        disableSortBy: true,
        Header: ({ getToggleAllRowsSelectedProps }: any) => (
          <div>
            <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }: any) => (
          <div>
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      {
        Header: "",
        accessor: "image",
        disableSortBy: true,
        Cell: ({ value }: any) => {
          return (
            <div>
              <img className="img" src={value} />
            </div>
          );
        },
      },
      {
        Header: "NAME",
        accessor: "name",
      },
      {
        Header: "CATEGORY",
        accessor: "category",
      },

      {
        Header: "CREATED AT",
        accessor: "createdAt",
        Cell: ({ value }: any) => {
          return moment(new Date(value)).format("DD-MM-YYYY");
        },
      },
      {
        Header: "STATUS",
        accessor: "status",
        Cell: ({ value }: any) => {
          const status: boolean = value;
          return (
            <>
              {status ? (
                <span className="badge bg-success">Active</span>
              ) : (
                <span className="badge bg-danger">Disabled</span>
              )}
            </>
          );
        },
      },
      {
        Header: "ACTION",
        accessor: "id",
        disableSortBy: true,
        Cell: ({ value }: any) => {
          return (
            <div className="d-flex gap-1">
              <Link
                className="p-2 bg-light"
                to={{
                  pathname: `/products/edit/${value}`,
                }}
              >
                <span className="fas fa-pencil-alt" aria-hidden="true"></span>
              </Link>

              <Link
                className="p-2 bg-light"
                to={{
                  pathname: `/products/details/${value}`,
                }}
              >
                <span
                  className="fas fa-eye text-warning"
                  aria-hidden="true"
                ></span>
              </Link>

              <button
                type="button"
                className="btn p-2 bg-light"
                data-toggle="modal"
                data-target="#deleteModal"
                onClick={() => {
                  handleDeleteData(value);
                }}
              >
                <span
                  className="fas fa-trash-alt text-danger"
                  aria-hidden="true"
                ></span>
              </button>
            </div>
          );
        },
      },
    ],
    []
  );

  const data = React.useMemo(() => {
    return records.map((data) => {
      return {
        name: data.name,
        category: data.category?.name,
        price: data,
        image: addUrlToFile(data.image),
        createdAt: data.createdAt,
        status: data.status,
        id: data._id,
      };
    });
  }, [records]);

  const { getTableProps, headerGroups, rows, prepareRow, selectedFlatRows } =
    useTable(
      { columns, data },
      useFilters,
      useSortBy,
      usePagination,
      useRowSelect
    ) as TableInstanceWithRowSelect<Record>;

  // handleDeleteData
  async function handleDeleteData(recordId: string | string[]) {
    const { isConfirmed } = await deleteConfirmation();

    if (!isConfirmed) {
      return;
    }

    let apiResponse = null;
    if (Array.isArray(recordId)) {
      apiResponse = await remove(`/products`, recordId);
    } else {
      apiResponse = await remove(`/products/${recordId}`);
    }

    if (apiResponse?.status == 200) {
      toast.success(apiResponse?.message);
      setNeedReload((old) => {
        return !old;
      });
    } else {
      toast.error(apiResponse?.message);
    }
  }

  function handleSelectedRows(): string[] {
    const selectedData = selectedFlatRows.map((row: any) => row?.original?.id);
    return selectedData;
  }

  // handleSetStatus
  function handleSetStatus(evt: React.ChangeEvent<HTMLInputElement>) {
    setStatus(evt.target.value);
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Products</h4>
            </div>
            <div>
              <Link
                to={"/products/add"}
                type="button"
                className="btn btn-primary text-light"
              >
                Add Product
              </Link>

              <Link
                to={"/products/addViaCsv"}
                type="button"
                className="btn btn-primary text-light"
              >
                Add Via CSV
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card ">
          <div className="card rounded-2">
            <div className="card-body shadow-none">
              <div className="row mb-2 gy-2">
                <div className="col-md-8">
                  <input
                    placeholder="Serach..."
                    className="form-control py-2"
                    type="serach"
                    onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(evt.target.value)
                    }
                  />
                </div>
                <div className="col-md-4 d-flex gap-2 justify-content-md-end">
                  {/* <button className="btn p-2 bg-light border">
                    <i className="ti-search"></i>
                  </button> */}
                  {selectedFlatRows.length ? (
                    <button
                      className="btn p-2 bg-light border"
                      onClick={() => {
                        handleDeleteData(handleSelectedRows());
                      }}
                    >
                      <i className="fas fa-trash-alt text-danger"></i>
                    </button>
                  ) : null}

                  <div className="dropdown">
                    <a
                      className="btn p-2 bg-light border"
                      href="#"
                      role="button"
                      id="dropdownMenuLink"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="ti-filter"></i>
                    </a>

                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuLink"
                    >
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="all"
                          value={"All"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="all">All</label>
                      </li>
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="active"
                          value={"true"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="active">Active</label>
                      </li>
                      <li className="d-flex px-3 gap-2">
                        <input
                          type="radio"
                          id="disabled"
                          value={"false"}
                          name="status"
                          onChange={handleSetStatus}
                        />
                        <label htmlFor="disabled">Disabled</label>
                      </li>
                    </ul>
                  </div>

                  {showOption ? (
                    <button
                      className="btn p-2 bg-light border"
                      onClick={() => {
                        setShowOption((old) => {
                          return !old;
                        });
                        handleClearFilter();
                      }}
                    >
                      <i className="fas fa-times text-danger"></i>
                    </button>
                  ) : (
                    <button
                      className="btn p-2 bg-light border"
                      onClick={() => {
                        setShowOption((old) => {
                          return !old;
                        });
                      }}
                    >
                      <i className="fas fa-angle-down text-info"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* More filter option */}
              {showOption ? (
                <div className="row">
                  <div className="form-group col-md-3">
                    <Select
                      placeholder="Select Category"
                      options={categories}
                      value={selectedCategory}
                      onChange={(value) => {
                        setSelectedCategory(value);
                      }}
                      styles={styles}
                    />
                  </div>

                  <div className="form-group col-md-3">
                    <Select
                      placeholder="Select Sub Category"
                      options={subCategories}
                      value={selectedSubCategory}
                      onChange={(value) => {
                        setSelectedSubCategory(value);
                      }}
                      styles={styles}
                    />
                  </div>

                  <div className="form-group col-md-4">
                    <Select
                      placeholder="Select Size"
                      options={sizes}
                      value={selectedSizes}
                      onChange={(value: any) => {
                        setSelectedSizes(value);
                      }}
                      styles={styles}
                      isMulti={true}
                    />
                  </div>

                  <div className="form-group col-md-2 d-flex justify-content-center align-items-center gap-2">
                    <input
                      type="checkbox"
                      checked={topSelling ? true : false}
                      onChange={(evt) => {
                        setTopSelling(evt.target.checked);
                      }}
                      id="topSellingCheckbox"
                    />
                    <label htmlFor="topSellingCheckbox" className="p-0 m-0">
                      Top Selling
                    </label>
                  </div>
                </div>
              ) : null}

              <div className="table-responsive">
                {/* Data Table */}
                <DataTable
                  getTableBodyProps={getTableProps}
                  getTableProps={getTableProps}
                  headerGroups={headerGroups}
                  rows={rows}
                  prepareRow={prepareRow}
                />
                {/* Pagination */}
                <Pagination
                  pagination={pagination}
                  setPagination={setPagination}
                  tableName={"table-to-xls"}
                  csvFileName={"coupons"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
