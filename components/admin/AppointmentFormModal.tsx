"use client";

import { useState, useEffect, useRef } from 'react';

export default function AppointmentFormModal({ onClose }: { onClose: () => void }) {
  const [customerName, setCustomerName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [service, setService] = useState('Basic Wash ($20)');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ].map(t => `${t.slice(0,2)}:${t.slice(2)} ${t < '12:00' ? 'AM' : 'PM'}`);

  const services = [
    'Basic Wash ($20)',
    'Premium Wash ($35)', 
    'Deluxe Wash ($50)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      customerName,
      dateTime: selectedDate.toISOString(),
      time: selectedTime,
      service
    });
    // TODO: Save to Supabase
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in-50 duration-300">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-lexend text-gray-900">New Appointment</h2>
            <button
              onClick={onClose}
              className="p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Customer Name
            </label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Date
            </label>
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-lg"
              required
            />
          </div>

          {/* Time Picker */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-lg"
              required
            >
              <option value="">Select time slot</option>
              {timeSlots.map((time, i) => (
                <option key={i} value={time}>{time}</option>
              ))}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">
              Service
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-lg"
              required
            >
              {services.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="btnSaveYlw flex-1 py-3 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Create Appointment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-semibold text-lg hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
