import {
  CustomSelect,
  GoBackButton,
  InputBox,
  SubmitButton,
  TextareaBox,
} from "../../components";
import { FormikHelpers, useFormik } from "formik";

import {
  categorySchema,
  CategoryValues,
  categoryInitialValues,
} from "../../validationSchemas/subCategorySchema";
import { useEffect, useState } from "react";
import { generateSlug, get, post } from "../../utills";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function AddSubCategory() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<any[]>([]);
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    onSubmit: async function (
      values: CategoryValues,
      helpers: FormikHelpers<CategoryValues>
    ) {
      setLoading(true);

      const newValue = {
        ...values,
        category: values.category?.value,
      };

      const apiResponse = await post("/subCategories", newValue, true);

      if (apiResponse?.status == 200) {
        toast.success(apiResponse?.message);
        navigate(-1);
      } else {
        helpers.setErrors(apiResponse?.errors);
        toast.error(apiResponse?.message);
      }
      setLoading(false);
    },
    initialValues: categoryInitialValues,
    validationSchema: categorySchema,
  });

  function handleTitleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    // let value = validateTextNumber(evt.target.value);
    let value = evt.target.value;
    let name = evt.target.name;
    setFieldValue(name, value);

    let slug = generateSlug(value);
    setFieldValue("slug", slug);
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

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-2">
              <GoBackButton />
              <h4 className="font-weight-bold mb-0">Add Sub Category</h4>
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
          <div className="card rounded-2">
            <div className="card-body">
              <form className="forms-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-group col-md-6">
                    <InputBox
                      label="Category Name"
                      name="name"
                      handleBlur={handleBlur}
                      handleChange={handleTitleChange}
                      type="text"
                      placeholder="Enter category name"
                      value={values.name}
                      required={true}
                      touched={touched.name}
                      error={errors.name}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Category Slug"
                      name="slug"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter category slug"
                      value={values.slug}
                      required={true}
                      touched={touched.slug}
                      error={errors.slug}
                    />
                  </div>
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
                      handleChange={(value) => {
                        setFieldValue("category", value);
                      }}
                      handleBlur={() => {
                        setFieldTouched("category", true);
                      }}
                      isMulti={false}
                    />
                  </div>

                  <div className="form-group col-md-6">
                    <InputBox
                      label="Short Description"
                      name="shortDescription"
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      type="text"
                      placeholder="Enter description"
                      value={values.shortDescription}
                      touched={touched.shortDescription}
                      error={errors.shortDescription}
                    />
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
                </div>

                <SubmitButton loading={false} text="Add Category" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
