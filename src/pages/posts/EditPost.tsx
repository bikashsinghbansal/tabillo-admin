import {
  CustomSelect,
  GoBackButton,
  InputBox,
  SubmitButton,
  TextareaBox,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  postSchema,
  PostValues,
  postInitialValues,
} from "../../validationSchemas/postSchema";
import { useEffect, useState } from "react";
import { get, post, put, remove } from "../../utills";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../constants";
import { addUrlToFile } from "../../utills/addUrlToFile";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export function EditPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
    setFieldError,
    setFieldTouched,
    setFieldValue,
  } = useFormik({
    onSubmit: async function (
      values: PostValues,
      helpers: FormikHelpers<PostValues>
    ) {
      setLoading(true);

      const newValue = {
        ...values,
        blogCategory: values.blogCategory?.value,
        author: values.author?.value,
      };

      const apiResponse = await put(`/blogs/${id}`, newValue);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: postInitialValues,
    validationSchema: postSchema,
  });

  // Get Data From Database
  useEffect(
    function () {
      async function getData(id: string) {
        let url = `/blogs/${id}`;
        const apiResponse = await get(url, true);
        if (apiResponse?.status == 200) {
          const apiData = apiResponse.body;
          apiData.status = `${apiData.status}`;

          delete apiData.isDeleted;
          delete apiData.createdAt;
          delete apiData.updatedAt;
          delete apiData._id;
          delete apiData.__v;

          if (apiData.blogCategory) {
            apiData.blogCategory = {
              label: apiData?.blogCategory?.name,
              value: apiData.blogCategory?._id,
            };
          }

          if (apiData.author) {
            apiData.author = {
              label: apiData?.author?.name,
              value: apiData.author?._id,
            };
          }

          if (apiData.author) {
          }
          setValues(apiData);
        } else {
          toast.error(apiResponse?.message);
        }
      }

      if (id) getData(id);
    },
    [id]
  );

  // get category
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/blogCategories?limit=0", true);
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

  // get author
  useEffect(function () {
    async function getData() {
      const apiResponse = await get("/authors?limit=0", true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setAuthors(modifiedValue);
      }
    }
    getData();
  }, []);

  // handleUploadFile
  async function handleUploadFile(
    event: React.ChangeEvent<HTMLInputElement>,
    source?: "COVER_IMAGE" | "LISTING_IMAGE"
  ) {
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

    const files = event.target.files;

    if (!files || files.length === 0) {
      if (source == "COVER_IMAGE") {
        setFieldTouched("coverImage", true);
        setFieldError("coverImage", "Image is required field");
        toast.error("Image is required field");
        return;
      } else {
        setFieldTouched("listingImage", true);
        return;
      }
    }

    // Validate MIME type and append valid files to FormData
    // Check if the file's MIME type is in the allowed list
    let file = files[0];
    if (!mimeTypes.includes(file.type)) {
      if (source == "COVER_IMAGE") {
        setFieldTouched("coverImage", true);
        setFieldError("coverImage", "Must select the valid coverImage file");
        toast.error("Must select the valid coverImage file");
        return;
      } else {
        setFieldTouched("listingImage", true);
        setFieldError("listingImage", "Must select the valid coverImage file");
        toast.error("Must select the valid coverImage file");
        return;
      }
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
        if (source == "COVER_IMAGE") {
          setFieldTouched("coverImage", false);
          setFieldError("coverImage", "");
          setFieldValue("coverImage", apiData.body[0].filename);
        } else {
          setFieldTouched("listingImage", false);
          setFieldError("listingImage", "");
          setFieldValue("listingImage", apiData.body[0].filename);
        }
      } else {
        if (source == "COVER_IMAGE") {
          setFieldTouched("coverImage", false);
          setFieldError("coverImage", apiData.message);
        } else {
          setFieldTouched("listingImage", false);
          setFieldError("listingImage", apiData.message);
        }
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleDeleteFile
  async function handleDeleteFile(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
    source?: "COVER_IMAGE" | "LISTING_IMAGE"
  ) {
    event.preventDefault();

    try {
      const apiResponse = await remove(`/fileUploads/${fileName}`);
      if (apiResponse?.status == 200) {
        if (source == "COVER_IMAGE") {
          setFieldError("coverImage", "");
          setFieldValue("coverImage", "");
        } else {
          setFieldError("listingImage", "");
          setFieldValue("listingImage", "");
        }
      } else {
        if (source == "COVER_IMAGE") {
          setFieldError("coverImage", "");
          setFieldValue("coverImage", "");
        } else {
          setFieldError("listingImage", "");
          setFieldValue("listingImage", "");
        }
        toast.error(apiResponse?.message);
      }

      if (source == "COVER_IMAGE") {
        const fileInput = document.getElementById(
          `imageFile`
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ""; // Clear the input field
          setFieldValue("coverImage", "");
        }
      } else {
        const fileInput = document.getElementById(
          `listingImageFile`
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = ""; // Clear the input field
        }
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  const customUploadAdapter = (loader: any) => {
    return {
      upload: async () => {
        const file = await loader.file;
        const data = new FormData();
        data.append("files", file);

        try {
          let url = `${API_URL}/fileUploads`;
          const apiResponse = await fetch(url, {
            method: "POST",
            body: data,
          });

          const result = await apiResponse.json();

          return {
            default: addUrlToFile(result.body[0].filename),
          };
        } catch (error: any) {
          toast.error(`"Image upload failed:", ${error.message}`);
        }
      },
    };
  };

  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      return customUploadAdapter(loader);
    };
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Edit Post</h4>
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
                      label="Post Title"
                      name="title"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter title"
                      value={values.title}
                      required={true}
                      touched={touched.title}
                      error={errors.title}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Post Slug"
                      name="slug"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter slug"
                      value={values.slug}
                      required={true}
                      touched={touched.slug}
                      error={errors.slug}
                    />
                  </div>
                  {/* Select Category */}
                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Select Category"
                      placeholder="Select Category"
                      name="blogCategory"
                      required={true}
                      options={categories}
                      value={values.blogCategory}
                      error={errors.blogCategory}
                      touched={touched.blogCategory}
                      isMulti={false}
                      handleChange={(value) => {
                        setFieldValue("blogCategory", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("blogCategory", true);
                      }}
                    />
                  </div>

                  {/* Select Author */}
                  <div className="form-group col-md-6">
                    <CustomSelect
                      label="Select Author"
                      placeholder="Select Author"
                      name="author"
                      required={true}
                      options={authors}
                      value={values.author}
                      error={errors.author}
                      touched={touched.author}
                      isMulti={false}
                      handleChange={(value) => {
                        setFieldValue("author", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("author", true);
                      }}
                    />
                  </div>

                  <div className="form-group col-md-12">
                    <InputBox
                      label="Excerpt"
                      name="excerpt"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter description"
                      value={values.excerpt}
                      touched={touched.excerpt}
                      error={errors.excerpt}
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
                          Publish
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
                          Not Publish
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

            {/* Cover Image */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Cover Image</h5>
                  </div>

                  <div className="mb-3 col-md-6 d-flex justify-content-center flex-column">
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="imageFile"
                        onChange={(evt) => {
                          handleUploadFile(evt, "COVER_IMAGE");
                        }}
                      />
                      <label className="input-group-text" htmlFor="imageFile">
                        Upload
                      </label>
                    </div>

                    {touched.coverImage && errors.coverImage ? (
                      <p className="custom-form-error text-danger">
                        {errors.coverImage}
                      </p>
                    ) : null}
                  </div>

                  <div className="col-md-6 text-center">
                    {values.coverImage ? (
                      <Link to={`${values.coverImage}`} target="_blank">
                        <img
                          className="img img-fluid rounded bordered"
                          // height={200}
                          width={200}
                          src={addUrlToFile(values.coverImage)}
                        />
                      </Link>
                    ) : null}
                    {values.coverImage ? (
                      <button
                        type="button"
                        className="btn p-1"
                        onClick={(evt) => {
                          handleDeleteFile(
                            evt,
                            values.coverImage,
                            "COVER_IMAGE"
                          );
                        }}
                      >
                        <i className="fa fa-trash text-danger"></i>
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">Content</h5>
                  </div>

                  <div className="col-md-12 form-group" id="blog-editor">
                    {/* <label htmlFor={"content"} className="mb-2">
                            Product Description
                          </label> */}
                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        extraPlugins: [uploadPlugin],
                      }}
                      data={values?.content}
                      onChange={(__, editor) => {
                        const data = editor.getData();
                        setFieldValue("content", data);
                      }}
                      onBlur={() => {
                        setFieldTouched("content", true);
                      }}
                      onFocus={() => {}}
                      id={"content"}
                    />
                    {errors.content && touched.content ? (
                      <p className="custom-form-error text-danger">
                        {errors.content}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* META Details */}
            <div className="card rounded-2 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="mb-2">META Details</h5>
                  </div>
                  <div className="form-group col-md-12">
                    <InputBox
                      label="Meta Title"
                      name="metaTitle"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter meta title"
                      value={values.metaTitle}
                      touched={touched.metaTitle}
                      error={errors.metaTitle}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <TextareaBox
                      label="Meta Description"
                      name="metaDescription"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="Enter meta description"
                      value={values.metaDescription}
                      touched={touched.metaDescription}
                      error={errors.metaDescription}
                    />
                  </div>

                  <div className="form-group col-md-12">
                    <TextareaBox
                      label="Meta Keywords"
                      name="metaKeywords"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      placeholder="Enter meta keywords (comma saparated values)"
                      value={values.metaKeywords}
                      touched={touched.metaKeywords}
                      error={errors.metaKeywords}
                    />
                  </div>

                  <div className="">
                    <SubmitButton loading={false} text="Update Post" />
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
