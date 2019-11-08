import React, { useState, useRef } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'

import chip from '../images/chip.png'
import visa from '../images/visa.png'
import background from '../images/21.jpeg'

import './animation.css'

const FocusElement = styled.div`
  position: absolute;
  z-index: 3;
  border-radius: 5px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all 0.35s cubic-bezier(0.71, 0.03, 0.56, 0.85);
  opacity: 0;
  pointer-events: none;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.65);
`

const Card = styled.div`
  margin-top: 5rem;
  max-width: 430px;
  height: 270px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  & .flipper {
    border-radius: 15px;
    height: 100%;
    position: relative;
  }
  & .front {
    width: 100%;
    height: 100%;
    transform: ${props => props.isFlipped ? 'perspective(1000px) rotateY(180deg) rotateX(0deg) rotate(0deg)' : 'perspective(2000px) rotateY(0deg) rotateX(0deg) rotate(0deg)'};
    & .card-content-wrapper {
      font-family: "Source Code Pro", monospace;
      padding: 25px 15px;
      position: relative;
      height: 100%;
      text-shadow: 7px 6px 10px rgba(14, 42, 90, 0.8);
      user-select: none;
      & .card-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
        & .chip{
          width: 60px;
        }
        & .logo{
          height: 45px;
        }
      }
      & .card-number {
        font-weight: 500;
        line-height: 1;
        color: #fff;
        font-size: 27px;
        margin-bottom: 25px;
        padding: 10px 15px;
        cursor: pointer;
        & span {
          display: inline-block;
          position: relative;
        }
        & .card-number-item {
          width: 16px;
          display: inline-block;
          overflow: visible;
        }
        & .card-number-item-space {
          width: 30px;
          display: inline-block;
        }
      }
      & .card-content {
        color: white;
        display: flex;
        align-items: flex-start;
        & .cardholder-info {
        max-width: calc(100% - 85px);
        padding: 10px 15px;
        font-weight: 500;
        cursor: pointer;
          & .cardholder-title {
            opacity: 0.7;
            font-size: 13px;
            margin-bottom: 6px;
          }
          & .cardholder-name {
            font-size: 18px;
            line-height: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-transform: uppercase;
            position: relative;
            & .cardholder-name-item {
              display: inline-block;
              min-width: 8px;
            }
          }
        }
        & .card-date {
          flex-wrap: wrap;
          font-size: 18px;
          margin-left: auto;
          padding: 10px;
          display: inline-flex;
          width: 80px;
          white-space: nowrap;
          flex-shrink: 0;
          cursor: pointer;
            & .date-title {
              opacity: 0.7;
              font-size: 13px;
              padding-bottom: 6px;
              width: 100%;
            }
            & .card-date-item {
              position: relative;
              span {
                width: 22px;
                display: inline-block;
              }
            }
        }
      }
    }
  }

  & .back {
    transform: ${props => props.isFlipped ? 'perspective(1000px) rotateY(0deg) rotateX(0deg) rotate(0deg)' : 'perspective(2000px) rotateY(-180deg) rotateX(0deg) rotate(0deg)'};
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
      & .strip {
        background: rgba(0, 0, 19, 0.8);
        width: 100%;
        height: 50px;
        z-index: 2;
        margin-top: 30px;
        position: relative;
      }
      & .cvv {
        position: relative;
        z-index: 2;
        text-align: right;
        padding: 15px;
        & .cvv-title {
          color: white;
          padding-right: 10px;
          font-size: 15px;
          font-weight: 500;
          margin-bottom: 5px;
        }
        & .cvv-band {
          height: 45px;
          background: white;
          color: #1a3b5d;
          font-size: 18px;
          border-radius: 4px;
          box-shadow: 0px 10px 20px -7px rgba(32, 56, 117, 0.35);
          margin-bottom: 30px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          
            & .cvv-item {
              display: inline-block;
              width: 15px;
              font-size: 30px;
              padding-top: 10px;
            }
        }
        & .cvv-logo {
          opacity: 0.7;
          height: 45px;
          display: flex;
          justify-content: flex-end;
          & img {
            object-fit: contain;
            object-position: top right;
          }
        }
      }

  }
  & .front, .back {
    transition: all 0.8s cubic-bezier(0.71, 0.03, 0.56, 0.85);
    transform-style: preserve-3d;
    backface-visibility: hidden;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 20px 60px 0 rgba(14, 42, 90, 0.55);
    .bg {
      position: absolute;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
    }
  }
`

