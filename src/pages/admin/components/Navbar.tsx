
import { Dropdown } from 'react-bootstrap';
import MenuBtn from '@components/MenuBtn'
import { Modal } from 'antd';
import { member, memberAction } from '@/store/slices/member.slice';
import { useDispatch } from 'react-redux';
import { Socket } from 'socket.io-client';
import './navbar.scss'
export default function Navbar({ menuState, setMenuState, data, socket, setSocket}: {
    menuState: boolean,
    setMenuState: any,
    data: member,
    socket: Socket | null,
    setSocket: any
}) {

    const dispatch = useDispatch()
  return (
    <nav>
      <div className='logo'>
        <img src='../../../public/img/logoRaoVat.jpg' />
        <MenuBtn onClickFn={setMenuState} open={menuState} />
      </div>

    </nav>
  )
}