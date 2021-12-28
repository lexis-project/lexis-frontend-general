import React from "react"

export const FilterEach = ({
    filterText,
    onFilter,
    id,
    label,
    text,
    colWidth,
}) => {
    return (
        <>
            <div key={id}>
                <div
                    id={id}
                    style={{
                        maxWidth: "100%",
                        width: `${colWidth}px`,
                        paddingRight: "32px",
                        paddingLeft: "8px",
                    }}
                    className="form-group has-label">
                    {label && (
                        <label htmlFor={`${label}-search`}>{label}</label>
                    )}
                    <input
                        className="form-control"
                        name={`${label}`}
                        type="text"
                        placeholder={`${label}`}
                        id={`${label}-search`}
                        aria-describedby={`${label}-help-block`}
                        value={filterText}
                        onChange={onFilter}
	                title={label ?"Enter name to filter values ("+label+")": undefined}
                    />
                    {label ? (
                        <small
                            id={`${label}-help-block`}
                            className="form-text text-muted"
                            htmlFor={`${label}-search`}>
                            {text}
                        </small>
                    ) : null}
                </div>
            </div>
        </>
    )
}
