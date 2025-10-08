import * as Yup from "yup";

export const featuresSchema = Yup.object({
  name: Yup.string().required().label("Name"),
  image: Yup.string().required().label("Image"),

  priority: Yup.number().required().label("Priority"),

  shortDescription: Yup.string().label("Short Description"),

  showInListing: Yup.string().label("Show In Listing"),
  status: Yup.string().label("Status"),
});

export const featuresInitialValues: FeaturesValues = {
  name: "",
  image: "",

  priority: 0,

  shortDescription: "",

  showInListing: "false",
  status: "true",
};

export interface FeaturesValues {
  name: string;
  image: string;

  priority: number;

  shortDescription: string;

  showInListing: string;
  status: string;
}
