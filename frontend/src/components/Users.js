import React from "react";

export const Breaches = () => {

    const API = process.env.REACT_APP_API

    return (
    <div className="row, col-md-12">
        <table className="table table-hover">
            <thead className="table-dark">
                <tr>
                    <th scope="col">Type</th>
                    <th scope="col">Column heading</th>
                    <th scope="col">Column heading</th>
                    <th scope="col">Column heading</th>
                </tr>
            </thead>
            <tbody>
            <tr class="table-secondary">
                <th scope="row">Secondary</th>
                <td>Column content</td>
                <td>Column content</td>
                <td>Column content</td>
            </tr>
            </tbody>
        </table>
    </div>
  );
};
