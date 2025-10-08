import { ReactNode, useState } from "react";
import { useFormik } from "formik";
import {
  forgotPasswordSchema,
  initialValues,
} from "../../validationSchemas/forgotPasswordSchema";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../utills";
import { Metadata, SubmitButton } from "../../components";
import { toast } from "react-toastify";

export function ForgotPassword(): ReactNode {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: async (value, helpers) => {
        setLoading(true);
        const apiResponse = await post("/admins/findAccount", value);

        if (apiResponse?.status == 200) {
          localStorage.setItem("email", value.email);
          toast.success(apiResponse?.message);
          navigate("/verify-otp");
        } else {
          helpers.setErrors(apiResponse?.errors);
          // toast.error(apiResponse?.message);
        }
        setLoading(false);
      },
      validationSchema: forgotPasswordSchema,
    });

  return (
    <>
      {/* Meta Details */}
      <Metadata
        title="Forgot Password : Find your Account"
        description="Forgot Password : Find your Account"
      />
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-4 mx-auto">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  <div className="brand-logo text-center authpage-logo">
                    <img src="/images/logo.png" alt="logo" />
                  </div>
                  {/* <h4>Hello! let's get started</h4> */}
                  <h6 className="font-weight-light">Forgot Password</h6>
                  <form className="pt-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        autoComplete="off"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="Enter your email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.email && errors.email ? (
                        <p className="text-danger custom-form-error">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-3">
                      <SubmitButton text="Find Account" loading={loading} />
                    </div>

                    <div className="text-center mt-4 font-weight-light">
                      Already have an Account?{" "}
                      <Link to="/login" className="auth-link text-black">
                        Login
                      </Link>
                    </div>

                    {/* <div className="text-center mt-4 font-weight-light">
                    Don't have an account?{" "}
                    <a href="register.html" className="text-primary">
                      Create
                    </a>
                  </div> */}
                  </form>
                </div>
              </div>
            </div>
          </div>
          {/* content-wrapper ends */}
        </div>
        {/* page-body-wrapper ends */}
        {/*  */}
      </div>
    </>
  );
}
