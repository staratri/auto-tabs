import './Tabs.scss'
import LeftArrow from '../../assets/img/left-arrow.png'
import rightArrow from '../../assets/img/right-arrow.png'
import close from '../../assets/img/cancel.png'
import plus from '../../assets/img/plus.png'

import { useState, useRef, useEffect } from 'react'

const debounce = (fn, timeout) => {
  let timer

  return function() {
    if (timer)
      return
    timer = setTimeout(() => {
      fn.apply(null, arguments)
      clearTimeout(timer)
    }, timeout)
  }
}


const Tabs = (props = {}) => {
  console.log()
  const tabsRef = useRef(null);
  const [chevronState, setChevronState] = useState({ action: '', state: 0 })
  const [allowedLimit, setAllowedLimit] = useState(0)
  const [itemWidth, setItemWidth] = useState(props?.tabWidth || 200)


  useEffect(() => {
    if (tabsRef) {
      const maximumTabs = Math.floor(Number(tabsRef.current.offsetWidth) / (props?.tabWidth || 200))
      setAllowedLimit(maximumTabs)
      setItemWidth(tabsRef.current.offsetWidth / maximumTabs)
    }
  }, [allowedLimit, props])

  const handleChevronChange = (action = 'increase', state = chevronState.state + 1) => {
    const update = action === 'increase' ? state : chevronState.state - 1
    setChevronState({ action, state: update })
  }

  const selectTab = idx => {
    if (idx + 1) {
      setActiveTab(idx)
      setChevronState({action: 'manual', state: idx})
    }
  }

  const { setActiveTab, tabs, setTabs } = props

  useEffect(() => {
    let scroller = tabsRef.current
    if (chevronState.action !== 'manual') {
      if (allowedLimit && chevronState.state > allowedLimit - 1) {
        if (chevronState.action === 'increase')
          scroller.scrollLeft += itemWidth
      } else if (scroller.scrollLeft) {
        scroller.scrollLeft -= itemWidth
      }
    }
    setActiveTab(chevronState.state)
  }, [allowedLimit, chevronState, itemWidth, setActiveTab])

  const addTab = () => {
    props.addTab()
    handleChevronChange('increase', tabs.length)
  }

  let dragElement = {
    index: null,
    event: null
  },
    dropElement
  const handleDrag = (event, index, action) => {
    if (action === 'dragend' && dragElement.event) {
      dragElement.event.target.style.visibility = 'visible'
    }
    if (action === 'dragover') {
      event.preventDefault()
      return
    }
    if (action === 'drag') {
      dragElement.index = index
      dragElement.event = event
      dragElement.event.target.style.visibility = 'hidden'
      return
    }
    if (action === 'drop') {
      dropElement = index
      let temp = tabs[dropElement]
      tabs[dropElement] = tabs[dragElement.index]
      tabs[dragElement.index] = temp
      dragElement.event.target.style.visibility = 'visible'
      setTabs([...tabs])
      dragElement.index = null
      dragElement.event = null
      dropElement = null
      return
    }
  }

  function removeTab(){
    props.removeTab.apply(null, arguments)
    handleChevronChange('decrease', chevronState - 1)
  }

  return (
    <div className="wrapper">
      <img
        src={LeftArrow}
        style={{ visibility: props.activeTab !== 0 ? 'visible' : 'hidden' }}
        onClick={() => debounce(handleChevronChange, 200)('decrease')}
        className="tabs__chevron tabs__chevron--left"
        alt="prev"
      />
      <ul className="tabs" ref={tabsRef}>
        {
          props.tabs.map((tab, idx) => (
            <li
              key={`tab--${idx}`}
              style={{ minWidth: itemWidth}}
              className={`tabs__item ${props.activeTab === idx && 'tabs__item--active'}`}
              draggable="true"
              onClick={() => selectTab(idx)}
              onDrop={(e) => handleDrag(e, idx, 'drop') }
              onDrag={(e) => handleDrag(e, idx, 'drag')}
              onDragOver={(e) => handleDrag(e, idx, 'dragover') }
              onDragEnd = {(e) => handleDrag(e, idx, 'dragend')}
            >
              {
                tabs.length > (props?.minimumRequiredTabs || 2) || (idx !== 0 && idx !== 1)
                ? <img src={close} onClick={(e) => removeTab(e, idx)} alt="remove tab" />
                : undefined
              }
              { tab.title || `tab ${idx + 1}` }
            </li>
          ))
        }
      </ul>
      <img
        src={rightArrow}
        style={{ visibility: props.activeTab !== props.tabs.length - 1 ? 'visible' : 'hidden' }}
        onClick={() => debounce(handleChevronChange, 200)('increase')}
        className="tabs__chevron tabs__chevron--right"
        alt="next"
      />
      <img
        src={plus}
        onClick={() => debounce(addTab, 200)()}
        className="tabs__chevron tabs__chevron--right"
        alt="next"
      />
    </div>
  );
}
 
export default Tabs;