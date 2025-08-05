import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { profilesApi } from '../utils/api';
import toast from 'react-hot-toast';

const CreateProfile = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await profilesApi.create(data);
      toast.success('Profile created successfully!');
      navigate('/profiles');
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          Create a new candidate profile for evaluation tracking
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter candidate's full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="candidate@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* Experience Years */}
            <div>
              <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                id="experience_years"
                min="0"
                max="50"
                {...register('experience_years', { valueAsNumber: true })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="5"
              />
            </div>

            {/* Current Company */}
            <div>
              <label htmlFor="current_company" className="block text-sm font-medium text-gray-700">
                Current Company
              </label>
              <input
                type="text"
                id="current_company"
                {...register('current_company')}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Current employer"
              />
            </div>

            {/* Position Applied */}
            <div>
              <label htmlFor="position_applied" className="block text-sm font-medium text-gray-700">
                Position Applied *
              </label>
              <input
                type="text"
                id="position_applied"
                {...register('position_applied', { required: 'Position is required' })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Senior Software Engineer"
              />
              {errors.position_applied && (
                <p className="mt-1 text-sm text-red-600">{errors.position_applied.message}</p>
              )}
            </div>
          </div>

          {/* Technology Stack */}
          <div>
            <label htmlFor="technology_stack" className="block text-sm font-medium text-gray-700">
              Technology Stack *
            </label>
            <textarea
              id="technology_stack"
              rows={3}
              {...register('technology_stack', { required: 'Technology stack is required' })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., React, Node.js, Python, AWS, Docker..."
            />
            {errors.technology_stack && (
              <p className="mt-1 text-sm text-red-600">{errors.technology_stack.message}</p>
            )}
          </div>

          {/* Resume Path */}
          <div>
            <label htmlFor="resume_path" className="block text-sm font-medium text-gray-700">
              Resume Path/URL
            </label>
            <input
              type="text"
              id="resume_path"
              {...register('resume_path')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Path to resume file or URL"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/profiles')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;