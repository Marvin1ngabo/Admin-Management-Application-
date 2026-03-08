import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

export default function Classes() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data } = await api.get('/classes')
      return data.data || []
    },
  })

  const filteredClasses = classes?.filter(cls =>
    cls.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-48"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-navy-900">Class Management</h1>
        <button className="px-4 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-600">
          + Add Class
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <input
          type="search"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Classes</p>
          <p className="text-2xl font-bold text-navy-900">{classes?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold text-green-600">
            {classes?.reduce((sum, cls) => sum + (cls._count?.students || 0), 0) || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Avg. Class Size</p>
          <p className="text-2xl font-bold text-blue-600">
            {classes?.length ? Math.round(classes.reduce((sum, cls) => sum + (cls._count?.students || 0), 0) / classes.length) : 0}
          </p>
        </div>
      </div>

      {filteredClasses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No classes found</h3>
          <p className="text-gray-600">Create classes to organize students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-navy-900">{cls.name}</h3>
                  <p className="text-sm text-gray-600">{cls.academicYear}</p>
                </div>
                <span className="px-3 py-1 bg-navy-100 text-navy-700 rounded-full text-sm font-medium">
                  {cls._count?.students || 0} students
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>👨‍🏫</span>
                  <span>Teacher: {cls.teacher?.user?.firstName} {cls.teacher?.user?.lastName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📚</span>
                  <span>Capacity: {cls.capacity || 'N/A'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-navy-700 text-white rounded-lg hover:bg-navy-600 text-sm">
                  View Details
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
