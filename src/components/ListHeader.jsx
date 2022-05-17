import React from "react";
import style from "../css/style.module.css";
export default function ListHeader({ datas }) {
  let [a, b] = datas;
  let getdate = new Date(a).toDateString().split(" ");
  let day = getdate[0];
  let month = getdate[1];
  let date = getdate[2];
  let year = getdate[3];
  let totalExpenses = () => {
    return b.reduce(
      (acc, val) => (val.type == "expense" ? acc + val.amount : acc),
      0
    );
  };
  let totalIncome = () => {
    return b.reduce(
      (acc, val) => (val.type == "income" ? acc + val.amount : acc),
      0
    );
  };
  return (
    <div
      className={`  d-flex justify-content-between rounded  ${style.expense_main}`}
    >
      <div className="p-0 d-flex align-items-center">
        <div className="mx-1">
          <p className="fw-bold display-5">{date}</p>
        </div>
        <div>
          <p className="m-0">{day}</p>
          <p>{`${month} ${year}`}</p>
        </div>
      </div>
      <div className="p-2 bg-danger d-flex align-items-center">
        {totalExpenses() != 0 && (
          <div className="me-2 bg-warning rounded p-1 text-dark">
            ${`${totalExpenses()}`}
          </div>
        )}
        {totalIncome() != 0 && (
          <div className="bg-success rounded p-1 text-white">
            ${`${totalIncome()}`}
          </div>
        )}
      </div>
    </div>
  );
}
