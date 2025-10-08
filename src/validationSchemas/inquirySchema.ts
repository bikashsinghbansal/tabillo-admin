import * as Yup from "yup";

export const inquirySchema = Yup.object({
  name: Yup.string().required().label("Name"),
  email: Yup.string().email().required().label("Email"),
  mobile: Yup.string().required().label("Mobile"),
  countryCode: Yup.object().required().label("Country Code"),
  message: Yup.string().label("Message"),
  address: Yup.string().label("Address"),
  city: Yup.string().label("City"),
  state: Yup.string().label("State"),
  country: Yup.object().nullable().label("Country"),
  pincode: Yup.string().label("Pincode"),
  position: Yup.string().label("Position"),
  interest: Yup.object().required().label("Interest"),
  categoryOfInterest: Yup.object().required().label("Category Of Interest"),
  inquiryStatus: Yup.string().label("Inquiry Status"),
});

export const inquiryInitialValues: InquiryValues = {
  name: "",
  email: "",
  mobile: "",
  countryCode: null,
  message: "",
  address: "",
  city: "",
  state: "",
  country: null,
  pincode: "",
  position: "ADMIN",
  interest: null,
  categoryOfInterest: null,
  inquiryStatus: "PENDING",
};

export interface InquiryValues {
  name: string;
  email: string;
  mobile: string;
  countryCode: {
    label: string;
    value: string;
  } | null;
  message: string;
  address: string;
  city: string;
  state: string;
  country: {
    label: string;
    value: string;
  } | null;
  pincode: string;
  position: string;
  interest: {
    label: string;
    value: string;
  } | null;
  categoryOfInterest: {
    label: string;
    value: string;
  } | null;
  inquiryStatus: string;
}
