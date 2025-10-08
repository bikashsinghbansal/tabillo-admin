import * as Yup from "yup";

export const productSchema = Yup.object({
  name: Yup.string().required().label("Name"),
  slug: Yup.string().required().label("Slug"),

  category: Yup.object().required().label("Category"),
  subCategory: Yup.object().nullable().label("Sub Category"),

  sku: Yup.string().required().label("SKU"),

  image: Yup.string().required().label("Default Image"),
  images: Yup.array().of(Yup.string()).nullable().optional().label("Images"),

  description: Yup.string().label("Description"),
  shortDescription: Yup.string().label("Short Descriptions"),

  metaTitle: Yup.string().label("Meta Title"),
  metaDescription: Yup.string().label("Meta Description"),
  metaKeywords: Yup.string().label("Meta Keywords"),
  tags: Yup.string().label("Tags"),

  thickness: Yup.string().label("Thickness"),
  core: Yup.string().label("Core"),

  status: Yup.string().required().label("Status"),
});

export const productInitialValues: ProductValues = {
  name: "",
  slug: "",
  category: null,
  subCategory: null,

  sku: "",

  image: "",
  images: null,

  description: "",
  shortDescription: "",

  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  tags: "",

  thickness: "",
  core: "",

  status: "true",
};

export interface ProductValues {
  name: string;
  slug: string;
  category: {
    label: string;
    value: string;
  } | null;

  subCategory: {
    label: string;
    value: string;
  } | null;

  sku: string;

  image: string;
  images: string[] | null;

  description: string;
  shortDescription: string;

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  tags: string;

  thickness: string;
  core: string;

  status: string;
}

export type FileType = {
  fieldname: string;
  encoding: string;
  originalname: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: string;
  filepath: string;
};
