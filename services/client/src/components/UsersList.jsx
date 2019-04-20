import React from 'react';
import PropTypes from 'prop-types';

const UsersList = (props) => {
  return (
    <div>
      <h1 className="title is-1">All Users</h1>
      <hr/><br/>
      <table className="table is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Username</th>
            <th>Active</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {
            props.users && props.users.map((user) => {
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{String(user.active)}</td>
                  <td>{String(user.admin)}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
};

UsersList.propTypes = {
  users: PropTypes.array.isRequired,
};

export default UsersList;
