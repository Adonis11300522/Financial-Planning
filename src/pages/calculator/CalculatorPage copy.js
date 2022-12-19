import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  InputGroup,
  Form,
  Tab,
  Tabs,
  Table,
  Accordion,
  Button,
} from "react-bootstrap";
import { FaCalendarAlt, FaCoins, FaMoneyBill, FaPercent } from "react-icons/fa";
import Chart from "react-apexcharts";
import { onValue, ref } from "firebase/database";
import { uuidv4 } from "@firebase/util";
import {collection, addDoc, getDocs, QuerySnapshot, doc, setDoc, updateDoc} from 'firebase/firestore';
import { db } from "../../utils/firebase";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const pieOption = {
  chart: {
    type: "donut",
    width: "100%",
    // offsetY: 30,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: "80%",
        labels: {
          show: true,
          value: {
            fontSize: "24px",
            fontWeight: 900,
            color: "#fff",
            offsetY: -5,
          },
          total: {
            show: true,
            offsetY: 10,
            showAlways: true,
            fontSize: "0px",
            label: "Total",
            formatter: function (w) {
              console.log(w.globals.seriesTotals);
              return "$45.012";
              /*return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);*/
            },
          },
        },
      },
      offsetY: 0,
    },
    // stroke: {
    //   colors: undefined,
    // },
  },
  states: {
    normal: { filter: { type: "darken", value: 1 } },
    hover: { filter: { type: "lighten", value: 0.1 } },
    active: { filter: { type: "darken", value: 1 } },
  },
  colors: ["#E564B8", "#5426BE", "#22C77A"],
  stroke: { width: 0 },
  legend: {
    show: true,
    position: "bottom",
    markers: {
      width: 7,
      height: 7,
      radius: 12,
    },
  },
  series: [21, 23, 19],
  tooltip: {
    enabled: true,
  },
  labels: ["Increased Floors", "Increased Volume", "Increased Delistings"],
};

