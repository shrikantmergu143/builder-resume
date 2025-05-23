

const DateRange = ({ startYear, endYear, id }) => {
    const start = new Date(startYear);
    const end = new Date(endYear);
    return (
        <p id={id} className="sub-content">
            {start.toLocaleString('default', { month: 'short' })?.toLocaleUpperCase?.()}, {start.getFullYear()} - {end != "Invalid Date" ? end.toLocaleString('default', { month: 'short' })?.toLocaleUpperCase?.() + ', ' + end.getFullYear() : 'Present'}
        </p>
    );
};

export default DateRange;