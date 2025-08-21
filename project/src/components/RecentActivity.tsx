import React from 'react';
import { Activity, Clock, Calendar } from 'lucide-react';
import { ActivityItem } from '../services/dashboardService';

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <Clock className="w-4 h-4" />;
      case 'leave':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'late':
        return 'text-orange-600 bg-orange-100';
      case 'on_time':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Activité Récente</h2>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-3">
        {activities.slice(0, 5).map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
            <div className="p-2 bg-blue-100 rounded-lg">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.employee_name}
              </p>
              <p className="text-sm text-gray-500 truncate">{activity.details}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(activity.status)}`}>
              {activity.status}
            </span>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;




// import React from 'react';
// import { Clock, UserCheck, UserX, AlertTriangle } from 'lucide-react';

// const RecentActivity: React.FC = () => {
//   const activities = [
//     {
//       id: 1,
//       type: 'pointage',
//       message: 'Marie Dubois a pointé son arrivée',
//       time: '08:00',
//       icon: UserCheck,
//       color: 'text-green-600'
//     },
//     {
//       id: 2,
//       type: 'retard',
//       message: 'Jean Martin en retard (08:15)',
//       time: '08:15',
//       icon: AlertTriangle,
//       color: 'text-orange-600'
//     },
//     {
//       id: 3,
//       type: 'depart',
//       message: 'Sophie Laurent a pointé son départ',
//       time: '17:30',
//       icon: UserX,
//       color: 'text-blue-600'
//     },
//     {
//       id: 4,
//       type: 'pointage',
//       message: 'Pierre Durand a pointé son arrivée',
//       time: '07:45',
//       icon: UserCheck,
//       color: 'text-green-600'
//     }
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">
//         Activité Récente
//       </h3>
//       <div className="space-y-4">
//         {activities.map((activity) => {
//           const Icon = activity.icon;
//           return (
//             <div key={activity.id} className="flex items-start space-x-3">
//               <div className={`p-2 rounded-full bg-gray-50 ${activity.color}`}>
//                 <Icon className="w-4 h-4" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm text-gray-900">{activity.message}</p>
//                 <p className="text-xs text-gray-500 flex items-center mt-1">
//                   <Clock className="w-3 h-3 mr-1" />
//                   {activity.time}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default RecentActivity;