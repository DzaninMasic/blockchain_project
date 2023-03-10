import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'
import OLXChain from './abis/OLXChain.json'
import config from './config.json'

function App() {
  const [account, setAccount] = useState(null) 
  const [provider, setProvider] = useState(null)
  const [olxchain, setOlxchain] = useState(null)

  const [electronics, setElectronics] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [toys, setToys] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => {
    //Blockchain connection
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()
    //Connect contract
    const olxchain = new ethers.Contract(config[network.chainId].olxchain.address, OLXChain, provider)
    setOlxchain(olxchain)
    //Load products
    const items = []
    for(let i=0; i<9;i++){
      const item = await olxchain.items(i+1)
      items.push(item)
    }

    const electronics = items.filter((item) => item.category === 'electronics')
    const clothing = items.filter((item) => item.category === 'clothing')
    const toys = items.filter((item) => item.category === 'toys')

    setElectronics(electronics)
    setClothing(clothing)
    setToys(toys)
  }

  useEffect(() => {
    loadBlockchainData()
  },[])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <h2>Featured on OLXChain</h2>
      {electronics && clothing && toys &&(
        <>
        <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
        <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
        <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} olxchain={olxchain} togglePop={togglePop} />
      )}

    </div>
  );
}

export default App;
