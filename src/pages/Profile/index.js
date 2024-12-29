import { useContext, useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";

import { FiSettings, FiUpload } from "react-icons/fi";
import avatar from "../../assets/avatar.png";
import { AuthContext } from "../../contexts/auth";

import { toast } from "react-toastify";

import { db, storage } from "../../services/firebaseConnection";
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import './profile.css';

export default function Profile() {

    const { user, storageUser, setUser, logout } = useContext(AuthContext);
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
    const [imageAvatar, setImageAvatar] = useState(null);
    const [nome, setNome] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);

    function handleFile(e) {
        if (e.target.files[0]) {
            const image = e.target.files[0];

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                setImageAvatar(image);
                setAvatarUrl(URL.createObjectURL(image));
            }else {
                alert('Envie uma imagem do tipo JPEG ou PNG');
                setImageAvatar(null);
                return;
            }
        }
    }

    async function handleUpload() {
        const currentUid = user.uid;

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snashot) => {
            getDownloadURL(snashot.ref).then(async (downloadUrl) => {
                let url = downloadUrl;

                const docRef = doc(db, "users", user.uid);
                await updateDoc(docRef, {
                    avatarUrl: url,
                    name: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        avatarUrl: url,
                        name: nome
                    };

                    setUser(data);
                    storageUser(data);
                    toast.success("Seu avatar foi atualizado com sucesso!");
                })
            })
        });

    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (imageAvatar === null && nome !== '') {
            const docRef = doc(db, "users", user.uid);
            await updateDoc(docRef, {
                name: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    name: nome
                };

                setUser(data);
                storageUser(data);
                toast.success("Seu nome foi atualizado com sucesso!");
            })
        }else if(imageAvatar !== null && nome !== '') {
            handleUpload();
        }
    }



    return (
        <div>
            <Header />

            <div className="content">
                <Title name="Minha conta">
                    <FiSettings size={25}  />
                </Title>
            
            <div className="container">
                <form className="form-profile" onSubmit={handleSubmit}>
                    <label className="label-avatar">
                        <span>
                            <FiUpload color="#FFF" size={25} />
                        </span>

                        <input type="file" accept="image/*" 
                        onChange={handleFile}
                        /> <br/>

                        {avatarUrl === null ? (
                            <img src={avatar} alt="Foto de perfil" width={250} height={250} />
                        ) : (
                            <img src={avatarUrl} alt="Foto de perfil" />
                        )}

                    </label>
                        
                    <label>Nome</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} />

                    <label>Email</label>
                    <input type="text" value={email} disabled={true} />

                    <button type="submit">Salvar</button>
                        

                </form>
            </div>

            <div className="container">
                <button className="logout-btn" onClick={() => logout()}>Sair</button>
            </div>

        </div>
            
            
        </div>
    )
}