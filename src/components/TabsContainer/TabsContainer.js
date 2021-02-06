import './TabsContainer.scss'

import { useState } from 'react'

import Tabs from '../tabs/Tabs.jsx'


const defaultTabs= [
  {
    title: 'foo',
    content: 'Satyam'
  },
  {
    title: 'bar',
    content: 'pathak'
  }
]

const TabsContainer = ({ props }) => {
  const [tabs, setTabs] = useState(defaultTabs)
  const [activeTab, setActiveTab] = useState(0)

  const removeTab = (event, index) => {
    event.stopPropagation()
    setTabs(tabs.filter((_, idx) => idx !== index))
  }

  const addTab = () => {
    const tab = {
      content: 'New tab' + tabs.length
    }
    setTabs([...tabs, tab])
  }

  return (
    <div className="tabs-container" style={{ maxWidth: props?.maxWidth || 800 + 'px' }}>
      <div className="tabs-container__header">
        <h2> Demo Container </h2>
      </div>
      <Tabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        removeTab={removeTab}
        addTab={addTab}
        tabs={tabs}
        setTabs={setTabs}
        tabWidth={100}
      />
      {
        tabs[activeTab]?.content &&
        <div className="tabs-container__content">
          <h1> { tabs[activeTab].content } </h1>
        </div>
      }
    </div> 
  );
}
 
export default TabsContainer;