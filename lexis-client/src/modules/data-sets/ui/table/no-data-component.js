import React from "react"
import { connect } from "react-redux"

const NoDataComponentImpl = ({ data, columns }) => (
    <>
        {data.length === 0 && (
            <table className="table table-striped table-bordered table-hover">
                <thead></thead>
                <tbody>
                    <tr>
                        <td
                            colSpan={columns.length}
                            style={{ textAlign: "center" }}>
                            The list of items is empty.
                        </td>
                    </tr>
                </tbody>
            </table>
        )}
    </>
)

export const NoDataComponent = connect(null, null)(NoDataComponentImpl)
