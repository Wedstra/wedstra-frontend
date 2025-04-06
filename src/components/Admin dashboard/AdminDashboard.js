import React from 'react'
import "./adminDashboard.css";
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const displayVendors = () => {
        navigate('/authorize-vendors');
    }
    return (
        <div id='admin-dashboard'>
            <h1 className='text-center'>Admin Dashboard</h1>
            <div className='admin-dashboard-container container p-0'>
                <div className='row' id='analysis-row'>
                    <div className='col-md-3 col-sm-6 mb-4' id='value-col'>
                        <div className='dashboard-card card shadow'>
                            <div className='card-body'>
                                <h5 className='card-title text-center text-primary'>Total Users</h5>
                                <p className='card-text text-center display-4'>100</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6 mb-4' id='value-col'>
                        <div className='dashboard-card card shadow'>
                            <div className='card-body'>
                                <h5 className='card-title text-center text-success'>Total Vendors</h5>
                                <p className='card-text text-center display-4'>50</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6 mb-4' id='value-col'>
                        <div className='dashboard-card card shadow'>
                            <div className='card-body'>
                                <h5 className='card-title text-center text-warning'>Total Services</h5>
                                <p className='card-text text-center display-4'>200</p>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3 col-sm-6 mb-4' id='value-col'>
                        <div className='dashboard-card card shadow'>
                            <div className='card-body'>
                                <h5 className='card-title text-center text-danger'>Total Bookings</h5>
                                <p className='card-text text-center display-4'>150</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='container'>
            <div className='row' id='users-row'>
                <div className='col-md-6 col-sm-6 mb-4' id='vendors-col'>
                    <div className='dashboard-card card shadow'>
                        <div className='card-body'>
                            <button className='btn btn-success w-100' onClick={ displayVendors }>Authorize Vendors</button>
                        </div>
                    </div>
                </div>
                <div className='col-md-6 col-sm-6 mb-4' id='users-col'>
                    <div className='dashboard-card card shadow'>
                        <div className='card-body'>
                        <button className='btn btn-primary w-100'>Users</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>

    )
}
