import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, CreditCard, Award, UserPlus, CalendarCheck } from 'lucide-react';
import { AppNotification } from '../../types';
import { getData, saveData, STORAGE_KEYS } from '../../services/storage';
import { useToast } from '../common/Toast';

export const NotificationsView: React.FC = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getData<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, [])
  );

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    saveData(STORAGE_KEYS.NOTIFICATIONS, updated);
    showToast('All notifications marked as read.');
  };

  const toggleRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: !n.read } : n
    );
    setNotifications(updated);
    saveData(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveData(STORAGE_KEYS.NOTIFICATIONS, updated);
    showToast('Notification cleared.');
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'fee':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'exam':
        return <Award className="w-5 h-5 text-amber-600" />;
      case 'admission':
        return <UserPlus className="w-5 h-5 text-indigo-600" />;
      case 'attendance':
        return <CalendarCheck className="w-5 h-5 text-sky-600" />;
      default:
        return <Bell className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Notifications & Alerts Center</h2>
            <p className="text-xs text-slate-400">
              System alerts, transaction logs, admissions updates and academic deadlines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" /> Mark All as Read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No notifications at the moment. All caught up!
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition hover:bg-slate-50/60 ${
                !item.read ? 'bg-indigo-50/30' : ''
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleRead(item.id)}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                >
                  {item.read ? 'Mark unread' : 'Mark read'}
                </button>
                <button
                  onClick={() => deleteNotification(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
