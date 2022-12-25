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
  Modal
} from "react-bootstrap";
import { FaCalendarAlt, FaCoins, FaMoneyBill, FaPercent, FaQuestion } from "react-icons/fa";
import Chart from "react-apexcharts";
import { onValue, ref } from "firebase/database";
import { uuidv4 } from "@firebase/util";
import {collection, addDoc, getDocs, QuerySnapshot, doc, setDoc, updateDoc} from 'firebase/firestore';
import { db } from "../../utils/firebase";
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { InvestmentChart, PieChart, PortfolioChart, TotalIncomeChart } from "../../components/charts/Charts";
import { ThemeMode, useThemeContext } from "../../utils/ThemeContext";
import Switch from "react-switch";
import language from '../../utils/language.json';


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
  const [show, setShow] = useState(false);
  const { value, setValue } = useThemeContext();

  const [checked, setChecked] = useState(true);
  const [mainLanguage, setMainLanguage] = useState(language.ar);
  
  const Language = language;
  const getData = async () => {
    await getDocs(collection(db, 'financial'))
    .then((QuerySnapshot) => {
      const newData = QuerySnapshot.docs
      .map((doc) => (
        {...doc.data(), id : doc.id}
      ));
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


  console.log("main", mainLanguage)

  useEffect(() => {    

    if (parseFloat(months) > 12) {
      setMonths(0);
      return;
    }

    let _savingVaue = parseFloat(expense) + parseFloat(invest);

    if (_savingVaue > parseFloat(mSalary)) {
      setSaving(0);
    } else {
      _savingVaue = parseFloat(mSalary) - _savingVaue;
      // alert(_savingVaue)
      setSaving(_savingVaue);
    }

    if(months == "") {
      setMonths(0);
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
      _investedYearlyForInsert = _investedYearly;
      _accumulatedExpense += _expenseYearly;
      _accumulatedSaving += _savingYearly;
      let _accumulatedExpenseForInsert = 0, _accumulatedSavingForInsert = 0, _annualProfitForInsert = 0;
      let _accumulatedForInsert = 0;
      
      if(i !== 0) {
        _accumulatedExpenseForInsert = _accumulatedExpense;
        _accumulatedSavingForInsert = _accumulatedSaving;
        _accumulatedForInsert = _investedYearlyForInsert + _totalForLast;
        if(yInvest >= i + 1) {
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
      if(yInvest >= 2) {
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
    console.log("---------------------",ResultArray);
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
    setPrincipleProfit(_tInvest + _tInvestY);
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


  }, [mSalary, expense, invest, yInvest, intest, yCMonthly, months, saving]);

  

  const dashboardData = [
    {
      title: mainLanguage.calculationsOver,
      value: ((pCalculation / 12).toFixed(1)).toLocaleString(),
      type: mainLanguage.years,
      icon: <FaCalendarAlt />,
    },
    {
      title: mainLanguage.accumulatedMonthlySalary,
      value: tSalary.toLocaleString(),
      type: mainLanguage.sar,
      icon: <FaCoins />,
    },
    {
      title: mainLanguage.accumulatedExpense,
      value: tExpense.toLocaleString(),
      type: mainLanguage.sar,
      icon: <FaCoins />,
    },
    {
      title: mainLanguage.accumulatedSaving,
      value: tSaving.toLocaleString(),
      type: mainLanguage.sar,
      icon: <FaCoins />,
    },
    {
      title: mainLanguage.accumulatedInvestment,
      value: tInvest.toLocaleString(),
      type: mainLanguage.sar,
      icon: <FaCoins />,
    },
    {
      title: mainLanguage.totalInvestmentYield,
      value: tInvestY.toLocaleString(),
      type: mainLanguage.sar,
      icon: <FaCoins />,
    },
    {
      title: mainLanguage.principleProfit,
      value: principleProfit.toLocaleString(),
      type: mainLanguage.sar,
      icon: <FaCoins />,
    },
    { title: mainLanguage.profitRate, value: intest, type: "%", icon: <FaPercent /> },
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
        toast.success(mainLanguage.successMessage, {
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
        toast.error(mainLanguage.errorMessage, {
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
          toast.success(mainLanguage.successMessage, {
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
          toast.error(mainLanguage.errorMessage, {
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


  const PieChartData = [parseFloat(expense), parseFloat(saving), parseFloat(invest)];

  const PortfolioChartData = [
    {
      name: mainLanguage.expense,
      data: [tExpense],
    },
    {
      name: mainLanguage.saving,
      data: [tSaving],
    },
  ];

  const TotalIncomeChartData = [
    {
      name: mainLanguage.totalIncome,
      data: [tSalary],
    },
    {
      name: mainLanguage.expense,
      data: [tExpense],
    },
    {
      name: mainLanguage.saving,
      data: [tSaving],
    },
    {
      name: mainLanguage.investment,
      data: [tInvest],
    },
  ];

  const InvestmentChartData = [
    {
      name: mainLanguage.investment,
      data: [tInvest],
    },
    {
      name: mainLanguage.profit,
      data: [tInvestY],
    },
    {
      name: mainLanguage.principleProfit,
      data: [principleProfit],
    },
  ];

  const handleChange = nextChecked => {
    setChecked(nextChecked);
    let _value ="";
    if(value == "ltr") {
      _value = "rtl";
      setMainLanguage(Language.ar);
      setValue(_value);
    } 
    else {
      _value = "ltr";
      setMainLanguage(Language.en);
      setValue(_value);
    }
  };

 
  return (
    <div className="CalculatorPage py-2">
      <ToastContainer />
      <Button className="description-btn" onClick={() => setShow(true)}><FaQuestion/></Button>
            
      <Container>
        <h2 className="title text-center">
          <span className="title-word title-word-1">{mainLanguage.modalTitle}</span>
        </h2>        
        <div className="section-title d-flex align-items-center justify-content-between">
          <span>{mainLanguage.dashboard}</span>
          <div className="d-flex align-items-center">{mainLanguage.language} : 
          <Switch
          onChange={handleChange}
          checked={checked}
          className="react-switch ms-2"
        />
        </div>
            
        </div>
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
        <div className="section-title">{mainLanguage.charts}</div>
        <Row>
          <Col sm={12} xs={12} md={3} className="mb-2">
            <Card>
              <Card.Body>
                <h4 className="text-center text-gray">{mainLanguage.totalIncome}</h4>
                <PieChart data={PieChartData} lang={mainLanguage} height="260"/>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} xs={12} md={3} className="mb-2">
            <Card>
              <Card.Body>
              <h4 className="text-center text-gray">{mainLanguage.portfolio}</h4>
              <PortfolioChart data={PortfolioChartData} height="220"/>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} xs={12} md={3} className="mb-2">
            <Card>
              <Card.Body>
              <h4 className="text-center text-gray">{mainLanguage.totalIncome}</h4>
              <TotalIncomeChart data={TotalIncomeChartData} height="220"/>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} xs={12} md={3} className="mb-2">
            <Card>
              <Card.Body>
              <h4 className="text-center text-gray">{mainLanguage.investment}</h4>
              <InvestmentChart data={InvestmentChartData} height="220"/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="section-title">{mainLanguage.setValues}</div>
        <Row>
          <Col sm={12} xs={12} md={12} className="my-2">
            <Card className="text-white">
              <Card.Body>
                <Row>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      {mainLanguage.monthlySalary}<span className="ms-2">({ mainLanguage.sar} )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={mSalary}
                        min="0"
                        onChange={(e) => setMSalary(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      {mainLanguage.expense}<span className="ms-2">( {mainLanguage.sar} )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={expense}
                        min="0"
                        onChange={(e) => setExpense(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      {mainLanguage.invest}<span className="ms-2">( {mainLanguage.sar} )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={invest}
                        min="0"
                        onChange={(e) => setInvest(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      {mainLanguage.yearsofInvestment}<span className="ms-2">( {mainLanguage.years} )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        min="0"
                        value={yInvest}
                        onChange={(e) => setYInvest(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      {mainLanguage.interest}<span className="ms-2">( % )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={intest}
                        min="0"
                        onChange={(e) => setInterest(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      {mainLanguage.saving}<span className="ms-2">( {mainLanguage.sar} )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={saving}
                        min="0"
                        onChange={(e) => setSaving(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                     {mainLanguage.yearsofContributingMonthly}
                      <span className="ms-2">( {mainLanguage.years} )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        min="0"
                        value={yCMonthly}
                        onChange={(e) => setYCMonthly(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      {mainLanguage.months}<span className="ms-2">( {mainLanguage.months} )</span>
                      <span className="mx-2">* {mainLanguage.monthsMustBe12}</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={months}
                        min="0"
                        onChange={(e) => setMonths(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col sm={12} xs={12} md={4}>
                    <Form.Label>
                      {mainLanguage.periodofCalculation}
                      <span className="ms-2">( {mainLanguage.months} )</span>
                    </Form.Label>
                    <InputGroup size="sm" className="mb-3">
                      <Form.Control
                        placeholder=""
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        type="number"
                        value={pCalculation}
                        min="0"
                        onChange={(e) => setPCalculation(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} xs={12} md={12}><Button className="w-100 save-btn" onClick={Submit}>{mainLanguage.calculate}</Button></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="section-title">{mainLanguage.results}</div>
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
                  <Tab eventKey="result1" title={mainLanguage.results + 1}>
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
                                {mainLanguage.year} {idx + 1}
                              </Accordion.Header>
                              <Accordion.Body>
                                <div className="month-info-list">
                                  <Table>
                                    <thead>
                                      <tr>
                                        <th>{mainLanguage.monthNo}</th>
                                        <th>{mainLanguage.expense}</th>
                                        <th>{mainLanguage.invested}</th>
                                        <th>{mainLanguage.saved}</th>
                                        <th>{mainLanguage.total}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {year.map((item, i) => (
                                        <tr key={i}>
                                          <td>{mainLanguage.month} {item.month + 1}</td>
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
                  <Tab eventKey="result2" title={mainLanguage.results + 2}>
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
                              <th>{mainLanguage.yearNo}</th>
                              <th>{mainLanguage.expense}<span className="ms-2">({mainLanguage.yearly})</span></th>
                              <th>{mainLanguage.accumulatedExpense}</th>
                              <th>{mainLanguage.saving}<span className="ms-2">({mainLanguage.yearly})</span></th>
                              <th>{mainLanguage.accumulatedSaving}</th>
                              <th>{mainLanguage.invested}<span className="ms-2">({mainLanguage.yearly})</span></th>
                              <th>{mainLanguage.accumulated}</th>
                              <th>{mainLanguage.annualProfit}</th>
                              <th>{mainLanguage.accumulatedProfit}</th>
                              <th>{mainLanguage.total}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              resultData.map((item, idx) => (
                                <tr key={idx}>
                                  <td>{mainLanguage.year} {idx + 1}</td>
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
      <Modal show={show} onHide={() => setShow(false)} animation={true} size="lg" dir={value}
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>{mainLanguage.modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{mainLanguage.modalContent1}</p>
          <p>{mainLanguage.modalContent2}</p>
          <p>{mainLanguage.modalContent3}</p>
          <p>{mainLanguage.modalContent4}</p> 
          <p><strong>{mainLanguage.email}:</strong> financial_001@gmail.com</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShow(false)}>
            {mainLanguage.close}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default CalculatorPage;
