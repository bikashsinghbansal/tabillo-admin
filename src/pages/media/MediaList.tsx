import { GoBackButton, Pagination } from "../../components";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteConfirmation, get, remove, removeFile } from "../../utills";
import { toast } from "react-toastify";
import { addUrlToFile, getMediaType } from "../../utills/addUrlToFile";

export function MediaList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [status, setStatus] = useState<boolean | string>("");
  const [needReload, setNeedReload] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 36,
    totalRecords: 0,
    totalPages: 0,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData() {
        setLoading(true);
        let url = `/media?page=${pagination.page}&limit=${pagination.limit}`;
        if (searchQuery) url += `&searchQuery=${searchQuery}`;
        if (status) url += `&status=${status}`;

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
    [pagination.page, pagination.limit, searchQuery, needReload, status]
  );

  // listening for shortcut
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check if the Shift key and "A" key are pressed
      if (event.altKey && event.key === "=") {
        navigate("/finishes/add");
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // handleDeleteFile
  async function handleDeleteFile(
    event: React.MouseEvent<HTMLButtonElement>,
    filename: string
  ) {
    event.preventDefault();

    const { isConfirmed } = await deleteConfirmation();

    if (!isConfirmed) {
      return;
    }

    try {
      const apiResponse = await removeFile(`/media`, filename);

      if (apiResponse?.status === 200) {
        toast.success("Image deleted successfully");
      } else {
        toast.error(apiResponse?.message || "Failed to delete image");
      }
      setNeedReload(!needReload);
    } catch (error: any) {
      toast.error(error?.message || "An error occurred during deletion");
    }
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Media List</h4>
            </div>
            <div>
              <Link
                title="Alt + '+'"
                to={"/media/add"}
                type="button"
                className="btn btn-primary text-light"
              >
                Add Media
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
              </div>

              <div className="row mb-2 gy-2 media-list-section">
                {records?.map((item) => {
                  return (
                    <div className="col-md-2">
                      <div className="card">
                        <button
                          className="media-close-btn"
                          onClick={(evt) => {
                            handleDeleteFile(evt, item.filename);
                          }}
                          style={{ zIndex: 9 }}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                        {/* <img src={addUrlToFile(item.filename)} alt="" /> */}
                        {getMediaType(addUrlToFile(item.filename)) ==
                        "image" ? (
                          <img src={addUrlToFile(item.filename)} alt="" />
                        ) : getMediaType(addUrlToFile(item.filename)) ==
                          "video" ? (
                          <video controls>
                            <source
                              src={addUrlToFile(item.filename)}
                              type="video/mp4"
                            />
                          </video>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          {/* Data Table */}
          {/* <DataTable
                          getTableBodyProps={getTableProps}
                          getTableProps={getTableProps}
                          headerGroups={headerGroups}
                          rows={rows}
                          prepareRow={prepareRow}
                        /> */}
          {/* Pagination */}
          <Pagination
            pagination={pagination}
            setPagination={setPagination}
            tableName={"table-to-xls"}
            csvFileName={"images"}
          />
        </div>
      </div>
    </div>
  );
}
