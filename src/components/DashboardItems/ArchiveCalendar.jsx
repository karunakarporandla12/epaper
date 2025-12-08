import React, { useState, useMemo } from "react";
import './ArchiveCalendar.css'

/**
 * props:
 *  - availableDates: Set of "YYYY-MM-DD" strings that should be highlighted
 *  - value: currently selected date string "YYYY-MM-DD"
 *  - onSelect(dateString) -> called when user picks a date
 */
const ArchiveCalendar = ({ availableDates = new Set(), value, onSelect }) => {
  const [shownMonth, setShownMonth] = useState(() => {
    const d = value ? new Date(value) : new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Helper to format YYYY-MM-DD
  const fmt = (d) =>
    d.toISOString().slice(0, 10);

  const startOfMonth = (m) => new Date(m.getFullYear(), m.getMonth(), 1);
  const endOfMonth = (m) => new Date(m.getFullYear(), m.getMonth() + 1, 0);

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(shownMonth);
    const monthEnd = endOfMonth(shownMonth);

    // compute the first day shown in grid (Sunday start)
    const firstDayIndex = monthStart.getDay(); // 0..6 (Sun..Sat)
    const gridStart = new Date(monthStart);
    gridStart.setDate(monthStart.getDate() - firstDayIndex);

    const days = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      days.push(d);
    }
    // break into 6 weeks of 7 days
    const rows = [];
    for (let r = 0; r < 6; r++) {
      rows.push(days.slice(r * 7, r * 7 + 7));
    }
    return rows;
  }, [shownMonth]);

  const prevMonth = () =>
    setShownMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () =>
    setShownMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const isSameDay = (a, b) => fmt(a) === fmt(b);

  return (
    <div className="archive-calendar card p-2" style={{ minWidth: 260 }}>
      <div className="d-flex align-items-center justify-content-between mb-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={prevMonth} aria-label="Previous month">
          ‹
        </button>
        <div style={{ fontWeight: 600 }}>
          {shownMonth.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={nextMonth} aria-label="Next month">
          ›
        </button>
      </div>

      <table className="w-100 text-center" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr className="text-muted small">
            <th style={{ width: "14%" }}>Sun</th>
            <th style={{ width: "14%" }}>Mon</th>
            <th style={{ width: "14%" }}>Tue</th>
            <th style={{ width: "14%" }}>Wed</th>
            <th style={{ width: "14%" }}>Thu</th>
            <th style={{ width: "14%" }}>Fri</th>
            <th style={{ width: "14%" }}>Sat</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((d) => {
                const dayStr = fmt(d);
                const inMonth = d.getMonth() === shownMonth.getMonth();
                const available = availableDates.has(dayStr);
                const selected = value === dayStr;
                return (
                  <td key={dayStr} style={{ padding: 4 }}>
                    <button
                      onClick={() => onSelect(dayStr)}
                      className={`day-btn btn btn-sm ${selected ? "btn-primary" : available ? "btn-outline-primary available" : "btn-light"}`}
                      disabled={!inMonth && !available && !selected}
                      title={available ? "Has data" : ""}
                      style={{
                        width: 34,
                        height: 34,
                        padding: 0,
                        borderRadius: 6,
                        lineHeight: "34px",
                        border: selected ? undefined : undefined,
                        opacity: inMonth ? 1 : 0.55,
                      }}
                    >
                      {d.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-2">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onSelect(new Date().toISOString().slice(0, 10))}
        >
          Today
        </button>
        <div className="small text-muted align-self-center">Dates with data are blue</div>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => onSelect("")}
          title="Clear selection"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ArchiveCalendar;
