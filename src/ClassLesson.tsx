import ExcelJS from 'exceljs'

export interface Schedule {
    week: string
    day: string
    time: string
    group: string
    classroom: string
    subjectType: string
    subjectName: string
    teacher: string
    department: string
}

export const parseSchedule = async (files: File[]): Promise<Schedule[]> => {
    const schedule: Schedule[] = []
    const daysOfWeek = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота']
    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(arrayBuffer)
        const worksheet = workbook.worksheets[0]
        for (let rowIndex = 7; rowIndex < worksheet.rowCount; rowIndex += 32) {
            let weekType = "четная"
            const teacherCell = worksheet.getRow(rowIndex).getCell(2)
            const teacher = teacherCell.value ? teacherCell.value.toString() : ''
            const departmentCell = worksheet.getRow(rowIndex).getCell(3)
            const department = departmentCell.value ? departmentCell.value.toString() : ''
            const getLessonForDay = (dayIndex: number, value: number): Schedule[] => {
                const lessons: Schedule[] = []
                for (let i = value; i < 20; i += 4) {
                    const rowtime = worksheet.getRow(rowIndex + i + 2)
                    const celltime = rowtime.getCell(1)
                    const cellValuetime = celltime.value ? celltime.value.toString() : ''
                    const row1 = worksheet.getRow(rowIndex + i + 2)
                    const cell1 = row1.getCell(dayIndex + 2)
                    let cellValue1 = cell1.value ? cell1.value.toString() : ''
                    let get1 = getCellValue2(cellValue1)
                    const row2 = worksheet.getRow(rowIndex + i + 3)
                    let cell2 = row2.getCell(dayIndex + 2)
                    let cellValue2 = cell2.value ? cell2.value.toString() : ''
                    let get2 = getCellValue3(cellValue2)
                    if (get1.group.includes('.')) {
                        const rowAbove = worksheet.getRow(rowIndex + i + 1)
                        const cellAbove = rowAbove.getCell(dayIndex + 2)
                        cellValue1 = cellAbove.value ? cellAbove.value.toString() : ''
                        get1 = getCellValue2(cellValue1)
                        const rowBelow = worksheet.getRow(rowIndex + i + 2)
                        const cellBelow = rowBelow.getCell(dayIndex + 2)
                        cellValue1 = cellBelow.value ? cellBelow.value.toString() : ''
                        get2 = getCellValue3(cellValue1)
                    }
                    if (get2.subjectType.includes(' ')) {
                        const rowAbove = worksheet.getRow(rowIndex + i + 3)
                        const cellAbove = rowAbove.getCell(dayIndex + 2)
                        cellValue1 = cellAbove.value ? cellAbove.value.toString() : ''
                        get1 = getCellValue2(cellValue1)
                        const rowBelow = worksheet.getRow(rowIndex + i + 4)
                        const cellBelow = rowBelow.getCell(dayIndex + 2)
                        cellValue2 = cellBelow.value ? cellBelow.value.toString() : ''
                        get2 = getCellValue3(cellValue2)
                    }
                    const couple: Schedule = {
                        week: weekType,
                        day: daysOfWeek[dayIndex],
                        time: cellValuetime,
                        teacher: teacher,
                        department: department,
                        ...get1,
                        ...get2
                    }
                    lessons.push(couple)
                }
                return lessons
            }

            for (let k = 0; k < 3; k += 2) {
                if (k === 0) weekType = "четная"
                else weekType = "нечетная"
                getLessonForDay(0, k).forEach(lesson => schedule.push(lesson)) // Adding lessons from the first day
                getLessonForDay(1, k).forEach(lesson => schedule.push(lesson)) // Adding lessons from the second day
                getLessonForDay(2, k).forEach(lesson => schedule.push(lesson)) // Adding lessons from the third day
                getLessonForDay(3, k).forEach(lesson => schedule.push(lesson)) // Adding lessons from the fourth day
                getLessonForDay(4, k).forEach(lesson => schedule.push(lesson)) // Adding lessons from the fifth day
                getLessonForDay(5, k).forEach(lesson => schedule.push(lesson)) // Adding lessons from the sixth day
            }
        }
    }
    return schedule
}

const getCellValue2 = (cellValue: string): { group: string; classroom: string } => {
    const spaceIndex = cellValue.indexOf(' ')
    let group = ''
    let classroom = ''
    if (spaceIndex !== -1) {
        group = cellValue.slice(0, spaceIndex)
        classroom = cellValue.slice(spaceIndex + 1).trim()
    } else {
        group = cellValue
    }
    return { group, classroom }
}

const getCellValue3 = (cellValue: string): { subjectType: string; subjectName: string } => {
    let subjectType = ''
    let subjectName = ''
    if (cellValue.includes('кср.')) {
        const index = cellValue.indexOf('кср.')
        subjectType = cellValue.substring(0, index + 4).trim()
        subjectName = cellValue.substring(index + 4).trim()
    } else {
        const [type, ...nameParts] = cellValue.split('.')
        subjectType = type.trim()
        subjectName = nameParts.join('.').trim()
    }
    return { subjectType, subjectName }
}
