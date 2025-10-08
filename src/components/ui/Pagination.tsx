// import ReactHTMLTableToExcel from "react-html-table-to-excel";
export function Pagination(props: any) {
  const {
    pagination,
    setPagination,
    tableName = "table-to-xls",
    csvFileName = "data",
  } = props;

  const limitHandler = (e: any) => {
    const limit = e.target.value;
    setPagination({
      ...pagination,
      limit,
      page: 1,
    });
  };

  const pageHandler = (e: any, page: number) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page: page,
    });
  };

  const previousPageHandler = (e: any) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page: pagination.page >= 2 ? pagination.page - 1 : 1,
    });
  };

  const nextPageHandler = (e: any) => {
    e.preventDefault();
    setPagination({
      ...pagination,
      page:
        parseInt(pagination.page) < pagination.totalPages
          ? parseInt(pagination.page) + 1
          : pagination.totalPages,
    });
  };

  return (
    <div className="mt-2 d-flex justify-content-between">
      <div className="d-flex">
        <div className="limit form-group p-0">
          <select
            value={pagination.limit}
            className="form-control"
            onChange={limitHandler}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value={pagination.totalRecords}>All</option>
          </select>
        </div>
        <div className="">
          {/* <ReactHTMLTableToExcel
            className="download-table-xls-button shadow-sm px-3 border"
            table={tableName}
            filename={csvFileName}
            sheet="data"
            buttonText="Download as XLS"
          /> */}
        </div>
      </div>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className={`page-item ${pagination.page == 1 ? "disabled" : ""}`}>
            <a
              className="page-link py-1"
              href="#"
              //   tabindex="-1"
              onClick={previousPageHandler}
            >
              Previous
            </a>
          </li>
          {[...Array(pagination.totalPages)].map((_, i) => {
            return (
              <li className="page-item">
                <a
                  className={
                    pagination.page == i + 1
                      ? "page-link py-1 bg-info text-light"
                      : "page-link py-1"
                  }
                  href="#"
                  onClick={(e) => pageHandler(e, i + 1)}
                >
                  {i + 1}
                </a>
              </li>
            );
          })}

          <li
            className={`page-item ${
              pagination.page == pagination.totalPages ? "disabled" : ""
            }`}
          >
            <a className="page-link py-1" href="#" onClick={nextPageHandler}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
