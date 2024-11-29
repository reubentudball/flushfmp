import React, { useEffect, useState } from "react";
import { FaTh, FaList } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "react-modal";
import { useUser } from "../../context/UserContext";
import { getEmployeesByFacility, addEmployee } from "../../Repo/employeeRepository";
import "./Employees.css";

const Employees = () => {
  const [viewType, setViewType] = useState("card");
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const { facility } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!facility || !facility.facilityId) {
        console.error("No facility context or ID available.");
        return;
      }

      try {
        const fetchedEmployees = await getEmployeesByFacility(facility.facilityId);
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, [facility]);

  const handleEmployeeClick = (id) => {
    console.log("Employee ID:", id);
    navigate(`${location.pathname}/${id}`);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewEmployee({ name: "", email: "", phone: "" });
  };

  const handleAddEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.phone) {
      alert("All fields are required.");
      return;
    }

    try {
      const addedEmployee = {
        ...newEmployee,
        role: "employee",
        facilityID: facility.facilityId,
      };

      const savedEmployee = await addEmployee(addedEmployee);
      setEmployees((prev) => [...prev, savedEmployee]);
      closeModal();
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  return (
    <div className="employees-container">
      <h2>Employees and Work Orders</h2>

      <div className="toggle-buttons">
        <button onClick={() => setViewType("card")}>
          <FaTh />
        </button>
        <button onClick={() => setViewType("list")}>
          <FaList />
        </button>
        <button className="add-employee-button" onClick={openModal}>
          Add Employee
        </button>
      </div>

      <div className={viewType === "card" ? "employee-list card-view" : "employee-list list-view"}>
        {employees.map((employee, index) => (
          <div
            className={viewType === "card" ? "employee-card" : "employee-list-item"}
            key={index}
            onClick={() => handleEmployeeClick(employee.id)}
          >
            <h3 style={{ textAlign: "center" }}>
              {employee.firstName} {employee.lastName}
            </h3>
            <p>
              <strong>Role:</strong> {employee.role}
            </p>
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>Phone:</strong> {employee.phone}
            </p>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        overlayClassName="modal-overlay"
        className="modal"
        ariaHideApp={false}
      >
        <div className="modal-content">
          <h3>Add New Employee</h3>
          <form className="modal-form">
            <label>First Name:</label>
            <input
              type="text"
              value={newEmployee.firstName}
              onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
            />
            <label>Last Name:</label>
            <input
              type="text"
              value={newEmployee.lastName}
              onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
            />
            <label>Email:</label>
            <input
              type="email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
            />
            <label>Phone:</label>
            <input
              type="text"
              value={newEmployee.phone}
              onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
            />
            <div className="modal-actions">
              <button type="button" onClick={closeModal} className="cancel-button">
                Cancel
              </button>
              <button type="button" onClick={handleAddEmployee} className="add-button">
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Employees;
