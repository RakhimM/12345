import './assets/style1.css'
import { Schedule } from './ClassLesson'
import ScheduleTableComponent from './ScheduleTableComponent'

export default function ScheduleTable({
  schedules,
  filters,
}: {
  schedules: Schedule[]
  filters: { [key: string]: string }
}) {
  const filteredLessons = schedules.filter((schedule) => {
    const matchGroup = filters['группа'] ? schedule.group === filters['группа'] : true
    const matchClassroom = filters['аудитория'] ? schedule.classroom.includes(filters['аудитория']) : true
    const matchTeacher = filters['преподаватель'] ? schedule.teacher.includes(filters['преподаватель']) : true
    const matchSubjectType = filters['тип предмета'] ? schedule.subjectType.includes(filters['тип предмета']) : true
    const matchSubjectName = filters['название предмета'] ? schedule.subjectName.includes(filters['название предмета']) : true
    return matchGroup && matchClassroom && matchTeacher && matchSubjectType && matchSubjectName
  })

  const lessonsByDepartment: { [department: string]: { [teacher: string]: Schedule[] } } = {}
  filteredLessons.forEach((lesson) => {
    if (!lessonsByDepartment[lesson.department]) {
      lessonsByDepartment[lesson.department] = {}
    }
    if (!lessonsByDepartment[lesson.department][lesson.teacher]) {
      lessonsByDepartment[lesson.department][lesson.teacher] = []
    }
    lessonsByDepartment[lesson.department][lesson.teacher].push(lesson)
  })

  const getUniqueDaysAndTimes = (lessons: Schedule[]) => {
    const days = Array.from(new Set(lessons.map((lesson) => lesson.day)))
    const times = Array.from(new Set(lessons.map((lesson) => lesson.time.toString())))
    return { days, times }
  }

  return (
    <div className="schedule-container">
      <h2 className="schedule-heading">Расписание по кафедрам и преподавателям</h2>

      {Object.keys(lessonsByDepartment).length === 0 ? (
        <p>Нет пар.</p>
      ) : (
        Object.keys(lessonsByDepartment).map((department) => (
          <div key={department}>
            <h3>Кафедра: {department}</h3>
            {Object.keys(lessonsByDepartment[department]).map((teacher) => {
              const teacherLessons = lessonsByDepartment[department][teacher]
              const { days, times } = getUniqueDaysAndTimes(teacherLessons)

              const evenWeekLessons = teacherLessons.filter((lesson) => lesson.week === 'четная')
              const oddWeekLessons = teacherLessons.filter((lesson) => lesson.week !== 'четная')

              return (
                <div key={teacher}>
                  <h4>Преподаватель: {teacher}</h4>
                  {evenWeekLessons.length > 0 && (
                    <div className="even-week">
                      <h5 className="schedule-week-heading">Четная неделя</h5>
                      <ScheduleTableComponent days={days} times={times} lessons={evenWeekLessons} />
                    </div>
                  )}
                  {oddWeekLessons.length > 0 && (
                    <div className="odd-week">
                      <h5 className="schedule-week-heading">Нечетная неделя</h5>
                      <ScheduleTableComponent days={days} times={times} lessons={oddWeekLessons} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))
      )}
    </div>
  )
}
