import React, { useEffect, useState } from 'react';
import { getUsers } from '../config/api';
import { MdEdit, MdOutlineBrowserUpdated, MdDelete } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Function to generate a random ID
export const generateRandomID = () => Math.floor(Math.random() * 10000);

const Todo = () => {
  const [data, setData] = useState([]);
  const [addData, setAddData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const itemsPerPage = 5; // Items per page set to 5

  // Fetch users
  const getRequest = async () => {
    try {
      const response = await axios.get(getUsers());
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  // Handle editing
  const handleEdit = (index) => {
    setEditIndex(index);
  };

  // Update user
  const handleUpdate = async (index) => {
    const updatedData = [...data];
    const user = updatedData[index];
    const combinedName = `${user.name.split(' ')[0]} ${user.name.split(' ')[1]}`;
    const updatedUser = {
      ...user,
      name: combinedName,
      email: data[index].email,
      company: { name: data[index].company.name }
    };

    try {
      await axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, updatedUser);
      updatedData[index] = updatedUser;
      setData(updatedData);
      setEditIndex(null);
      toast.success("Data Updated Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // Add user
  const handleAdd = async (event) => {
    event.preventDefault();
  
    const newId = generateRandomID();
    const combinedName = `${addData.firstName} ${addData.lastName}`;
    const newUser = {
      id: newId,
      name: combinedName,
      email: addData.email,
      company: { name: addData.department }
    };

    try {
      const response = await axios.post("https://jsonplaceholder.typicode.com/users/", newUser);
      setData([...data, response.data]);  // Use the ID returned by the mock API
      setAddData({
        firstName: '',
        lastName: '',
        email: '',
        department: ''
      });
      setShowPopup(false);
      toast.success("Data Added Successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      const updatedData = data.filter(user => user.id !== id);
      setData(updatedData);
      toast.success("Data deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className='main-div'>
        <div className='pages-div'>
          <button
            onClick={() => setShowPopup(true)}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgb(0,255,255)", border: "none", height: "30px", borderRadius: "10px", width:"85px" }}
          >
            Add New <Toaster /><span style={{ marginTop: "5px" }}><FaPlus /></span>
          </button>
          <div>
            <button className='pagination' disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span>Page: {page}</span>
            <button className='pagination' disabled={page === Math.ceil(data.length / itemsPerPage)} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>User First Name</th>
              <th>User Last Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((user, index) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  {editIndex === index ? (
                    <input onChange={(e) => setAddData({ ...addData, firstName: e.target.value })} type="text" defaultValue={user.name.split(' ')[0]} />
                  ) : (
                    user.name.split(' ')[0]
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input onChange={(e) => setAddData({ ...addData, lastName: e.target.value })} type="text" defaultValue={user.name.split(' ')[1]} />
                  ) : (
                    user.name.split(' ')[1]
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input onChange={(e) => setAddData({ ...addData, email: e.target.value })} type="email" defaultValue={user.email} />
                  ) : (
                    user.email
                  )}
                </td>
                <td>
                  {editIndex === index ? (
                    <input onChange={(e) => setAddData({ ...addData, department: e.target.value })} type="text" defaultValue={user.company.name} />
                  ) : (
                    user.company.name
                  )}
                </td>
                <td className="actions-btn">
                  {editIndex === index ? (
                    <button
                      style={{ backgroundColor: "green", fontWeight: "bold", color: "white", border: "none" }}
                      onClick={() => handleUpdate(index)}
                    >
                      Update <span><MdOutlineBrowserUpdated /></span>
                    </button>
                  ) : (
                    <button
                      style={{ backgroundColor: "green", fontWeight: "bold", color: "white", border: "none" }}
                      onClick={() => handleEdit(index)}
                    >
                      Edit <span><MdEdit /></span>
                    </button>
                  )}
                  <button
                    style={{ backgroundColor: "red", fontWeight: "bold", color: "white", border: "none" }}
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete <span><MdDelete /></span>
                  </button>
                  <Toaster />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showPopup && (
          <>
            <div className='backdrop'></div>
            <div className='store-add-div'>
              <form onSubmit={handleAdd}>
                <h2 style={{ backgroundColor: "white", border: "none", color: "red", fontWeight: "bold", cursor: "pointer" }}>Add User</h2>
                {/* Removed ID field */}
                <input
                  type="text"
                  name="firstName"
                  placeholder='Enter First Name'
                  value={addData.firstName}
                  onChange={(e) => setAddData({ ...addData, firstName: e.target.value })}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder='Enter Last Name'
                  value={addData.lastName}
                  onChange={(e) => setAddData({ ...addData, lastName: e.target.value })}
                />
                <input
                  type="email"
                  name="email"
                  placeholder='Enter Email'
                  value={addData.email}
                  onChange={(e) => setAddData({ ...addData, email: e.target.value })}
                />
                <input
                  type="text"
                  name="department"
                  placeholder='Enter Department'
                  value={addData.department}
                  onChange={(e) => setAddData({ ...addData, department: e.target.value })}
                />
                <button
                  style={{ backgroundColor: "rgb(0,255,255)", height: "30px", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" }}
                  type="submit"
                >
                  Add
                </button>
              </form>
              <button
                style={{ marginTop: "20px", height: "35px", cursor: "pointer", backgroundColor: "red", border: "none", color: "white", fontWeight: "bold", padding: "0 5px" }}
                onClick={() => setShowPopup(false)}
              >
                {/* backgroundColor: "white", border: "none", color: "red", fontWeight: "bold", cursor: "pointer" */}
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Todo;
