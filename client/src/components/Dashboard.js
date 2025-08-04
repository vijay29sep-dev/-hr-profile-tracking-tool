import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../utils/api';
import { format } from 'date-fns';
import {
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    statusCounts: {},
    recentProfiles: [],
    upcomingInterviews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardApi.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStageColor = (stage) => {
    const colors = {
      initial: 'bg-gray-100 text-gray-800',
      'hr-screening': 'bg-blue-100 text-blue-800',
      'technical': 'bg-yellow-100 text-yellow-800',
      'final': 'bg-green-100 text-green-800',
      'customer': 'bg-purple-100 text-purple-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Profiles',
      value: Object.values(stats.statusCounts).reduce((sum, count) => sum + count, 0),
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'New Applications',
      value: stats.statusCounts.new || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Shortlisted',
      value: stats.statusCounts.shortlisted || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Rejected',
      value: stats.statusCounts.rejected || 0,
      icon: XCircleIcon,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overview of candidate profiles and evaluation status
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Profiles */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Profiles
            </h3>
            {stats.recentProfiles.length === 0 ? (
              <p className="text-gray-500 text-sm">No profiles added yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {profile.name}
                        </h4>
                        <div className="flex space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                            {profile.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(profile.current_stage)}`}>
                            {profile.current_stage}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {profile.position_applied} • Added {format(new Date(profile.created_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <Link
                      to={`/profiles/${profile.id}`}
                      className="ml-3 text-blue-600 hover:text-blue-800"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/profiles"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all profiles →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Upcoming Interviews
            </h3>
            {stats.upcomingInterviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming interviews scheduled.</p>
            ) : (
              <div className="space-y-3">
                {stats.upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {interview.candidate_name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {interview.position_applied} • {interview.evaluation_type}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {format(new Date(interview.scheduled_date), 'MMM dd, yyyy HH:mm')}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;