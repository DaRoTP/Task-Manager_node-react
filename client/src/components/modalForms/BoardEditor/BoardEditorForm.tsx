import React, { useContext, useEffect } from "react";
import { FormikProps, Form, Field } from "formik";
import { BoardEditorFormProps, FormValues } from ".";
import { TextField, TextAreaField } from "components/general/TextInput";
import Button from "components/general/Button";
import { AlertContext, AlertActionType } from "context/AlertContext";
import { ModalContext, ModalActionType } from "context/ModalContext";
import { useHistory } from "react-router-dom";


const BoardEditorForm: React.FC<BoardEditorFormProps & FormikProps<FormValues>> = (props) => {
  const { errors, isSubmitting, isValid, submitType, status } = props;
  const { modalDispatch } = useContext(ModalContext);
  const { alertDispatch } = useContext(AlertContext);
  const history = useHistory();

  useEffect(() => {
    if (status?.submitStatus === "SUCCESS") {
      modalDispatch({ type: ModalActionType.CLOSE });
      alertDispatch({ type: AlertActionType.SUCCESS, payload: { message: status.message } });
      history.push(`/board/${status.boardId}`);
    }
    return () => {};
  }, [status, modalDispatch, history, alertDispatch]);

  return (
    <Form>
      <Field
        name="name"
        className="board-description-field"
        error={errors["name"]}
        as={TextField}
      />
      <Field
        name="description"
        className="board-description-field"
        error={errors["description"]}
        as={TextAreaField}
      />
      <Button
        disabled={isSubmitting || !isValid}
        variant="glow"
        className="btn-submit"
        type="submit">
        {submitType as String}
      </Button>
    </Form>
  );
};

export default BoardEditorForm;
