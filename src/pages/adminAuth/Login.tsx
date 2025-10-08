import { ReactNode, useState } from "react";
import { useFormik } from "formik";
import {
  loginSchema,
  initialValues,
} from "../../validationSchemas/loginSchema";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../utills";
import { SubmitButton } from "../../components";
import { toast } from "react-toastify";
import { Metadata } from "../../components";
import Logo from "../../assets/images/logo.png";

export function Login(): ReactNode {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: async (value, helpers) => {
        setLoading(true);
        const apiResponse = await post("/admins/login", value);

        if (apiResponse?.status == 200) {
          const token = apiResponse?.body?.token;
          localStorage.setItem("token", token);
          toast.success(apiResponse?.message);
          navigate("/");
        } else {
          helpers.setErrors(apiResponse?.errors);
          toast.error(apiResponse?.message);
        }
        setLoading(false);
      },
      validationSchema: loginSchema,
    });

  return (
    <>
      {/* Meta Details */}
      <Metadata
        title="Login to your Account"
        description="Login to your Account"
      />

      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-4 mx-auto">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  <div className="brand-logo text-center authpage-logo">
                    <img src={Logo} alt="logo" />
                  </div>
                  {/* <h4>Hello! let's get started</h4> */}
                  <h6 className="font-weight-light">Login to your Account.</h6>
                  <form className="pt-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="email"
                        name="email"
                        autoComplete="off"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="Email"
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
                    <div className="form-group">
                      <input
                        type="password"
                        name="password"
                        autoComplete="off"
                        className="form-control"
                        id="exampleInputPassword1"
                        placeholder="Password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.password && errors.password ? (
                        <p className="text-danger custom-form-error">
                          {errors.password}
                        </p>
                      ) : null}
                    </div>
                    <div className="mt-3">
                      <SubmitButton text="Log in" loading={loading} />
                    </div>
                    <div className="my-2 d-flex justify-content-end align-items-center">
                      {/* <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" />
                        Keep me signed in
                      </label>
                    </div> */}
                      <Link
                        to="/forgot-password"
                        className="auth-link text-black"
                      >
                        Forgot password?
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
