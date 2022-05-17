import React from "react";
import { ListGroup } from "react-bootstrap";
import { ListHeader } from "./components";
import {
  BsPlusCircle,
  MdOutlineDelete,
  MdOutlineModeEditOutline,
  FiMinusCircle,
} from "../lib/icons";
import { doc, deleteDoc, db } from "../lib/firebase/config";
import style from "../css/style.module.css";

export default function DataView({ datas, editHandler }) {
  let deleteData = async (id) => {
    let docRef = doc(db, "expensemanager", id);
    try {
      deleteDoc(docRef, id);
    } catch (e) {
      alert("error");
    }
  };
  let sortedData = datas.sort(
    (a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
  return (
    <div>
      <ListGroup className="p-0 ">
        {sortedData.map((x) => {
          let [a, b] = x;
          return [
            <ListHeader datas={x} />,
            b.map((x) => (
              <ListGroup.Item
                key={x.id}
                className={`  p-0  my-1 text-white  rounded `}
              >
                <div className="d-flex">
                  <div
                    style={{ width: "10%" }}
                    className={`d-flex align-items-center justify-content-center text-white  ${
                      x.type == "income" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    <div className="">
                      <MdOutlineDelete
                        className={style.delete_icon}
                        onClick={() => deleteData(x.id)}
                      />
                    </div>
                    <div>
                      {" "}
                      <MdOutlineModeEditOutline
                        onClick={() => editHandler(x)}
                        className={style.edit_icon}
                      />
                    </div>
                  </div>
                  <div
                    style={{ width: "95%" }}
                    className={`d-flex ${
                      x.type == "income"
                        ? style.income_color
                        : style.expense_color
                    }`}
                  >
                    <div
                      className="d-flex align-items-center  "
                      style={{ width: "90%", fontSize: "14px" }}
                    >
                      <div>
                        {x.type == "income" ? (
                          <BsPlusCircle className="mx-3" />
                        ) : (
                          <FiMinusCircle className="mx-3" />
                        )}
                      </div>
                      <div>
                        <p className="m-0 ">{`${x.category}  (${x.payment_mode})`}</p>
                        <p className="m-0">{x.description}</p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center">{`$${x.amount}`}</div>
                  </div>
                </div>
              </ListGroup.Item>
            )),
          ];
        })}
      </ListGroup>
    </div>
  );
}
