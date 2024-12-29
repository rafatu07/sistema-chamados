import { useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { toast } from "react-toastify";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";

import { FiUsers } from "react-icons/fi";

export default function Customers() {
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [endereço, setEndereço] = useState('');


    async function handleRegister(e) {
        e.preventDefault();

        if (nome !== '' && cnpj !== '' && endereço !== '') {
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereço: endereço
            })
            .then(() => {
                setNome('');
                setCnpj('');
                setEndereço('');
                toast.success('Empresa cadastrada com sucesso!');
            })
            .catch((error) => {
                console.log(error);
                toast.error('Ops, algo deu errado!');
            })
        } else {
            toast.warn('Preencha todos os campos!');   
        }
    }

    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Clientes">
                <FiUsers size={25} /></Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Nome Fantasia</label>
                        <input 
                        type="text"
                        placeholder="Nome da empresa"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        />
                        <label>CNPJ</label>
                        <input 
                        type="text"
                        placeholder="Digite o CNPJ"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value)}
                        />
                        <label>Endereço</label>
                        <input 
                        type="text"
                        placeholder="Digite o Endereço"
                        value={endereço}
                        onChange={(e) => setEndereço(e.target.value)}
                        />

                        <button type="submit">Salvar</button>

                    </form>
                </div>
            </div>
        </div>
    )
}