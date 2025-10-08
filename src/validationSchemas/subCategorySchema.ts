import * as Yup from "yup";

export const categorySchema = Yup.object({
  name: Yup.string().required().label("Name"),
  slug: Yup.string().required().label("Slug"),
  category: Yup.object().required().label("Category"),
  shortDescription: Yup.string().label("Short Description"),
  metaTitle: Yup.string().label("Meta Title"),
  metaDescription: Yup.string().label("Meta Description"),
  metaKeywords: Yup.string().label("Meta Keywords"),
  status: Yup.bool().label("Status"),
});

export const categoryInitialValues: CategoryValues = {
  name: "",
  slug: "",
  category: null,
  shortDescription: "",
  status: "true",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export interface CategoryValues {
  name: string;
  slug: string;
  category: { label: ""; value: "" } | null;
  shortDescription: string;
  status: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
