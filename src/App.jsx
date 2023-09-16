/*
? DESAFIO - Shopping Cart:

Você deve desenvolver um carrinho de compras funcional.
Funcionalidades que esperamos que você desenvolva:

X - inserção de novos produtos no carrinho
X - remoção de produtos já inseridos
X - alteração de quantidade de cada item 
X - cálculo do preço total dos itens inseridos

X - FUNCIONALIDADE EXTRA: aplicação de cupom de desconto
*/
import './styles.scss';

import PageHeader from './layout/PageHeader';
import PageTitle from './layout/PageTitle';
import Summary from './Summary';
import TableRow from './TableRow';
import { useEffect, useState } from 'react';
import { api } from './provider';

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function App() {
  const [cart,setCart] = useState([]);
  const [discount, setDiscount] = useState(0)
  const [used, setUsed] = useState(false)
  
  const productObject = {
    name : "Produto",
    category : "Categoria",
    price : randomNumber(20, 1000),
    quantity : 1
  }
  const fetchData = () => {
    api.get("/card").then((response) => setCart(response.data))
  }
   // Actions
   const handleAddItem = () => {
    api.post("/card",productObject)
    fetchData()
  }

   const handleRemoveItem = (item) => {
    api.delete(`/card/${item._id}`)
    fetchData()
  } 

 const handleUpdateItem = (item , action) => {
    let newQuantity = item.quantity;
    if (action === 'decrease') {
      if (newQuantity === 1) {
        setDisabled(true)
        return;
      }
      newQuantity -= 1
    }
    if (action === 'increase') {
      newQuantity += 1;
    }
    const newData = { ...item, quantity : newQuantity}
    delete newData._id
    api.put(`/card/${item._id}`, newData)
    fetchData()
  }

  const getTotal = (discount) => {
    let sum = 0
    for (let item of cart) {
      sum += item.price * item.quantity
    }
    sum -= discount
    return sum > 0 ? sum : 0
  }
  const handleDiscount = (code = "$20OFF") => {
    if(used){
      alert("You can only use the coupon once")
    }else{
      code == "$20OFF" ? setDiscount(discount + 20): setDiscount(0)
      setUsed(true)
    }
  }
  const TotalPrice = getTotal(discount)

  getTotal(discount)

  useEffect(()=>{
    fetchData()
  },[])
  
  return (
    <>
      <PageHeader />
      <main>
        <PageTitle data={'Seu carrinho'} />
        <div className='content'>
          <section>
            <button onClick={handleAddItem} style={{ padding: '5px 10px', marginBottom: 15 }}>
            Adicionar Itens ao Carrinho
            </button>
            <table>
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                  <th>-</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 
                ? 
                  <tr>
                    <td colSpan="5" style={{textAlign : 'center'}}>
                      Sem Itens No Carrinho
                    </td>
                </tr>
                : 
                cart.map((cart) => (
                  <TableRow key={cart._id} data={cart} handleRemoveItem={handleRemoveItem} handleUpdateItem={handleUpdateItem}/>
                ))    
              }
              </tbody>
            </table>
          </section>
          <aside>
            <Summary handleDiscount={handleDiscount} total={TotalPrice}/>
          </aside>
        </div>
      </main>
    </>
  );
}

export default App;
