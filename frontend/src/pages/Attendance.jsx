import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'

export default function Attendance() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const isTeacher = user?.role === 'TEACHER'

  // Fetch classes (for teachers, only their classes)
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data } = await api.get('/classes')
      return data.data
    },
  })

  // Fetch students in selected class
  const { data: students, isLoading } = useQuery({
    queryKey: ['classStudents', selectedClass],
    queryFn: async () => {
      const { data } = await api.get(`/classes/${selectedClass}/students`)
      return data.data
    },
    enabled: !!selectedClass,
  })

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: async (attendanceData) => {
      const { data } = await api.post('/attendance', attendanceData)
      return data
    },
    onSuccess: () => {
      toast.success('Attendance marked successfully')
      queryClient.invalidateQueries(['classStudents', selectedClass])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to mark attendance')
    },
  })

  const handleMarkAttendance = (studentId, status) => {
    markAttendanceMutation.mutate({
      studentId,
      date: selectedDate,
      status,
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading text-primary mb-2">
          {isTeacher ? 'Mark Attendance' : 'Attendance Management'}
        </h1>
        <p className="text-gray-600">
          {isTeacher ? 'Mark attendance for your classes' : 'View and manage student attendance'}
        </p>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">-- Select a class --</option>
              {classes?.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Students List */}
      {selectedClass && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Students</h3>

          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading students...</div>
          ) : students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Student Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Roll Number</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Mark Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {student.user?.firstName} {student.user?.lastName}
                      </td>
                      <td className="py-3 px-4">{student.rollNumber || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleMarkAttendance(student.id, 'PRESENT')}
                            className="px-4 py-2 bg-success text-white rounded hover:bg-green-600 text-sm"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(student.id, 'ABSENT')}
                            className="px-4 py-2 bg-danger text-white rounded hover:bg-red-600 text-sm"
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(student.id, 'LATE')}
                            className="px-4 py-2 bg-accent text-white rounded hover:bg-amber-600 text-sm"
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No students found in this class</div>
          )}
        </div>
      )}

      {!selectedClass && (
        <div className="card p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Class</h3>
          <p className="text-gray-500">Choose a class and date to mark attendance</p>
        </div>
      )}
    </div>
  )
}
