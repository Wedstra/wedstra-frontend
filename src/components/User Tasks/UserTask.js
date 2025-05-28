import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../../API/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
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
  const [task, setTask] = useState('');
  const [checked, setChecked] = useState(false);
  const PHASE_ORDER = [
    '12 – 9 Months Before',
    '9 – 6 Months Before',
    '6 – 4 Months Before',
    '3 – 2 Months Before',
    '1 Month Before',
    'Wedding Week',
    'Post-Wedding',
    'custom'
  ];

  const groupedTasks = useMemo(() => {
    // create a map → { phase: [tasks …] }
    const map = {};
    tasks.forEach(t => {
      const p = t.phase || 'Un-categorised';
      if (!map[p]) map[p] = [];
      map[p].push(t);
    });
    // return an array sorted by our PHASE_ORDER
    return PHASE_ORDER
      .filter(p => map[p])          // keep phases that exist in data
      .map(p => ({ phase: p, items: map[p] }));
  }, [tasks]);


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
        task: task,
        phase: 'custom',
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


  const markTaskStatus = async (taskId, nextCompleted, isCompleted) => {

    if (isCompleted == false) {
      try {
        const { status } = await axiosInstance.post('/tasks/mark-complete',
          {
            "userId": userId,
            "taskId": taskId,
            "completed": !isCompleted
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (status === 200 || status === 201) {
          notify('success');
          setTasks(prev =>
            prev.map(t =>
              t.id === taskId ? { ...t, completed: nextCompleted } : t
            )
          );
        }
        else {
          notify('error');
        }
      } catch (err) {
        console.error('Failed to update task status:', err.response?.data || err);
      }
    }
    else {
      try {
        const { status } = await axiosInstance.delete(`/tasks/${taskId}/completion?userId=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (status === 204) {
          notify('success');
          setTasks(prev =>
            prev.map(t =>
              t.id === taskId ? { ...t, completed: nextCompleted } : t
            )
          );
        }
        else {
          notify('error');
        }
      } catch (err) {
        console.error('Failed to update task status:', err.response?.data || err);
      }
    }

  };

  const notify = (status) => {
    (status == "success") ? (toast.success('Marked Task Completed!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    })) : ((toast.error('Something went wrong!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    })))
  };


  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div className="container mt-4 position-relative">
        {groupedTasks.map(({ phase, items }) => (
          <div className="card shadow mb-4" key={phase}>
            <div className="card-header bg-light">
              <h5 className="m-0">{phase}</h5>
            </div>

            <ul className="list-group list-group-flush">
              {items.map(task => (
                <li key={task.id}
                  className="list-group-item d-flex justify-content-between align-items-center">

                  {/* left side: checkbox + title */}
                  <div className="d-flex align-items-start">
                    <input
                      className="form-check-input me-2 Success-checkbox"
                      type="checkbox"
                      value={task.id}
                      onChange={e => markTaskStatus(task.id, e.target.checked, task.completed)}
                      checked={task.completed}
                    />

                    <div>
                      <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        {task.task}
                      </strong>
                      <div className="text-muted small">
                        {task.type === 'custom' ? 'Custom Task' : 'Predefined Task'}
                      </div>
                    </div>
                  </div>

                  {/* right badge */}
                  <span className={`badge ${task.completed ? 'bg-success' : 'bg-secondary'}`}>
                    {task.completed ? 'Completed' : 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}

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
                      <div className="mb-3">
                        <label htmlFor="task" className="form-label">Task</label>
                        <input
                          type="text"
                          className="form-control"
                          id="taskTitle"
                          placeholder="Enter task title"
                          value={task}
                          onChange={e => setTask(e.target.value)}
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
    </>
  );
};

export default UserTask;
