import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import api from '../api/axios'

export default function Devices() {
  const queryClient = useQueryClient()
  const [confirmAction, setConfirmAction] = useState(null)

  const { data: devices, isLoading } = useQuery({
    queryKey: ['pendingDevices'],
    queryFn: async () => {
      const { data } = await api.get('/devices')
      return data.data
    },
  })

  const verifyMutation = useMutation({
    mutationFn: (deviceId) => api.patch(`/devices/${deviceId}/verify`),
    onSuccess: () => {
      toast.success('✅ Device verified successfully!')
      queryClient.invalidateQueries(['pendingDevices'])
      queryClient.invalidateQueries(['pendingDevicesCount'])
      setConfirmAction(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Verification failed')
    },
  })

  const rejectMutation = useMutation({
    mutationFn: (deviceId) => api.patch(`/devices/${deviceId}/reject`),
    onSuccess: () => {
      toast.success('Device rejected. User has been notified.')
      queryClient.invalidateQueries(['pendingDevices'])
      queryClient.invalidateQueries(['pendingDevicesCount'])
      setConfirmAction(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Rejection failed')
    },
  })

  const handleApprove = (device) => {
    setConfirmAction({
      type: 'approve',
      device,
      message: `Approve device for ${device.user.firstName} ${device.user.lastName}?`,
    })
  }

  const handleReject = (device) => {
    setConfirmAction({
      type: 'reject',
      device,
      message: `Are you sure you want to reject this device? The user will be notified.`,
    })
  }

  const confirmActionHandler = () => {
    if (confirmAction.type === 'approve') {
      verifyMutation.mutate(confirmAction.device.id)
    } else {
      rejectMutation.mutate(confirmAction.device.id)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-heading text-primary mb-2">Device Verification</h1>
        <p className="text-gray-600">Review and approve device registration requests</p>
      </div>

      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-700">
            Pending Devices ({devices?.length || 0})
          </h3>
        </div>

        {devices && devices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {devices.map((device, idx) => (
                  <tr key={device.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {device.user.firstName} {device.user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{device.user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        device.user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        device.user.role === 'TEACHER' ? 'bg-blue-100 text-blue-800' :
                        device.user.role === 'STUDENT' ? 'bg-green-100 text-green-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {device.user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {device.deviceId.substring(0, 16)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(device.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleApprove(device)}
                        disabled={verifyMutation.isPending || rejectMutation.isPending}
                        className="btn btn-success text-sm"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleReject(device)}
                        disabled={verifyMutation.isPending || rejectMutation.isPending}
                        className="btn btn-danger text-sm"
                      >
                        ❌ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Pending Devices</h3>
            <p className="text-gray-500">All device verification requests have been processed.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card p-6 max-w-md w-full">
            <h3 className="text-xl font-heading text-primary mb-4">Confirm Action</h3>
            <p className="text-gray-700 mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button
                onClick={confirmActionHandler}
                disabled={verifyMutation.isPending || rejectMutation.isPending}
                className={`flex-1 btn ${
                  confirmAction.type === 'approve' ? 'btn-success' : 'btn-danger'
                } disabled:opacity-50`}
              >
                {verifyMutation.isPending || rejectMutation.isPending ? 'Processing...' : 'Confirm'}
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 btn bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
