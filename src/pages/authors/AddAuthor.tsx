import { GoBackButton, InputBox, SubmitButton } from "../../components";
import { FormikHelpers, useFormik } from "formik";

import {
  authorSchema,
  AuthorValues,
  authorInitialValues,
} from "../../validationSchemas/authorSchema";

import { useState } from "react";
import { post, remove, validateTextNumber } from "../../utills";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import { addUrlToFile } from "../../utills/addUrlToFile";

export function AddAuthor() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    setFieldError,
  } = useFormik({
    onSubmit: async function (
      values: AuthorValues,
      helpers: FormikHelpers<AuthorValues>
    ) {
      setLoading(true);

      const newValue = { ...values };

      const apiResponse = await post("/authors", newValue, true);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: authorInitialValues,
    validationSchema: authorSchema,
  });

  // handleUploadFile
  async function handleUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

    const files = event.target.files;

    if (!files || files.length === 0) {
      setFieldTouched("profilePhoto", true);
      setFieldError("profilePhoto", "Profile Photo is required field");
      toast.error("Profile Photo is required field");
      return;
    }

    // Validate MIME type and append valid files to FormData
    // Check if the file's MIME type is in the allowed list
    let file = files[0];
    if (!mimeTypes.includes(file.type)) {
      setFieldTouched("profilePhoto", true);
      setFieldError("profilePhoto", "Must select the valid Profile Photo file");
      toast.error("Must select the valid Profile Photo file");
      return;
    }

    const formData = new FormData();

    formData.append("files", file);

    try {
      let url = `${API_URL}/fileUploads`;
      const apiResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const apiData = await apiResponse.json();

      if (apiData.status == 200) {
        setFieldTouched("profilePhoto", false);
        setFieldError("profilePhoto", "");
        setFieldValue("profilePhoto", apiData.body[0].filename);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleDeleteFile
  async function handleDeleteFile(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string
  ) {
    event.preventDefault();

    try {
      const apiResponse = await remove(`/fileUploads/${fileName}`);
      if (apiResponse?.status == 200) {
        setFieldError("profilePhoto", "");
        setFieldValue("profilePhoto", "");
      }

      const fileInput = document.getElementById(
        `imageFile`
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ""; // Clear the input field
        setFieldValue("profilePhoto", "");
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
              <h4 className="font-weight-bold mb-0">Add Author</h4>
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
        <div className="col-md-12">
          <form className="forms-sample" onSubmit={handleSubmit}>
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Author Name"
                      name="name"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter name"
                      value={values.name}
                      required={true}
                      touched={touched.name}
                      error={errors.name}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Author Email"
                      name="email"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="email"
                      placeholder="Enter email"
                      value={values.email}
                      required={true}
                      touched={touched.email}
                      error={errors.email}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Author Mobile"
                      name="mobile"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter mobile"
                      value={values.mobile}
                      required={true}
                      touched={touched.mobile}
                      error={errors.mobile}
                    />
                  </div>

                  <div className="form-group col-md-12">
                    <InputBox
                      label="Author Bio"
                      name="bio"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter description"
                      value={values.bio}
                      touched={touched.bio}
                      error={errors.bio}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="">Status</label>
                    <div className="d-flex gap-3">
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="radio"
                          name="status"
                          id="true"
                          value={"true"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.status == "true"}
                        />
                        <label htmlFor="true" className="mt-2">
                          Active
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <input
                          type="radio"
                          name="status"
                          id="false"
                          value={"false"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.status == "false"}
                        />
                        <label htmlFor="false" className="mt-2">
                          Disabled
                        </label>
                      </div>
                    </div>
                    {errors.status && touched.status ? (
                      <p className="custom-form-error text-danger">
                        {errors.status}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Profile Photo (1080X1080 PX)</h5>
                  </div>

                  <div className="mb-3 col-md-6 d-flex justify-content-center flex-column">
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="imageFile"
                        onChange={handleUploadFile}
                      />
                      <label className="input-group-text" htmlFor="imageFile">
                        Upload
                      </label>
                    </div>

                    {touched.profilePhoto && errors.profilePhoto ? (
                      <p className="custom-form-error text-danger">
                        {errors.profilePhoto}
                      </p>
                    ) : null}
                  </div>

                  <div className="col-md-6 text-center">
                    {values.profilePhoto ? (
                      <Link to={`${values.profilePhoto}`} target="_blank">
                        <img
                          className="img img-fluid rounded bordered"
                          // height={200}
                          width={200}
                          src={addUrlToFile(values.profilePhoto)}
                        />
                      </Link>
                    ) : null}
                    {values.profilePhoto ? (
                      <button
                        type="button"
                        className="btn p-1"
                        onClick={(evt) => {
                          handleDeleteFile(evt, values.profilePhoto);
                        }}
                      >
                        <i className="fa fa-trash text-danger"></i>
                      </button>
                    ) : null}
                  </div>

                  <div className="">
                    <SubmitButton loading={false} text="Add Author" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
