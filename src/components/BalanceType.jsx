import React from "react";
import style from "../css/style.module.css";
export default function BalanceType({ Icon, title, total }) {
  return (
    <div className="d-flex justify-content-center">
      <div>
        <Icon className={style.balance_icon} />
      </div>
      <div className="ms-1">
        <p className="m-0">{title}</p>
        <p>${total}</p>
      </div>
    </div>
  );
}
