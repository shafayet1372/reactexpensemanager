import React, { useState, useEffect } from "react";
import { Form, Button, Col, Spinner, Row } from "react-bootstrap";
import { ModalView, Calendar } from "./components";
import { MdDateRange, BiArrowBack } from "../lib/icons";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc, updateDoc, doc, db } from "../lib/firebase/config";
import {
  paymentMethods,
  categoriesIncome,
  categoriesExpense,
} from "../lib/data";
import style from "../css/style.module.css";

export default function FormController({
  goBackHandler,
  type,
  editedValues,
  clearEditedHandler,
}) {
  let [paymentMode, setPaymentMode] = useState("Cash");
  let [category, setCategory] = useState("");
  let [mode, setMode] = useState(false);
  let [spinner, setSpinner] = useState(true);
  let [date, setDate] = useState(new Date());
  let [showModal, setShowModal] = useState(false);
  let [values, setValues] = useState({
    amount: "",
    description: "",
  });

  useEffect(() => {
    if (type == "update") {
      let { payment_mode, type, date, category, amount, description } =
        editedValues;

      setPaymentMode(payment_mode);
      setCategory(category);
      setDate(new Date(date));
      setMode(type == "income" ? false : true);
      setValues({ amount, description });
    }
  }, [editedValues]);

  let collections = collection(db, "expensemanager");

  let modalHandler = () => {
    setShowModal((p) => !p);
  };

  useEffect(() => {
    setTimeout(() => setSpinner(false), 800);
  }, []);

  useEffect(() => {
    if (type == "create") {
      if (!mode) {
        setCategory("Salary");
      } else {
        setCategory("Groceries");
      }
    }
  }, [mode]);

  let changeHandler = (e) => {
    if (e.target.name == "amount" && /[^0-9]/.test(e.target.value)) {
      return null;
    }
    setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  let addData = async () => {
    let { amount, description } = values;
    try {
      addDoc(collections, {
        amount: parseInt(amount),
        payment_mode: paymentMode,
        category,
        description,
        type: !mode ? "income" : "expense",
        date: new Date(date).toLocaleDateString(),
      });
    } catch (e) {
      alert("error");
    }
  };

  let updateData = async () => {
    let { id } = editedValues;
    let { amount, description } = values;
    let docRef = doc(db, "expensemanager", id);

    try {
      updateDoc(docRef, {
        amount: parseInt(amount),
        payment_mode: paymentMode,
        category,
        description,
        type: !mode ? "income" : "expense",
        date: new Date(date).toLocaleDateString(),
      });
      clearEditedHandler();
    } catch (e) {
      alert("error");
    }
  };

  let submitHandler = (e) => {
    e.preventDefault();
    goBackHandler();
    if (type == "create") {
      let { amount } = values;
      if (!amount) {
        alert("please give amount");
      } else {
        addData();
      }
      return null;
    }
    updateData();
  };

  return (
    <div>
      {!spinner ? (
        <Form className="text-white bg-info p-5" onSubmit={submitHandler}>
          <Form.Group>
            <Row>
              <Col xs={2}>
                <BiArrowBack
                  onClick={goBackHandler}
                  className={`${style.back_icon} `}
                />
              </Col>
              <Col className="text-end fw-bold" xs={5}>
                {!mode ? (
                  <p>Add Income</p>
                ) : (
                  <p className="text-danger">Add Expense</p>
                )}
              </Col>
              <Col className="d-flex justify-content-end" xs={5}>
                {" "}
                <Form.Check
                  checked={mode}
                  type="switch"
                  id="custom-switch"
                  label="mode"
                  onChange={() => setMode((p) => !p)}
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3 mt-1">
            <MdDateRange onClick={modalHandler} className={style.input_date} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="text"
              name="amount"
              placeholder="Amount"
              value={values.amount}
              onChange={changeHandler}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Payment Mode</Form.Label>
            <Form.Select
              size="sm"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              {paymentMethods.map((x) => (
                <option key={uuidv4()}>{x}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              size="sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {!mode
                ? categoriesIncome.map((x) => (
                    <option key={uuidv4()}>{x}</option>
                  ))
                : categoriesExpense.map((x) => (
                    <option key={uuidv4()}>{x}</option>
                  ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={values.description}
              onChange={changeHandler}
            />
          </Form.Group>
          <Button className="bg-white text-info border-0" type="submit">
            Done
          </Button>
        </Form>
      ) : (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      )}
      <ModalView show={showModal} handleClose={modalHandler}>
        <Calendar
          onChange={(e) => {
            setDate(e);
            modalHandler();
          }}
          value={date}
        />
      </ModalView>
    </div>
  );
}
