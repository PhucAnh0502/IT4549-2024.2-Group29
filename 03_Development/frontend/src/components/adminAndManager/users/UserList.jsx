import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../utils/UserHelper";
import DataTable from "react-data-table-component";
import { columns } from "./UserColumns";
import UserButtons from "./UserButtons";
import UserFilters from "./UserFilters";

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const onUserDelete = () => {
    fetchUsers();
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const users = await getAllUsers();
      if (users) {
        let sno = 1;
        const data = users.map((user) => ({
          id: user.id,
          sno: sno++,
          name: user.firstName + " " + user.lastName,
          dob: new Date(user.dateOfBirth).toLocaleDateString(),
          email: user.account.email,
          role: user.account.role,
          action: <UserButtons id={user.id} onUserDelete={onUserDelete} />,
        }));
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (err) {
      if (err.response.data.Message) {
        alert(err.response.data.Message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filterByInput = (e) => {
    const records = users.filter((user) => {
      return user.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredUsers(records);
  };

  const filterByButton = (role) => {
    const data = users.filter((user) =>
      user.role.toLowerCase().includes(role.toLowerCase())
    );
    setFilteredUsers(data);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-red-500 rounded-full animate-spin border-t-transparent mb-4"></div>
            <p className="text-lg font-semibold text-red-500 animate-pulse">
              Loading...
            </p>
          </div>
        </div>
      ) : (
        <div className="p-5">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-5">Manage Users</h3>
          </div>
          <UserFilters
            filterByInput={filterByInput}
            filterByButton={filterByButton}
          />
          <div className="mt-5">
            <DataTable columns={columns} data={filteredUsers} pagination />
          </div>
        </div>
      )}
    </>
  );
};

export default UserList;
