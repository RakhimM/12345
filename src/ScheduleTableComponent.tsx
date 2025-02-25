import React from 'react'
import { Schedule } from './ClassLesson'

export default function ScheduleTableComponent({
  days,
  times,
  lessons,
}: {
    days: string[]
    times: string[]
    lessons: Schedule[]
  }) {
  return (
    <table className="schedule-table">
      <thead>
        <tr>
          <th>Время</th>
          {days.map((day: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {times.map((time: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
          <tr key={index}>
            <td>{time}</td>
            {days.map((day: React.Key | null | undefined) => {
              const lesson = lessons.find(
                (lesson: { time: { toString: () => any; }; day: any; }) => lesson.time.toString() === time && lesson.day === day
              );
              return (
                <td key={day}>
                  {lesson ? (
                    <>
                      {lesson.group || ' '}<br />
                      {lesson.classroom || ' '}<br />
                      {lesson.subjectType || ' '}<br />
                      {lesson.subjectName || ' '}
                    </>
                  ) : (
                    ' '
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