function CalculatorPage() {
  const [mSalary, setMSalary] = useState(0);
  const [expense, setExpense] = useState(0);
  const [invest, setInvest] = useState(0);
  const [yInvest, setYInvest] = useState(0);
  const [intest, setInterest] = useState(0);
  const [saving, setSaving] = useState(0);
  const [yCMonthly, setYCMonthly] = useState(0);
  const [months, setMonths] = useState(0);
  const [pCalculation, setPCalculation] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [tSalary, setTSalary] = useState(0);
  const [tExpense, setTExpense] = useState(0);
  const [tSaving, setTSaving] = useState(0);
  const [tInvest, setTInvest] = useState(0);
  const [tInvestY, setTInvestY] = useState(0);
  const [principleProfit, setPrincipleProfit] = useState(0);
  const [documentId, setDocumentId] = useState('');
  
  // const table1Data = [];

  const getData = async () => {
    await getDocs(collection(db, 'financial'))
    .then((QuerySnapshot) => {
      const newData = QuerySnapshot.docs
      .map((doc) => (
        {...doc.data(), id : doc.id}
      ));

      console.log('getdata', newData[0]);
      setMSalary(newData[0].mSalary);
      setExpense(newData[0].expense);
      setInvest(newData[0].invest);
      setYInvest(newData[0].yInvestment);
      setInterest(newData[0].interest);
      setYCMonthly(newData[0].yCMonthly);
      setMonths(newData[0].Months);
      setDocumentId(newData[0].id);
    })
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    let _savingVaue = parseFloat(expense) + parseFloat(invest);

    if (_savingVaue > parseFloat(mSalary)) {
      setSaving(0);
    } else {
      _savingVaue = parseFloat(mSalary) - _savingVaue;
      setSaving(_savingVaue);
    }

    if (parseFloat(months) > 12) {
      setMonths(0);
      return;
    }

    let _pCalculation = parseFloat(yCMonthly) * 12 + parseFloat(months);
    setPCalculation(_pCalculation);

    // debugger
    let mArray = [];
    let ResultArray = [];
    for (let i = 0; i < _pCalculation; i++) {
      let _tmp = {
        month: i,
        expense: expense,
        invested: invest,
        saved: saving,
        total: mSalary,
      };
      mArray.push(_tmp);
    }

    const group = mArray
      .map((e, i) => {
        return i % 12 === 0 ? mArray.slice(i, i + 12) : null;
      })
      .filter((e) => {
        return e;
      });

      setTableData(group);
    let _accumulatedExpense = 0
    let _accumulatedSaving = 0;
    let _investedYearlyForInsert = 0;
    let _totalForLast = 0;
    let _accumulatedProfit = 0;
    for(let i = 0; i < group.length; i++) {
      let _expenseYearly = 0;
      let _savingYearly = 0;
      let _investedYearly = 0;
      for(let j = 0; j < group[i].length; j++) {
        _expenseYearly += parseFloat(group[i][j].expense);
        _savingYearly += parseFloat(group[i][j].saved);
        _investedYearly += parseFloat(group[i][j].invested);
      }
      _accumulatedExpense += _expenseYearly;
      _accumulatedSaving += _savingYearly;
      let _accumulatedExpenseForInsert = 0, _accumulatedSavingForInsert = 0, _annualProfitForInsert = 0;
      let _accumulatedForInsert = 0;
      
      if(i !== 0) {
        _accumulatedExpenseForInsert = _accumulatedExpense;
        _accumulatedSavingForInsert = _accumulatedSaving;
        _accumulatedForInsert = _investedYearlyForInsert + _totalForLast;
        if(yInvest >= 2) {
          _annualProfitForInsert = Math.round(intest * _accumulatedForInsert * 0.01);
        }
        _accumulatedProfit += _annualProfitForInsert;
      }
      let resultTmp = {
        ExpenseYearly: _expenseYearly,
        AccumulatedExpense: _accumulatedExpenseForInsert,
        SavingYearly: _savingYearly,
        AccumulatedSaving: _accumulatedSavingForInsert,
        InvestedYearly: _investedYearlyForInsert,
        Accumulated: _accumulatedForInsert,
        AnnualProfit: _annualProfitForInsert,
        AccumulatedProfit: _accumulatedProfit,
        Total: _accumulatedForInsert + _annualProfitForInsert,
      };
      _totalForLast = _accumulatedForInsert + _annualProfitForInsert;
      _investedYearlyForInsert = _investedYearly;
      ResultArray[i] = resultTmp;
    }
    
    for(let i = group.length; i < yInvest; i++) {
      let _tmpInvestedYearly = 0;
      let _annualProfitForInsert = 0;
      let _accumulatedForInsert = 0;
      if(i === group.length) {
        _tmpInvestedYearly = _investedYearlyForInsert;
      }
      _accumulatedForInsert = ResultArray[i - 1]?.Total + _tmpInvestedYearly;
      if(yInvest >= i) {
        _annualProfitForInsert =  Math.round(_accumulatedForInsert * intest * 0.01);
      }
      _accumulatedProfit += _annualProfitForInsert;
      let resultTmp = {
        ExpenseYearly: 0,
        AccumulatedExpense: ResultArray[i - 1]?.AccumulatedExpense,
        SavingYearly: 0,
        AccumulatedSaving: ResultArray[i - 1]?.AccumulatedSaving,
        InvestedYearly: _tmpInvestedYearly,
        Accumulated: _accumulatedForInsert ,
        AnnualProfit: _annualProfitForInsert,
        AccumulatedProfit: _accumulatedProfit,
        Total: _accumulatedForInsert + _annualProfitForInsert,
      };
      ResultArray[i] = resultTmp;
    }
    console.log(ResultArray);
    setResultData(ResultArray);

    let _tSalary = 0;
    let _tExpense = 0;
    let _tSaving = 0;
    let _tInvest = 0;
    let _tInvestY = 0;
    let _principleProfit = 0;

    for(let i = 0; i < ResultArray.length; i++) {
      _tExpense += parseFloat(ResultArray[i].ExpenseYearly);
      _tSaving += parseFloat(ResultArray[i].SavingYearly);
      _tInvest += parseFloat(ResultArray[i].InvestedYearly);
    }

    if(yInvest >= 2) {
      let _tmpInvestY = 0
      for(let i = 0; i < yInvest; i++) {
        _tmpInvestY = Math.round(intest * ResultArray[i].Accumulated * 0.01);
        // debugger
        _tInvestY += _tmpInvestY;

      }
      console.log(_tInvestY) 
    }
    setTSalary(_tExpense + _tSaving + _tInvest);
    setTExpense(_tExpense);
    setTSaving(_tSaving);
    setTInvest(_tInvest);
    setTInvestY(_tInvestY);
    setPrincipleProfit(_tInvest + _tInvestY)
    let _dashboardArray = {
      tSalary : _tExpense + _tSaving + _tInvest,
      tExpense : _tExpense,
      tSaving : _tSaving,
      contributionPeriod : yCMonthly,
      tInvest : _tInvest,
      profitRate : intest,
      investmentYeild : _tInvestY,
      over : yInvest,
      principleProfit : _tInvest + _tInvestY
    }

    console.log("investmentYeild array = >",ResultArray)
    console.log("dashboard array = >",_dashboardArray)


  }, [mSalary, expense, invest, yInvest, intest, yCMonthly, months]);

  const dashboardData = [
    {
      title: "Calculations Over",
      value: yInvest,
      type: "Years",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Accumulated Monthly Salary",
      value: tSalary,
      type: "SAR",
      icon: <FaCoins />,
    },
    {
      title: "Accumulated Expense",
      value: tExpense,
      type: "SAR",
      icon: <FaCoins />,
    },
    {
      title: "Accumulated Saving",
      value: tSaving,
      type: "SAR",
      icon: <FaCoins />,
    },
    {
      title: "Accumulated Investment",
      value: tInvest,
      type: "SAR",
      icon: <FaCoins />,
    },
    {
      title: "Total Investment Yield",
      value: tInvestY,
      type: "SAR",
      icon: <FaCoins />,
    },
    {
      title: "Principle + Profit",
      value: principleProfit,
      type: "SAR",
      icon: <FaCoins />,
    },
    { title: "Profit Rate", value: intest, type: "%", icon: <FaPercent /> },
  ];

  const Submit = async () => {

    if(documentId == '') {
      try {
        const docRef = await addDoc(collection(db, 'financial'), {        
          Months : months,
          expense: expense,
          interest : intest,
          invest : invest,
          mSalary : mSalary,
          pCalculation : pCalculation, 
          saving : saving,
          yCMonthly : yCMonthly,
          yInvestment : yInvest
        })
        toast.success('Data saving successful!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      } catch (error) {
        toast.error('Failed to save data!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    }
    else {

      const docRef = doc(db, 'financial', documentId);

      try {
        await updateDoc(docRef, {        
          Months : months,
          expense: expense,
          interest : intest,
          invest : invest,
          mSalary : mSalary,
          pCalculation : pCalculation, 
          saving : saving,
          yCMonthly : yCMonthly,
          yInvestment : yInvest
        }).then(docRef => {
          toast.success('Data saving successful!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }).catch (e => {
          toast.error('Failed to save data!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        })
      } catch (error) {
        console.log('no')
      }


    }
      
    

    
  }

  const pieChartData = [41, 21, 38];

  return (
    <div className="CalculatorPage py-2">
      <ToastContainer />
      <Container>
        <div className="section-title">Dashboard</div>
        <Row>
          {dashboardData.map((item, idx) => (
            <Col sm={12} xs={12} md={3} className="my-2">
              <Card className="dashboard-card">
                <Card.Body className="d-flex align-items-center justify-content-between">
                  <div className="d-flex flex-column">
                    <Card.Subtitle>{item.title}</Card.Subtitle>
                    <div className="d-flex align-items-center mt-3">
                      <h3>{item.value}</h3>
                      <span className="ms-2">{item.type}</span>
                    </div>
                  </div>
                  <div className="card-icon">
                    <span>{item.icon}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="section-title">Set Values</div>
        <Row>
          <Col sm={12} xs={12} md={12} className="my-2">
            <Card className="text-white">
              <Card.Body>
                <Row>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Monthly Salary<span className="ms-2">( $ )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={mSalary}
                        onChange={(e) => setMSalary(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Expense<span className="ms-2">( $ )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={expense}
                        onChange={(e) => setExpense(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Invest<span className="ms-2">( $ )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={invest}
                        onChange={(e) => setInvest(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Years of Investment<span className="ms-2">( Years )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={yInvest}
                        onChange={(e) => setYInvest(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Interest<span className="ms-2">( % )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={intest}
                        onChange={(e) => setInterest(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Saving<span className="ms-2">( $ )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={saving}
                        onChange={(e) => setSaving(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Years of Contributing Monthly
                      <span className="ms-2">( Years )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={yCMonthly}
                        onChange={(e) => setYCMonthly(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Months<span className="ms-2">( Months )</span>
                      <span className="mx-2">* Months must be 12</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      Period of Calculation
                      <span className="ms-2">( $ / Months )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={pCalculation}
                        onChange={(e) => setPCalculation(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} xs={12} md={12}><Button className="w-100 save-btn" onClick={Submit}>Save Data</Button></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="section-title">Results</div>
        <Card>
          <Card.Body>
            <Row>
              <Col sm={12} xs={12} md={12}>
                <Tabs
                  defaultActiveKey="result1"
                  transition={false}
                  id="noanim-tab-example"
                  className="mb-3"
                >
                  <Tab eventKey="result1" title="Result1">
                    <Row className="result-content">
                      <Col
                        sm={12}
                        xs={12}
                        md={12}
                        className="result-table-section"
                      >
                        <Accordion defaultActiveKey="0">
                          {tableData.map((year, idx) => (
                            <Accordion.Item eventKey={idx} key={idx}>
                              <Accordion.Header>
                                Year {idx + 1}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="month-info-list">
                                  <Table>
                                    <thead>
                                      <tr>
                                        <th>Month No</th>
                                        <th>Expense</th>
                                        <th>Invested</th>
                                        <th>Saved</th>
                                        <th>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {year.map((item, i) => (
                                        <tr key={i}>
                                          <td>Month {item.month + 1}</td>
                                          <td>{item.expense}</td>
                                          <td>{item.invested}</td>
                                          <td>{item.saved}</td>
                                          <td>{item.total}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          ))}
                        </Accordion>
                      </Col>
                    </Row>
                  </Tab>
                  <Tab eventKey="result2" title="Result2">
                    <Row className="result-content">
                      <Col
                        sm={12}
                        xs={12}
                        md={12}
                        className="result-table-section"
                      >
                        <Table>
                          <thead>
                            <tr>
                              <th>Year No</th>
                              <th>Expense<span className="ms-2">(Yearly)</span></th>
                              <th>Accumulated Expense</th>
                              <th>Saving<span className="ms-2">(Yearly)</span></th>
                              <th>Accumulated Saving</th>
                              <th>Invested<span className="ms-2">(Yearly)</span></th>
                              <th>Accumulated</th>
                              <th>Annual Profit</th>
                              <th>Accumulated Profit</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              resultData.map((item, idx) => (
                                <tr key={idx}>
                                  <td>Year {idx + 1}</td>
                                  <td>{item.ExpenseYearly}</td>
                                  <td>{item.AccumulatedExpense}</td>
                                  <td>{item.SavingYearly}</td>
                                  <td>{item.AccumulatedSaving}</td>
                                  <td>{item.InvestedYearly}</td>
                                  <td>{item.Accumulated}</td>
                                  <td>{item.AnnualProfit}</td>
                                  <td>{item.AccumulatedProfit}</td>
                                  <td>{item.Total}</td>
                                </tr>
                              ))
                            }
                            
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default CalculatorPage;
