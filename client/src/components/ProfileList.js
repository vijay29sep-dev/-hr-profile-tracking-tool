import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profilesApi } from '../utils/api';
import { format } from 'date-fns';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    stage: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [filters]);

  const fetchProfiles = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.stage) params.stage = filters.stage;
      if (filters.search) params.search = filters.search;

      const response = await profilesApi.getAll(params);
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      stage: '',
      search: ''
    });
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Profiles</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track candidate profiles through the evaluation process
          </p>
        </div>
        <Link
          to="/profiles/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Profile
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>

              {/* Stage Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  value={filters.stage}
                  onChange={(e) => handleFilterChange('stage', e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Stages</option>
                  <option value="initial">Initial</option>
                  <option value="hr-screening">HR Screening</option>
                  <option value="technical">Technical</option>
                  <option value="final">Final</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {profiles.length} profile{profiles.length !== 1 ? 's' : ''}
      </div>

      {/* Profiles List */}
      {profiles.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No profiles found matching your criteria.</p>
          <Link
            to="/profiles/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add First Profile
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <li key={profile.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {profile.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {profile.position_applied}
                            {profile.current_company && ` • ${profile.current_company}`}
                            {profile.experience_years && ` • ${profile.experience_years} years exp`}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                            {profile.status}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(profile.current_stage)}`}>
                            {profile.current_stage}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {profile.technology_stack}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>
                            Added {format(new Date(profile.created_at), 'MMM dd, yyyy')}
                            {profile.created_by_name && ` by ${profile.created_by_name}`}
                          </p>
                          <span className="mx-2">•</span>
                          <p>
                            {profile.evaluation_count} evaluation{profile.evaluation_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      <Link
                        to={`/profiles/${profile.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileList;