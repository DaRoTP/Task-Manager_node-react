import React, { useContext, useEffect } from "react";
import { FormikProps, Form, Field, withFormik } from "formik";
import TextInput from "components/general/TextInput";
import Button from "components/general/Button";
import { ModalContext, ModalActionType } from "context/ModalContext";
import { changeAvatar } from "service";
import { FormValues, ChangeProfilePictureProps } from "./";
import * as Yup from "yup";

export const validationSchema = Yup.object({
  imageLink: Yup.string().url().required("image link is required"),
});

const ChangeProfilePicture: React.FC<FormikProps<FormValues>> = (props) => {
  const { errors, isSubmitting, isValid, status } = props;
  const { modalDispatch } = useContext(ModalContext);

  useEffect(() => {
    if (status?.submitStatus === "SUCCESS") {
      modalDispatch({ type: ModalActionType.CLOSE });
    }
    return () => {};
  }, [status]);

  return (
    <Form>
      <Field
        name="imageLink"
        label="avatar image URL"
        hasErrors={!!errors["imageLink"]}
        helperText={errors["imageLink"]}
        as={TextInput}
      />
      <Button
        disabled={isSubmitting || !isValid}
        variant="glow"
        className="btn-submit"
        type="submit">
        Update
      </Button>
    </Form>
  );
};

const ChangeProfilePictureWithFormik = withFormik<ChangeProfilePictureProps, FormValues>({
  mapPropsToValues: () => {
    return { imageLink: "", password: "" };
  },
  validationSchema: validationSchema,
  handleSubmit: async (submittedData, { setSubmitting, setStatus, props }) => {
    const { data } = await changeAvatar({
      payload: { imageURL: submittedData.imageLink },
      setLoading: setSubmitting,
    });
    if (!!data) {
      props.changeProfilePic(submittedData.imageLink);
      setStatus({ submitStatus: "SUCCESS" });
    }
  },
})(ChangeProfilePicture);

export default ChangeProfilePictureWithFormik;