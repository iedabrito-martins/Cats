import React from 'react';
import Input from '../Forms/Input';
import Button from '../Forms/Button';
import Error from '../Helper/Error';
import useForm from '../../Hooks/useForm';
import { USER_POST } from '../../api';
import { UserContext } from '../../UserContext';
import useFetch from '../../Hooks/UseFetch';

const LoginCreate = () => {
    const username = useForm();
    const email = useForm('email');
    const password = useForm();

    const { userLogin } = React.useContext(UserContext);
    const { loading, error, request } = useFetch();

    async function handleSubmit(event){
        event.preventDefault();
        // const { url, options } = USER_POST({
        //     username: username.value,
        //     email: email.value,
        //     password: password.value
        // });
        //const response = await fetch(url, options);

        const { response } = await request(`https://dogsapi.origamid.dev/json/api/user`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({
                    username: username.value,
                    email: email.value,
                    password: password.value,
                }),

        });
        // console.log(username.value + password.value);
        if(response.ok) userLogin(username, password);   
    }
    return ( 
     <section className="animeLeft">
        <h1 className="title">Cadastre-se</h1> 
        <form onSubmit={handleSubmit}>
            <Input label="Usuario" type="text" name="username" {...username}/>
            <Input label="Email" type="email" name="email" {...email}/>
            <Input label="Senha" type="password" name="password" {...password}/>
            {loading ? ( 
              <Button disabled>Cadastrando...</Button>
             ) : (
             <Button>Cadastrar</Button>
             )}  
          <Error error={error} />
        </form>
      </section>
   ); 
};

export default LoginCreate;