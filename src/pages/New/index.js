import './new.css'
import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiPlusCircle } from "react-icons/fi"

import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import { db  } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc } from 'firebase/firestore'

const listRef = collection(db, "customers");

export default function New() {
    const { user } = useContext(AuthContext);

    const [customer, setCustomer] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');

    useEffect(() => {
        async function loadCustomersList() {
            const querySnapshot = await getDocs(listRef)
           .then((snapshot) => {
               let list = [];

               snapshot.forEach((doc) => {
                   list.push({
                       id: doc.id,
                       nomeFantasia: doc.data().nomeFantasia
                   })
               })  
               
               if(snapshot.docs.size === 0){
                setCustomer([{ id: '1', nomeFantasia: 'FREELA' }]);
                setLoadCustomers(false);
                return;
               }

               setCustomer(list);
               setLoadCustomers(false);
           })
           .catch((error) => {
               console.log("Erro ao obter os clientes", error);
               setLoadCustomers(false);
               setCustomer([{ id: '1', nomeFantasia: 'FREELA' }]);
            })
        }
        loadCustomersList();
    }, []);

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Handle select status change
 * @param {object} event - Event object
 * @returns {void}
 */
/******  5c552bfe-4b5d-40c4-980a-8a27c97a49a3  *******/
    function handleOptionChange(event) {
        setStatus(event.target.value)
    }

    function handleChangeSelect(event) {
        setAssunto(event.target.value)
    }

    function handleChangeCustomer(event) {
        setCustomerSelected(event.target.value)
    }


    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Novo Chamado">
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form className="form-profile">
                        <label>Clientes</label>
                        {
                            loadCustomers ? (
                                <input type="text" disabled value="Carregando clientes..." />
                            ) : (
                                <select value={customerSelected} onChange={handleChangeCustomer}>
                                    {
                                        customer.map((item, index) => {
                                            return (
                                                <option key={index} value={index}>
                                                    {item.nomeFantasia}
                                                </option>    
                                            )
                                        })}
                                </select>
                            )
                        }
                        
                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita Tecnica">Visita Tecnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                            type='radio'
                            name='radio'
                            value='Aberto'
                            onChange={handleOptionChange}
                            checked={status === 'Aberto'}
                            />
                            <span>Em Aberto</span>

                            <input
                            type='radio'
                            name='radio'
                            value='Progresso'
                            onChange={handleOptionChange}
                            checked={status === 'Progresso'}
                            />
                            <span>Progresso</span>
                            
                            <input
                            type='radio'
                            name='radio'
                            value='Atendido'
                            onChange={handleOptionChange}
                            checked={status === 'Atendido'}
                            />
                            <span>Atendido</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                        placeholder="Descreva seu problema (opcional)"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                        />
                        <button type="submit">Registrar</button>
                    </form>
                </div>

            </div>
        </div>
    )
}