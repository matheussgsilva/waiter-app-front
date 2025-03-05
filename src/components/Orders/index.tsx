import { useEffect, useState } from "react";
import socketIo from 'socket.io-client';

import { Order } from "../../types/Order";
import { api } from "../../utils/api";
import { OrdersBoard } from "../OrdersBoard";
import { Container } from "./styles";

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const socket = socketIo('http://localhost:3001', {
      transports: ['websocket'],
    });

      socket.on('orders@new', (order) => {
        setOrders(prevState => prevState.concat(order));
      });
  }, []);

  useEffect(() => {
    api.get('/orders')
    .then(({ data }) => setOrders(data))
  }, []);

  const waitingOrders = orders.filter(order => order.status === 'WAITING');
  const inProductionOrders = orders.filter(order => order.status === 'IN_PRODUCTION');
  const readyOrders = orders.filter(order => order.status === 'DONE');

  function handleCancelOrder(orderId: string) {
    setOrders((prevState) => prevState.filter(order => order._id !== orderId));
  }

  function handleUpdateOrderStatus(orderId: string, newStatus: Order['status']) {
    setOrders((prevState) => prevState.map(order => (
      order._id === orderId ? { ...order, status: newStatus } : order
    )))
  }

  return (
    <Container>
      <OrdersBoard
        icon="🕑"
        title="Fila de espera"
        orders={waitingOrders}
        onCancelOrder={handleCancelOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      <OrdersBoard
        icon="👩‍🍳"
        title="Em produção"
        orders={inProductionOrders}
        onCancelOrder={handleCancelOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      <OrdersBoard
        icon="✅"
        title="Pronto"
        orders={readyOrders}
        onCancelOrder={handleCancelOrder}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </Container>
  )
}
