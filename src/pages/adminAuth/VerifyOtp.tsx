import { ReactNode, useEffect, useState } from "react";
import { useFormik } from "formik";

import { Link, useNavigate } from "react-router-dom";
import { post } from "../../utills";
import { Metadata, SubmitButton } from "../../components";
import { toast } from "react-toastify";
import {
  verigyOtpSchema,
  initialValues,
} from "../../validationSchemas/verifyOtpSchema";

export function VerifyOtp(): ReactNode {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      onSubmit: async (value, helpers) => {
        setLoading(true);
        // get email
        const email = localStorage.getItem("email");

        const apiResponse = await post("/admins/verifyOtp", {
          ...value,
          email,
        });

        if (apiResponse?.status == 200) {
          const token = apiResponse?.body?.token;
          localStorage.setItem("resetToken", token);

          toast.success(apiResponse?.message);
          navigate("/create-new-password");
        } else {
          helpers.setErrors(apiResponse?.errors);
          // toast.error(apiResponse?.message);
        }
        setLoading(false);
      },
      validationSchema: verigyOtpSchema,
    });

  // handleResendOtp
  async function handleResendOtp(evt: React.MouseEvent) {
    evt.preventDefault();
    setOtpSending(true);
    // get email
    const email = localStorage.getItem("email");
    const apiResponse = await post("/admins/findAccount", {
      email,
    });
    if (apiResponse?.status == 200) {
      toast.success("Otp send on your email");
      setOtpTimer(20);
    } else {
      toast.error(apiResponse?.message);
    }
    setOtpSending(false);
  }

  // otp timer
  useEffect(() => {
    const timer = setTimeout(() => {
      if (otpTimer == 0) {
        return;
      } else {
        setOtpTimer((old) => {
          return old - 1;
        });
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [otpTimer]);

  return (
    <>
      {/* Meta Details */}
      <Metadata
        title="OTP Verification : Need to verify the OTP"
        description="OTP Verification : Need to verify the OTP"
      />
      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-center auth px-0">
            <div className="row w-100 mx-0">
              <div className="col-lg-4 mx-auto">
                <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                  <div className="brand-logo text-center authpage-logo">
                    <img src="/images/black-logo.png" alt="logo" />
                  </div>
                  {/* <h4>Hello! let's get started</h4> */}
                  <h6 className="font-weight-light">OTP Verification</h6>
                  <p className="text-sm">
                    OTP received on your registered e-mail
                  </p>
                  <form className="pt-3" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <input
                        type="text"
                        name="otp"
                        autoComplete="off"
                        className="form-control"
                        id="exampleInputEmail1"
                        placeholder="Enter your otp"
                        value={values.otp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.otp && errors.otp ? (
                        <p className="text-danger custom-form-error">
                          {errors.otp}
                        </p>
                      ) : null}
                    </div>

                    <div className="d-flex justify-content-end font-weight-light">
                      {otpTimer ? (
                        <Link to="#" className="auth-link text-black">
                          {`Resend OTP in ${otpTimer}s`}
                        </Link>
                      ) : (
                        <Link
                          to="/login"
                          className="auth-link text-black"
                          onClick={handleResendOtp}
                        >
                          {otpSending ? "Loading..." : "Resend OTP"}
                        </Link>
                      )}
                    </div>

                    <div className="mt-3">
                      <SubmitButton text="Verify Account" loading={loading} />
                    </div>

                    <div className="text-center mt-4 font-weight-light">
                      Already have an Account?{" "}
                      <Link to="/login" className="auth-link text-black">
                        Login
                      </Link>
                    </div>
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