const CreditCard = () => {
  const [flipped, setFlipped] = useState(false)
  const [cardNumber, setCardNumber] = useState([])
  const placeholder = '#### #### #### ####'.split('')
  const [name, setName] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [cvv, setCvv] = useState([])
  const focusRef = useRef(null)

  const displayNumber = () => {
    const num = (n, index) => {
      if (cardNumber.length > index) {
        if (index > 4 && index <14 && cardNumber[index] !== ' ') {
          return '*'
        }
        return cardNumber[index]
      } else {
        return n
      }
    }
    return (
      placeholder.map((n, index) => (
          <TransitionGroup key={index} component='span' className="number-group">
            <CSSTransition key={num(n, index)} timeout={300} classNames="item">
              <div className={num(n, index) !== ' ' ? "card-number-item": "card-number-item-space"}>{num(n, index)}</div>
            </CSSTransition>
          </TransitionGroup>
      ))
    )
  }

  const displayName = () => {
      return (
        <div className="cardholder-name">
          <TransitionGroup component='span'>
            {name.length > 0 ? (
              name.join('').replace(/\s\s+/g, ' ').split('').map((n, index) => (
                <CSSTransition timeout={300} classNames="name" key={index}>
                  <span className="cardholder-name-item">
                    {n}
                  </span>
                </CSSTransition>
              ))
            ) : (
              <CSSTransition in={name.length === 0} timeout={300} classNames="noname">
                <div className="cardholder-name-item">Full name</div>
              </CSSTransition>
            )}
          </TransitionGroup>
        </div>
      )
  }

  const displayCvv = () => {
    return (
      <TransitionGroup component={null}>
        {cvv.map((n, index) => (
          <CSSTransition timeout={300} classNames="cvv" key={index + n}>
            <span className="cvv-item">&#42;</span>
          </CSSTransition>
        ))}
      </TransitionGroup>
    )
  }

  const handleCardNumberChange = e => {
    let value = e.target.value
    if (value.length > 19) {
      e.target.value = value.slice(0, 19)
      return
    }
    let index = value.length - 1
    setCardNumber(cardNumber => {
      if (value.length > cardNumber.length) {
        if (value.replace(/\s/g,'').length % 4 === 0 && value.length <19) {
          e.target.value = e.target.value + ' '
          return [...cardNumber.slice(0, index), value[index], ' ', ...cardNumber.slice(index + 1)]
        } else {
          return [...cardNumber.slice(0, index), value[index], ...cardNumber.slice(index + 1)]
        }
      } else {
        return [...value.slice(0, value.length)]
      }
    })
  }

  const handleNameChange = e => {
    let value = e.target.value
    setName(value.split(''))
  }

  const handleMonthChange = e => {
    setMonth(e.target.value)
  }

  const handleYearChange = e => {
    setYear(e.target.value)
  }

  const handleCardNumberFocus = () => {
    if (flipped === true) {
      setFlipped(false)
    }
    focusRef.current.style.transform = "translateX(15px) translateY(114px)"
    focusRef.current.style.width = "376px"
    focusRef.current.style.height = "47px"
    focusRef.current.style.opacity = "1"
  }

  const handleCardNumberBlur = () => {
    focusRef.current.style = {}
  }

  const handleCardNameFocus = () => {
    if (flipped === true) {
      setFlipped(false)
    }
    focusRef.current.style.transform = "translateX(15px) translateY(196px)"
    focusRef.current.style.width = "288px"
    focusRef.current.style.height = "57px"
    focusRef.current.style.opacity = "1"
  }

  const handleCardNameBlur = () => {
    focusRef.current.style = {}
  }

  const handleCardDateFocus = () => {
    if (flipped === true) {
      setFlipped(false)
    }
    focusRef.current.style.transform = "translateX(335px) translateY(196px)"
    focusRef.current.style.width = "80px"
    focusRef.current.style.height = "57px"
    focusRef.current.style.opacity = "1"
  }

  const handleCardDateBlur = () => {
    focusRef.current.style = {}
  }

  const onCVVFocus = () => {
    setFlipped(true)
    focusRef.current.style.transitionDelay = ".6s"
  }

  const handleCvvChange = e => {
    const value = e.target.value
    if (value.length > 3) {
      e.target.value = value.slice(0, 3)
      return
    }
    setCvv(value.replace(/\s/g,'').split(''))
  }

  return (
    <div>
      <Card isFlipped={flipped} >
      <FocusElement ref={focusRef} />
        <div className="flipper">
          <div className="front">
            <div className="bg">
              <img src={background} alt="bg" />
            </div>
            <div className="card-content-wrapper">
              <div className="card-top">
                <img className="chip" src={chip} alt="chip"/>
                <img className="logo" src={visa} alt="logo"/>
              </div>
              <div className="card-number">
                {displayNumber()}
              </div>
              <div className="card-content">
                <div className="cardholder-info">
                  <div className="cardholder-title">Card Holder Name</div>
                  {displayName()}
                </div>
                <div className="card-date">
                  <div className="date-title">Expires</div>
                  <div className="card-date-item">
                    <TransitionGroup component={null}>
                      <CSSTransition key={month ? month : 'MM'} timeout={300} classNames="item">
                        <span>{month ? month : 'MM'}</span>
                      </CSSTransition>
                    </TransitionGroup>
                  </div>
                  /
                  <div className="card-date-item">
                    <TransitionGroup component={null}>
                      <CSSTransition key={year ? year : 'YY'} timeout={300} classNames="item">
                        <span>{year ? year.slice(2) : 'YY'}</span>
                      </CSSTransition>
                    </TransitionGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="back">
            <div className="bg">
              <img src={background} alt="bg" />
            </div>
            <div className="strip"></div>
            <div className="cvv">
              <div className="cvv-title">CVV</div>
              <div className="cvv-band">
                {displayCvv()}
              </div>
              <div className="cvv-logo">
                <img src={visa} alt="cvv-logo" />
              </div>
            </div>
          </div>
        </div>
      </Card>
      <br/>
      Card Number: <input onChange={handleCardNumberChange} onFocus={handleCardNumberFocus} onBlur={handleCardNumberBlur}/>
      Card Holder Name: <input onChange={handleNameChange} onFocus={handleCardNameFocus} onBlur={handleCardNameBlur}/>
      <br />
      Expiry Month:
      <select onChange={handleMonthChange} onFocus={handleCardDateFocus} onBlur={handleCardDateBlur}>
        <option value="" disabled defaultValue></option>
        <option value="01">01</option>
        <option value="02">02</option>
        <option value="03">03</option>
        <option value="04">04</option>
        <option value="05">05</option>
        <option value="06">06</option>
      </select>
      Expiry Year:
      <select onChange={handleYearChange} onFocus={handleCardDateFocus} onBlur={handleCardDateBlur}>
        <option value="" disabled defaultValue></option>
        <option value="2019">19</option>
        <option value="2020">20</option>
        <option value="2021">21</option>
        <option value="2022">22</option>
        <option value="2023">23</option>
        <option value="2024">24</option>
        <option value="2025">25</option>
      </select>
      <br />
      CVV: <input onFocus={onCVVFocus} onChange={handleCvvChange}/>
    </div>
  )
}

export default CreditCard