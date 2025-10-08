import * as Yup from "yup";

export const colorSchema = Yup.object({
  name: Yup.string().required().label("Name"),
  code: Yup.string().required().label("Code"),
  anotherCode: Yup.string().label("Code 2"),
  status: Yup.string().required().label("Status"),
});

export const colorInitialValues: ColorValues = {
  name: "",
  code: "",
  anotherCode: "",
  status: "true",
};

export interface ColorValues {
  name: string;
  code: string;
  anotherCode: string;
  status: string;
}
