import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { OutlinedButton } from '@elements/button';
import { AppTitle } from '@elements/common';
import { User } from "phosphor-react";
import { theme } from '@utility/theme'
import { orderVendorProcess } from '@hooks/watchOrder';
import VendorService from '@utility/services/vendor';
import toast from 'react-hot-toast';
import { CommonUtility } from '@utility/common';
import { Loading, Text } from '@nextui-org/react';
import { skillsMap } from '@utility/constants/common';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const OrderContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({theme}) =>theme.colors.yellow};
  width: 90%;
  box-shadow: 0px 0px 7px ${({theme}) =>theme.colors.boxShadow};
  color: white;
  border-radius: 10px;
  margin: 10px 0;
  transition: 0.3s ease-in-out;
  :hover {
    transform: translateY( -2px)
  }
`
const RowMain = styled.div`
  padding: 25px;
  width: 100%;
  height: max height;
  background-color: white;
  border-radius: 0 10px 10px 0;
  color: black;
  display: flex;
  justify-content: space-between;
  .left p{
    font-weight: 700;
  }
  .left p span{
    font-weight: 500;
    opacity: 0.6;
    margin-left: 10px;
  }
`

const RowLeft = styled.div`
  p{
    width: 400px;
    font-weight: 700;
  }
  p span{
    font-weight: 500;
    color: #919191;
    margin-left: 10px;
  }
  
  p:nth-child(2) span{
    color: #919191;
    opacity: 0.7;
  }
`
  
const MapButton = styled.button`
  margin-left: 30px;
  padding: 0 5px ;
  font-size: 12px;
  border-radius: 10px;
  border: 1px solid black;
  outline: none;
  background-color: #ffefa1;
  font-weight: 600;
  cursor: pointer;
  float: right;
`

const RowRight = styled.div`
  color: #919191;
  p {
    font-weight: 600;
  }
  p span {
    font-weight: 700;
    margin-left: 10px;
    color: black;
  }
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  div {
    display: flex;
  }
`

const ImageContainer = styled.div`
  height: 60px;
  width: 60px;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid black;
  border-radius: 50%;
  margin: 20px 40px;
  margin-left: 10px;
`

const OrderRow = ({order}) =>{

  const [ loading , setLoading ] = useState(false)
  const [ cancelLoading , setCancelLoading ] = useState(false)

  async function completeOrder(){
    try{
      setLoading(true);
      await VendorService.completeOrder({id:order.id});
      toast.success("Order completed")
      setLoading(false)
    }catch(error){
      console.log(error)
    }
  }

  async function cancelOrder(){
    try{
      setCancelLoading(true);
      await VendorService.cancelOrder({id:order.id});
      toast.success("Order canceled")
      setCancelLoading(false)
    }catch(error){
      console.log(error)
    }
  }

  return (
  <OrderContainer>
    <RowMain>
      <RowLeft>
        <ImageContainer>
          {order.image? <Image />: <User /> }
        </ImageContainer>
        <p>Name <span>{order.userName}</span></p>
        <p>Location <span>{order.location}</span> <MapButton>Show maps</MapButton></p>
        <p>Problem <span>{skillsMap[order.problem] || order.problem}</span></p>
        {(!!order.time && !!order.date) ? <div>
            <Text h5 className='mt-3' >Appointment</Text>
            <p>Time <span>{order.time}</span></p>
            <p>Date <span>{order.date}</span></p>
          </div>
            : <></>
          }
      </RowLeft>
      <RowRight>
        <p>
          Price <span>{CommonUtility.currencyFormat(order.bid)}</span>
        </p>
        <div>
          <OutlinedButton onClick={cancelOrder} loading={cancelLoading} className="mr-2" color={theme.colors.red} >Cancel</OutlinedButton>
          <OutlinedButton onClick={completeOrder} loading={loading} color={theme.colors.green} >Complete</OutlinedButton>
        </div>
      </RowRight>
    </RowMain>
  </OrderContainer>)
}

export default function OrderNow() {

  const {data: orders, loading} = orderVendorProcess();
  return (
    <Container>
      <AppTitle name="In-Process Orders"/>
      {loading && <Loading/> }
      {orders.map((order)=>(
        <OrderRow order={order} />
      ))}
      {(!loading && orders.length === 0)? "Nothing here yet" : ''}
    </Container>
  )
}
