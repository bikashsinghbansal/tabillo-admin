import { Routes, Route } from "react-router-dom";
import * as Pages from "../../pages";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Pages.Home />} />
      <Route path="/login" element={<Pages.Login />} />
      <Route path="/forgot-password" element={<Pages.ForgotPassword />} />
      <Route path="/verify-otp" element={<Pages.VerifyOtp />} />
      <Route
        path="/create-new-password"
        element={<Pages.CreateNewPassword />}
      />

      {/* Media */}
      <Route path="/media/add" element={<Pages.AddMedia />} />
      {/* <Route path="/categories/edit/:id" element={<Pages.EditCategory />} /> */}
      <Route path="/media" element={<Pages.MediaList />} />

      {/* Category */}
      <Route path="/categories/add" element={<Pages.AddCategory />} />
      <Route path="/categories/edit/:id" element={<Pages.EditCategory />} />
      <Route path="/categories" element={<Pages.CategoryList />} />

      {/* Carousel */}
      <Route path="/carousels/add" element={<Pages.AddCarousel />} />
      <Route path="/carousels/edit/:id" element={<Pages.EditCarousel />} />
      <Route path="/carousels" element={<Pages.CarouselList />} />

      {/* Category Showcase */}
      <Route
        path="/categoryShowcase/add"
        element={<Pages.AddCategoryShowcase />}
      />
      <Route
        path="/categoryShowcase/edit/:id"
        element={<Pages.EditCategoryShowcase />}
      />
      <Route
        path="/categoryShowcase"
        element={<Pages.CategoryShowcaseList />}
      />

      {/* Homepage */}
      <Route path="/homepage" element={<Pages.HomepageContent />} />

      {/* Sub Category */}
      <Route path="/subCategories/add" element={<Pages.AddSubCategory />} />
      <Route
        path="/subCategories/edit/:id"
        element={<Pages.EditSubCategory />}
      />
      <Route path="/subCategories" element={<Pages.SubCategoryList />} />

      {/* Newsletters */}
      <Route path="/newsletters/add" element={<Pages.AddNewsletter />} />
      <Route path="/newsletters/edit/:id" element={<Pages.EditNewsletter />} />
      <Route path="/newsletters" element={<Pages.NewsletterList />} />

      {/* Sizes */}
      <Route path="/sizes/add" element={<Pages.AddSize />} />
      <Route path="/sizes/edit/:id" element={<Pages.EditSize />} />
      <Route path="/sizes" element={<Pages.SizeList />} />

      {/* Shapes */}
      <Route path="/shapes/add" element={<Pages.AddShape />} />
      <Route path="/shapes/edit/:id" element={<Pages.EditShape />} />
      <Route path="/shapes" element={<Pages.ShapeList />} />

      {/* Posts */}
      <Route path="/blogCategories/add" element={<Pages.AddBlogCategory />} />
      <Route
        path="/blogCategories/edit/:id"
        element={<Pages.EditBlogCategory />}
      />
      <Route path="/blogCategories" element={<Pages.BlogCategoryList />} />

      {/* Authors */}
      <Route path="/authors/add" element={<Pages.AddAuthor />} />
      <Route path="/authors/edit/:id" element={<Pages.EditAuthor />} />
      <Route path="/authors" element={<Pages.AuthorList />} />

      {/* Posts */}
      <Route path="/posts/add" element={<Pages.AddPost />} />
      <Route path="/posts/edit/:id" element={<Pages.EditPost />} />
      <Route path="/posts" element={<Pages.PostList />} />

      {/* Promotion Text */}
      <Route path="/promotionTexts/add" element={<Pages.AddPromotionText />} />
      <Route
        path="/promotionTexts/edit/:id"
        element={<Pages.EditPromotionText />}
      />
      <Route path="/promotionTexts" element={<Pages.PromotionTextList />} />

      {/* Features */}
      <Route path="/features/add" element={<Pages.AddFeatures />} />
      <Route path="/features/edit/:id" element={<Pages.EditFeatures />} />
      <Route path="/features" element={<Pages.FeaturesList />} />

      {/* Types */}
      <Route path="/decorSeries/add" element={<Pages.AddDecorSeries />} />
      <Route path="/decorSeries/edit/:id" element={<Pages.EditDecorSeries />} />
      <Route path="/decorSeries" element={<Pages.DecorSeriesList />} />

      {/* Orders */}
      <Route path="/orders/edit/:id" element={<Pages.EditOrder />} />
      <Route path="/orders" element={<Pages.OrderList />} />
      <Route path="/orders/falseOrders" element={<Pages.FalseOrderList />} />
      <Route path="/orders/details/:id" element={<Pages.OrderDetails />} />

      {/* Inquiries */}
      <Route path="/inquiries/add" element={<Pages.AddInquiry />} />
      <Route path="/inquiries/edit/:id" element={<Pages.EditInquiry />} />
      <Route path="/inquiries" element={<Pages.InquiryList />} />
      <Route path="/inquiries/details/:id" element={<Pages.InquiryDetails />} />

      {/* Products */}
      <Route path="/products/add" element={<Pages.AddProductNew />} />
      {/* <Route path="/products/add" element={<Pages.AddProduct />} /> */}
      <Route path="/products/addViaCsv" element={<Pages.AddProductViaCSV />} />
      <Route path="/products/edit/:id" element={<Pages.EditProductNew />} />
      <Route path="/products" element={<Pages.ProductList />} />
      <Route path="/products/details/:id" element={<Pages.ProductDetails />} />

      {/* File Details */}
      <Route path="/fileDetails/:fileName" element={<Pages.ViewFile />} />
    </Routes>
  );
}
