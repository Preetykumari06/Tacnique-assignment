import React from 'react'
import { useEffect, useState } from "react"
import { getUsers } from "../config/api";
import { MdEdit, MdOutlineBrowserUpdated } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import axios from "axios"

const Todo = () => {

  const [data, setData] = useState([]);
  const [addData, setAddData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    department: ''
  });
  const [editIndex, setEditIndex] = useState(null);
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const [showPopup, setshowPopup] = useState(false)
  const [page, setPage] = useState(1)


  //get request
  const getRequest = async () => {
    try {
      const { data } = await axios.get(getUsers())
      setData(data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getRequest()
  }, [])

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  //edit function put request
  const handleUpdate = async (index) => {
    const combinedName = name + ' ' + lastName;
    try {
      const updatedData = [...data];
      updatedData[index] = { ...updatedData[index], name: combinedName || data[index].name, email: email || data[index].email, company: { name: department || data[index].company.name } };
      await axios.put(`https://jsonplaceholder.typicode.com/users/${index + 1}`, updatedData[index]);
      setData(updatedData);
      setEditIndex(null);
      toast.success("Data Updated Successfully!")
    } catch (error) {
      console.log(error);
      setEditIndex(null);
      toast.error("Something went wrong!")
    }
  }

  //add function post request 
  const handleAdd = async (event) => {
    event.preventDefault();
    try {
      const combinedName = `${addData.firstName} ${addData.lastName}`;
      const postData = {
        id: addData.id,
        name: combinedName,
        email: addData.email,
        company: {
          name: addData.department
        }
      };

      const response = await axios.post("https://jsonplaceholder.typicode.com/users/", postData);
      setData([...data, response.data]); // Add new data to existing data
      setAddData({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        department: ''
      }); // Reset addData state
      setshowPopup(false);
      toast.success("Data Added Successfully!")
    } catch (error) {
      console.log(error);
      setshowPopup(false);
      toast.error("Something went wrong!")
    }
  };

  //delete function axios delete request
  const handleDelete = async (index) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${index}`);
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
      toast.success("Data deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <>
      <div className='main-div'>
        <div className='pages-div'>
          <button onClick={() => setshowPopup(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgb(0,255,255)", border: "none",height:"30px",borderRadius:"10px" }}>
            AddNew <Toaster /><span style={{ marginTop: "5px" }}><FaPlus /></span>
          </button>
          <div>
            <button className='pagination' disabled={page == 1} onClick={() => setPage(page - 1)}>Prev</button>
            <span>Page: {page}</span>
            <button className='pagination' disabled={page == 2} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </div>


        <table>
          <tr>
            <th>Id</th>
            <th>User firstName</th>
            <th>User lastName</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
          {data?.slice((page - 1) * 10, (page - 1) * 10 + 10).map(function (ele, index) {
            return <tr key={index}>
              <td>{ele.id}</td>
              <td>{editIndex === index ? <input onChange={(e) => setName(e.target.value)} type="text" defaultValue={ele.name.split(' ')[0]} /> : `${ele.name.split(' ')[0]}`}</td>
              <td>{editIndex === index ? <input onChange={(e) => setLastName(e.target.value)} type="text" defaultValue={ele.name.split(' ')[1]} /> : `${ele.name.split(' ')[1]}`}</td>
              <td>{editIndex === index ? <input onChange={(e) => setEmail(e.target.value)} type="email" defaultValue={ele.email} /> : `${ele.email}`}</td>
              <td>{editIndex === index ? <input onChange={(e) => setDepartment(e.target.value)} type="text" defaultValue={ele.company.name} /> : `${ele.company.name}`}</td>
              <td className="actions-btn">
                {editIndex === index ? (
                  <button style={{ backgroundColor: "green", fontWeight: "bold", color: "white", border: "none" }} onClick={() => handleUpdate(index)}>Update <span><MdOutlineBrowserUpdated /></span></button>
                ) : (
                  <button style={{ backgroundColor: "green", fontWeight: "bold", color: "white", border: "none" }} onClick={() => handleEdit(index)}>Edit <span><MdEdit /></span></button>
                )}
                <button style={{ backgroundColor: "red", fontWeight: "bold", color: "white", border: "none" }} onClick={() => handleDelete(index)}>Delete<span><MdDelete /></span></button>
                <Toaster /></td>
            </tr>
          })}
        </table>
        {showPopup && (
          <React.Fragment>
            <div className='backdrop' ></div>
            <div className='store-add-div'>
              <form onSubmit={handleAdd}>
                <h2 style={{ backgroundColor: "white", border: "none", color: "red", fontWeight: "bold", cursor: "pointer" }}>Add User</h2>
                <input type="number" name='id' placeholder='Enter Id'
                  value={addData.id}
                  onChange={(e) => setAddData({ ...addData, id: e.target.value })} />

                <input type="text" name="firstName" placeholder='Enter firstName'
                  value={addData.firstName}
                  onChange={(e) => setAddData({ ...addData, firstName: e.target.value })} />

                <input type="text" name="lastName" placeholder='Enter lastName'
                  value={addData.lastName}
                  onChange={(e) => setAddData({ ...addData, lastName: e.target.value })} />

                <input type="email" name="email" placeholder='Enter Email'
                  value={addData.email}
                  onChange={(e) => setAddData({ ...addData, email: e.target.value })} />

                <input type="text" name="department" placeholder='Enter department'
                  value={addData.department}
                  onChange={(e) => setAddData({ ...addData, department: e.target.value })} />

                <button style={{ backgroundColor: "rgb(0,255,255)",height:"30px", border: "none", color: "white", fontWeight: "bold", cursor: "pointer" }} type="submit">Add</button>
              </form>

              <div>
                <button style={{ marginTop: "20px",height:"35px", cursor: "pointer", backgroundColor: "red", border: "none", color: "white", fontWeight: "bold", padding: "0 5px", width:"280px" }} onClick={() => setshowPopup(false)}>Cancel</button>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </>
  )
}

export default Todo