import React, { useState, useContext, useEffect } from "react";
import "./ProfilePage.scss";
import ImageIcon from "@material-ui/icons/Image";
import Image from "components/general/Image";
import Button from "components/general/Button";
import ContainerBox from "components/layout/ContainerBox/ContainerBox";
import { ModalContext, ModalActionType } from "context/ModalContext";
import { UserContext, UserActionType } from "context/UserContext";
import ChangePassword from "components/modalForms/ChangePassword";
import ChangeProfilePicture from "components/modalForms/ChangeProfilePicture/ChangeProfilePicture";
import LoadingOverlay from "components/layout/LoadingOverlay/LoadingOverlay";
import ProfileFields from "./ProfileFields";

const ProfilePage: React.FC = () => {
  const { modalDispatch } = useContext(ModalContext);
  const {userState: { user }, userDispatch} = useContext(UserContext);

  const [isProfileLoaded, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!!user) {
      setProfileLoading(false);
    }
    return () => {};
  }, [user]);

  const setProfilePicture = (newImage: string) => {
    userDispatch({ type: UserActionType.UPDATE_AVATAR, payload: { avatar: newImage } });
  }
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
        <div className="profile">
          <div className="profile__image">
            <Image src={user.avatarImageURL} />
            <button onClick={changeImageModalOpen} className="profile__image__btn">
              <ImageIcon className="profile__image__btn-icon" />
            </button>
          </div>
          <div className="profile__info">
            <h1 className="profile__info__username">{`@${user.username}`}</h1>
            <h3 className="profile__info__name-surname">{`${user.name} ${user.surname}`}</h3>
          </div>
          <ProfileFields
            name={user.name}
            surname={user.surname}
            username={user.username}
            email={user.email}
          />
          <Button onClick={changePasswordModalOpen} className="profile__password-btn">
            change password
          </Button>
        </div>
      </LoadingOverlay>
    </ContainerBox>
  );
};

export default ProfilePage;
