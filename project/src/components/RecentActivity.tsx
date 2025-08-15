import React from 'react';
import { Clock, UserCheck, UserX, AlertTriangle } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'pointage',
      message: 'Marie Dubois a pointé son arrivée',
      time: '08:00',
      icon: UserCheck,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'retard',
      message: 'Jean Martin en retard (08:15)',
      time: '08:15',
      icon: AlertTriangle,
      color: 'text-orange-600'
    },
    {
      id: 3,
      type: 'depart',
      message: 'Sophie Laurent a pointé son départ',
      time: '17:30',
      icon: UserX,
      color: 'text-blue-600'
    },
    {
      id: 4,
      type: 'pointage',
      message: 'Pierre Durand a pointé son arrivée',
      time: '07:45',
      icon: UserCheck,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Activité Récente
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full bg-gray-50 ${activity.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;