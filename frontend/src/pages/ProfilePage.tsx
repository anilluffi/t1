import { Avatar } from "../components/ProfileItem/Avatar/Avatar";
import { Info } from "../components/ProfileItem/Info/Info";
import { ResetPassword } from "../components/ProfileItem/ResetPassword/ResetPassword";

const ProfilePage = () => {
  return (
    <div className="card p-4 shadow-sm text-secondary m-5 rounded-2 pb-5">
      <h1 className="bi bi-person fs-3"> Profile </h1> <br />
      <Avatar />
      <Info />
      <ResetPassword />
    </div>
  );
};

export default ProfilePage;
