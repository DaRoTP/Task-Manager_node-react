import React from "react";
import { FormikProps, Form, Field, withFormik } from "formik";
import { TextField } from "components/general/TextInput";
import Button from "components/general/Button";
import * as Yup from "yup";
import { updateCredentials } from "service";

const validationSchema = Yup.object({
  username: Yup.string().max(25, "username is too long").required("field is required"),
  email: Yup.string().email().required("field is required"),
  name: Yup.string().max(25, "name is too long").required("field is required"),
  surname: Yup.string().max(25, "surname is too long").required("field is required"),
});

interface ProfileFieldsProps {
  username: string;
  email: string;
  name: string;
  surname: string;
}

interface FormValues extends ProfileFieldsProps {}

const ProfileFields: React.FC<FormikProps<FormValues>> = (props) => {
  const { errors, isSubmitting, isValid } = props;

  return (
    <Form className="profile__inputs">
      <Field name="username" error={errors["username"]} as={TextField} />
      <Field name="email" error={errors["email"]} as={TextField} />
      <Field name="name" error={errors["name"]} as={TextField} />
      <Field name="surname" error={errors["surname"]} as={TextField} />
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

const ProfileFieldsWithFormik = withFormik<ProfileFieldsProps, FormValues>({
  mapPropsToValues: (props) => {
    const { username, email, name, surname } = props;
    return { username, email, name, surname };
  },
  validationSchema: validationSchema,
  handleSubmit: async (submittedData, { setSubmitting, setErrors }) => {
    const { error } = await updateCredentials({
      setLoading: setSubmitting,
      payload: submittedData,
    });

    if (!!error) {
      setErrors(error.message);
    }
  },
})(ProfileFields);

export default ProfileFieldsWithFormik;
