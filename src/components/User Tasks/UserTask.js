import React, { useEffect, useState } from 'react';
import axiosInstance from '../../API/axiosInstance';
import { FiPlus } from 'react-icons/fi';
import './userTask.css';

const UserTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [membership, setMembership] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }

    const fetchUser = () => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
        setMembership(user.planType);
      }
    };

    fetchToken();
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId && token) {
      axiosInstance.get(`/tasks/all-tasks-with-status/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          setTasks(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch tasks:", err);
          setLoading(false);
        });
    }
  }, [userId, token]);


  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }


  const saveNewTask = async () => {
    try {
      const response = await axiosInstance.post('/tasks/create', {
        title: taskTitle,
        createdBy: userId,
        type: 'custom',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setTasks(prev => [...prev, response.data]);
        setTaskTitle('');
        setShowModal(false);
      }
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  };


  const markTaskStatus = async (taskId, status) => {
    console.log(taskId, !status); 
    const response = axiosInstance.post('/tasks/mark-complete',{
      "taskId": taskId,
      "completed": !status
    }
    , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200 || response.status === 201) {
      setTasks(prev => prev.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task));
    } else {
      console.error("Failed to update task status:", response.statusText);
    }
  }


  return (
    <div className="container mt-4 position-relative">
      <div className="card shadow">
        <div className="card-header text-center">
          <h4>Tasks to do</h4>
        </div>
        <ul className="list-group list-group-flush">
          {tasks.map(task => (
            <li
              key={task.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-start">
                <div className="form-check">
                <input class={`form-check-input Success-checkbox`}
                type="checkbox" 
                value={ task.id } 
                onClick={ e => markTaskStatus(e.target.value, !task.completed) }
                checked = {task.completed}
                />
                </div>
                <div className="ms-3">
                  <strong  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</strong>
                  <div className="text-muted small">
                    {task.type === 'custom' ? 'Custom Task' : 'Predefined Task'}
                  </div>
                </div>
              </div>
              <span className={`badge ${task.completed ? 'bg-success' : 'bg-secondary'}`}>
                {task.completed ? 'Completed' : 'Pending'}
              </span>
            </li>


          ))}
        </ul>
      </div>

      {/* Show "Add Task" button only if membership is FREE */}
      {membership === 'FREE' && (
        <>
          <button
            className="btn btn-primary position-fixed"
            style={{ bottom: '30px', right: '30px', borderRadius: '16px', fontSize: '18px' }}
            onClick={() => setShowModal(true)}
          >
            <FiPlus size={20} /> Add Task
          </button>

          {/* Modal */}
          {showModal && (
            <div className="modal d-block" tabIndex="-1" onClick={() => setShowModal(false)} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Task</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="taskTitle" className="form-label">Task Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="taskTitle"
                        placeholder="Enter task title"
                        value={taskTitle}
                        onChange={e => setTaskTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    <button className="btn btn-primary" onClick={saveNewTask}>Save Task</button>
                  </div>
                </div>
              </div>
            </div>

          )}
        </>
      )}
    </div>
  );
};

export default UserTask;
