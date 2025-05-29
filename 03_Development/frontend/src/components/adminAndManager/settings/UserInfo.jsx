const UserInfo = ({ userInfo }) => (
  <div className="space-y-6">
    <div className="flex">
      <p className="w-1/3 text-gray-600 font-medium">First Name:</p>
      <p className="text-gray-900">{userInfo.firstName}</p>
    </div>
    <div className="flex">
      <p className="w-1/3 text-gray-600 font-medium">Last Name:</p>
      <p className="text-gray-900">{userInfo.lastName}</p>
    </div>
    <div className="flex">
      <p className="w-1/3 text-gray-600 font-medium">Date of Birth:</p>
      <p className="text-gray-900">
        {new Date(userInfo.dateOfBirth).toLocaleDateString()}
      </p>
    </div>
    <div className="flex">
      <p className="w-1/3 text-gray-600 font-medium">Current Balance:</p>
      <p className="text-gray-900">
        {userInfo.currentBalance != null
          ? `${userInfo.currentBalance.toLocaleString("vi-VN")} VND`
          : "N/A"}
      </p>
    </div>
    <div className="flex">
      <p className="w-1/3 text-gray-600 font-medium">Email:</p>
      <p className="text-gray-900">{userInfo.email || "N/A"}</p>
    </div>
    <div className="flex">
      <p className="w-1/3 text-gray-600 font-medium">Role:</p>
      <p className="text-gray-900">{userInfo.role || "N/A"}</p>
    </div>
    <div className="flex">
      <p className="w-1/3 text-gray-600 font-medium">Department:</p>
      <p className="text-gray-900">{userInfo.department || "None"}</p>
    </div>
    <div className="flex">
      <p className="w-1/3 text-gray-600 font-medium">Specialization:</p>
      <p className="text-gray-900">{userInfo.specialization || "None"}</p>
    </div>
  </div>
);

export default UserInfo;
