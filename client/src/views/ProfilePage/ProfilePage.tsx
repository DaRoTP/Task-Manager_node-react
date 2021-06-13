import React, { useState, useContext, useEffect } from "react";
import "./ProfilePage.scss";
import ImageIcon from "@material-ui/icons/Image";
import SimpleForm from "components/SimpleForm/SimpleForm";
import Image from "components/general/Image";
import Button from "components/general/Button";
import ContainerBox from "components/layout/ContainerBox/ContainerBox";
import { ModalContext, ModalActionType } from "context/ModalContext";
import { UserContext } from "context/UserContext";
import ChangePassword from "components/modalForms/ChangePassword";
import ChangeProfilePicture from "components/modalForms/ChangeProfilePicture/ChangeProfilePicture";
import LoadingOverlay from "components/layout/LoadingOverlay/LoadingOverlay";
import { updateCredentials } from "service";
import { validationSchema } from "./";

const ProfilePage: React.FC = () => {
  const { modalDispatch } = useContext(ModalContext);
  const {
    userState: { user },
  } = useContext(UserContext);

  const [profileInfo, setProfileInfo] = useState({
    username: { initialVal: "", type: "text" },
    name: { initialVal: "", type: "text" },
    surname: { initialVal: "", type: "text" },
    email: { initialVal: "", type: "text" },
  });
  const [profilePicture, setProfilePicture] = useState("");
  const [isProfileLoaded, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!!user) {
      const { username, email, name, surname, avatarImageURL } = user;
      setProfilePicture(avatarImageURL);
      setProfileInfo({
        username: { initialVal: username, type: "text" },
        name: { initialVal: name, type: "text" },
        surname: { initialVal: surname, type: "text" },
        email: { initialVal: email, type: "text" },
      });
      setProfileLoading(false);
    }
    return () => {};
  }, [user]);

  const handleSaveChanges = async (
    submittedData: any,
    {
      setSubmitting,
      setErrors,
    }: { setSubmitting: (state: boolean) => void; setErrors: (error: any) => void }
  ) => {
    const { error } = await updateCredentials({
      setLoading: setSubmitting,
      payload: submittedData,
    });

    if (!!error) {
      setErrors(error.message);
    }
  };
  const changeImageModalOpen = () => {
    modalDispatch({
      type: ModalActionType.OPEN,
      payload: {
        render: <ChangeProfilePicture changeProfilePic={setProfilePicture} />,
        title: "Change profile picture",
      },
    });
  };
  const changePasswordModalOpen = () => {
    modalDispatch({
      type: ModalActionType.OPEN,
      payload: {
        render: <ChangePassword />,
        title: "Change password",
      },
    });
  };

  return (
    <ContainerBox>
      <LoadingOverlay className="profile-page-loading-overlay" show={isProfileLoaded} opacity={0}>
        <div className="profile-page-container">
          <div className="profile-image">
            <Image src={profilePicture} />
            <button onClick={changeImageModalOpen} className="change-image-btn">
              <ImageIcon />
            </button>
          </div>
          <div className="profile-info">
            <h1 className="username">{`@${profileInfo.username.initialVal}`}</h1>
            <h3 className="name-surname">{`${profileInfo.name.initialVal} ${profileInfo.surname.initialVal}`}</h3>
          </div>
          <SimpleForm
            submitButtonName="save changes"
            validationSchema={validationSchema}
            handleSubmit={handleSaveChanges}
            fields={profileInfo}
            loadingOverlayColor={{ light: "245, 249, 250", dark: "51, 54, 55" }}
          />
          <Button onClick={changePasswordModalOpen} className="change-password">
            change password
          </Button>
        </div>
      </LoadingOverlay>
    </ContainerBox>
  );
};

export default ProfilePage;
