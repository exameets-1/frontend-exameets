import { useState, useEffect } from 'react';
import { AlertCircle, Loader2, Users, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function Registrations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://skillverse.exameets.in/api/test/student/analytics');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (studentId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(studentId)) {
      newExpanded.delete(studentId);
    } else {
      newExpanded.add(studentId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Error Loading Data</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Student Registrations</h1>
            </div>
            <button
              onClick={fetchAnalytics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Total Students</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{data?.totalStudents || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Verified</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {data?.students.filter(s => s.verified).length || 0}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Total Courses</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {data?.students.reduce((sum, s) => sum + s.totalRegisteredCourses, 0) || 0}
              </p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-600">Test Attempts</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {data?.students.reduce((sum, s) => sum + s.totalAttempts, 0) || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Attempts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.students.map((student) => (
                  <>
                    <tr key={student.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.location.district && student.location.state 
                          ? `${student.location.district}, ${student.location.state}`
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          student.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                        {student.totalRegisteredCourses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="text-gray-900">{student.totalAttempts}</div>
                        <div className="text-xs text-gray-500">
                          {student.completedAttempts} completed
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(student.registeredAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleRow(student.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {expandedRows.has(student.id) ? 'Hide Details' : 'View Details'}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Row Details */}
                    {expandedRows.has(student.id) && (
                      <tr>
                        <td colSpan="9" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* Personal Details */}
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-2">Personal Information</h3>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Date of Birth:</span>
                                  <span className="ml-2 text-gray-900">{formatDate(student.dateOfBirth)}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Guardian:</span>
                                  <span className="ml-2 text-gray-900">{student.guardianName} ({student.guardianPhone})</span>
                                </div>
                                {student.referralCode && (
                                  <div>
                                    <span className="text-gray-600">Referral Code:</span>
                                    <span className="ml-2 text-gray-900 font-mono">{student.referralCode}</span>
                                  </div>
                                )}
                                {student.referredBy && (
                                  <div>
                                    <span className="text-gray-600">Referred By:</span>
                                    <span className="ml-2 text-gray-900">{student.referredBy.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Registered Courses */}
                            {student.registeredCourses.length > 0 && (
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Registered Courses</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {student.registeredCourses.map((course) => (
                                    <div key={course.id} className="bg-white p-3 rounded border border-gray-200">
                                      <div className="font-medium text-gray-900">{course.title}</div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        {course.totalMarks} marks • {course.durationMinutes} mins
                                      </div>
                                      {course.testDate && (
                                        <div className="text-xs text-gray-500 mt-1">
                                          Test Date: {formatDate(course.testDate)}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Test Attempts */}
                            {student.testAttempts.length > 0 && (
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Test Attempts</h3>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-sm">
                                    <thead className="bg-gray-100">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Course</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Progress</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Start Time</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">End Time</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {student.testAttempts.map((attempt) => (
                                        <tr key={attempt.id}>
                                          <td className="px-3 py-2">{attempt.courseTitle}</td>
                                          <td className="px-3 py-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                              attempt.status === 'submitted' || attempt.status === 'auto_submitted'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                              {attempt.status.replace('_', ' ')}
                                            </span>
                                          </td>
                                          <td className="px-3 py-2">
                                            {attempt.answeredQuestions}/{attempt.totalQuestions} answered
                                          </td>
                                          <td className="px-3 py-2 text-gray-600">
                                            {formatDateTime(attempt.startTime)}
                                          </td>
                                          <td className="px-3 py-2 text-gray-600">
                                            {formatDateTime(attempt.endTime)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {data?.students.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No students registered yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}