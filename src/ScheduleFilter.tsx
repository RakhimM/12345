import { useState } from 'react'

export default function ScheduleFilter({
    filters,
    onFilterChange,
    onApplyFilter,
    onResetFilters,
}: {
    filters: { [key: string]: string };
    onFilterChange: (filterType: string, value: string) => void;
    onApplyFilter: () => void;
    onResetFilters: () => void;
}) {
    const filterOptions = [
        { value: 'группа', label: 'Группа' },
        { value: 'преподаватель', label: 'Преподаватель' },
        { value: 'аудитория', label: 'Аудитория' },
        { value: 'тип предмета', label: 'Тип предмета' },
        { value: 'название предмета', label: 'Название предмета' },
    ];

    const [selectedFilters, setSelectedFilters] = useState<string[]>([])

    function handleFilterSelection(filterValue: string) {
        setSelectedFilters((prevSelectedFilters) =>
            prevSelectedFilters.includes(filterValue)
                ? prevSelectedFilters.filter((value) => value !== filterValue)
                : [...prevSelectedFilters, filterValue]
        )
    }

    function handleApplyFilter() {
        onApplyFilter()
        selectedFilters.forEach((filter) => {
            onFilterChange(filter, '')
        });
    }

    function handleResetFilters() {
        setSelectedFilters([])
        onResetFilters()
    }

    return (
        <div>
            <h2>Фильтрация</h2>
            <div>
                <h3>Выберите фильтры</h3>
                {filterOptions.map((option) => (
                    <div key={option.value}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedFilters.includes(option.value)}
                                onChange={() => handleFilterSelection(option.value)}
                            />
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>

            {selectedFilters.length > 0 && (
                <div>
                    <h3>Введите значения для фильтров</h3>
                    {selectedFilters.map((filter) => {
                        const option = filterOptions.find((o) => o.value === filter);
                        return (
                            <div key={filter}>
                                <label>
                                    {option?.label}:
                                    <input
                                        type="text"
                                        value={filters[filter] || ''}
                                        onChange={(e) => onFilterChange(filter, e.target.value)}
                                    />
                                </label>
                            </div>
                        );
                    })}
                    <button onClick={handleApplyFilter}>Применить фильтр</button>
                    <button onClick={handleResetFilters}>Сбросить фильтры</button>
                </div>
            )}
        </div>
    )
}