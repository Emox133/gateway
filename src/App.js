import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import './App.css';
import axios from 'axios'

const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });

async function _onApprove(data, actions) {
  let order = await actions.order.capture();
  console.log(order);
  window.ReactNativeWebView &&
    window.ReactNativeWebView.postMessage(JSON.stringify(order));
  return order;
}

function _onError(err) {
  console.log(err);
  let errObj = {
    err: err,
    status: "FAILED",
  };
  window.ReactNativeWebView &&
    window.ReactNativeWebView.postMessage(JSON.stringify(errObj));
}

function App() {
  const [orderData, setOrderData] = useState()
  console.log(orderData)

  useEffect(() => {
    axios.get('http://localhost:8000/paypal').then(res => {
      setOrderData(res.data.create_payment_json)
    })
      .catch(err => console.log(err.response))
  }, [])

  function _createOrder(data, actions) {
    return actions.order.create({
      purchase_units: orderData
    })
  }

  return (
    <div className="App">
      <PayPalButton
        createOrder={(data, actions) => _createOrder(data, actions)}
        onApprove={(data, actions) => _onApprove(data, actions)}
        onCancel={() => _onError("Canceled")}
        onError={(err) => _onError(err)}
      />
    </div>
  );
}

export default App;
