import React, { useState, useEffect, useContext } from "react";
import * as Yup from "yup";
import "./TaskEditor.scss";
import TextInput from "components/general/TextInput";
import { ModalContext, ModalActionType } from "context/ModalContext";

import Button from "components/general/Button/Button";
import { Formik, Field, Form } from "formik";
import { getBoardTags, updateBoardTask, createTask } from "service";
import LoadingOverlay from "components/layout/LoadingOverlay/LoadingOverlay";
import TagChoiceControll from "./TagChoiceControll";
import UserListManager from "./UserListManager";
import { AlertContext, AlertActionType } from "context/AlertContext";
import { TaskEditorProps } from ".";

const validationSchema = Yup.object({
  title: Yup.string().max(100, "task title is too long").required("field is required"),
  description: Yup.string().max(500, "description is too long"),
});

const TaskEditor: React.FC<TaskEditorProps> = ({
  buttonName,
  action,
  updateTask,
  initialValues,
  boardId,
  taskId,
  columnId,
}) => {
  const { modalDispatch } = useContext(ModalContext);
  const { alertDispatch } = useContext(AlertContext);

  const initialVals = {
    title: initialValues ? initialValues.name : "",
    description: initialValues ? initialValues.description : "",
  };
  const [users, setUsers] = useState(initialValues ? [...initialValues.people] : []);

  const [availableTags, setAvailableTags] = useState([]);
  const [chosenBoardTags, setChosenBoardTags] = useState(
    initialValues ? [...initialValues.tags] : []
  );

  useEffect(() => {
    //  fetch all available tags at mount of  the component
    const getBoardTagss = async () => {
      const { data } = await getBoardTags({ boardId });
      if (!!data) setAvailableTags(data.tags);
    };
    getBoardTagss();
    return () => {};
  }, [boardId]);

  const submitOnButtonClick = async (
    submittedData: any,
    { setSubmitting }: { setSubmitting: (state: boolean) => void }
  ) => {
    const submittingTask = {
      ...submittedData,
      people: users.map(({ _id }) => _id),
      tags: chosenBoardTags.map(({ _id }) => _id),
    };
    if (action === "CREATE") {
      createTask({
        boardId,
        payload: {
          ...submittingTask,
          columnId,
        },
        res: (res) => {
          if (res.success) {
            alertDispatch({
              type: AlertActionType.SUCCESS,
              payload: { message: "new task created" },
            });
            modalDispatch({ type: ModalActionType.CLOSE });
          } else if (res.error) {
            alertDispatch({
              type: AlertActionType.ERROR,
              payload: { message: "error - while creating new task" },
            });
          }
        },
      });
    } else if (action === "UPDATE") {
      const { data, error } = await updateBoardTask({
        boardId,
        taskId: taskId as string,
        setLoading: setSubmitting,
        payload: submittingTask,
      });
      if (!!data) {
        alertDispatch({
          type: AlertActionType.SUCCESS,
          payload: { message: "successfuly updated task" },
        });
        if (updateTask) updateTask(data.task);
      } else if (!!error) {
        alertDispatch({
          type: AlertActionType.ERROR,
          payload: { message: "error - while updating new task" },
        });
      }
    }
  };

  // TAGS
  const addTagToList = (tagId: string) => {
    const foundTag = availableTags.find(({ _id }) => _id === tagId);
    setChosenBoardTags((tags) => {
      const newTags = [...tags];
      newTags.push(foundTag);
      return newTags;
    });
  };
  const removeTagFromList = (tagIndex: number) => {
    setChosenBoardTags((tags) => {
      const newTags = [...tags];
      newTags.splice(tagIndex, 1);
      return newTags;
    });
  };

  return (
    <div className="new-task-container">
      <Formik
        validationSchema={validationSchema}
        initialValues={initialVals}
        onSubmit={submitOnButtonClick}>
        {({ isSubmitting, isValid, errors }) => (
          <>
            <LoadingOverlay opacity={0.5} show={isSubmitting}></LoadingOverlay>
            <Form>
              <div className="fields">
                <Field
                  className="new-task-input board-name-field"
                  label={"task title"}
                  name={"title"}
                  hasErrors={!!errors["title"]}
                  helperText={errors["title"]}
                  as={TextInput}
                />
                <Field
                  className="board-description-field"
                  name={"description"}
                  hasErrors={!!errors["description"]}
                  helperText={errors["description"]}
                  multiline={{ rows: 7, max: 7 }}
                  as={TextInput}
                />
              </div>
              <UserListManager users={users} setUsers={setUsers} boardId={boardId} />
              <TagChoiceControll
                availableTags={availableTags}
                chosenBoardTags={chosenBoardTags}
                removeTagFromList={removeTagFromList}
                addTagToList={addTagToList}
              />
              <Button
                disabled={isSubmitting || !isValid}
                variant="glow"
                className="btn-submit"
                type="submit">
                {buttonName}
              </Button>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default TaskEditor;
