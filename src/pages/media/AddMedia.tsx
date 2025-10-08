import { GoBackButton } from "../../components";

import React, { useState } from "react";
import { removeFile } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import ReactHelmet from "../../components/ui/ReactHelmet";
import { addUrlToFile, getMediaType } from "../../utills/addUrlToFile";

export function AddMedia() {
  const navigate = useNavigate();

  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const [, setLoading] = useState<boolean>(false);

  // handleUploadFile
  async function handleUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const mimeTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4"];

    const files = event.target.files;
    // const inputElementName = event.target.name;

    if (!files || files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const formData = new FormData();

    // Validate MIME type and append valid files to FormData
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if the file's MIME type is in the allowed list
      if (!mimeTypes.includes(file.type)) {
        toast.error("Please select at least one file.");
      } else {
        formData.append("files", file);
      }
    }

    try {
      let url = `${API_URL}/media`;
      const token = localStorage.getItem("token");
      const apiResponse = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiData = await apiResponse.json();

      if (apiData.status == 200) {
        let images = apiData?.body?.map((item: any) => {
          return item.filename;
        });

        setUploadedImages((old) => {
          return [...old, ...images];
        });
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleDeleteFile
  async function handleDeleteFile(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
    index: number
  ) {
    event.preventDefault();
    try {
      const apiResponse = await removeFile(`/media`, fileName);

      if (apiResponse?.status == 200) {
        let images = [...uploadedImages];
        images.splice(index, 1);
        setUploadedImages(images);
      } else {
        let images = [...uploadedImages];
        images.splice(index, 1);
        setUploadedImages(images);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <ReactHelmet title="Add Media" />
              <h4 className="font-weight-bold mb-0">Add Media</h4>
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
        <div className="col-md-12 grid-margin stretch-card">
          <div className="col-md-12">
            {/* Product Images */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-3">Product Media</h5>
                  </div>

                  <div className="form-group col-md-12">
                    <label
                      htmlFor={"imagesFile"}
                      className="select-product-section"
                    >
                      <div className="">
                        <button>
                          <label htmlFor={"imagesFile"} style={{ margin: 0 }}>
                            Upload New
                          </label>
                        </button>
                      </div>
                      <p className="mt-2">Accept Images (png, jpg, jpeg)</p>
                    </label>

                    <div className="d-flex gap-2">
                      <input
                        type="file"
                        name="imagesFile"
                        id="imagesFile"
                        onChange={(evt) => {
                          handleUploadFile(evt);
                        }}
                        className="form-control"
                        multiple={true}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="d-flex gap-4">
                      {uploadedImages?.map((file: any, index: number) => {
                        return (
                          <div className="p-image">
                            <button
                              type="button"
                              className="btn btn-danger p-image-remove"
                              onClick={(evt) => {
                                handleDeleteFile(evt, file, index);
                              }}
                            >
                              X
                            </button>
                            {/* <img
                              className="img img-thumbnail"
                              src={addUrlToFile(file)}
                            /> */}

                            {getMediaType(addUrlToFile(file)) == "image" ? (
                              <img
                                src={addUrlToFile(file)}
                                alt=""
                                className="img img-thumbnail"
                              />
                            ) : getMediaType(addUrlToFile(file)) == "video" ? (
                              <video
                                controls
                                height={70}
                                width={70}
                                // className="img img-thumbnail"
                              >
                                <source
                                  src={addUrlToFile(file)}
                                  type="video/mp4"
                                />
                              </video>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
