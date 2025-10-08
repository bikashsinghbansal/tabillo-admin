import * as Yup from "yup";

export const homepageSchema = Yup.object({
  // Aboutus
  aboutusTitle: Yup.string().label("Aboutus Title"),
  aboutusSubTitle: Yup.string().label("Aboutus Sub Title"),
  aboutusImage: Yup.string().label("Aboutus Image"),
  aboutusVideo: Yup.string().label("Aboutus Video"),
  aboutusDescription: Yup.string().label("Aboutus Description"),
  aboutusButtonText: Yup.string().label("Aboutus Button Text"),
  aboutusButtonLink: Yup.string().label("Aboutus Button Link"),

  // Featured
  featuredTitle: Yup.string().label("Featured Title"),
  featuredSubTitle: Yup.string().label("Featured Sub Title"),
  featuredImage: Yup.string().label("Featured Image"),
  featuredVideo: Yup.string().label("Featured Video"),
  featuredDescription: Yup.string().label("Featured Description"),
  featuredButtonText: Yup.string().label("Featured Button Text"),
  featuredButtonLink: Yup.string().label("Featured Button Link"),

  // Gallery
  galleryTitle: Yup.string().label("Gallery Title"),
  gallerySubTitle: Yup.string().label("Gallery Sub Title"),
  galleryDescription: Yup.string().label("Gallery Description"),

  // Blog
  blogTitle: Yup.string().label("Blog Title"),
  blogSubTitle: Yup.string().label("Blog Sub Title"),
  blogDescription: Yup.string().label("Blog Description"),

  // Inquiry
  inquiryTitle: Yup.string().label("Inquiry Title"),
  inquirySubTitle: Yup.string().label("Inquiry Sub Title"),
  inquiryDescription: Yup.string().label("Inquiry Description"),
  inquiryImage: Yup.string().label("Inquiry Image"),

  // Meta
  metaTitle: Yup.string().label("Meta Title"),
  metaDescription: Yup.string().label("Meta Description"),
  metaKeywords: Yup.string().label("Meta Keywords"),
});

export const homepageInitialValues: HomepageValues = {
  // Aboutus
  aboutusTitle: "",
  aboutusSubTitle: "",
  aboutusImage: "",
  aboutusVideo: "",
  aboutusDescription: "",
  aboutusButtonText: "",
  aboutusButtonLink: "",

  // Marketing
  marketingTitle: "",
  marketingSubTitle: "",
  marketingImage: "",
  marketingVideo: "",
  marketingDescription: "",
  marketingButtonText: "",
  marketingButtonLink: "",

  // Gallery
  galleryTitle: "",
  gallerySubTitle: "",
  galleryDescription: "",

  // Blog
  blogTitle: "",
  blogSubTitle: "",
  blogDescription: "",

  // Inquiry
  inquiryTitle: "",
  inquirySubTitle: "",
  inquiryDescription: "",
  inquiryImage: "",

  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

export interface HomepageValues {
  // Aboutus
  aboutusTitle: string;
  aboutusSubTitle: string;
  aboutusImage: string;
  aboutusVideo: string;
  aboutusDescription: string;
  aboutusButtonText: string;
  aboutusButtonLink: string;

  // Marketing
  marketingTitle: string;
  marketingSubTitle: string;
  marketingImage: string;
  marketingVideo: string;
  marketingDescription: string;
  marketingButtonText: string;
  marketingButtonLink: string;

  // Gallery
  galleryTitle: string;
  gallerySubTitle: string;
  galleryDescription: string;

  // Blog
  blogTitle: string;
  blogSubTitle: string;
  blogDescription: string;

  // Inquiry
  inquiryTitle: string;
  inquirySubTitle: string;
  inquiryDescription: string;
  inquiryImage: string;

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
