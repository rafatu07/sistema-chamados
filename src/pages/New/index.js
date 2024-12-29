import './new.css'
import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiPlusCircle } from "react-icons/fi"
import { useParams, useNavigate} from "react-router-dom"

import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import { db  } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { set } from 'date-fns'

const listRef = collection(db, "customers");

export default function New() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState([]);
    const [loadCustomers, setLoadCustomers] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(0);

    const [complemento, setComplemento] = useState('');
    const [assunto, setAssunto] = useState('Suporte');
    const [status, setStatus] = useState('Aberto');
    const [idCustomer, setIdCustomer] = useState(false);

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

               if(id){
                loadId(list);
               }

           })
           .catch((error) => {
               console.log("Erro ao obter os clientes", error);
               setLoadCustomers(false);
               setCustomer([{ id: '1', nomeFantasia: 'FREELA' }]);
            })
        }
        loadCustomersList();
    }, [id]);

    async function loadId(list) {
        const docRef = doc(db, "chamados", id);
        await getDoc(docRef)
        .then((snapshot) => {
            setAssunto(snapshot.data().assunto);
            setStatus(snapshot.data().status);
            setComplemento(snapshot.data().complemento);
            
            let index = list.findIndex(item => item.id === snapshot.data().clienteId)
            setCustomerSelected(index);
            setIdCustomer(true);
        })
        .catch((error) => {
            setIdCustomer(false);
            toast.error("Erro ao carregar o chamado");
            console.log("Erro ao carregar o chamado", error);
        })

    }


    function handleOptionChange(event) {
        setStatus(event.target.value)
    }

    function handleChangeSelect(event) {
        setAssunto(event.target.value)
    }

    function handleChangeCustomer(event) {
        setCustomerSelected(event.target.value)
    }

    async function handleRegister(e) {
        e.preventDefault();

        if(idCustomer) {
            const docRef = doc(db, "chamados", id);
            await updateDoc(docRef, {
            cliente: customer[customerSelected].nomeFantasia,
            clienteId: customer[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
            })
            .then(() => {
                toast.success("Chamado atualizado com sucesso!");
                setCustomerSelected(0);
                setComplemento('');
                navigate('/dashboard');
            })
            .catch((error) => {
                toast.error("Ops, algo deu errado!", error);
            })
            return;
        }

        //Registrar chamado
        await addDoc(collection(db, "chamados"), {
            created: new Date(),
            cliente: customer[customerSelected].nomeFantasia,
            clienteId: customer[customerSelected].id,
            assunto: assunto,
            status: status,
            complemento: complemento,
            userId: user.uid
        })
        .then(() => {
            toast.success("Chamado registrado com sucesso!");
            setComplemento('');



            
            setCustomerSelected(0);
        })
        .catch((error) => {
            toast.error("Ops, algo deu errado!", error);
        })
    }


    return (
        <div>
            <Header />

            <div className="content">
                <Title name={id ? "Editando chamado" : "Novo chamado"}>
                    <FiPlusCircle size={25} />
                </Title>

                <div className="container">
                    <form 
                    className="form-profile"
                    
                    >
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
                        <button type="submit" onClick={handleRegister}>{id ? "Editar" : "Cadastrar"}</button>
                    </form>
                </div>

            </div>
        </div>
    )
}