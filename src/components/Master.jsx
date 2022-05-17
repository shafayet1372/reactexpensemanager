import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiOutlinePlus,
  MdDateRange,
  FiMinusCircle,
  BiMoney,
} from "../lib/icons";
import {
  Controller,
  BalanceType,
  DataView,
  FormController,
  ModalView,
  Calendar,
} from "./components";
import { db, collection, onSnapshot } from "../lib/firebase/config";
import {
  getGroupedDataByDate,
  getTotalIncome,
  getTotalExpense,
  getSortedDataByDate,
} from "../lib/functionality";
import style from "../css/style.module.css";

export default function Master() {
  let [date, setDate] = useState("");
  let [createMode, setCreateMode] = useState(false);
  let [showModal, setShowModal] = useState(false);
  let [datas, setDatas] = useState([]);
  let [editedValues, setEditedValues] = useState({});
  let collections = collection(db, "expensemanager");

  useEffect(() => {
    let unsub = onSnapshot(collections, (data) => {
      setDatas(data.docs.map((x) => ({ ...x.data(), id: x.id })));
    });
    return () => {
      unsub();
    };
  }, []);

  let modalHandler = () => {
    setShowModal((p) => !p);
  };

  let changeViewMode = () => {
    setCreateMode((p) => true);
  };

  let goBackHandler = () => {
    setCreateMode((p) => false);
  };

  let editHandler = (value) => {
    setEditedValues((p) => ({ ...value }));
    changeViewMode((p) => true);
  };

  let clearEditedHandler = () => setEditedValues({});

  let getAllData = () => {
    let getGroupedData = getGroupedDataByDate(datas.slice());
    let getSortedData = getSortedDataByDate(getGroupedData.slice(), date);

    let totalIncome = getTotalIncome(getSortedData.slice());
    let totalExpense = getTotalExpense(getSortedData.slice());
    let totalBalance = totalIncome - totalExpense;
    return {
      getGroupedData,
      totalBalance,
      totalExpense,
      totalIncome,
      getSortedData,
    };
  };

  let showBalanceData = () => {
    let { totalIncome, totalExpense, totalBalance } = getAllData();
    return (
      <div>
        <Row
          className={`justify-content-between text-center text-white fw-bold ${style.balance_bg}`}
        >
          <Col xs={4}>
            <BalanceType
              total={totalIncome}
              title="INCOME"
              Icon={AiOutlinePlus}
            />
          </Col>
          <Col xs={4}>
            <BalanceType
              total={totalExpense}
              title="EXPENSE"
              Icon={FiMinusCircle}
            />
          </Col>
          <Col xs={4}>
            <BalanceType total={totalBalance} title="BALANCE" Icon={BiMoney} />
          </Col>
        </Row>
      </div>
    );
  };
  let showDataList = () => {
    let { getSortedData } = getAllData();
    return (
      <Row className="my-2 px-2 ">
        {" "}
        <Col className="p-0">
          <DataView datas={getSortedData} editHandler={editHandler} />
        </Col>
      </Row>
    );
  };

  return (
    <Container className={`style.container_fix `}>
      {createMode ? (
        <Row>
          <Col>
            {!editedValues?.id ? (
              <FormController type="create" goBackHandler={goBackHandler} />
            ) : (
              <FormController
                goBackHandler={goBackHandler}
                type="update"
                editedValues={editedValues}
                clearEditedHandler={clearEditedHandler}
              />
            )}
          </Col>
        </Row>
      ) : (
        <div>
          <div className="sticky-top">
            <Row
              className={`${style.expense_header} justify-content-between bg-white`}
            >
              <Col className=" m-0 p-0" xs={5} onClick={changeViewMode}>
                <Controller
                  border="border-end "
                  classes="add_expense"
                  Icon={AiOutlinePlus}
                />
              </Col>
              <Col xs={5} className=" m-0 p-0" onClick={setShowModal}>
                <Controller
                  border="border-start "
                  classes="add_date"
                  Icon={MdDateRange}
                />
              </Col>
            </Row>

            {showBalanceData()}
          </div>
          {showDataList()}
        </div>
      )}

      <ModalView show={showModal} handleClose={setShowModal}>
        <Calendar
          onChange={(e) => {
            setDate(e);
            modalHandler();
          }}
          value={date ? date : new Date()}
        />
      </ModalView>
    </Container>
  );
}
<ul></ul>;
