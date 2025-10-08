import {
  CustomSelect,
  GoBackButton,
  InputBox,
  SubmitButton,
  TextareaBox,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";
import {
  productSchema,
  ProductValues,
  productInitialValues,
} from "../../validationSchemas/productSchema";
import React, { useEffect, useState } from "react";
import {
  generateSlug,
  get,
  post,
  remove,
  validateNumber,
  validateSlug,
} from "../../utills";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../constants";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactHelmet from "../../components/ui/ReactHelmet";
import { addUrlToFile } from "../../utills/addUrlToFile";

export function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  const [, setLoading] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [status, setStatus] = useState<boolean | string>("");
  const [records, setRecords] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 60,
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
    [pagination.page, pagination.limit, searchQuery, status]
  );

  type PRODUCT_VARIANTS = {
    color: { label: string; value: string } | null;
    sizes: {
      salePrice: string;
      mrp: string;
      stock: string;
      size: { label: string; value: string } | null;
      image: string;
      images: string[];
    }[];
    error: string;
  };
  const [productVariantInputFields, setProductVariantInputFields] = useState<
    PRODUCT_VARIANTS[]
  >([
    {
      color: null,
      sizes: [
        {
          salePrice: "0",
          mrp: "0",
          stock: "1",
          size: null,
          image: "",
          images: [],
        },
      ],
      error: "",
    },
  ]);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    setFieldError,
  } = useFormik({
    onSubmit: async function (
      values: ProductValues,
      helpers: FormikHelpers<ProductValues>
    ) {
      setLoading(true);

      const newValue: any = {
        ...values,
        category: values?.category?.value,
        subCategory: values.subCategory?.value,
        taxModel: values.taxModel?.value,
      };

      let productVariants = [];
      for (let variantFeild of productVariantInputFields) {
        if (variantFeild.color && variantFeild.sizes?.length) {
          productVariants.push({
            color: variantFeild.color?.value,
            sizes: variantFeild?.sizes?.map((item) => {
              return {
                salePrice: item?.salePrice,
                mrp: item?.mrp,
                stock: item?.stock,
                size: item?.size?.value,
                image: "",
                images: item.images,
              };
            }),
          });
        }
      }

      newValue.variants = productVariants;

      const apiResponse = await post("/products", newValue, true);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: productInitialValues,
    validationSchema: productSchema,
  });

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
        let url = `/subCategories?limit=100`;

        if (values.category) {
          url += `&category=${values.category?.value}`;
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
    [values.category]
  );

  // get features
  useEffect(function () {
    async function getData() {
      let url = `/features?limit=0&status=true`;

      const apiResponse = await get(url, true);

      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setFeatures(modifiedValue);
      }
    }
    getData();
  }, []);

  // get Size
  useEffect(function () {
    async function getData() {
      let url = `/sizes?limit=0&status=true`;
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

  // get Colors
  useEffect(function () {
    async function getData() {
      let url = `/colors?limit=0&status=true`;
      const apiResponse = await get(url, true);
      if (apiResponse?.status == 200) {
        const modifiedValue = apiResponse?.body?.map((value: any) => {
          return {
            label: value.name,
            value: value._id,
          };
        });
        setColors(modifiedValue);
      }
    }
    getData();
  }, []);

  // handleUploadFile
  async function handleUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const mimeTypes = ["image/jpeg", "image/png", "image/webp"];

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
        // if (inputElementName == "kycFile") {
        //   let kycDocsFiles = [...kycDocuments];
        //   kycDocuments[index]["error"] = "File type is not allowed";
        //   return setKycDocumnets(kycDocsFiles);
        // } else if (inputElementName == "certificateFile") {
        //   let certificateFields = [...faqsInputFields];
        //   certificateFields[index]["error"] = "File type is not allowed";
        //   return setFaqsInputFields(certificateFields);
        // }
      }
    }

    // Append each file to the FormData object
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
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

        setUploadedImages(images);
      }
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // handleUploadFiles
  async function handleUploadFiles(
    event: React.ChangeEvent<HTMLInputElement>,
    colorIndex: number,
    sizeIndex: number
  ) {
    console.log(colorIndex, sizeIndex);

    const mimeTypes = ["image/jpeg", "image/png", "image/webp"];
    const files = event.target.files;

    if (!files || files.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const formData = new FormData();

    // Validate and append allowed files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (mimeTypes.includes(file.type)) {
        formData.append("files", file);
      } else {
        toast.error(`File type ${file.type} is not allowed.`);
      }
    }

    try {
      const url = `${API_URL}/fileUploads`;
      const apiResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const apiData = await apiResponse.json();

      if (apiData.status === 200) {
        const newImages = apiData.body.map((item: any) => item.filename);

        // ✅ Update the images array in state
        setProductVariantInputFields((prev) => {
          const updated = [...prev];
          const sizes = [...updated[colorIndex].sizes];
          const currentImages = sizes[sizeIndex].images || [];

          sizes[sizeIndex] = {
            ...sizes[sizeIndex],
            images: [...currentImages, ...newImages],
          };

          updated[colorIndex] = {
            ...updated[colorIndex],
            sizes,
          };

          return updated;
        });

        toast.success("Images uploaded successfully.");
      } else {
        toast.error(apiData.message || "Upload failed.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    }
  }

  //
  async function handleDeleteFiles(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
    colorIndex: number,
    sizeIndex: number
  ) {
    event.preventDefault();

    try {
      const apiResponse = await remove(`/fileUploads/${fileName}`);

      if (apiResponse?.status === 200) {
        // Update state by removing the file from images[]
        setProductVariantInputFields((prev) => {
          const updated = [...prev];
          const sizes = [...updated[colorIndex].sizes];
          const currentSize = { ...sizes[sizeIndex] };

          const filteredImages = currentSize.images.filter(
            (img) => img !== fileName
          );

          sizes[sizeIndex] = {
            ...currentSize,
            images: filteredImages,
          };

          updated[colorIndex] = {
            ...updated[colorIndex],
            sizes,
          };

          return updated;
        });

        toast.success("Image deleted successfully");
      } else {
        toast.error(apiResponse?.message || "Failed to delete image");
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred during deletion");
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
      const apiResponse = await remove(`/fileUploads/${fileName}`);

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

  // handleUploadImage
  // async function handleUploadImage(event: React.ChangeEvent<HTMLInputElement>) {
  //   const mimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

  //   const files = event.target.files;

  //   if (!files || files.length === 0) {
  //     setFieldTouched("image", true);
  //     setFieldError("image", "Image is required field");
  //     toast.error("Image is required field");
  //     return;
  //   }

  //   // Validate MIME type and append valid files to FormData
  //   // Check if the file's MIME type is in the allowed list
  //   let file = files[0];
  //   if (!mimeTypes.includes(file.type)) {
  //     setFieldTouched("image", true);
  //     setFieldError("image", "Must select the valid image file");
  //     toast.error("Must select the valid image file");
  //     return;
  //   }

  //   const formData = new FormData();

  //   formData.append("files", file);

  //   try {
  //     let url = `${API_URL}/fileUploads`;
  //     const apiResponse = await fetch(url, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const apiData = await apiResponse.json();

  //     if (apiData.status == 200) {
  //       setFieldTouched("image", false);
  //       setFieldError("image", "");
  //       setFieldValue("image", apiData.body[0].filename);
  //     } else {
  //       setFieldTouched("image", false);
  //       setFieldError("image", apiData.message);
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.message);
  //   }
  // }

  // handleUploadImage
  async function handleUploadImage(
    event: React.ChangeEvent<HTMLInputElement>,
    colorIndex: number,
    sizeIndex: number
  ) {
    const mimeTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
    const files = event.target.files;

    if (!files || files.length === 0) {
      toast.error("Image is required field");
      return;
    }

    const file = files[0];

    if (!mimeTypes.includes(file.type)) {
      toast.error("Must select a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const url = `${API_URL}/fileUploads`;
      const apiResponse = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const apiData = await apiResponse.json();
      console.log(apiData);

      if (apiData.status === 200) {
        const uploadedImage = apiData.body[0].filename;

        console.log(uploadedImage);

        setProductVariantInputFields((prev) => {
          const updated = [...prev];
          const sizes = [...updated[colorIndex].sizes];

          sizes[sizeIndex] = {
            ...sizes[sizeIndex],
            image: uploadedImage, // update image field
          };

          updated[colorIndex] = {
            ...updated[colorIndex],
            sizes,
          };

          return updated;
        });

        toast.success("Image uploaded successfully");
      } else {
        toast.error(apiData.message || "Image upload failed");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  }

  // handleDeleteImage
  // async function handleDeleteImage(
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   fileName: string
  // ) {
  //   event.preventDefault();

  //   try {
  //     const apiResponse = await remove(`/fileUploads/${fileName}`);
  //     if (apiResponse?.status == 200) {
  //       setFieldError("image", "");
  //       setFieldValue("image", "");
  //     } else {
  //       setFieldError("image", "");
  //       setFieldValue("image", "");
  //       toast.error(apiResponse?.message);
  //     }

  //     const fileInput = document.getElementById(
  //       `imageFile`
  //     ) as HTMLInputElement;
  //     if (fileInput) {
  //       fileInput.value = ""; // Clear the input field
  //     }
  //   } catch (error: any) {
  //     toast.error(error?.message);
  //   }
  // }

  async function handleDeleteImage(
    event: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
    colorIndex: number,
    sizeIndex: number
  ) {
    event.preventDefault();

    try {
      const apiResponse = await remove(`/fileUploads/${fileName}`);

      if (apiResponse?.status === 200) {
        // Update state by clearing the image field
        setProductVariantInputFields((prev) => {
          const updated = [...prev];
          const sizes = [...updated[colorIndex].sizes];

          sizes[sizeIndex] = {
            ...sizes[sizeIndex],
            image: "", // Clear the image field
          };

          updated[colorIndex] = {
            ...updated[colorIndex],
            sizes,
          };

          return updated;
        });

        toast.success("Image deleted successfully");
      } else {
        toast.error(apiResponse?.message || "Failed to delete image");
      }

      const fileInput = document.getElementById(
        `imageFile-${colorIndex}-${sizeIndex}`
      ) as HTMLInputElement;

      if (fileInput) {
        fileInput.value = ""; // Clear the input field
      }
    } catch (error: any) {
      toast.error(error?.message || "An error occurred during deletion");
    }
  }

  function handleNameChange(evt: React.ChangeEvent<HTMLInputElement>) {
    let value = evt.target.value;
    let name = evt.target.name;
    setFieldValue(name, value);

    let slug = generateSlug(value);
    setFieldValue("slug", slug);
  }

  const handleAddVariantFields = () => {
    setProductVariantInputFields([
      ...productVariantInputFields,
      {
        color: null,
        sizes: [
          {
            salePrice: "0",
            mrp: "0",
            stock: "1",
            size: null,
            image: "",
            images: [],
          },
        ],
        error: "",
      },
    ]);
  };

  const handleAddSizeVariantFields = (index: number) => {
    setProductVariantInputFields((old) => {
      const updated = [...old]; // shallow copy of the array
      const sizes = [...updated[index].sizes]; // copy sizes array

      sizes.push({
        salePrice: "0",
        mrp: "0",
        stock: "1",
        size: null,
        image: "",
        images: [],
      });

      updated[index] = {
        ...updated[index],
        sizes,
      };

      return updated;
    });
  };

  const handleRemoveSizeVariantField = (
    variantIndex: number,
    sizeIndex: number
  ) => {
    setProductVariantInputFields((old) => {
      const updated = [...old]; // shallow copy of variants
      const sizes = [...updated[variantIndex].sizes]; // shallow copy of sizes array

      sizes.splice(sizeIndex, 1); // remove the size at given index

      updated[variantIndex] = {
        ...updated[variantIndex],
        sizes,
      };

      return updated;
    });
  };

  const handleRemoveVariantFields = (index: number) => {
    const updatedInputFields = [...productVariantInputFields];
    updatedInputFields.splice(index, 1);
    setProductVariantInputFields(updatedInputFields);
  };

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <ReactHelmet title="Add Product" />
              <h4 className="font-weight-bold mb-0">Add Product</h4>
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
            <form className="forms-sample" onSubmit={handleSubmit}>
              {/* Basic Details */}
              <div className="card rounded-2">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-2">Basic Details</h5>
                    </div>

                    {/* Product Name */}
                    <div className="form-group col-md-6">
                      <InputBox
                        label="Product Name"
                        name="name"
                        handleBlur={handleBlur}
                        handleChange={handleNameChange}
                        type="text"
                        placeholder="Enter program name"
                        value={values.name}
                        required={true}
                        touched={touched.name}
                        error={errors.name}
                      />
                    </div>

                    {/* Slug */}
                    <div className="form-group col-md-6">
                      <InputBox
                        label="Product Slug"
                        name="slug"
                        handleBlur={handleBlur}
                        handleChange={(evt) => {
                          setFieldValue("slug", validateSlug(evt.target.value));
                        }}
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
                        name="category"
                        required={true}
                        options={categories}
                        value={values.category}
                        error={errors.category}
                        touched={touched.category}
                        isMulti={false}
                        handleChange={(value) => {
                          setFieldValue("category", value);
                        }}
                        handleBlur={() => {
                          setFieldTouched("category", true);
                        }}
                      />
                    </div>

                    {/* Select Sub Category */}
                    <div className="form-group col-md-6">
                      <CustomSelect
                        label="Select Sub Category"
                        placeholder="Select Category"
                        name="subCategory"
                        required={false}
                        options={subCategories}
                        value={values.subCategory}
                        error={errors.subCategory}
                        touched={touched.subCategory}
                        isMulti={false}
                        handleChange={(value) => {
                          setFieldValue("subCategory", value);
                        }}
                        handleBlur={() => {
                          setFieldTouched("subCategory", true);
                        }}
                      />
                    </div>

                    {/* Product SKU */}
                    <div className="form-group col-md-6">
                      <InputBox
                        label="Product SKU"
                        name="sku"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        type="text"
                        placeholder="Enter sku"
                        value={values.sku}
                        required={false}
                        touched={touched.sku}
                        error={errors.sku}
                      />
                    </div>

                    <div className="form-group col-md-6">
                      <label htmlFor="">
                        Status <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="status"
                            id="statusTrue"
                            value={"true"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={values.status == "true"}
                          />
                          <label htmlFor="statusTrue" className="mt-2">
                            Active
                          </label>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <input
                            type="radio"
                            name="status"
                            id="statusFalse"
                            value={"false"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={values.status == "false"}
                          />
                          <label htmlFor="statusFalse" className="mt-2">
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

                    <div className="form-group col-md-6">
                      <label htmlFor="">
                        Product Badge <span className="text-danger">*</span>
                      </label>
                      <div className="d-flex gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="badge"
                            id="badge-best-seller"
                            value={"BEST_SELLER"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={values.badge == "BEST_SELLER"}
                          />
                          <label htmlFor="badge-best-seller" className="mt-2">
                            Best Seller
                          </label>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="badge"
                            id="badge-top-selling"
                            value={"TOP_SELLING"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={values.badge == "TOP_SELLING"}
                          />
                          <label htmlFor="badge-top-selling" className="mt-2">
                            Top Selling
                          </label>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="badge"
                            id="badge-limited-edition"
                            value={"LIMITED_EDITION"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={values.badge == "LIMITED_EDITION"}
                          />
                          <label
                            htmlFor="badge-limited-edition"
                            className="mt-2"
                          >
                            Limited Edition
                          </label>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="badge"
                            id="badge-none"
                            value={""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={values.badge == ""}
                          />
                          <label htmlFor="badge-none" className="mt-2">
                            None of These
                          </label>
                        </div>
                      </div>
                      {errors.badge && touched.badge ? (
                        <p className="custom-form-error text-danger">
                          {errors.badge}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-3">Tax Information</h5>
                    </div>

                    {/* Tax Percentage */}
                    <div className="form-group col-md-6">
                      <InputBox
                        label="Tax Percentage"
                        name="taxPercent"
                        handleBlur={handleBlur}
                        handleChange={(evt) => {
                          setFieldValue(
                            "taxPercent",
                            validateNumber(evt.target.value)
                          );
                        }}
                        type="number"
                        placeholder="Enter sale price"
                        value={values.taxPercent}
                        required={true}
                        touched={touched.taxPercent}
                        error={errors.taxPercent}
                      />
                    </div>

                    {/* Tax Model */}
                    <div className="form-group col-md-6">
                      <CustomSelect
                        label="Tax Model"
                        placeholder="Tax Model"
                        name="taxModel"
                        required={true}
                        options={[
                          { label: "INCLUDE", value: "INCLUDE" },
                          { label: "EXCLUDE", value: "EXCLUDE" },
                        ]}
                        value={values.taxModel}
                        error={errors.taxModel}
                        touched={touched.taxModel}
                        handleChange={(value) => {
                          setFieldValue("taxModel", value);
                        }}
                        handleBlur={() => {
                          setFieldTouched("taxModel", true);
                        }}
                        isMulti={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Variants*/}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 d-flex justify-content-between align-items-center mb-2">
                      <h5 className="mb-2">Product Variants</h5>
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={handleAddVariantFields}
                      >
                        <i className="fas fa-plus text-info"></i>
                      </button>
                    </div>
                    <div className="form-group col-md-12">
                      {productVariantInputFields.map((field, index) => (
                        <div className="mb-2 shadow-sm p-2 border">
                          {/* Select Color */}
                          <div className="form-group col-md-5 d-flex gap-2 m-0 align-items-center">
                            <CustomSelect
                              label=""
                              placeholder="Select Color"
                              name="color"
                              required={false}
                              options={colors}
                              value={field.color}
                              error={field.error}
                              touched={false}
                              handleChange={(value) => {
                                const updatedInputFields = [
                                  ...productVariantInputFields,
                                ];
                                updatedInputFields[index]["color"] = value;
                                setProductVariantInputFields(
                                  updatedInputFields
                                );
                                // setFieldValue("size", value);
                              }}
                              handleBlur={() => {
                                // setFieldTouched("size", true);
                              }}
                              isMulti={false}
                              padding="0px"
                            />

                            <span>
                              {index != 0 ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveVariantFields(index)
                                  }
                                  className="btn btn-light p-1"
                                >
                                  <i className="fas fa-trash text-danger"></i>
                                </button>
                              ) : null}
                            </span>
                          </div>

                          <div
                            className="col-md-12"
                            style={{ paddingLeft: "30px" }}
                          >
                            <table className="table p-0 m-0 table-borderless">
                              <thead>
                                <tr>
                                  <th style={{ width: "40px" }}></th>
                                  <th>Size</th>
                                  <th>MRP</th>
                                  <th>Sale Price</th>
                                  <th>
                                    <span>Stock</span>
                                  </th>
                                  {/* <th>Image</th> */}
                                  <th className="d-flex gap-3 align-items-center justify-content-end">
                                    {/* Images */}
                                    <div className="">
                                      <button
                                        type="button"
                                        className="btn btn-none p-2 border"
                                        onClick={() => {
                                          handleAddSizeVariantFields(index);
                                        }}
                                      >
                                        <i className="fas fa-plus text-info"></i>{" "}
                                        Size
                                      </button>
                                    </div>
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {field?.sizes?.map((sizeField, sizeIndex) => {
                                  console.log(sizeIndex);
                                  return (
                                    <tr>
                                      <td>
                                        {sizeIndex != 0 ? (
                                          <div>
                                            <button
                                              type="button"
                                              className="btn btn-light p-1"
                                              onClick={() => {
                                                handleRemoveSizeVariantField(
                                                  index,
                                                  sizeIndex
                                                );
                                              }}
                                            >
                                              <i className="fas fa-trash text-danger"></i>
                                            </button>
                                          </div>
                                        ) : null}
                                      </td>
                                      <td style={{ width: "200px" }}>
                                        <div className="form-group m-0">
                                          <CustomSelect
                                            label=""
                                            placeholder="Select Size"
                                            name="size"
                                            required={false}
                                            options={sizes}
                                            value={sizeField.size}
                                            error={""}
                                            touched={false}
                                            handleChange={(value) => {
                                              const updatedInputFields = [
                                                ...productVariantInputFields,
                                              ];
                                              updatedInputFields[index][
                                                "sizes"
                                              ][sizeIndex]["size"] = value;
                                              setProductVariantInputFields(
                                                updatedInputFields
                                              );
                                              // setFieldValue("size", value);
                                            }}
                                            handleBlur={() => {
                                              // setFieldTouched("size", true);
                                            }}
                                            isMulti={false}
                                            padding="0px"
                                          />
                                        </div>
                                      </td>

                                      <td style={{ width: "100px" }}>
                                        <div className="form-group m-0">
                                          <input
                                            className="form-control"
                                            value={sizeField.mrp}
                                            onChange={(e) => {
                                              const updatedInputFields = [
                                                ...productVariantInputFields,
                                              ];
                                              updatedInputFields[index][
                                                "sizes"
                                              ][sizeIndex]["mrp"] =
                                                e.target.value;
                                              setProductVariantInputFields(
                                                updatedInputFields
                                              );
                                            }}
                                            placeholder="MRP"
                                            style={{
                                              padding: "10px",
                                              borderRadius: "5px",
                                            }}
                                          />
                                        </div>
                                      </td>

                                      <td style={{ width: "100px" }}>
                                        <div className="form-group m-0">
                                          <input
                                            className="form-control"
                                            value={sizeField.salePrice}
                                            onChange={(e) => {
                                              const updatedInputFields = [
                                                ...productVariantInputFields,
                                              ];
                                              updatedInputFields[index][
                                                "sizes"
                                              ][sizeIndex]["salePrice"] =
                                                e.target.value;
                                              setProductVariantInputFields(
                                                updatedInputFields
                                              );
                                            }}
                                            placeholder="Sale Price"
                                            style={{
                                              padding: "10px",
                                              borderRadius: "5px",
                                            }}
                                          />
                                        </div>
                                      </td>

                                      <td style={{ width: "100px" }}>
                                        <div
                                          className="form-group m-0 d-flex gap-1"
                                          style={{ alignItems: "center" }}
                                        >
                                          <div className="">
                                            <input
                                              className="form-control"
                                              value={sizeField.stock}
                                              onChange={(e) => {
                                                const updatedInputFields = [
                                                  ...productVariantInputFields,
                                                ];
                                                updatedInputFields[index][
                                                  "sizes"
                                                ][sizeIndex]["stock"] =
                                                  e.target.value;
                                                setProductVariantInputFields(
                                                  updatedInputFields
                                                );
                                              }}
                                              placeholder="Sale Price"
                                              style={{
                                                padding: "10px",
                                                borderRadius: "5px",
                                              }}
                                            />
                                          </div>

                                          {/* {sizeIndex != 0 ? (
                                            <div className="">
                                              <button
                                                type="button"
                                                className="btn btn-light p-1"
                                                onClick={() => {
                                                  handleRemoveSizeVariantField(
                                                    index,
                                                    sizeIndex
                                                  );
                                                }}
                                              >
                                                <i className="fas fa-trash text-danger"></i>
                                              </button>
                                            </div>
                                          ) : null} */}
                                        </div>
                                      </td>

                                      {/* <td style={{ width: "100px" }}>
                                        <div className="">
                                          {!sizeField.image ? (
                                            <div className="">
                                              <input
                                                type="file"
                                                id="image"
                                                style={{ display: "none" }}
                                                onChange={(evt) => {
                                                  handleUploadImage(
                                                    evt,
                                                    index,
                                                    sizeIndex
                                                  );
                                                }}
                                              />
                                              <label htmlFor="image">
                                                <img
                                                  src="/images/select-photo.png"
                                                  style={{
                                                    borderRadius: "0px",
                                                  }}
                                                />
                                              </label>
                                            </div>
                                          ) : null}

                                          {sizeField.image ? (
                                            <Link
                                              to={`${sizeField.image}`}
                                              target="_blank"
                                            >
                                              <img
                                                className="img"
                                                height={43}
                                                width={43}
                                                src={addUrlToFile(
                                                  sizeField.image
                                                )}
                                              />
                                            </Link>
                                          ) : null}
                                          {sizeField.image ? (
                                            <button
                                              type="button"
                                              className="btn p-1"
                                              onClick={(evt) => {
                                                handleDeleteImage(
                                                  evt,
                                                  sizeField.image,
                                                  index,
                                                  sizeIndex
                                                );
                                              }}
                                            >
                                              <i className="fa fa-trash text-danger"></i>
                                            </button>
                                          ) : null}
                                        </div>
                                      </td> */}

                                      <td>
                                        <div className="d-flex align-items-center gap-2">
                                          <div>
                                            <input
                                              type="file"
                                              id={`images-${index}-${sizeIndex}`}
                                              style={{ display: "none" }}
                                              multiple={true}
                                              onChange={(evt) => {
                                                handleUploadFiles(
                                                  evt,
                                                  index,
                                                  sizeIndex
                                                );
                                              }}
                                            />

                                            <label
                                              htmlFor={`images-${index}-${sizeIndex}`}
                                            >
                                              <img
                                                src="/images/select-photo.png"
                                                style={{ borderRadius: "0px" }}
                                              />
                                            </label>
                                          </div>

                                          {sizeField?.images?.map(
                                            (
                                              file: string,
                                              fileIndex: number
                                            ) => {
                                              return (
                                                <div className="p-image d-flex align-items-center">
                                                  <button
                                                    type="button"
                                                    className="btn btn-danger p-image-remove"
                                                    onClick={(evt) => {
                                                      handleDeleteFiles(
                                                        evt,
                                                        file,
                                                        index,
                                                        sizeIndex
                                                      );
                                                    }}
                                                  >
                                                    X
                                                  </button>
                                                  <img
                                                    className="img img-thumbnail"
                                                    src={addUrlToFile(file)}
                                                  />
                                                </div>
                                              );
                                            }
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                          <div className="col-md-12">
                            <p className="custom-form-error text-danger">
                              {field?.error}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order & Shipping */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-3">Order & Shipping</h5>
                    </div>

                    {/* Minimum Order Quantity */}
                    <div className="form-group col-md-4">
                      <InputBox
                        label="Minimum Order Quantity"
                        name="minimumOrderQuantity"
                        handleBlur={handleBlur}
                        handleChange={(evt) => {
                          setFieldValue(
                            "minimumOrderQuantity",
                            validateNumber(evt.target.value)
                          );
                        }}
                        type="text"
                        placeholder="Enter order quantity"
                        value={values.minimumOrderQuantity}
                        required={true}
                        touched={touched.minimumOrderQuantity}
                        error={errors.minimumOrderQuantity}
                      />
                    </div>

                    {/* Shipping Cost */}
                    <div className="form-group col-md-4">
                      <InputBox
                        label="Shipping Cost"
                        name="shippingCost"
                        handleBlur={handleBlur}
                        handleChange={(evt) => {
                          setFieldValue(
                            "shippingCost",
                            validateNumber(evt.target.value)
                          );
                        }}
                        type="text"
                        placeholder="Enter order quantity"
                        value={values.shippingCost}
                        required={false}
                        touched={touched.shippingCost}
                        error={errors.shippingCost}
                      />
                    </div>

                    <div className="form-group col-md-4">
                      <label htmlFor="">
                        Shipping Multiply With Quantity{" "}
                        {/* <span className="text-danger">*</span> */}
                      </label>
                      <div className="d-flex gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="radio"
                            name="shippingMultiplyWithQuantity"
                            id="shippingMultiplyWithQuantityTrue"
                            value={"true"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={
                              values.shippingMultiplyWithQuantity == "true"
                            }
                          />
                          <label
                            htmlFor="shippingMultiplyWithQuantityTrue"
                            className="mt-2"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <input
                            type="radio"
                            name="shippingMultiplyWithQuantity"
                            id="shippingMultiplyWithQuantityFalse"
                            value={"false"}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            checked={
                              values.shippingMultiplyWithQuantity == "false"
                            }
                          />
                          <label
                            htmlFor="shippingMultiplyWithQuantityFalse"
                            className="mt-2"
                          >
                            No
                          </label>
                        </div>
                      </div>
                      {errors.shippingMultiplyWithQuantity &&
                      touched.shippingMultiplyWithQuantity ? (
                        <p className="custom-form-error text-danger">
                          {errors.shippingMultiplyWithQuantity}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* More Details */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-2">More Details</h5>
                    </div>
                    <div className="col-md-12 form-group">
                      <label htmlFor={"description"} className="mb-2">
                        Long Description
                      </label>
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onChange={(__, editor) => {
                          const data = editor.getData();
                          setFieldValue("description", data);
                        }}
                        onBlur={() => {
                          setFieldTouched("description", true);
                        }}
                        onFocus={() => {}}
                        id={"description"}
                      />
                      {errors.description && touched.description ? (
                        <p className="custom-form-error text-danger">
                          {errors.description}
                        </p>
                      ) : null}
                    </div>

                    <div className="col-md-12 form-group">
                      <label htmlFor={"description"} className="mb-2">
                        Short Description
                      </label>
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onChange={(__, editor) => {
                          const data = editor.getData();
                          setFieldValue("shortDescription", data);
                        }}
                        onBlur={() => {
                          setFieldTouched("shortDescription", true);
                        }}
                        onFocus={() => {}}
                        id={"shortDescription"}
                      />
                      {errors.shortDescription && touched.shortDescription ? (
                        <p className="custom-form-error text-danger">
                          {errors.shortDescription}
                        </p>
                      ) : null}
                    </div>

                    {/* <div className="col-md-12 form-group">
                      <label htmlFor={"description"} className="mb-2">
                        How To Use
                      </label>
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onChange={(__, editor) => {
                          const data = editor.getData();
                          setFieldValue("howToUse", data);
                        }}
                        onBlur={() => {
                          setFieldTouched("howToUse", true);
                        }}
                        onFocus={() => {}}
                        id={"howToUse"}
                      />
                      {errors.howToUse && touched.howToUse ? (
                        <p className="custom-form-error text-danger">
                          {errors.howToUse}
                        </p>
                      ) : null}
                    </div> */}

                    <div className="col-md-12 form-group">
                      <label htmlFor={"description"} className="mb-2">
                        Benefits
                      </label>
                      <CKEditor
                        editor={ClassicEditor}
                        data=""
                        onChange={(__, editor) => {
                          const data = editor.getData();
                          setFieldValue("benefits", data);
                        }}
                        onBlur={() => {
                          setFieldTouched("benefits", true);
                        }}
                        onFocus={() => {}}
                        id={"benefits"}
                      />
                      {errors.benefits && touched.benefits ? (
                        <p className="custom-form-error text-danger">
                          {errors.benefits}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Tags */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-3">Search Tags</h5>
                    </div>

                    {/* Tags */}
                    <div className="form-group col-md-12">
                      <InputBox
                        label="Tags"
                        name="tags"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        type="text"
                        placeholder="Enter tags"
                        value={values.tags}
                        required={false}
                        touched={touched.tags}
                        error={errors.tags}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-3">Product Media</h5>
                    </div>

                    <div className="form-group col-md-12">
                      <div className="select-product-section">
                        <div className="d-flex gap-2 align-items-center">
                          <button>
                            <label htmlFor={"imagesFile"} style={{ margin: 0 }}>
                              Upload New
                            </label>
                          </button>

                          <label style={{ margin: 0 }}>Select Existing</label>
                        </div>
                        <p className="mt-2">Accept Images (png, jpg, jpeg)</p>
                      </div>

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
                              <img
                                className="img img-thumbnail"
                                src={addUrlToFile(file)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketplace Links */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-3">Marketplace Links</h5>
                    </div>

                    {/* Amazon Product Link */}
                    <div className="form-group col-md-6">
                      <InputBox
                        label="Amazon Product Link"
                        name="amazon"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        type="text"
                        placeholder="Enter link"
                        value={values.amazon}
                        required={true}
                        touched={touched.amazon}
                        error={errors.amazon}
                      />
                    </div>

                    {/* Flipkart Product Link */}
                    <div className="form-group col-md-6">
                      <InputBox
                        label="Flipkart Product Link"
                        name="flipkart"
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        type="text"
                        placeholder="Enter link"
                        value={values.flipkart}
                        required={true}
                        touched={touched.flipkart}
                        error={errors.flipkart}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Details */}
              <div className="card rounded-2 mt-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="mb-2">Meta Details</h5>
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
                      <SubmitButton loading={false} text="Add Product" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
