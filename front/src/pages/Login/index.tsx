import { Button, Input } from "@material-tailwind/react";
import { formatPhone } from "../../utils/format";
import { useState } from "react";
import { useCookies, useHttp } from "../../lib";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [credentials, setCredentials] = useState({
    phone: "",
    password: "",
  });
  const http = useHttp();
  const cookies = useCookies();
  const navigate = useNavigate();

  const updatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneRaw = e.target.value.replace(/\D/g, "");
    const phone = formatPhone(phoneRaw);
    setCredentials({ ...credentials, phone });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { data } = await http.post("/auth/login", {
        phone: credentials.phone.replace(/\D/g, ""),
        password: credentials.password,
      });
      const token = data.token;
      cookies.set("token", token, { secure: true });
      // navigate("/dashboard");
      navigate("/participantes");
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 401) {
        return toast.error("Telefone ou senha inválidos");
      }
      toast.error("Algo deu errado, tente novamente mais tarde");
    }
  };

  return (
    <div className="flex justify-center items-center bg-blue-gray-200 w-screen h-screen">
      <form
        onSubmit={handleSubmit}
        className="min-h-[368px] max-h-[70vh] min-w-[480px] max-w-[70vw] bg-white rounded-md shadow-md p-4 flex flex-col items-center justify-around"
      >
        <h1>Login</h1>
        <div className="flex flex-col justify-evenly items-center w-full gap-8">
          <Input
            type="text"
            label="Telefone"
            placeholder="(99) 9 9999-9999"
            color="blue"
            size="lg"
            crossOrigin="true"
            name="phone"
            onChange={updatePhone}
            value={credentials.phone}
            autoFocus
          />
          <Input
            type="password"
            label="Senha"
            placeholder="********"
            color="blue"
            size="lg"
            crossOrigin="true"
            name="password"
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            value={credentials.password}
          />
        </div>
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          placeholder="Fazer login"
          type="submit"
        >
          Entrar
        </Button>
      </form>
    </div>
  );
}
