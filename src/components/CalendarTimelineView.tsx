import React from 'react';
import { Subscription } from '../types';
import { MODEL_CONFIGS } from '../constants/models';

interface CalendarTimelineViewProps {
  subscriptions: Subscription[];
  onEdit: (sub: Subscription) => void;
}

export const CalendarTimelineView: React.FC<CalendarTimelineViewProps> = ({
  subscriptions,
  onEdit,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Maximum 2 weeks (14 days) limit
  const daysList: { date: Date; dateStr: string; label: string; isToday: boolean }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    daysList.push({
      date: d,
      dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      isToday: i === 0,
    });
  }

  const eventsByDay: Record<string, Subscription[]> = {};
  subscriptions.forEach(sub => {
    if (!eventsByDay[sub.renewalDate]) eventsByDay[sub.renewalDate] = [];
    eventsByDay[sub.renewalDate].push(sub);
  });

  return (
    <div
      style={{
        padding: 24,
        borderRadius: 'var(--radius)',
        border: '1px solid var(--line)',
        background: 'rgba(14,20,43,.76)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 20 }}>
        <h2 style={{ font: "700 18px 'Space Grotesk'", margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>▣</span> 2-Week Renewal &amp; Reset Timeline (14 Days Max)
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          Upcoming billing renewals and quotas across all accounts over the next 2 weeks (14-day limit)
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {daysList.map(({ dateStr, label, isToday }) => {
          const events = eventsByDay[dateStr] || [];

          return (
            <div
              key={dateStr}
              style={{
                padding: '14px 18px',
                borderRadius: 14,
                border: isToday ? '1px solid rgba(154,77,255,.55)' : '1px solid var(--line)',
                background: isToday
                  ? 'rgba(154,77,255,.12)'
                  : events.length > 0
                  ? 'rgba(16,25,53,.8)'
                  : 'rgba(5,9,26,.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: isToday ? '#9a4dff' : events.length > 0 ? '#4cdbac' : '#475569',
                    boxShadow: isToday ? '0 0 10px #9a4dff' : events.length > 0 ? '0 0 10px #4cdbac' : 'none',
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ font: "700 14px 'Space Grotesk'", color: '#fff' }}>{label}</strong>
                    {isToday && (
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: '#9a4dff', color: '#fff' }}>
                        TODAY
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {events.length > 0 ? `${events.length} renewal(s) scheduled` : 'No renewals scheduled'}
                  </span>
                </div>
              </div>

              {/* Subscriptions Pills */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {events.map(sub => {
                  const meta = MODEL_CONFIGS[sub.model] || MODEL_CONFIGS.custom;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => onEdit(sub)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 10,
                        border: '1px solid var(--line)',
                        background: 'rgba(10,15,34,.9)',
                        color: '#d7def4',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontFamily: 'inherit',
                      }}
                    >
                      <span>{meta.icon}</span>
                      <strong style={{ color: '#fff' }}>{meta.name}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: 11 }}>
                        {sub.account.split('@')[0]} (${sub.cost})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
