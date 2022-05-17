import React from "react";
import style from "../css/style.module.css";

export default function Controller({ Icon, handler, border, classes }) {
  return (
    <div
      className={`border-5 border-info  text-danger d-flex justify-content-center align-items-center ${style[classes]} ${border} `}
    >
      <Icon className={style.icon} onClick={handler} />
    </div>
  );
}
