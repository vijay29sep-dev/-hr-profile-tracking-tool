import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { profilesApi, evaluationsApi } from '../utils/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const ProfileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState(null);

  const statusForm = useForm();
  const evaluationForm = useForm();

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await profilesApi.getById(id);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      navigate('/profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (data) => {
    try {
      await profilesApi.updateStatus(id, data);
      toast.success('Status updated successfully');
      setShowStatusModal(false);
      fetchProfile();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEvaluationSubmit = async (data) => {
    try {
      if (editingEvaluation) {
        await evaluationsApi.update(editingEvaluation.id, data);
        toast.success('Evaluation updated successfully');
      } else {
        await evaluationsApi.create(id, data);
        toast.success('Evaluation added successfully');
      }
      setShowEvaluationModal(false);
      setEditingEvaluation(null);
      evaluationForm.reset();
      fetchProfile();
    } catch (error) {
      toast.error('Failed to save evaluation');
    }
  };

  const openEvaluationModal = (evaluation = null) => {
    setEditingEvaluation(evaluation);
    if (evaluation) {
      evaluationForm.reset(evaluation);
    } else {
      evaluationForm.reset();
    }
    setShowEvaluationModal(true);
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

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/profiles')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <p className="text-sm text-gray-600">{profile.position_applied}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Update Status
          </button>
          <button
            onClick={() => openEvaluationModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Evaluation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="w-4 h-4 mr-2" />
                <span>{profile.name}</span>
              </div>
              {profile.email && (
                <div className="flex items-center text-sm text-gray-600">
                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile.current_company && (
                <div className="flex items-center text-sm text-gray-600">
                  <BuildingOfficeIcon className="w-4 h-4 mr-2" />
                  <span>{profile.current_company}</span>
                </div>
              )}
              {profile.experience_years && (
                <div className="flex items-center text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4 mr-2" />
                  <span>{profile.experience_years} years experience</span>
                </div>
              )}
              {profile.resume_path && (
                <div className="flex items-center text-sm text-gray-600">
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  <span>Resume: {profile.resume_path}</span>
                </div>
              )}
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Technology Stack</h4>
              <p className="text-sm text-gray-600">{profile.technology_stack}</p>
            </div>
          </div>

          {/* Evaluations */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluations</h3>
            {profile.evaluations.length === 0 ? (
              <p className="text-gray-500 text-sm">No evaluations recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {profile.evaluations.map((evaluation) => (
                  <div key={evaluation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{evaluation.evaluation_type}</h4>
                        <p className="text-sm text-gray-600">
                          Evaluator: {evaluation.evaluator_name}
                        </p>
                        {evaluation.panel_names && (
                          <p className="text-sm text-gray-600">
                            Panel: {evaluation.panel_names}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(evaluation.status)}`}>
                          {evaluation.status}
                        </span>
                        <button
                          onClick={() => openEvaluationModal(evaluation)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                    
                    {evaluation.scheduled_date && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>
                          Scheduled: {format(new Date(evaluation.scheduled_date), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    )}
                    
                    {evaluation.interview_date && (
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>
                          Conducted: {format(new Date(evaluation.interview_date), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </div>
                    )}
                    
                    {(evaluation.technical_score || evaluation.communication_score || evaluation.overall_score) && (
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        {evaluation.technical_score && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Technical</p>
                            <p className="font-medium">{evaluation.technical_score}/10</p>
                          </div>
                        )}
                        {evaluation.communication_score && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Communication</p>
                            <p className="font-medium">{evaluation.communication_score}/10</p>
                          </div>
                        )}
                        {evaluation.overall_score && (
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Overall</p>
                            <p className="font-medium">{evaluation.overall_score}/10</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {evaluation.feedback && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Feedback</p>
                        <p className="text-sm text-gray-700">{evaluation.feedback}</p>
                      </div>
                    )}
                    
                    {evaluation.recommendation && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Recommendation</p>
                        <p className="text-sm text-gray-700">{evaluation.recommendation}</p>
                      </div>
                    )}
                    
                    {evaluation.next_round_scheduled && (
                      <div className="text-sm text-blue-600">
                        Next round: {format(new Date(evaluation.next_round_scheduled), 'MMM dd, yyyy HH:mm')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Status</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Status:</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                    {profile.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Stage:</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(profile.current_stage)}`}>
                    {profile.current_stage}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status History</h3>
            {profile.history.length === 0 ? (
              <p className="text-gray-500 text-sm">No status changes recorded.</p>
            ) : (
              <div className="space-y-3">
                {profile.history.map((entry) => (
                  <div key={entry.id} className="text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-900">
                          {entry.previous_status && `${entry.previous_status} → `}
                          <span className="font-medium">{entry.new_status}</span>
                        </p>
                        {entry.previous_stage !== entry.new_stage && (
                          <p className="text-gray-600">
                            Stage: {entry.previous_stage && `${entry.previous_stage} → `}
                            <span className="font-medium">{entry.new_stage}</span>
                          </p>
                        )}
                        {entry.reason && (
                          <p className="text-gray-600 mt-1">{entry.reason}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{entry.changed_by_name || 'System'}</span>
                      <span>{format(new Date(entry.created_at), 'MMM dd, HH:mm')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
            <form onSubmit={statusForm.handleSubmit(handleStatusUpdate)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...statusForm.register('status', { required: true })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select status</option>
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <select
                  {...statusForm.register('stage', { required: true })}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select stage</option>
                  <option value="initial">Initial</option>
                  <option value="hr-screening">HR Screening</option>
                  <option value="technical">Technical</option>
                  <option value="final">Final</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason (optional)
                </label>
                <textarea
                  {...statusForm.register('reason')}
                  rows={3}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Reason for status change..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluation Modal */}
      {showEvaluationModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingEvaluation ? 'Edit Evaluation' : 'Add Evaluation'}
            </h3>
            <form onSubmit={evaluationForm.handleSubmit(handleEvaluationSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evaluation Type *
                  </label>
                  <select
                    {...evaluationForm.register('evaluation_type', { required: true })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select type</option>
                    <option value="hr-screening">HR Screening</option>
                    <option value="technical">Technical Interview</option>
                    <option value="final">Final Interview</option>
                    <option value="customer">Customer Interview</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Evaluator Name *
                  </label>
                  <input
                    type="text"
                    {...evaluationForm.register('evaluator_name', { required: true })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Primary evaluator"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Panel Names
                  </label>
                  <input
                    type="text"
                    {...evaluationForm.register('panel_names')}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Panel member names (comma separated)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    {...evaluationForm.register('status')}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rescheduled">Rescheduled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="datetime-local"
                    {...evaluationForm.register('scheduled_date')}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Date
                  </label>
                  <input
                    type="datetime-local"
                    {...evaluationForm.register('interview_date')}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technical Score (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    {...evaluationForm.register('technical_score', { valueAsNumber: true })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Communication Score (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    {...evaluationForm.register('communication_score', { valueAsNumber: true })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overall Score (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    {...evaluationForm.register('overall_score', { valueAsNumber: true })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback
                </label>
                <textarea
                  rows={3}
                  {...evaluationForm.register('feedback')}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Detailed feedback from the evaluation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recommendation
                </label>
                <textarea
                  rows={2}
                  {...evaluationForm.register('recommendation')}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Recommendation for next steps..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Round Scheduled
                </label>
                <input
                  type="datetime-local"
                  {...evaluationForm.register('next_round_scheduled')}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEvaluationModal(false);
                    setEditingEvaluation(null);
                    evaluationForm.reset();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingEvaluation ? 'Update' : 'Add'} Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDetail;